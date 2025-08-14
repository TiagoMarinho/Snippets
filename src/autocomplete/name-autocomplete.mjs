import { Op, Sequelize } from "sequelize"
import Snippet from "../models/snippet.mjs"
import User from "../models/user.mjs"

import { nameAutocompleteCache } from '../cache/name-autocomplete-cache.mjs'

const handleNameAutocomplete = async (interaction, global = false) => {
	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const focusedName = interaction.options.getFocused().toLowerCase()
	const authorId = interaction.options.get('author')?.value

	const allSnippets = await nameAutocompleteCache.get(guildId)

	const filteredSnippets = allSnippets
		.filter(s => {
			// First, filter by the correct user. authorId takes precedence.
			if (authorId) return s.userId === authorId
			// If no author is given and the command isn't global, show the user's own snippets.
			if (!global) return s.userId === userId
			// Otherwise (global command with no author), don't filter by user.
			return true
		})
		.filter(s => {
			// Then, filter the results by the text the user is typing.
			if (focusedName) return s.name.toLowerCase().includes(focusedName)
			// If the user hasn't typed anything, show all results from the first filter.
			return true
		})

	const choices = filteredSnippets
		.sort((a, b) => {
			if (a.userId === userId && b.userId !== userId) return -1
			if (a.userId !== userId && b.userId === userId) return 1
			return b.usages - a.usages
		})
		.slice(0, 25)
		.map(snippet => ({
			name: `${snippet.name}${snippet.userId === userId ? "" : ` (${snippet.User.username})`}`,
			value: snippet.name
		}))

	await interaction.respond(choices)
}

export default handleNameAutocomplete