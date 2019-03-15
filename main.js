'use strict'
const baseUrl = 'https://collectionapi.metmuseum.org/public/collection/v1/search';

let imageIndex = 0
let objIDs=[];
function watchForm() {
    $('form').submit(event => {
    event.preventDefault();
        const query = 'q'
        let search = $('#search-term').val();
        $('.keyword').text(`Results for ${search}. Click picture for full-size image. `)
        const url = baseUrl + '?' + query + '=' + search;
        getUrl(url);
       $('.results').empty();


});
}
//ACCESS ENTIRE CATALOG
function getUrl(url) {
const error= 'Could not find anything. Try a different keyword.'
const searching= 'Searching...'
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

function getObjectUrl() {
    let objId = objIDs[imageIndex]
    const error='Please type new keyword.'
    const loading = 'Retrieving artwork...'
    let url = 'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+objId;
    fetch(url)
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
}




//make function that will assign random number for objID array itme with every submit//

function showResults(responseJson) {
    let keywordMatchArray = responseJson;
    $('#loading').remove();
    $('.results').empty();
    $('#message').empty();
    $('.info').empty();
    $('.results').append(
        `<a target='_blank' href='${keywordMatchArray.primaryImage}'><img src=${keywordMatchArray.primaryImage}  class='img'></a>
        `)
   $('.info').append(
    `<a target='_blank' href='https://en.wikipedia.org/wiki/${keywordMatchArray.artistDisplayName}'><h3>${keywordMatchArray.artistDisplayName}</h3></a>${keywordMatchArray.artistDisplayBio}
    <h4 class='title'>${keywordMatchArray.title} </h4>
    <p>${keywordMatchArray.objectDate}</p>
    <p>${keywordMatchArray.medium}</p>
    <p>${keywordMatchArray.period}</p>
    <p>${keywordMatchArray.dynasty}</p>
    <p>${keywordMatchArray.culture}</p>
    <p>${keywordMatchArray.country}</p>
    <button id='next'>Next item</button>
    <footer>
            <a href="https://www.metmuseum.org/"><p>Visit the Metropolitan Museum Wesbite</p></a>
        </footer>
    `   );
       console.log(responseJson)
           //when the next button is clicked, another api request made with for the next array item in keywordMatchArray
    $('#next').on('click', function(){
    imageIndex++;
    getObjectUrl()

    })
    
    $('#search-term').val('')
}

function renderPage() {
    watchForm();   
}

$(renderPage)


