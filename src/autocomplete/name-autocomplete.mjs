import { Op, Sequelize } from "sequelize"
import Snippet from "../models/snippet.mjs"

const handleNameAutocomplete = async interaction => {
	const userId = interaction.user.id
	const guildId = interaction.guild.id

	const name = interaction.options.getFocused()
	const authorId = interaction.options.get(`author`)?.value

	const snippets = await Snippet.findAll({
		order: [
			[`usages`, `DESC`]
		],
		where: {
			name: {
				[Op.like]: `${name}%`,
			},
			userId: authorId ?? userId,
			guildId
		},
		limit: 25
	})

	const choices = snippets.map(snippet => ({name: snippet.name, value: snippet.name}))
	
	await interaction.respond(choices)
}

export default handleNameAutocomplete