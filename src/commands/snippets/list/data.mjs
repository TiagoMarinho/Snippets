import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";

// TODO: Add support for localization
export default {
	name: `list`,
	description: `Lists all snippets`,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Number,
			name: `page`,
			description: `Page to start listing from`,
			min_value: 1,
		},
		{
			type: ApplicationCommandOptionType.User,
			name: `author`,
			description: `User to filter snippets by`,
		},
	]
}