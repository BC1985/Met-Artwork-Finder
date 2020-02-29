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
            'background':'none', 'margin-top': '0'           
        });
        $('.top-header').css('display', 'flex');
        changeBackground();
    });
}

function changeBackground(){
     $('form').prepend(`
         <p class="small">Enter keyword to browse artworks</p>
    `)
    $('body').css({
        'background-color': '#fdfbfb',
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
        // .then($('.results').empty())
              .then(response => {
            if (response.ok) {  
                return response.json();
            }
            throw new Error(error);
        })
        .then(responseJson => showResults(responseJson))
        .then(scroll())

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
        `<h2 class='title'>${keywordMatchArray.title}</h2>
        <p>${keywordMatchArray.artistDisplayName}</p>
            <p>${keywordMatchArray.artistDisplayBio}</p>
            <p>${keywordMatchArray.objectDate}</p>
            <p>${keywordMatchArray.medium}</p>
            <p>${keywordMatchArray.country}</p>
            <p>${keywordMatchArray.period}</p>
            <p>${keywordMatchArray.dynasty}</p>
            <p>${keywordMatchArray.culture}</p>
            <div class="btn-div">
            <button id='next'>Next item</button>
            <button id='back'>Previous item</button>
            </div>`
    ); 
    // Fetches the next index in the array when clicking the 'next' button
    $('#next').on('click', function(){
        imageIndex++;
        scroll();
        getObjectUrl()
        $('.keyword').empty()
    })
    // Empties search field
    $('#search-term').val('');

    // disables back button if shown item is first in the array
    if (imageIndex === 0) {
        $('#back').attr('disabled', true)
        } else {
        $('#back').removeAttr('disabled')        
    }
    
    $('#back').on('click', function(){
        // disable back function if shown item is first in the arry
        if (imageIndex !== 0) {
            imageIndex--;
        }        
        $('#search-term').val('');
        scroll();
        getObjectUrl()
    })
}
// Focuses on the image when clicking next
function scroll() {
    $('html, body').animate({
        scrollTop: $("#results").offset().top
    }, 500); 
}

function renderPage() {
    watchForm();
    takeToSearchEngine();   
}

$(renderPage)
