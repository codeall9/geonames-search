import { render } from 'lit-html';
import { view_main as main } from "./views/tmpl-main"
import { list_dropdown } from "./views/list-dropdown"
import { list_input } from "./views/list-input";
import { chain, head, map, reduce, sortBy, intersectionBy, memoize } from 'lodash'
import * as geoServices from "./geonames-services";

const contientList = [
    { name: "Africa", geonameId: 6255146, code: "AF" },
    { name: "Asia", geonameId: 6255147, code: "AS" },
    { name: "Europe", geonameId: 6255148, code: "EU" },
    { name: "North American", geonameId: 6255149, code: "NA" },
    { name: "Oceania", geonameId: 6255151, code: "OC" },
    { name: "South American", geonameId: 6255150, code: "SA" },
    { name: "Anetatika", geonameId: 6255152, code: "AN" }
];
render(main(contientList, populateCountries), document.body);

const htmlContinent = document.getElementById("continent");  
const htmlCountry = document.getElementById("country");
const htmlCities = document.getElementById("cities");

/**
 * Returns the children for a given geonameId and cache by memoize
 * @function 
 * @param {(Number|String)} geoId the geonameId of place
 * @type {(geoId) => Promise<JSON>} 
 */
const memoizePlaces = memoize(geoServices.loadRegions);

let nearby = [];
if (navigator.geolocation) {
    //get current location and set default value for drop down list / check box
    loadNearbyPlace()
        .then(logResult)
        .then(json => {
            nearby = json.geonames;
            return map(intersectionBy(contientList, nearby, 'geonameId'), value => value.geonameId);
        })
        //.then(logResult)
        .then(result=> {
            render(list_input(contientList, populateCountries, result), htmlContinent);
            return populateCountries();
        })
        .catch(error => alert(`Looks like there was a problem: \n ${error}`));
} else {
    console.log('Geolocation is not supported by this browser.');
}

function populateCities(event) {
    const select = htmlCountry.querySelector('select');
    if (!select.value || select.value === 'undefined') {
        console.log('no option is selected');
        return render(list_dropdown([{name: '-- Please Select --'}]), htmlCities);
    }
    console.log(`search ${select.value}`);
    memoizePlaces(select.value)
        .then(json => sortBy(json.geonames, ['name', 'geonameId']))
        .then(logResult)
        .then(renderCities)
        .catch(error=>{
            alert(`Looks like there was a problem: \n ${error}`);
            render(list_dropdown([{name: '-- Please Select --'}]), htmlCountry)
        });
    return render(list_dropdown([{name: '-- Loading --'}]), htmlCities);
}

function renderCities(jsonResult) {
    const list = [{name: '-- Please Select --'}].concat(jsonResult);
    return render(list_dropdown(list), htmlCities);
}

function populateCountries(event) {
    const checkboxs = Array.from(htmlContinent.querySelectorAll('input[type=checkbox]:checked'));
    const firstHolder = [{name: '-- Please Select --'}];

    render(list_dropdown(firstHolder), htmlCities);
    if (checkboxs.length === 0) {
        console.log('no checkbox is checked');
        render(list_input(contientList, populateCountries, []), htmlContinent);
        return render(list_dropdown(firstHolder), htmlCountry);
    }

    const geoIds = checkboxs.map(item => Number(item.value));
    getCountryList(geoIds)
        .then(logResult)
        .then(renderCountry)
        .catch(error=>{
            alert(`Looks like there was a problem: \n ${error}`);
            render(list_dropdown(firstHolder), htmlCountry)
        });
    render(list_input(contientList, populateCountries, geoIds), htmlContinent);
    return render(list_dropdown([{name: '-- Loading --'}]), htmlCountry);
}

function renderCountry(jsonResult) {
    //nearby will be assigned after obtain user location
    const first = head(intersectionBy(jsonResult, nearby, 'geonameId'));
    const list = [{name: '-- Please Select --'}].concat(jsonResult);
    render(list_dropdown(list, populateCities, first && first.geonameId), htmlCountry);
    return populateCities();
}

/**
 * Returns all the country by given geoids
 * @param {Number[]} geoIds Array of geonameId
 * @returns {Promise<Array>}
 */
function getCountryList(geoIds) {
    const jobs = geoIds.map(ids => memoizePlaces(ids).then(json => json.geonames))
    console.log(jobs);
    return Promise.all(jobs)
        .then(values => {
            console.log('reduce values');
            return chain(values)
                .reduce((all, jsonArray) => all.concat(jsonArray))
                .sortBy(['name', 'geonameId'])
                .sortedUniqBy('geonameId')
                .value();
        });
}

function loadNearbyPlace() {
    const options = {
        enableHighAccuracy: true,
        timeout: 16000,
        maximumAge: 0
    }
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(pos => resolve(pos.coords), logError, options);
    })
    .then(logResult)
    .then(result => geoServices.loadExtendedNearby(result.latitude, result.longitude))
}

function logResult(result) {
    console.log(result);
    return result;
}

function logError(error) {
    console.log('Looks like there was a problem: \n', error);
}
