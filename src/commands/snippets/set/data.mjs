import { ApplicationCommandType, ApplicationCommandOptionType } from "discord.js";
import limits from '../../../shared/limits.json' assert { type: 'json' }

// TODO: Add support for localization
export default {
	name: `set`,
	description: `Adds a new snippet`,
	type: ApplicationCommandType.ChatInput,
}