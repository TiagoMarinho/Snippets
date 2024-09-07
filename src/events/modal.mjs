import { Events } from 'discord.js'
import { handleSetSnippetModalSubmit } from '../modals/set-snippet-modal.mjs'

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isModalSubmit())
			return
		
		const modalHandlerById = {
			"set-snippet-modal": handleSetSnippetModalSubmit
		}

		modalHandlerById[interaction.customId](interaction)
	}
}