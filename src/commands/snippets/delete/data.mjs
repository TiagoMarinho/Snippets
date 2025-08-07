import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import limits from '../../../shared/limits.json' assert { type: 'json' }

// TODO: Add support for localization
export default {
	name: `delete`,
	description: `Deletes a snippet`,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: `name`,
			description: `Name of the snippet`,
			required: true,
			autocomplete: true,
			max_length: limits.MAX_NAME_LENGTH,
		},
	]
}