import Snippet from '../models/snippet.mjs'
import User from '../models/user.mjs'

class NameAutocompleteCache {
	constructor() {
		this.cache = new Map()
	}

	async get(guildId) {
		if (this.cache.has(guildId))
			return this.cache.get(guildId)

		console.log(`Cache miss for guild ${guildId}. Fetching from database.`)
		const snippets = await Snippet.findAll({
			where: { guildId },
			attributes: ['name', 'userId', 'usages'],
			include: {
				model: User,
				attributes: ['username'],
			},
			raw: true,
			nest: true,
		})

		this.cache.set(guildId, snippets)
		return snippets
	}

	invalidate(guildId) {
		if (!this.cache.has(guildId)) return

		console.log(`Invalidating cache for guild ${guildId}.`)
		this.cache.delete(guildId)
	}
	incrementUsage (guildId, snippetName, authorId) {
		if (!this.cache.has(guildId)) return

		const cachedSnippets = this.cache.get(guildId)
		const snippetToUpdate = cachedSnippets.find(s => s.name === snippetName && s.userId === authorId)

		if (snippetToUpdate)
			snippetToUpdate.usages++
	}
}

export const nameAutocompleteCache = new NameAutocompleteCache()