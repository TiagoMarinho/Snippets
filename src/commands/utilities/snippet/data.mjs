import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import limits from '../../../shared/limits.json' assert { type: 'json' }

// TODO: Add support for localization
export default {
	name: `snippet`,
	description: `Saves and retrieves strings of text`,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: `set`,
			description: `Adds a new snippet`,
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: `get`,
			description: `Retrieves a previously saved snippet`,
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
					description: `User this snippet belongs to (defaults to yourself)`,
				},
			]
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: `delete`,
			description: `Deletes a snippet`,
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
		},
		{
			type: ApplicationCommandOptionType.Subcommand,
			name: `list`,
			description: `Lists all snippets`,
			options: [
				{
					type: ApplicationCommandOptionType.Number,
					name: `page`,
					description: `Page to start listing from`,
					min_value: 1,
				},
			]
		},
	],
}