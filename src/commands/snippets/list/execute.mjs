import Snippet from "../../../models/snippet.mjs"
import { getLocalizedText } from "../../../locale/languages.mjs"
import { limit } from "../../../utils/formatting.mjs"
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, MessageFlags, SeparatorBuilder, TextDisplayBuilder, escapeMarkdown, bold } from "discord.js"
import emojis from '../../../shared/emojis.json' assert { type: 'json' }


const snippetToListing = (snippet, locale) => {
	const contentLabel = getLocalizedText(`list snippets embed snippet content label`, locale)
	const titleLabel = getLocalizedText(`list snippets embed snippet title label`, locale)
	const usesLabel = getLocalizedText(`list snippets embed snippet uses label`, locale)
	const authorLabel = getLocalizedText(`list snippets embed snippet author label`, locale)

	const MAX_CONTENT_LENGTH = 50
	const FIELD_SEPARATOR = ": "

	const formatContent = str =>
		limit(str, MAX_CONTENT_LENGTH)
			.replace(/`/g, ``)
			.replace(/\n/g, ` `)

	const snippetListing = [
		["### " + bold(escapeMarkdown(snippet.name))],
		snippet.title && [titleLabel, `\`${formatContent(snippet.title)}\``],
		[contentLabel, `\`${formatContent(snippet.content)}\``],
		[usesLabel, `\`${snippet.usages}\``],
		[authorLabel, `<@${snippet.userId}>`],
	]
	.filter(Boolean)
	.map(field => field.join(FIELD_SEPARATOR))
	.join("\n")

	return snippetListing
}

const ITEMS_PER_PAGE = 10

export const createListPage = async (
	interaction, 
	pageNumber, 
	authorId = interaction.options?.getUser(`author`)?.id
) => {

	const { guildId, locale } = interaction
	const whereClause = { guildId }

	if (authorId)
		whereClause.userId = authorId

	const offset = pageNumber * ITEMS_PER_PAGE
	const snippetCount = await Snippet.count({ where: whereClause })

	const snippets = await Snippet.findAll({
		order: [[`usages`, `DESC`]],
		where: whereClause,
		limit: ITEMS_PER_PAGE,
		offset
	})

	const textComponents = snippets
		.map(snippet => snippetToListing(snippet, locale))
		.map(snippetListing => {
			return new TextDisplayBuilder()
				.setContent(snippetListing)
		})

	const containerComponents = textComponents
		.flatMap((item) => {
			const separator = new SeparatorBuilder()
			return [separator, item]
		})
		
	containerComponents.push(new SeparatorBuilder().setDivider(false))

	const isFirstPage = pageNumber === 0
	const isLastPage = (pageNumber + 1) * ITEMS_PER_PAGE >= snippetCount

	const row = new ActionRowBuilder()

	const authorIdStr = authorId ?? ""
	const buttonData = [
		{
			id: `snippet-list-page#to=${pageNumber - 1}#author=${authorIdStr}`,
			emoji: emojis.previous,
			style: ButtonStyle.Primary,
			disabled: isFirstPage
		},
		{
			id: `snippet-list-page#to=${pageNumber + 1}#author=${authorIdStr}`,
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

	const listEmbedDescription = getLocalizedText(`list snippets embed description`, locale)
	const listDescriptionTextDisplayComponent = new TextDisplayBuilder()
		.setContent(listEmbedDescription)

	const currentPage = pageNumber + 1
	const totalPages = Math.max(1, Math.ceil(snippetCount / ITEMS_PER_PAGE))
	const paginationText = getLocalizedText(`list snippets embed page number`, locale, currentPage, totalPages)
	const paginationTextDisplayComponent = new TextDisplayBuilder()
		.setContent("-# " + paginationText)

	const container = new ContainerBuilder({ 
		components: [
			listDescriptionTextDisplayComponent, 
			...containerComponents,
			paginationTextDisplayComponent,
		] 
	})

	return { components: [container, row], ephemeral: true, flags: MessageFlags.IsComponentsV2 }
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
	
	// if the requested page is out of bounds, simply show the last page.
	const pageToShow = Math.min(requestedPage, maxPage)

	const listPage = await createListPage(interaction, pageToShow - 1)
	return interaction.editReply(listPage)
}

export default listSnippets