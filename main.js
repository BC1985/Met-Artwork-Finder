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
        $('.results').empty();

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
    let objId=data[42]
    let url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+objId;
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


//make function that will assign random number for objID array itme with every submit//

function showResults(responseJson) {

    const data=responseJson;
        $('.results').append(`
    <img src=${data.primaryImage} class='img'>
    <h3>${data.artistDisplayName}</h3>
    <h4 class='title'>${data.title} </h4>
    <p>${data.objectDate}</p>
    <p>${data.medium}</p>
    <p>${data.period}</p>
    <p>${data.dynasty}</p>
    <p>${data.culture}</p>
    <p>${data.country}</p>
    <button class='button'>Next</button>
    `  
    ); 
   //BUTTON UNDER PICTURE SHOULD SCROLL TO NEXT IMAGE IN ARRAY
    //??????????
    $('#search-term').val('')
}
//RETURN RANDOM IMAGE FROM JSON FILE

let random = function getRandom() {
    return responseJson[Math.floor(Math.random() * responseJson.length)];
}

function renderPage() {
    watchForm();
    
}

$(renderPage)