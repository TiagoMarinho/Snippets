import { Events } from 'discord.js'
import { createListPage } from '../commands/snippets/list/execute.mjs'

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton())
			return

		if (interaction.customId.startsWith('snippet-list-page-')) {
			await interaction.deferUpdate()
			const newPageNumber = parseInt(interaction.customId.split('-').pop(), 10)
			const updatedPage = await createListPage(interaction, newPageNumber)
			await interaction.editReply(updatedPage)
		}
	}
}