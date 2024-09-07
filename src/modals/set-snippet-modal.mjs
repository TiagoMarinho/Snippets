import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from "discord.js"
import { getLocalizedText } from "../locale/languages.mjs"
import User from "../models/user.mjs"
import Snippet from "../models/snippet.mjs"
import limits from '../shared/limits.json' assert { type: 'json' }

export const createSetSnippetModal = async locale => {
	const [title, titleLabel, nameLabel, contentLabel] = [
		getLocalizedText(`set snippet modal title`, locale),
		getLocalizedText(`set snippet modal title label`, locale),
		getLocalizedText(`set snippet modal name label`, locale),
		getLocalizedText(`set snippet modal content label`, locale),
	]

	const modal = new ModalBuilder()
		.setCustomId('set-snippet-modal')
		.setTitle(title)

	const nameInput = new TextInputBuilder()
		.setCustomId('nameInput')
		.setLabel(nameLabel)
		.setStyle(TextInputStyle.Short)
		.setMaxLength(limits.MAX_NAME_LENGTH)
		.setPlaceholder('Name of your snippet')
		.setRequired(true)

	const titleInput = new TextInputBuilder()
		.setCustomId('titleInput')
		.setLabel(titleLabel)
		.setStyle(TextInputStyle.Short)
		.setMaxLength(limits.MAX_TITLE_LENGTH)
		.setPlaceholder('Title of your snippet')
		.setRequired(false)

	const contentInput = new TextInputBuilder()
		.setCustomId('contentInput')
		.setLabel(contentLabel)
		.setStyle(TextInputStyle.Paragraph)
		.setMaxLength(limits.MAX_CONTENT_LENGTH)
		.setPlaceholder('Text to be saved')
		.setRequired(true)

	const nameActionRow = new ActionRowBuilder().addComponents(nameInput)
	const titleActionRow = new ActionRowBuilder().addComponents(titleInput)
	const contentActionRow = new ActionRowBuilder().addComponents(contentInput)

	modal.addComponents(nameActionRow, titleActionRow, contentActionRow)

	return modal
}

export const handleSetSnippetModalSubmit = async interaction => {
	const replyDeferral = interaction.deferReply({ ephemeral: true })

	const id = interaction.user.id
	const username = interaction.user.username
	const guildId = interaction.guild.id

	await User.findOrCreate({ 
		where: { id },
		defaults: { username } 
	})

	const name = interaction.fields.getTextInputValue(`nameInput`)
	const title = interaction.fields.getTextInputValue(`titleInput`)
	const content = interaction.fields.getTextInputValue(`contentInput`)

	await Snippet.upsert({
		userId: id,
		name,
		title,
		content,
		guildId
	})

	await replyDeferral
	
	return interaction.editReply({ content: getLocalizedText("set snippet success", interaction.locale, name) })
}