import Snippet from "../../../../models/snippet.mjs"
import { getLocalizedText } from "../../../../locale/languages.mjs"
import { limit } from "../../../../utils/formatting.mjs"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js"
import emojis from '../../../../shared/emojis.json' assert { type: 'json' }
import colors from '../../../../shared/colors.json' assert { type: 'json' }

const listSnippets = async interaction => {

	const replyDeferral = interaction.deferReply({ ephemeral: true })

	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const pageNumber = (interaction.options.getNumber(`page`) ?? 1) - 1

	const ITEMS_PER_PAGE = 10
	const offset = pageNumber * ITEMS_PER_PAGE

	const snippets = await Snippet.findAll({
		order: [[`usages`, `DESC`]],
		where: {
			guildId
		},
		limit: 25,
		offset
	})

	const MAX_CONTENT_LENGTH = 40
	const FIELD_SEPARATOR = ": "

	const contentLabel = getLocalizedText(`list snippets embed snippet content label`, interaction.locale)
	const titleLabel = getLocalizedText(`list snippets embed snippet title label`, interaction.locale)
	const usesLabel = getLocalizedText(`list snippets embed snippet uses label`, interaction.locale)
	const authorLabel = getLocalizedText(`list snippets embed snippet author label`, interaction.locale)

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
			.map(field => field.join(FIELD_SEPARATOR))
			.join("\n"),
		}))

	const listEmbedDescription = getLocalizedText(`list snippets embed description`, interaction.locale)
	const embed = new EmbedBuilder()
		.setDescription(listEmbedDescription)
		.setColor(colors.snippet)
		.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
		.addFields(...fields)

	const snippetCount = Snippet.count()

	const isFirstPage = pageNumber === 0
	const isLastPage = ((pageNumber + 1) * ITEMS_PER_PAGE > snippetCount)

	const row = new ActionRowBuilder()

	const previousPageNumber = pageNumber - 1
	const nextPageNumber = pageNumber + 1
	const buttonData = [
		{
			id: `snippet-list-page-${previousPageNumber}`,
			emoji: emojis.previous,
			style: ButtonStyle.Primary,
			disabled: isFirstPage
		},
		{
			id: `snippet-list-page-${nextPageNumber}`,
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

	await replyDeferral
	
	return interaction.editReply({ embeds: [embed], components: [row], ephemeral: true })
}

const createSnippetListEmbed = async (interaction, snippets, pageNumber, snippetCount) => {
	const MAX_CONTENT_LENGTH = 40
	const FIELD_SEPARATOR = ": "
	const ITEMS_PER_PAGE = 10

	const contentLabel = getLocalizedText(`list snippets embed snippet content label`, interaction.locale)
	const usesLabel = getLocalizedText(`list snippets embed snippet uses label`, interaction.locale)
	const authorLabel = getLocalizedText(`list snippets embed snippet author label`, interaction.locale)

	const fields = snippets.map(snippet => ({
		name: `\`${snippet.name}\``,
		value: [
			[contentLabel, `\`${limit(snippet.content, MAX_CONTENT_LENGTH)}\``],
			[usesLabel, `\`${snippet.usages}\``],
			[authorLabel, `<@${snippet.userId}>`],
		]
		.map(field => field.join(FIELD_SEPARATOR))
		.join("\n"),
	}))

	const listEmbedDescription = getLocalizedText(`list snippets embed description`, interaction.locale)
	const embed = new EmbedBuilder()
		.setDescription(listEmbedDescription)
		.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
		.addFields(...fields)

	const isFirstPage = pageNumber === 0
	const isLastPage = ((pageNumber + 1) * ITEMS_PER_PAGE > snippetCount)

	const row = new ActionRowBuilder()

	const buttonData = [
		{
			id: `snippet-list-next`,
			emoji: ``,
			style: ButtonStyle.Primary,
			disabled: isLastPage,
		},
		{
			id: `snippet-list-previous`,
			emoji: ``,
			style: ButtonStyle.Primary,
			disabled: isFirstPage,
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

	return { embed, row }
}

export default listSnippets