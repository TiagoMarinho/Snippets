import Snippet from "../../../../models/snippet.mjs"
import { EmbedBuilder } from "discord.js"
import colors from '../../../../shared/colors.json' assert { type: 'json' }
import { getLocalizedText } from "../../../../locale/languages.mjs"

const getSnippet = async interaction => {

	const replyDeferral = interaction.deferReply()

	const guildId = interaction.guild.id
	const name = interaction.options.getString(`name`)
	const mention = interaction.options.getUser(`mention`)
	const user = interaction.options.getUser(`author`)
	const userId = user?.id ?? interaction.user.id

	const snippet = await Snippet.findOne({
		where: {
			name,
			userId,
			guildId
		}
	})

	if (!snippet) {
		const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)
		await replyDeferral
		await interaction.deleteReply()
		return interaction.followUp({ content: snippetNotFoundReply, ephemeral: true })
	}

	snippet.increment(`usages`)

	const embed = new EmbedBuilder()
		.setTitle(snippet.title || null)
		.setDescription(snippet.content)
		.setColor(colors.snippet)
		//.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })

	await replyDeferral
	
	const content = mention ? `<@${mention.id}>` : ``
	return interaction.editReply({ content, embeds: [embed] })
}

export default getSnippet