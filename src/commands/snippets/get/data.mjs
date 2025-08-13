import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import limits from '../../../shared/limits.json' assert { type: 'json' }

// TODO: Add support for localization
export default {
	name: `get`,
	description: `Retrieves a previously saved snippet`,
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
		{
			type: ApplicationCommandOptionType.User,
			name: `mention`,
			description: `User to ping when sending the snippet`,
		},
		{
			type: ApplicationCommandOptionType.User,
			name: `author`,
			description: `User this snippet belongs to`,
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: `private`,
			description: `Show this snippet as a message only you can see`,
		},
	]
}