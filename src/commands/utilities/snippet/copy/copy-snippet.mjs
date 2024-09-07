import { getLocalizedText } from "../../../../locale/languages.mjs"
import Snippet from "../../../../models/snippet.mjs"

const copySnippet = async (interaction) => {

	const id = interaction.user.id
	const name = interaction.options.getString(`name`)

	const snippet = await Snippet.findOne({
		where: {
			userId: id,
			name
		}
	})

	const copySuccessReply = getLocalizedText(`copy snippet success reply`, interaction.locale, name)
	return interaction.reply(copySuccessReply)
}

export default copySnippet