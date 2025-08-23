import m from 'mithril'

import Icon from './Icon'
import { fetchMediaSource } from '../Controllers/Helpers'
import Store from '../Models/Store'

const PAGE_SIZE = 10

const Gallery = () => {
	const cache = Store.getCache()
	let loading = false, page = 0, images = cache.media || []
	const mediaEndpoint = Store.getSession('media-endpoint')

	const parameterList = new URLSearchParams(window.location.search)
	const params = {
		image: parameterList.get('image')
	}

	const loadGallery = async (force) => {
		loading = true
		const mediaSource = await fetchMediaSource(force)
		if (mediaSource) {
			images = mediaSource.media
			cache.mediaFetched = mediaSource.mediaFetched
		}
		loading = false
		if (!mediaSource) m.redraw()
	}

	const onClose = (url) => {
		const idx = images.findIndex((img) => img.url === url)
		if (idx > -1) {
			images.splice(idx, 1)
			Store.addToCache({ media: images.filter(i => !!i)})
			m.redraw()
		}
	}

	const onMove = (url, direction) => {
		const fromIdx = images.findIndex((img) => img?.url && img.url === url)
		if (fromIdx < 0) {
			return
		}
		let toIdx = fromIdx + direction
		if (toIdx < 0){
			// Moving off the start, so wrap around to the end
			images.push(images.shift())
		} else if (toIdx == images.length) {
			images.unshift(images.pop())
		} else {
			[images[fromIdx], images[toIdx]] = [images[toIdx], images[fromIdx]]
		}
		Store.addToCache({ media: images.filter(i => !!i)})
		m.redraw()
	}

	return {
		oninit: () => loadGallery(),
		view: () => {
			if (!mediaEndpoint) return null
			if (loading && !images.length) return m(Icon, { name: 'spinner', className: 'spin' })
			if (cache.mediaFetched < 0) return m('h5', [
				'q=source for media-endpoint not found ',
				m('a', { href: 'https://github.com/indieweb/micropub-extensions/issues/14', target: '_blank' },
					m(Icon, { name: 'question', label: 'media endpoint source discussion' }))
			])

			return [
				m('button', {
					title: 'refresh',
					type: 'button',
					onclick: () => loadGallery(true)
				}, loading ?
					m(Icon, { name: 'spinner', className: 'spin' })
					:
					m(Icon, { name: 'arrow-clockwise', label: 'refresh' })),
				m('.sp-gallery', [
					images.filter(i => !!i).slice(0, (page + 1) * PAGE_SIZE).map(i =>
						m(m.route.Link,
							{ class: 'icon', href: `/new/photo?image=${i.url}`, key: `${i.url}` },
							m(GalleryImage(i.url, onClose, onMove, params.image === i.url)))
					)
				]),
				images.length > (page + 1) * PAGE_SIZE && m('button', { type: 'button', onclick: () => page++ }, 'load more')
			]
		}
	}
}

const GalleryImage = (src, onClose, onMove, shouldHighlight) => {
	return {
		view: function() {
			return m('div', {class: `gallery-container ${shouldHighlight ? 'current-image' : ''}` },
				m('img', { src }),
				m('i.fas.fa-circle-xmark', {
					class: 'close',
					onclick: () => {
						onClose(src)
					}
				}),
				m('i.fas.fa-caret-right', {
					class: 'move-right',
					onclick: () => {
						onMove(src, 1)
					}
				}),
				m('i.fas.fa-caret-left', {
					class: 'move-left',
					onclick: () => {
						onMove(src, -1)
					}
				}),
			)
		}
	}
}

export default Gallery
