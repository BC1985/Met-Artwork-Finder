'use strict'
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';

// Array for iterating through index items
let imageIndex = 0
let objIDs = [];
let search = ''
// When user clicks submit button
function watchForm() {
    $('form').submit(event => {
    event.preventDefault();
        const query = 'q'
         search = $('#search-term').val();
        
        const url = baseUrl + '?' + query + '=' + search;
        getUrl(url);
       $('.results').empty();
});
}
// ACCESS ENTIRE CATALOG
function getUrl(url) {
const error = 'Could not find anything. Try a different keyword.'
const searching = 'Searching...'
    fetch(url)
        .then($('#message').text(searching))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(error);
        })
        .then(responseJson => {
            objIDs= responseJson.objectIDs;
            getObjectUrl()
        })
        .catch(err => {
            $('.info').empty();
            $('#message').text(`${error}`);
            $('#search-term').val('')
        });       
}
// Get array of keyword-related items

function getObjectUrl() {
    let objId = objIDs[imageIndex];
    const error ='Please type new keyword.';
    const loading = 'Retrieving artwork...';
    let url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+objId;
    fetch(url)
    // Handle DOM elements when fetching URL
        .then($('#message').text(loading))
        .then($('.info').empty())
        .then($('.results').empty())
              .then(response => {
            if (response.ok) {  
                return response.json();
            }
            throw new Error(error);
        })
        .then(responseJson => showResults(responseJson))
        .catch(err => {
            $('#message').text(`${err}`);
        });
    console.log(url)
}
// Display search results

function showResults(responseJson) {

    // Returned JSON array from keyword search
    let keywordMatchArray = responseJson;
    // Empties error or loading messages
    $('#loading').remove();
    $('#message').empty();
    // Empties container from previous searches
    $('.results').empty();
    $('.info').empty();
    $('.keyword').text(`Results for "${search}". Item no.${imageIndex + 1} out of ${objIDs.length}`)
    // Displays images
    $('.results').append(
        
        `<a data-lightbox="${keywordMatchArray.primaryImage}" href="${keywordMatchArray.primaryImage}"><img src=${keywordMatchArray.primaryImage} class='img'></a>
        <p class="small">Click picture for full size image</p>
        `)

    // Displays artwork info
   $('.info').append(
    `<a target='_blank' href='https://en.wikipedia.org/wiki/${keywordMatchArray.artistDisplayName}'><h3>${keywordMatchArray.artistDisplayName}</h3></a>
    <p>${keywordMatchArray.artistDisplayBio}</p>
    <h4 class='title'>${keywordMatchArray.title}</h4>
    <p>${keywordMatchArray.objectDate}</p>
    <p>${keywordMatchArray.medium}</p>
    <p>${keywordMatchArray.country}</p>
    <p>${keywordMatchArray.period}</p>
    <p>${keywordMatchArray.dynasty}</p>
    <p>${keywordMatchArray.culture}</p>
    <button id='next'>Next item</button>
    `   
    );   
       //console.log(url)
        // Fetches the next index in the array when clicking the 'next' button
    $('#next').on('click', function(){
    imageIndex++;
    getObjectUrl()
    })
    // Empties search field
    $('#search-term').val('');
}

function renderPage() {
    watchForm();   
}

$(renderPage)


