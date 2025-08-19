import { createHash } from 'crypto'

export const Colors = {
	fg: {
		RED: 31,
		GREEN: 32,
		YELLOW: 33,
		BLUE: 34,
		MAGENTA: 35,
		CYAN: 36,
		BRIGHT_RED: 91,
		BRIGHT_GREEN: 92,
		BRIGHT_YELLOW: 93,
		BRIGHT_BLUE: 94,
		BRIGHT_MAGENTA: 95,
		BRIGHT_CYAN: 96,
		GREY: 90,
		WHITE: 37,
		BLACK: 30,
	},
	bg: {
		BLACK: 40,
		RED: 41,
		GREEN: 42,
		YELLOW: 43,
		BLUE: 44,
		MAGENTA: 45,
		CYAN: 46,
		WHITE: 47,
	}
}

export const colorize = (text, fg, bg) => {
	if (text.length === 0) return ``
	const codes = [fg, bg].filter(Boolean)
	if (codes.length === 0) return text
	const codeString = codes.join(';')
	return `\x1b[${codeString}m${text}\x1b[0m`
}

const excludedColors = new Set([Colors.fg.GREY, Colors.fg.BLACK])
const availableColors = Object.values(Colors.fg).filter(c => !excludedColors.has(c))
const simpleHash = seed => {
	const hashHex = createHash('sha256').update(seed).digest('hex')
	return parseInt(hashHex.substring(0, 8), 16)
}

export const colorizeSeeded = (text, seed = text, bg) => {
	const hash = Math.abs(simpleHash(seed))
	const fgColor = availableColors[hash % availableColors.length]
	return colorize(text, fgColor, bg)
}