import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js"

export default {
	name: `Copy as snippet`,
	description: `Saves the message as a new snippet`,
	type: ApplicationCommandType.Message,
}