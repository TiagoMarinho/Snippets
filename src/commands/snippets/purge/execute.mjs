import { getLocalizedText } from "../../../locale/languages.mjs"
import Snippet from "../../../models/snippet.mjs"

const purgeSnippet = async (interaction) => {
	const deferral = interaction.deferReply({ ephemeral: true })

	const name = interaction.options.getString(`name`)
	const author = interaction.options.getUser(`author`)
	const authorId = author.id
	const guildId = interaction.guild.id

	const snippet = await Snippet.findOne({
		where: {
			name,
			userId: authorId,
			guildId,
		}
	})

	await deferral

	if (!snippet) {
		const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)
		return interaction.editReply({ content: snippetNotFoundReply })
	}

	await snippet.destroy()

	const destroySuccessReply = getLocalizedText(`purge snippet success`, interaction.locale, name, `<@${authorId}>`)
	return interaction.editReply({ content: destroySuccessReply })
}

export default purgeSnippet