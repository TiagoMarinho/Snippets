import { Events } from 'discord.js'
import { createListPage } from '../commands/snippets/list/execute.mjs'

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isButton())
			return

		if (interaction.customId.startsWith('snippet-list-page')) {
			const pageMatch = interaction.customId.match(/#to=([\d-]+)/)
			const authorMatch = interaction.customId.match(/#author=([\w\d]+)/)

			const newPageNumber = pageMatch ? parseInt(pageMatch[1], 10) : 0
			const authorIdStr = authorMatch?.[1]

			await interaction.deferUpdate()
			const updatedPage = await createListPage(interaction, newPageNumber, authorIdStr)
			await interaction.editReply(updatedPage)
		}
	}
}