import { Events } from 'discord.js'
import { handleSetSnippetModalSubmit } from '../modals/set-snippet-modal.mjs'
import { handleEditSnippetModalSubmit } from '../modals/edit-snippet-modal.mjs'

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit())
			return
		
		const modalHandlerById = {
			"set-snippet-modal": handleSetSnippetModalSubmit,
			"edit-snippet-modal": handleEditSnippetModalSubmit,
		}

		const customId = interaction.customId.split("#")[0]

		modalHandlerById[customId](interaction)
	}
}