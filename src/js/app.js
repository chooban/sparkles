import m from 'mithril'

import AuthLayout from './Layouts/AuthLayout'
import NoAuthLayout from './Layouts/NoAuthLayout'
import DefaultLayout from './Layouts/DefaultLayout'

import AboutPage from './Pages/AboutPage'
import CallbackPage from './Pages/CallbackPage'
import HomePage from './Pages/HomePage'
import LoginPage from './Pages/LoginPage'
import LogoutPage from './Pages/LogoutPage'
import SettingsPage from './Pages/SettingsPage'
import SharePage from './Pages/SharePage'
import SuccessPage from './Pages/SuccessPage'

import {
	ArticleEditor,
	BookmarkEditor,
	LikeEditor,
	NoteEditor,
	PhotoEditor,
	ReplyEditor,
	RSVPEditor
} from './Editors'
import ImageEditor from './Editors/ImageEditor'
import {
	MovieEditor,
	BookEditor,
	ListenEditor,
	GameEditor,
} from './Editors/MediaEditor'

import Store from './Models/Store'

import '../scss/main.scss'

m.route.prefix = ''

m.route(document.body, '/', {
	'/': {
		// https://mithril.js.org/route.html#redirection
		onmatch: () => {
			!Store.getSession('access_token') ? m.route.set('/login') : m.route.set('/home')
		}
	},
	'/callback': NoAuthLayout(CallbackPage),
	'/about': { render: () => m(DefaultLayout, m(AboutPage)) },
	'/login': NoAuthLayout(LoginPage),
	'/logout': AuthLayout(LogoutPage),
	'/home': AuthLayout(HomePage),
	'/share': AuthLayout(SharePage),
	'/success': AuthLayout(SuccessPage),
	'/settings': AuthLayout(SettingsPage),
	// editors
	'/new/note': AuthLayout(NoteEditor),
	'/new/photo': {
		onmatch: () => {
			return AuthLayout(PhotoEditor).onmatch
		},
		render: (vnode) => {
			const image = m.route.param('image')
			vnode.key = image
			return m(DefaultLayout, vnode)
		}
	},
	'/new/image': AuthLayout(ImageEditor),
	'/new/article': AuthLayout(ArticleEditor),
	'/new/bookmark': AuthLayout(BookmarkEditor),
	'/new/reply': AuthLayout(ReplyEditor),
	'/new/like': AuthLayout(LikeEditor),
	'/new/rsvp': AuthLayout(RSVPEditor),
	'/new/movie': AuthLayout(MovieEditor),
	'/new/book': AuthLayout(BookEditor),
	'/new/listen': AuthLayout(ListenEditor),
	'/new/game': AuthLayout(GameEditor),
})
