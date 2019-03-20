'use strict'
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';

// Array for iterating through index items
let imageIndex = 0
let objIDs = [];
// Global variable for image counter string
let search = ''


// from landing screen

function takeToSearchEngine(){
    $('#form-link').on('click', function(){
        $('form').removeClass('hidden');
        $('.hero').hide();
        $('header').css({
            'background':'none',
            'margin-top': '30px',
            'padding':'30px'
        });
        // $('header').css('margin-top', '30px');
        //$('.top-header').removeClass('hidden');
        $('.top-header').css('display', 'block');
        changeBackground();
    });

}

function changeBackground(){
     $('form').prepend(`
     
         <p class="small">Enter keyword to browse artworks</p>
    `)
    // $('.top-header').append(`
    // <img src="images/art-creative-creativity-20967.jpg" class='img-big'>
    // `);
    $('body').css({
        'background-color': '#4E4343',
        'background-image': 'none'
    });


}
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
            $('#search-term').val('');
            $('.keyword').empty();
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
    $('.keyword').text(`Results for "${search}". Item no. ${imageIndex + 1}/ ${objIDs.length}`)
    // Display image and open in lightbox on click
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
    takeToSearchEngine();   
}

$(renderPage)


