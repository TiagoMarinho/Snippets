import setColor from "./set/set-color.mjs"
import clearColor from "./clear/clear-color.mjs"

const execute = async interaction => {
	const subcommands = {
		SET: setColor,
		CLEAR: clearColor,
	}
	return subcommands[
		interaction.options
			.getSubcommand()
			.toUpperCase()
	](interaction)
}
export default execute