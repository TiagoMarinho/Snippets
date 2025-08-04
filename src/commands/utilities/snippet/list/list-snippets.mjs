import Snippet from "../../../../models/snippet.mjs"
import { getLocalizedText } from "../../../../locale/languages.mjs"
import { limit } from "../../../../utils/formatting.mjs"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import emojis from '../../../../shared/emojis.json' assert { type: 'json' }
import colors from '../../../../shared/colors.json' assert { type: 'json' }

export const createListPage = async (interaction, pageNumber) => {
	const { guildId, user, locale } = interaction
	const ITEMS_PER_PAGE = 10
	const offset = pageNumber * ITEMS_PER_PAGE

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
		.setColor(colors.snippet)
		.setAuthor({ name: user.username, iconURL: user.displayAvatarURL() })
		.addFields(...fields)

	const snippetCount = await Snippet.count({ where: { guildId } })

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
	const pageNumber = (interaction.options.getNumber(`page`) ?? 1) - 1
	const listPage = await createListPage(interaction, pageNumber)
	return interaction.editReply(listPage)
}

export default listSnippets