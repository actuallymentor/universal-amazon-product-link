import { log, q } from './helpers'

export const handleUrlUI = f => {

	if( !q( '#index' ) ) return log( 'Not index page, skipping UI logic' )

	q( '#sourceurl' ).addEventListener( 'input', handleUrlInput )
	q( '#universalurl' ).addEventListener( 'mouseenter', handleHover )
	q( '#advanced' ).addEventListener( 'click', handleAdvancedUsageClick )

}

const handleUrlInput = ( { target } ) => {

	if( !target || !target.value ) return

	const defaultContinentRules = `continent=AF:.co.uk,AS:.sg,EU:.de,NA:.com,SA:.com.mx,OC:.com.au,AN:.com`

	try {

		const id = getProductIdFromUrl( target.value )
		q( '#universalurl' ).value = `${ location.origin }/product/?id=${ id }&${defaultContinentRules}`

	} catch( e ) {
		q( '#universalurl' ).value = e
	}

}

const handleHover = ( { target } ) => {
	log( 'Hovering!' )
	target.focus()
	target.select()
}

const handleAdvancedUsageClick = e => {

	e.preventDefault()

	const advancedText = q( '#advancedusage' )

	if( advancedText.classList.contains( 'hide' ) ) advancedText.classList.remove( 'hide' )
	else advancedText.classList.add( 'hide' )
	

}


export const getProductIdFromUrl = url => {

	try {

		// Get product ID and return it
		const id = url.match( /(?:\/dp\/)([a-zA-Z0-9]*)/ )
		if( id && id[1] ) return id[1]

		throw `This is not a valid Amazon product URL`

	} catch( e ) {
		log( 'getProductIdFromUrl error: ', e )
		throw `This is not a valid Amazon product URL`
	}

}

