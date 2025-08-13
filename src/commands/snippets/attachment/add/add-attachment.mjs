import { getLocalizedText } from "../../../../locale/languages.mjs"
import Snippet from "../../../../models/snippet.mjs"
import Attachment from "../../../../models/attachment.mjs"
import limits from "../../../../shared/limits.json" assert { type: 'json' }
import { formatBytes } from "../../../../utils/formatting.mjs"

const addAttachment = async interaction => {
	const deferral = interaction.deferReply({ ephemeral: true })

	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const snippetName = interaction.options.getString("name")
	const file = interaction.options.getAttachment("attachment")
	const description = interaction.options.getString("description")
	const isSpoiler = interaction.options.getBoolean("spoiler") ?? false
	const storageChannelId = process.env.STORAGE_CHANNEL_ID

	if (file.size > limits.MAX_ATTACHMENT_SIZE_BYTES) {
		const formattedLimit = formatBytes(limits.MAX_ATTACHMENT_SIZE_BYTES)
		const reply = getLocalizedText("attachment too large", interaction.locale, file.name, formattedLimit)
		await deferral
		return interaction.editReply({ content: reply })
	}

	if (!storageChannelId) {
		console.error("STORAGE_CHANNEL_ID is not configured in the .env file")
		await deferral
		const reply = getLocalizedText("attachment storage not configured", interaction.locale)
		return interaction.editReply({ content: reply })
	}

	const snippet = await Snippet.findOne({
		where: { name: snippetName, userId, guildId },
		include: { model: Attachment, as: 'attachments' },
	})

	await deferral

	if (!snippet) {
		const reply = getLocalizedText("snippet not found", interaction.locale, snippetName)
		return interaction.editReply({ content: reply })
	}

	const currentCount = snippet.attachments?.length ?? 0
	if (currentCount >= limits.MAX_ATTACHMENTS_PER_SNIPPET) {
		const reply = getLocalizedText(
			"attachment limit reached",
			interaction.locale,
			snippetName,
			limits.MAX_ATTACHMENTS_PER_SNIPPET
		)
		return interaction.editReply({ content: reply })
	}

	const storageChannel = await interaction.client.channels
		.fetch(storageChannelId)
		.catch(error => {
			console.error(`Could not fetch storage channel (${storageChannelId}):`, error)
			return null
		})

	if (!storageChannel || !storageChannel.isTextBased()) {
		const reply = getLocalizedText("attachment storage channel invalid", interaction.locale)
		return interaction.editReply({ content: reply })
	}

	const sentMessage = await storageChannel
		.send({ files: [{ attachment: file.url, name: file.name }] })
		.catch(error => {
			console.error(`Could not send attachment to storage channel (${storageChannelId}):`, error)
			return null
		})

	if (!sentMessage) {
		const reply = getLocalizedText("attachment upload failed", interaction.locale)
		return interaction.editReply({ content: reply })
	}
	
	const permanentAttachment = sentMessage.attachments.first()
	
	if (!permanentAttachment) {
		sentMessage.delete().catch(console.error)
		const reply = getLocalizedText("attachment upload retrieval failed", interaction.locale)
		return interaction.editReply({ content: reply })
	}

	const newAttachment = await Attachment.create({
		snippetId: snippet.id,
		url: permanentAttachment.url,
		filename: permanentAttachment.name,
		contentType: file.contentType,
		description: description,
		spoiler: isSpoiler,
	}).catch(error => {
		console.error('Failed to create Attachment record in database:', error)
		// cleanup the orphan file in the storage channel
		sentMessage.delete().catch(console.error)
		return null
	})

	if (!newAttachment) {
		const reply = getLocalizedText("attachment db save failed", interaction.locale)
		return interaction.editReply({ content: reply })
	}

	const successReply = getLocalizedText(
		"add attachment success",
		interaction.locale,
		permanentAttachment.name,
		snippetName
	)

	return interaction.editReply({ content: successReply })
}

export default addAttachment