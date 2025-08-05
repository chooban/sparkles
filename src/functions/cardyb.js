import fetch from 'node-fetch'
import { isValidURL, Response, Error } from './lib/utils'

exports.handler = async e => {
	const { url } = e.queryStringParameters
	if (!isValidURL(url)) return Response.error(Error.INVALID, 'Invalid URL')

	try {
		const encodedUrl = encodeURI(url)
		const response = await fetch('https://cardyb.bsky.app/v1/extract?url=' + encodedUrl)
		const body = await response.json()

		return Response.success({
			title: body.title,
			description: body.description,
			image: body.image,
		})
	} catch (err) {
		console.error('[ERROR]', err && err.message)
	}

	return Response.error(Error.NOT_FOUND)
}
