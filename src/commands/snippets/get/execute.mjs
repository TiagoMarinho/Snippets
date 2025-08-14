import Snippet from "../../../models/snippet.mjs"
import { AttachmentBuilder, ContainerBuilder, EmbedBuilder, MediaGalleryBuilder, MessageFlags, TextDisplayBuilder } from "discord.js"
import colors from '../../../shared/colors.json' assert { type: 'json' }
import { getLocalizedText } from "../../../locale/languages.mjs"
import Attachment from "../../../models/attachment.mjs"
import { nameAutocompleteCache } from "../../../cache/name-autocomplete-cache.mjs"

const getSnippetContainer = async snippet => {
	const components = []
	if (snippet.title?.length > 0) {
		const title = new TextDisplayBuilder({
			content: "## " + snippet.title
		})
		components.push(title)
	}

		const content = new TextDisplayBuilder({
			content: snippet.content
		})
		components.push(content)

	if (snippet.attachments?.length > 0) {
		const media = snippet.attachments
			.map((attachment, i) => ({
				media: {
					url: attachment.url,
				},
				description: attachment.description || null,
				spoiler: attachment.spoiler
			}))
		const gallery = new MediaGalleryBuilder({ items: media })
		components.push(gallery)
	}
	
	const container = new ContainerBuilder({ components })

	if (snippet.color) {
		const colorHexStr = colors[snippet.color].hex
		const color = parseInt(colorHexStr.substring(1), 16)
		container
			.setAccentColor(color)
	}
	
	return container
}

const getSnippet = async interaction => {

	const guildId = interaction.guild.id
	const name = interaction.options.getString(`name`)
	const mention = interaction.options.getUser(`mention`)
	const user = interaction.options.getUser(`author`)
	const userId = user?.id ?? interaction.user.id
	const ephemeral = interaction.options.getBoolean(`private`) ?? false
	const ephemeralFlag = ephemeral ? MessageFlags.Ephemeral : 0

	const replyDeferral = interaction.deferReply({ flags: ephemeralFlag })

	const components = []
	if (mention) {
		const mentionText = new TextDisplayBuilder({
			content: `<@${mention?.id}>`
		})
		components.push(mentionText)
	}

	const userSnippet = await Snippet.findOne({
		where: {
			name,
			userId,
			guildId
		},
		include: { model: Attachment, as: 'attachments' }
	})

	if (userSnippet) {
		userSnippet.increment(`usages`)
		nameAutocompleteCache.incrementUsage(guildId, name, userId)
		const container = await getSnippetContainer(userSnippet)
		await replyDeferral
		components.push(container)
		return interaction.editReply({ components, flags: MessageFlags.IsComponentsV2 })
	}

	const mostUsedSnippet = await Snippet.findOne({
			where: { name, guildId },
			order: [[`usages`, `DESC`]],
			include: { model: Attachment, as: 'attachments' }
		})

	if (!mostUsedSnippet) {
		const snippetNotFoundReply = getLocalizedText(`snippet not found`, interaction.locale, name)
		await replyDeferral
		await interaction.deleteReply()
		return interaction.followUp({ content: snippetNotFoundReply, flags: MessageFlags.Ephemeral })
	}

	const container = await getSnippetContainer(mostUsedSnippet)
	components.push(container)
	mostUsedSnippet.increment(`usages`)
	nameAutocompleteCache.incrementUsage(guildId, name, mostUsedSnippet.userId)

	await replyDeferral
	return interaction.editReply({ components, flags: MessageFlags.IsComponentsV2 })
}

export default getSnippet