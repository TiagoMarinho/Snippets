import { nameAutocompleteCache } from '../cache/name-autocomplete-cache.mjs'

const handleNameAutocomplete = async (interaction, global = false) => {
	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const focusedName = interaction.options.getFocused().toLowerCase()
	const authorId = interaction.options.get('author')?.value

	const allSnippets = await nameAutocompleteCache.get(guildId)

	const filteredSnippets = allSnippets
		.filter(s => {
			if (authorId) return s.userId === authorId
			if (!global) return s.userId === userId
			return true
		})
		.filter(s => {
			if (focusedName) return s.name.toLowerCase().includes(focusedName)
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