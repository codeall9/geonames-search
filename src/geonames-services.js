// GeoNames Web Services Documentation --> http://www.geonames.org/export/web-services.html

const isServeOnHttps = false; // set true if html serve on https
const domainApi = 'http://api.geonames.org/';
const domainHttpsApi = 'https://secure.geonames.org/'
const geonamesDomain = isServeOnHttps ? domainHttpsApi : domainApi;
const apiSearch = 'searchJSON';
const apiChildren = 'childrenJSON';
const apiExtFindNearby = 'extendedFindNearbyJSON';

/**
 * This is default demo account name of GeoNames Web Services,
 * Please change this if account is reach the limit.
 */
const apiUserName = 'demo';

const featuresOfCountry = 'featureCode=PCL&featureCode=PCLD&featureCode=PCLF&&featureCode=PCLI&featureCode=PCLS';

const fetchOptions = {
    cache: 'reload'
};

/**
 * Call the API
 * @param {String} api API name
 * @param {String} query Parameters
 * @returns {Promise<JSON>}
 */
function getJsonData(api, query) {
    return fetch(`${geonamesDomain}${api}?${query}&username=${apiUserName}`, fetchOptions)
        .then(response => {
            console.log(response);
            return response.json()
        })
        .then(json => {
            return json.status && json.status.message 
                ? Promise.reject(json.status.message)
                : json;
        });
}

/**
 * Returns the children for a given geonameId
 * @see http://www.geonames.org/export/place-hierarchy.html#children
 * @param {(Number|String)} geoId The geonameId of place
 * @returns {Promise<JSON>}
 */
export const loadRegions = (geoId) => getJsonData(apiChildren, `geonameId=${geoId}`);

/**
 * Returns the most detailed information available for the lat/lng query
 * @see http://www.geonames.org/export/web-services.html#extendedFindNearby
 * @param {(Number|String)} lat Latitude
 * @param {(Number|String)} lng Longitude
 * @returns {Promise<JSON>}
 */
export const loadExtendedNearby = (lat, lng) => getJsonData(apiExtFindNearby, `lat=${lat}&lng=${lng}`);

/**
 * Returns the countries of continent by given contientCode
 * @see http://www.geonames.org/export/geonames-search.html
 * @param {String} contientCode Contient code, AF,AS,EU,NA,OC,SA,AN
 * @returns {Promise<JSON>}
 */
export const loadCountries = (contientCode) => getJsonData(apiSearch, `continentCode=${contientCode}&${featuresOfCountry}`);

/**
 * Returns the countries of cities by given countryCode
 * @see http://www.geonames.org/export/geonames-search.html
 * @param {String|String[]} countryCode Country code, ISO-3166 
 * @returns {Promise<JSON>}
 */
export const loadCities = (countryCode) => {
    let queryCountry = (typeof countryCode === 'string' || countryCode instanceof String) 
        ? contientCode
        : contientCode.join('$country=');
    return getJsonData(apiSearch, `country=${queryCountry}&featureCode=PPL`);
}