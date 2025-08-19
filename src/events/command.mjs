import { Events } from 'discord.js'
import { colorize, colorizeSeeded, Colors } from '../utils/logging.mjs'

const DETAIL_COLOR = Colors.fg.GREY

const formatArguments = interaction => {
	const options = interaction.options.data
	if (options.length === 0) return ''
	return options.map(opt => `${opt.name}:${opt.value}`).join(' ')
}

export default {
	name: Events.InteractionCreate,
	async execute(interaction) {

		if (!interaction.isCommand())
			return

		const command = interaction.client.commands.get(interaction.commandName)

		if (!command) return

		const user = colorizeSeeded(interaction.user.username)
		const commandName = interaction.commandName
		const coloredCommand = colorizeSeeded(commandName)
		const formattedArgs = colorize(formatArguments(interaction), DETAIL_COLOR)
		const guild = colorizeSeeded(interaction.guild?.name ?? 'DMs')
		const logStr = `${user} used ${coloredCommand} ${formattedArgs} in ${guild}`.replace(/\s+/g, " ")

		console.log(logStr)

		try {
			await command.execute(interaction)
		} catch (error) {
			console.error(error)

			if (error.code === 10062)
				return

			if (interaction.replied)
				return
			
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	},
}