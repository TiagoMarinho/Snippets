import data from './data.mjs'
import setSnippet from './set/set-snippet.mjs'
import getSnippet from './get/get-snippet.mjs'
import deleteSnippet from './delete/delete-snippet.mjs'
import listSnippets from './list/list-snippets.mjs'
import autocomplete from './autocomplete.mjs'
import copySnippet from './copy/copy-snippet.mjs'

export default {
	data,
	autocomplete,
	async execute (interaction) {
		const subcommands = {
			SET: setSnippet,
			GET: getSnippet,
			COPY: copySnippet,
			DELETE: deleteSnippet,
			LIST: listSnippets
		}
		return subcommands[
			interaction.options
				.getSubcommand()
				.toUpperCase()
		](interaction)
	}
}