var template = document.querySelector("#event-template").innerHTML;
var destination = document.querySelector(".events");

// PRODUCTION URL
// this requires the latest commit hash in the events-data repo (the merge commit from the last PR)
// Can be the short or long version.
var commitHash = "76879546";
var prodUrl = "https://cdn.rawgit.com/node-girls/events-data/" + commitHash + "/events.json";

// DEVELOPMENT URL
// To see if your updated events.json is working, set this variable to the name
// of your working branch on the events-data repo (after you've pushed to GitHub)
var yourWorkingBranchName = "";
var devUrl = "https://rawgit.com/node-girls/events-data/" + yourWorkingBranchName + "/events.json";

// LOCAL URL
// Use if you are serving your events-data repo from a local server (e.g. simple-http-server)
var localUrl = "";

var DATA_URL = prodUrl; // change to devUrl or localURL as necessary

var TODAY = moment().format("YYYY-MM-DD");
