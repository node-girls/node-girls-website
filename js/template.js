var template = document.querySelector('#event-template').innerHTML;
var destination = document.querySelector('.events');


// PRODUCTION URL
// prodUrl requires the latest commit hash for the `json` branch (the merge commit from the last PR)
// Can be the short or long version.
var commitHash = "e112610";
var prodUrl = "https://cdn.rawgit.com/node-girls/node-girls-website/" + commitHash + "/events.json";

// DEVELOPMENT URL
// To see if your updated events.json is working, set this variable to the name
// of the branch you're working from (after you've pushed to GitHub)
var yourWorkingBranchName = "";
var devUrl = "https://rawgit.com/node-girls/node-girls-website/" + yourWorkingBranchName + "/events.json";

var DATA_URL = prodUrl; // change to devUrl as necessary
var TODAY = moment().format('YYYY-MM-DD');

fetch(DATA_URL)
  .then(function (res) {
    return res.json();
  })
  .then(sort)
  .then(handleData)
  .then(function (html) {
    document.querySelector('.future-events-container').innerHTML = html.futureHTML;
    document.querySelector('.past-events-container').innerHTML = html.pastHTML;
  })
  .catch(console.err);

function sort (data) {
  var futureEvents = data.filter(function (event) {
    return event.date >= TODAY;
  });
  var pastEvents = data.filter(function (event) {
    return event.date < TODAY;
  });
  return {
    futureEvents: futureEvents,
    pastEvents: pastEvents
  };
}

function handleData (events) {
  var futureHTML;
  if (events.futureEvents.length === 0) {
    futureHTML =
      '<p class="flow-text no-events-text">\
      More events to be announced soon.<br/>Check back here or \
      <a target="_blank" href="https://www.twitter.com/nodegirlslondon">on Twitter</a> \
      for updates!\
      </p>';
  } else {
    futureHTML = events.futureEvents.reduce(generateHTML, '');
  }
  var pastHTML = events.pastEvents.reduce(generateHTML, '');
  return {
    futureHTML: futureHTML,
    pastHTML: pastHTML
  };
}

/***************/

function generateHTML (finalHTML, event) {
  var currentEventHTML = template;

  for (var key in event) {
    var value = '';
    switch (key) {
    case 'date':
      value = moment(event.date).format('dddd Do MMMM YYYY');
      break;
    case 'application_text':
      value = generateApplicationText(event);
      break;
    case 'sponsors':
      value = generateSponsors(event.sponsors);
      break;
    default:
      value = event[key] || 'TBC'
    }
    currentEventHTML = currentEventHTML.replace(new RegExp('{{' + key + '}}', 'g'), value);
  }
  return finalHTML + currentEventHTML;
}

function generateApplicationText (event) {
  // if the event is in the future, include application text
  // add a link if there is one
  var text = '';
  if (moment(event.date).isAfter(TODAY))  {
    text = '<span class="application-text">' + event.application_text + '</span>';
    if (event.application_link && event.application_link.length > 0) {
      text = '<a href="' + event.application_link + '">' + text + '</a>';
    }
  }
  return text;
}

function generateSponsors (sponsors) {
  return sponsors.reduce((html, sponsor) => {
    html = html + '<a target="_blank" href="' + sponsor.link + '">\
      <img class="sponsor" src="' + sponsor.logo + '" alt="' + sponsor.name + '">\
    </a>'
    return html;
  }, '');
}
