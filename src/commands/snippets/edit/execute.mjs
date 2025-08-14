import { MessageFlags } from "discord.js"
import { getLocalizedText } from "../../../locale/languages.mjs"
import { createEditSnippetModal } from "../../../modals/edit-snippet-modal.mjs"
import Snippet from "../../../models/snippet.mjs"

const editSnippet = async interaction => {
	
	const id = interaction.user.id
	const name = interaction.options.getString(`name`)
	const guildId = interaction.guild.id

	const snippet = await Snippet.findOne({
		where: {
			userId: id,
			name,
			guildId,
		}
	})

	const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)
	if (!snippet)
		return await interaction.reply({ content: snippetNotFoundReply, flags: MessageFlags.Ephemeral })

	const modal = createEditSnippetModal(interaction.locale, snippet.id, snippet.name, snippet.title, snippet.content)

	if (snippet)
		return interaction.showModal(await modal).catch(console.error)
}

export default editSnippet