import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { getLocalizedText } from "../../../../locale/languages.mjs"
import Snippet from "../../../../models/snippet.mjs"

const deleteSnippet = async (interaction) => {

	const deferral = interaction.deferReply({ ephemeral: true })

	const id = interaction.user.id
	const name = interaction.options.getString(`name`)

	const snippet = await Snippet.findOne({
		where: {
			userId: id,
			name
		}
	})

	const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)
	const destroySuccessReply = getLocalizedText(`delete snippet success reply`, interaction.locale, name)

	await deferral

	if (!snippet)
		return await interaction.editReply(snippetNotFoundReply)

	await snippet.destroy()

	return interaction.editReply({ content: destroySuccessReply})
}

export default deleteSnippet