import { Op, Sequelize } from "sequelize"
import Snippet from "../models/snippet.mjs"
import User from "../models/user.mjs"

const handleNameAutocomplete = async (interaction, global = false) => {
	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const name = interaction.options.getFocused()
	const authorId = interaction.options.get(`author`)?.value

	const where = {
		name: {
			[Op.like]: `${name}%`,
		},
		guildId
	}

	if (authorId) where.userId = authorId

	if (!authorId && !global) where.userId = interaction.user.id

	const snippets = await Snippet.findAll({
		include: {
			model: User,
			attributes: ['username']
		},
		group: 'name', 
		attributes: ['name', 'userId'],
		order: [
			[`usages`, `DESC`]
		],
		where,
		limit: 25
	})

	const choices = snippets
		.sort((a, b) => {
			if (a.userId === userId && b.userId !== userId) 
				return -1
			if (a.userId !== userId && b.userId === userId) 
				return 1
			return 0
		})
		.map(snippet => ({
			name: `${snippet.name}${snippet.userId === userId ? "" : ` (${snippet.User.username})`}`, 
			value: snippet.name
		}))
	
	await interaction.respond(choices)
}

export default handleNameAutocomplete