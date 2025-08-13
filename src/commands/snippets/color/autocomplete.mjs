import handleNameAutocomplete from "../../../autocomplete/name-autocomplete.mjs"

const autocomplete = async interaction => {
	const focusedOption = interaction.options.getFocused(true)

	const autocompleteHandlerById = {
		name: handleNameAutocomplete
	}
	return await autocompleteHandlerById[focusedOption.name](interaction)
}

export default autocomplete