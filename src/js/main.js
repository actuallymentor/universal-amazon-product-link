import { log } from './modules/helpers'
import { handleRedirect } from './modules/redirect'
import { handleUrlUI } from './modules/user-ui'

log( 'I am alive' )

window.onload = f => {

	handleRedirect()
	handleUrlUI()

}