import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import limits from '../../../shared/limits.json' assert { type: 'json' }
import colors from '../../../shared/colors.json' assert { type: 'json' };

const colorChoices = Object.entries(colors).map(([key, value]) => ({
	name: `${value.emoji} ${value.name}`,
	value: key
}))

// TODO: Add support for localization
export default {
	name: `color`,
	description: `Manage snippet colors`,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: `set`,
			description: `Set the accent color of a snippet`,
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: `name`,
					description: `Name of the snippet to color`,
					required: true,
					autocomplete: true,
					max_length: limits.MAX_NAME_LENGTH,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: `color`,
					description: `The color you want to set`,
					required: true,
					choices: colorChoices,
				},
			],
		},
		{
			name: `clear`,
			description: `Clears a snippet's color`,
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: `name`,
					description: `Name of the snippet to clear the color of`,
					required: true,
					autocomplete: true,
					max_length: limits.MAX_NAME_LENGTH,
				},
			],
		}
	]
}