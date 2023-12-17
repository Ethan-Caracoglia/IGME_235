
"use strict";
// 1
  window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

// 2
let displayTerm = "";

// 3
function searchButtonClicked(){
    console.log("searchButtonClicked() called");

    //URL
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //Public API Key
    let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    //Construct URL on a string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //Parse the user entered data
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //get rid of spaces
    term = term.trim();

    //encode spaces and special characters
    term = encodeURIComponent(term);

    //If there is no term entered then return
    if (term.length < 1) {return;};

    //append the search term to the URL
    url += "&q=" + term;

    //grab the chosen limit
    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    //Update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    //See what the url looks like.
    console.log(url);

    getData(url);
}

function getData(url) {
    //create xhr objhect
    let xhr = new XMLHttpRequest();

    //set the onload event handler
    xhr.onload = dataLoaded;

    //Set the onerror handler
    xhr.onerror = dataError;

    //open the connection and send the request
    xhr.open("GET", url);
    xhr.send();
}

function dataLoaded(e) {
    //event xhr is set to the event target
    let xhr = e.target;

    //make the response text the JSON file we just downloaded
    console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    //if there are not results - return
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return; // ball out
    }

    //Start building an HTML string we will display to the user
    let results = obj.data;
    console.log("results.length = " + results.length);
    let bigString = "";

    //loop through the array of results
    for (let i = 0; i < results.length; i++) {
        let result = results[i];

        //Get the gif URL
        let smallURL = result.images.fixed_width_downsampled.url;
        if (!smallURL) {
            smallURL = "images/no-image-found.png";
        }

        //GEt the URL to the page
        let url = result.url;

        //grab the rating
        let rating = (result.rating ? result.rating : "NA").toUpperCase();

        //build a div for each result
        let line = `<div class ='result'><img src='${smallURL}' title='${result.id}'>`;
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a><p>Rating: ${rating}</p></span></div>`;

        bigString += line;
    }

    //set the content equal to the bigString
    document.querySelector("#content").innerHTML = bigString;

    //Update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b><i> Here are " + results.length + " results for '" + displayTerm + "'</i>";
}

function dataError(e) {
    //called during error occurrence
    console.log("An error occurred");
}