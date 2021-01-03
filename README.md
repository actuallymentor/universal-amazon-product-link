# Amazon universal product link

## Api reference

### GET /product/

```js
    {
        id: String( 'Amazon product ID' ), // Amazon product ID, found after /dp/ in url
        counter: Number( 5 ), // Number of seconds to wait before auto-redirect
        continent: String( 'continent=AF:.co.uk,AS:.sg,EU:.de,NA:.com,SA:.com.mx,OC:.com.au,AN:.com' ), // Continent-based redirects ( are overridden if there are country-specific redirects or overrides )
        blacklist: String( 'blacklist=.com,.co.uk' ), // Blacklist of amazon domains to show in manual selection list
        overrides: String( 'overrides=LU:.com' ), // Countrycode:tld pairings to override, comma separated
        s: Boolean( 'true' ), // Silent mode, no countdown
        d: Boolean( 'true' ) // Debug mode, no auto redirect
    }
```