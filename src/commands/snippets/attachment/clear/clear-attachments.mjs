import { getLocalizedText } from "../../../../locale/languages.mjs"
import Snippet from "../../../../models/snippet.mjs"
import Attachment from "../../../../models/attachment.mjs"

const clearAttachments = async interaction => {
	const deferral = interaction.deferReply({ ephemeral: true })

	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const snippetName = interaction.options.getString("name")

	const snippet = await Snippet.findOne({
		where: {
			name: snippetName,
			userId,
			guildId,
		},
	})

	await deferral

	if (!snippet) {
		const notFoundReply = getLocalizedText("snippet not found", interaction.locale, snippetName)
		return interaction.editReply({ content: notFoundReply })
	}

	await Attachment.destroy({
		where: {
			snippetId: snippet.id,
		},
	})

	const successReply = getLocalizedText("clear attachments success", interaction.locale, snippetName)
	return interaction.editReply({ content: successReply })
}

export default clearAttachments