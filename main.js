'use strict'
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';


function watchForm() {
    $('form').submit(event => {
    event.preventDefault();
        const query = 'q'
        let search = $('#search-term').val();
        const url = baseUrl + '?' + query + '=' + search;
        getUrl(url);
console.log(url)

});
}
//ACCESS ENTIRE CATALOG
function getUrl(url) {

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        //FETCH SPECIFIC ITEM ID
        .then(responseJson => getObjectUrl(responseJson))
        .catch(err => {
            $('#error-message').text(`Something went wrong. ${err.message}`);
        } ); 
}

function getObjectUrl(responseJson) {
    let data = responseJson.objectIDs;
    let objID=data[0]
    let url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+objID;
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => showResults(responseJson))
        .catch(err => {
            $('#error-message').text(`Something went wrong. ${err.message}`);
        });
}

function showResults(responseJson) {
     const data=responseJson.primaryImage;
    
        $('.results').append(
            `<img src=${data}>`
        )  
}
//RETURN RANDOM IMAGE FROM JSON FILE

/*function getRandom() {
    return responseJson[Math.floor(Math.random() * responseJson.length)];
}*/

function renderPage() {
    watchForm();
    
}

$(renderPage)