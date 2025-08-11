import { getLocalizedText } from "../../../../locale/languages.mjs"
import Snippet from "../../../../models/snippet.mjs"
import colors from "../../../../shared/colors.json" assert { type: 'json' }

const setColor = async interaction => {
	await interaction.deferReply({ ephemeral: true })

	const userId = interaction.user.id
	const guildId = interaction.guild.id
	const snippetName = interaction.options.getString("name")
	const colorKey = interaction.options.getString("color")

	const snippet = await Snippet.findOne({ where: { name: snippetName, userId, guildId } })

	if (!snippet) {
		const reply = getLocalizedText("snippet not found", interaction.locale, snippetName)
		return interaction.editReply({ content: reply })
	}

	snippet.color = colorKey
	await snippet.save()
	
	const colorName = colors[colorKey].name
	const successReply = getLocalizedText("set accent color success", interaction.locale, snippetName, colorName)
	return interaction.editReply({ content: successReply })
}

export default setColor