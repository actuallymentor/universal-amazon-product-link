import { log } from './helpers'
import { getGeo, getGeoByIp } from 'geoplugin'
import { countries } from 'countries-list'

// ///////////////////////////////
// All-in-one get TLD function
// ///////////////////////////////
export const getTldBasedonIp = async f => {

	try {

		log( `Getting geo codes...` )
		const [ continentCode, countryCode ] = await getCountryCode()
		log( `Got continent ${ continentCode } and country ${ countryCode }` )

		const tld = countryToTld( continentCode, countryCode )
		log( `Resolved Tld: `, tld )

		return tld

	} catch( e ) {

		log( `getTldBasedonIp error: `, e )
		log( `Returning default tld` )
		return countryToTld()

	}

}

// ///////////////////////////////
// Geolocation
// ///////////////////////////////
const getCountryCode = async f => {

	let continentCode = 'NA'
	let countryCode = 'US'

	try {

		const geo = await getGeo().catch( f => false )
		log( `Geolocation from geoplugin: `, geo )

		// If geolocation worked, use it
		if( geo ) {
			if( geo.continentCode ) continentCode = geo.continentCode
			if( geo.countryCode ) countryCode = geo.countryCode
		}

		// If geolocation did not work, use fallback services
		if( !geo ) {
			const ip = await myIp()
			const country = await ipToCountryCode( ip )
			countryCode = country
			continentCode = countries[ country ].continent
		}


	} catch( e ) {

		log( `Error resolving geolocation: `, e )

	} finally {
		return [ continentCode, countryCode ]
	}

}

// ///////////////////////////////
// Fallback providers
// ///////////////////////////////

// Fetch helper
const resToText = res => res.text()

// Get country from ip2c
export const ipToCountryCode = async ip => {

	try {

		log( `Fetching locale data for ${ ip }` )

		const localeString = await fetch( `https://ip2c.org/${ ip }` ).then( resToText )
		const [ status, twoLetterCode, threeLetterCode, countryName ] = localeString.split( ';' )

		log( `Locate data: `, status, twoLetterCode, threeLetterCode, countryName )

		if( status != 1 ) throw 'IP did not return valid locale'

		return twoLetterCode

	} catch( e ) {

		log( `ipToCountryCode error: `, e )
		return false

	}

}

// Get my IP from icanhazip
export const myIp = async f => {

	log( `Getting ip` )

	try {

		const ip = await fetch( `https://icanhazip.com/` ).then( resToText )
		log( `My ip is: `, ip )
		return ip

	} catch( e ) {

		log( `Error getting ip: `, e )
		return '127.0.0.1'

	}

}

// ///////////////////////////////
// TLD logic
// ///////////////////////////////
export const countryToTld = ( continentCode, countryCode ) => {

	log( `Guessing TLD for continent: ${ continentCode } and country: ${ countryCode }` )

	let tld = '.com'

	// Guess based on continent
	// Based on: https://en.wikipedia.org/wiki/List_of_sovereign_states_and_dependent_territories_by_continent_(data_file)
	if( continentCode == 'AF' ) tld = '.co.uk'
	if( continentCode == 'AS' ) tld = '.sg'
	if( continentCode == 'EU' ) tld = '.de'
	if( continentCode == 'NA' ) tld = '.com'
	if( continentCode == 'SA' ) tld = '.com.mx'
	if( continentCode == 'OC' ) tld = '.com.au'
	if( continentCode == 'AN' ) tld = '.com'

	// Guess based on countries with amazon
	if( countryCode == 'US' ) tld = '.com'
	if( countryCode == 'CA' ) tld = '.ca'
	if( countryCode == 'MX' ) tld = '.com.mx'
	if( countryCode == 'BR' ) tld = '.com.br'
	if( countryCode == 'UK' ) tld = '.co.uk'
	if( countryCode == 'DE' ) tld = '.de'
	if( countryCode == 'FR' ) tld = '.fr'
	if( countryCode == 'IT' ) tld = '.it'
	if( countryCode == 'ES' ) tld = '.es'
	if( countryCode == 'NL' ) tld = '.nl'
	if( countryCode == 'JP' ) tld = '.co.jp'
	if( countryCode == 'IN' ) tld = '.in'
	if( countryCode == 'AU' ) tld = '.com.au'
	if( countryCode == 'SG' ) tld = '.sg'
	if( countryCode == 'AE' ) tld = '.ae'
	if( countryCode == 'TR' ) tld = '.tr'

	// Guess based on my country preferences
	if( countryCode == 'LU' ) tld = '.de'

	return tld
	
}