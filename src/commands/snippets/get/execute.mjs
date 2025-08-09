import Snippet from "../../../models/snippet.mjs"
import { EmbedBuilder } from "discord.js"
import colors from '../../../shared/colors.json' assert { type: 'json' }
import { getLocalizedText } from "../../../locale/languages.mjs"

const getSnippetEmbed = async snippet => {
	snippet.increment(`usages`)

	const embed = new EmbedBuilder()
		.setTitle(snippet.title || null)
		.setDescription(snippet.content)
		.setColor(colors.snippet)
	
	return embed 
}

const getSnippet = async interaction => {

	const replyDeferral = interaction.deferReply()

	const guildId = interaction.guild.id
	const name = interaction.options.getString(`name`)
	const mention = interaction.options.getUser(`mention`)
	const user = interaction.options.getUser(`author`)
	const userId = user?.id ?? interaction.user.id
	const content = mention ? `<@${mention.id}>` : ``

	const userSnippet = await Snippet.findOne({
		where: {
			name,
			userId,
			guildId
		}
	})

	if (userSnippet) {
		userSnippet.increment(`usages`)
		const embed = await getSnippetEmbed(userSnippet)
		await replyDeferral
		return interaction.editReply({ content, embeds: [embed] })
	}

	const mostUsedSnippet = await Snippet.findOne({
			where: { name, guildId },
			order: [[`usages`, `DESC`]]
		})

	if (!mostUsedSnippet) {
		const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)
		await replyDeferral
		await interaction.deleteReply()
		return interaction.followUp({ content: snippetNotFoundReply, ephemeral: true })
	}

	const embed = await getSnippetEmbed(mostUsedSnippet)
	mostUsedSnippet.increment(`usages`)

	await replyDeferral
	return interaction.editReply({ content, embeds: [embed] })
}

export default getSnippet