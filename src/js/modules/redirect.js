import { log, q, wait } from './helpers'
import { getTldBasedonIp } from './ip'
import { generateUniversalUrl, getQuery } from './url'


export const handleRedirect = async f => {

	const queryCounter = getQuery( 'counter' )
	let counter = queryCounter ? Number( queryCounter ) : 5
	let paused = false
	
	if( !q( '#product' ) ) return log( `Not product page, skipping redirect handling` )

	// Handle pause button
	q( '#stop' ).addEventListener( 'click', f => {


		if( !paused ) {
			q( '#countdown' ).classList.add( 'hide' )
			q( '#stop' ).innerHTML = 'Continue redirect'
			showAllAmazons()
			paused = true
		} else if( paused ) {
			q( '#countdown' ).classList.remove( 'hide' )
			q( '#stop' ).innerHTML = 'Choose different Amazon'
			hideAllAmazons()
			paused = false
		}

	} )

	// Redirect handler
	try {

		// Data
		const id = getQuery( 'id' )
		const silent = getQuery( 's' )
		const dev = getQuery( 'd' )
		const tld = await getTldBasedonIp()
		const url = generateUniversalUrl( id, tld )

		//Logging
		log( `Product id: `, id )
		log( `Tld: `, tld )
		log( `Universal url: `, url )

		// Html elements
		const title = q( `#title` )
		const countdown = q( `#countdown` )
		const button = q( '#stop' )

		// Interface update
		if( !silent ) {
			title.innerHTML = `Redirecting to amazon${ tld }`
			countdown.innerHTML = `Redirecting in ${counter} seconds`
		}
		title.classList.remove( 'hide' )
		countdown.classList.remove( 'hide' )
		button.classList.remove( 'hide' )

		// Do countdown if silent is unset and counter is counting
		while( !silent && counter != 0 ) {
			log( 'loop' )
			await wait( 1000 )
			if( paused ) continue
			counter -= 1
			countdown.innerHTML = `Redirecting in ${counter} seconds`

		}

		// Redirect to universal Amazon link
		if( !dev ) window.location.replace( url )

	} catch( e ) {
		log( `handleRedirect error: `, e )
	}

}

const showAllAmazons = f => {

	// Html elements
	const title = q( `#title` )
	const countdown = q( `#countdown` )

	// Interface update
	title.classList.add( 'hide' )
	countdown.classList.add( 'hide' )

	// Data
	const id = getQuery( 'id' )
	let blacklistedTlds = getQuery( 'blacklist' )
	let tlds = [ '.com', '.co.uk', '.ca', '.de', '.fr', '.it', '.es', '.nl', '.co.jp', '.in', '.com.au', '.sg', '.ae', '.com.tr', '.com.mx', '.com.br' ]
	const tldHolder = q( '#alltlds' )

	// Parse blacklist of tlds
	if( blacklistedTlds ) {
		blacklistedTlds = blacklistedTlds.split( ',' )
		tlds = tlds.filter( tld => !blacklistedTlds.includes( tld ) )
	}

	for (var i = tlds.length - 1; i >= 0; i--) {
		tldHolder.innerHTML += `<a href='https://www.amazon${ tlds[i] }/dp/${id}'>amazon${ tlds[i] }</a>`
	}

}

const hideAllAmazons = f => {
	// Html elements
	const title = q( `#title` )
	const countdown = q( `#countdown` )

	// Interface update
	title.classList.remove( 'hide' )
	countdown.classList.remove( 'hide' )
	q( '#alltlds' ).innerHTML = ''

}