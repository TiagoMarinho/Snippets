import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import limits from '../../../shared/limits.json' assert { type: 'json' }

// TODO: Add support for localization
export default {
	name: `attachment`,
	description: `Manage snippet attachments`,
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: `add`,
			description: `Adds an attachment to a snippet`,
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: `name`,
					description: `Name of the snippet to add the attachment to`,
					required: true,
					max_length: limits.MAX_NAME_LENGTH,
					autocomplete: true,
				},
				{
					type: ApplicationCommandOptionType.Attachment,
					name: `attachment`,
					description: `The file to attach to the snippet`,
					required: true,
				},
				{
					type: ApplicationCommandOptionType.String,
					name: `description`,
					description: `A description for the attachment`,
					max_length: limits.MAX_ATTACHMENT_DESCRIPTION_LENGTH,
					required: false,
				},
				{
					type: ApplicationCommandOptionType.Boolean,
					name: `spoiler`,
					description: `Whether to mark the attachment as a spoiler`,
					required: false,
				},
			],
		},
		{
			name: `clear`,
			description: `Clears all attachments of a snippet`,
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: `name`,
					description: `Name of the snippet to clear all attachments from`,
					required: true,
					autocomplete: true,
					max_length: limits.MAX_NAME_LENGTH,
				},
			],
		}
	]
}