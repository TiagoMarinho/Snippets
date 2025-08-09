import { createEditSnippetModal } from "../../../modals/edit-snippet-modal.mjs"
import { createSetSnippetModal } from "../../../modals/set-snippet-modal.mjs"
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

	const modal = createEditSnippetModal(interaction.locale, snippet.id, snippet.name, snippet.title, snippet.content)

	if (snippet)
		return interaction.showModal(await modal).catch(console.error)

	//const deferral = interaction.deferReply({ ephemeral: true })

	const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)

	//await deferral

	if (!snippet)
		return await interaction.editReply(snippetNotFoundReply)
}

export default editSnippet