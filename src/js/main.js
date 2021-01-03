import { log } from './modules/helpers'
import { handleRedirect } from './modules/redirect'

log( 'I am alive' )

window.onload = f => {

	handleRedirect()

}