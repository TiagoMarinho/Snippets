import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js"
import { getLocalizedText } from "../locale/languages.mjs"
import User from "../models/user.mjs"
import Snippet from "../models/snippet.mjs"
import limits from '../shared/limits.json' assert { type: 'json' }

export const createEditSnippetModal = async (locale, snippetId, name, title, content) => {
	const [modalTitle, titleLabel, nameLabel, contentLabel] = [
		getLocalizedText(`edit snippet modal title`, locale),
		getLocalizedText(`set snippet modal title label`, locale),
		getLocalizedText(`set snippet modal name label`, locale),
		getLocalizedText(`set snippet modal content label`, locale),
	]

	const modal = new ModalBuilder()
		.setCustomId(`edit-snippet-modal#id=${snippetId}`)
		.setTitle(modalTitle)

	const nameInput = new TextInputBuilder()
		.setCustomId('nameInput')
		.setLabel(nameLabel)
		.setStyle(TextInputStyle.Short)
		.setMaxLength(limits.MAX_NAME_LENGTH)
		.setPlaceholder('Name of your snippet')
		.setRequired(true)
		.setValue(name)

	const titleInput = new TextInputBuilder()
		.setCustomId('titleInput')
		.setLabel(titleLabel)
		.setStyle(TextInputStyle.Short)
		.setMaxLength(limits.MAX_TITLE_LENGTH)
		.setPlaceholder('Title of your snippet')
		.setRequired(false)
		.setValue(title || "")

	const contentInput = new TextInputBuilder()
		.setCustomId('contentInput')
		.setLabel(contentLabel)
		.setStyle(TextInputStyle.Paragraph)
		.setMaxLength(limits.MAX_CONTENT_LENGTH)
		.setPlaceholder('Text to be saved')
		.setRequired(true)
		.setValue(content || "")

	const nameActionRow = new ActionRowBuilder().addComponents(nameInput)
	const titleActionRow = new ActionRowBuilder().addComponents(titleInput)
	const contentActionRow = new ActionRowBuilder().addComponents(contentInput)

	modal.addComponents(nameActionRow, titleActionRow, contentActionRow)

	return modal
}

export const handleEditSnippetModalSubmit = async interaction => {
	const replyDeferral = interaction.deferReply({ ephemeral: true })

	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const match = interaction.customId.match(/#id=(\d+)/)
	const snippetId = match?.[1]

	const name = interaction.fields.getTextInputValue(`nameInput`)
	const title = interaction.fields.getTextInputValue(`titleInput`)
	const content = interaction.fields.getTextInputValue(`contentInput`)

	const conflictingSnippet = await Snippet.findOne({ where: { name, userId, guildId } })
	if (conflictingSnippet && String(conflictingSnippet.id) !== snippetId)
		await conflictingSnippet.destroy()

	await Snippet.update({
		name,
		title,
		content
	}, {
		where: {
			id: snippetId,
			userId,
			guildId
		}
	})

	await replyDeferral
	
	return interaction.editReply({ content: getLocalizedText("edit snippet success", interaction.locale, name) })
}