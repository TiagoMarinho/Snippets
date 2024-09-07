import { createSetSnippetModal } from "../../../../modals/set-snippet-modal.mjs"

const setSnippet = async interaction => {
	const modal = await createSetSnippetModal(interaction.locale)
	return interaction.showModal(modal).catch(console.error)
}

export default setSnippet