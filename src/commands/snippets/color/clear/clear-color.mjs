import { getLocalizedText } from "../../../../locale/languages.mjs"
import Snippet from "../../../../models/snippet.mjs"

const clearAttachments = async interaction => {
	await interaction.deferReply({ ephemeral: true })

	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const snippetName = interaction.options.getString("name")

	const snippet = await Snippet.findOne({ where: { name: snippetName, userId, guildId } })

	if (!snippet) {
		const reply = getLocalizedText("snippet not found", interaction.locale, snippetName)
		return interaction.editReply({ content: reply })
	}

	snippet.color = null
	await snippet.save()
	
	const successReply = getLocalizedText("clear accent color success", interaction.locale, snippetName)
	return interaction.editReply({ content: successReply })
}

export default clearAttachments