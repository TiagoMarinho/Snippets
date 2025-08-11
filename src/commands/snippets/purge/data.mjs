import { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField } from "discord.js"
import limits from '../../../shared/limits.json' assert { type: 'json' }

// TODO: Add support for localization
export default {
	name: `purge`,
	description: `Deletes a snippet made by another user.`,
	type: ApplicationCommandType.ChatInput,
	default_member_permissions: String(PermissionsBitField.Flags.ManageGuild), 
	options: [
		{
			type: ApplicationCommandOptionType.User,
			name: `author`,
			description: `The user who owns the snippet`,
			required: true, 
		},
		{
			type: ApplicationCommandOptionType.String,
			name: `name`,
			description: `Name of the snippet to delete`,
			required: true,
			autocomplete: true, 
			max_length: limits.MAX_NAME_LENGTH,
		},
	]
}