import addAttachment from "./add/add-attachment.mjs"
import clearAttachments from "./clear/clear-attachments.mjs"

const execute = async interaction => {
	const subcommands = {
		ADD: addAttachment,
		CLEAR: clearAttachments,
	}
	return subcommands[
		interaction.options
			.getSubcommand()
			.toUpperCase()
	](interaction)
}
export default execute