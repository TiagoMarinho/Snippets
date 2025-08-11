import Snippet from "../../../models/snippet.mjs"
import { getLocalizedText } from "../../../locale/languages.mjs"
import { limit } from "../../../utils/formatting.mjs"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import emojis from '../../../shared/emojis.json' assert { type: 'json' }

const ITEMS_PER_PAGE = 10

export const createListPage = async (interaction, pageNumber) => {
	const { guildId, user, locale } = interaction

	const offset = pageNumber * ITEMS_PER_PAGE
	const snippetCount = await Snippet.count({ where: { guildId } })

	const snippets = await Snippet.findAll({
		order: [[`usages`, `DESC`]],
		where: { guildId },
		limit: ITEMS_PER_PAGE,
		offset
	})

	const MAX_CONTENT_LENGTH = 40
	const FIELD_SEPARATOR = ": "

	const contentLabel = getLocalizedText(`list snippets embed snippet content label`, locale)
	const titleLabel = getLocalizedText(`list snippets embed snippet title label`, locale)
	const usesLabel = getLocalizedText(`list snippets embed snippet uses label`, locale)
	const authorLabel = getLocalizedText(`list snippets embed snippet author label`, locale)

	const formatContent = str =>
		limit(str, MAX_CONTENT_LENGTH)
			.replace(/`/g, ``)
			.replace(/\n/g, ` `)

	const fields = snippets.map(snippet => ({
		name: `\`${snippet.name.replace(/`/g, ``)}\``,
		value: [
			snippet.title ? [titleLabel, `\`${formatContent(snippet.title)}\``] : [],
			[contentLabel, `\`${formatContent(snippet.content)}\``],
			[usesLabel, `\`${snippet.usages}\``],
			[authorLabel, `<@${snippet.userId}>`],
		]
		.filter(field => field.length > 0)
		.map(field => field.join(FIELD_SEPARATOR))
		.join("\n"),
	}))

	const listEmbedDescription = getLocalizedText(`list snippets embed description`, locale)
	const embed = new EmbedBuilder()
		.setDescription(listEmbedDescription)
		.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
		.addFields(...fields)

	const isFirstPage = pageNumber === 0
	const isLastPage = (pageNumber + 1) * ITEMS_PER_PAGE >= snippetCount

	const row = new ActionRowBuilder()

	const buttonData = [
		{
			id: `snippet-list-page-${pageNumber - 1}`,
			emoji: emojis.previous,
			style: ButtonStyle.Primary,
			disabled: isFirstPage
		},
		{
			id: `snippet-list-page-${pageNumber + 1}`,
			emoji: emojis.next,
			style: ButtonStyle.Primary,
			disabled: isLastPage
		},
	]
	const buttons = buttonData.map(button =>
		new ButtonBuilder()
			.setCustomId(button.id)
			.setEmoji(button.emoji)
			.setStyle(button.style)
			.setDisabled(button.disabled === true)
	)

	row.addComponents(...buttons)

	return { embeds: [embed], components: [row], ephemeral: true }
}

const listSnippets = async interaction => {
	await interaction.deferReply({ ephemeral: true })

	const { guildId, locale } = interaction
	const snippetCount = await Snippet.count({ where: { guildId } })

	if (snippetCount === 0) {
		const noSnippetsReply = getLocalizedText('list snippets no snippets found', locale)
		return interaction.editReply({ content: noSnippetsReply, ephemeral: true })
	}

	const maxPage = Math.ceil(snippetCount / ITEMS_PER_PAGE)
	const requestedPage = interaction.options.getNumber(`page`) ?? 1
	
	// If the requested page is out of bounds, simply show the last page.
	const pageToShow = Math.min(requestedPage, maxPage)

	const listPage = await createListPage(interaction, pageToShow - 1)
	return interaction.editReply(listPage)
}

export default listSnippets