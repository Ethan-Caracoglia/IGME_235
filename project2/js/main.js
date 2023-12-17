"use strict";
// 1
window.onload = (e) => {
    document.querySelector("#search").onclick = searchButtonClicked
    prev = document.querySelector("#back");
    more = document.querySelector("#more");
    prev.onclick = decreaseOffset;
    more.onclick = increaseOffset;
    offsetIndicator = document.querySelector("#offset");
    spinner = document.querySelector("#spinner");
    spinner.style.visibility = "hidden";

    //Set the on select event of the recent searhes to call the optionSelected function
    //document.querySelector("#searches").onSelect yadayda

    //Attempted to store information
    let storedItem = localStorage.getItem("EOC_235_Proj2_lastTerm");
    document.querySelector("#searchterm").value = storedItem;

};

// 2
let displayTerm = "";

let offset = 0;
let prev;
let more;
let spinner;
let recentSearchesHTML = []; //Represents the element list in the DOM.
let recentSearches = []; //Represents the string list of searchs.
let offsetIndicator; //The element in whicht the offset number will be displayed.

//Increases the offset variable and then searches for the new images
function increaseOffset() {
    if(offset <= 4999 - parseInt(document.querySelector("#limit").value))
    offset += parseInt(document.querySelector("#limit").value);

    //Change the indicator so the user knows what is happening
    offsetIndicator.innerHTML = offset;

    searchButtonClicked();
}

//Decreases the offset variable and then searched for the new images
function decreaseOffset() {
    if(offset >= parseInt(document.querySelector("#limit").value))
    offset -= parseInt(document.querySelector("#limit").value);

    //Change the indicator so the user knows what is happening
    offsetIndicator.innerHTML = offset;

    searchButtonClicked();
}

// 3
function searchButtonClicked(){
    //console.log("searchButtonClicked() called");

    //URL
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

    //Public API Key
    let GIPHY_KEY = "91POGnb4gBaV9ggUXBabIzvg2HFHuxZ3";

    //Construct URL on a string
    let url = GIPHY_URL;
    url += "api_key=" + GIPHY_KEY;

    //Parse the user entered data
    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    //Store the term in local storage
    localStorage.setItem("EOC_235_Proj2_lastTerm", term);

    //Add the term to the recent search list
    addTerm(term);


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

    //Add the offset
    url += "&offset=" + offset;

    //Update the UI
    document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

    //See what the url looks like.
    //console.log(url);

    getData(url);
}

function getData(url) {
    spinner.style.visibility = "visible";

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
    //console.log(xhr.responseText);

    let obj = JSON.parse(xhr.responseText);

    //if there are not results - return
    if (!obj.data || obj.data.length == 0) {
        document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
        return; // ball out
    }

    //Start building an HTML string we will display to the user
    let results = obj.data;
    //console.log("results.length = " + results.length);
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
        line += `<span><a target='_blank' href='${url}'>View on Giphy</a>
        <button class="copy" onclick="copyLink('${url}')" data-url="${url}">Copy URL</button><br>Rating: ${rating}</span></div>`;

        bigString += line;
    }

        //Done loading so hide the spinner
        spinner.style.visibility = "hidden";
        document.querySelector("#appear").style.visibility = "hidden";
        //Got a little creative here and made the positon absolute
        //So it will no longer affect spacing.
        document.querySelector("#appear").style.position = "absolute";

    //set the content equal to the bigString
    document.querySelector("#content").innerHTML = bigString;

    //Update the status
    document.querySelector("#status").innerHTML = "<b>Success!</b><i> Here are " + results.length 
    + " results for '" + displayTerm + "'</i>";
}

function dataError(e) {
    //called during error occurrence
    console.log("An error occurred");
    spinner.style.visibility = "hidden";
}

//Adds a the most recent search to the list
function addTerm(term) {
    //Get the <select> element named "#searches"
    let searches = document.querySelector("#searches");

    //Add the term to the top of the search string list
    recentSearches.unshift(term);

    //Create the <option> element>
    let option = document.createElement("option");
    option.value = term;
    option.innerHTML = term;

    //Add a new <option> element to the recentSearchesHTML
    recentSearchesHTML.unshift(option);

    //Add the new element to the searches
    searches.prepend(option);

    //The limit of recent searches will be 10
    if (recentSearches.length > 10) {
        //remove the last child from searches
        searches.removeChild(searches.lastChild);

        //Remove the last element in the recentSearches lists
        recentSearches.pop();
        recentSearchesHTML.pop();
    }
}

//Changes the value in the search bar to the recent search selected.
function optionSelected() {
    //Grabs the input element
    let searches = document.querySelector("#searches");

    //Gets the value from the selected button
    let str = searches.options[searches.selectedIndex].value;

    //Sets the value of the input bar to that term
    document.querySelector("#searchterm").value = str;
}

//Copies the URL link of the intended image
function copyLink(url) {
    navigator.clipboard.writeText(url); 
}