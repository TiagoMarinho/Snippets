export const limit = (string, length, end = "...") => string.length < length ? string : string.substring(0, length).trim() + end

export const formatBytes = (bytes, decimals = 2) => {
	if (!+bytes) return '0 Bytes'

	const k = 1000 // use decimal standard (1000) instead of binary (1024)
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}