/*
  Used for index.html and events.html
*/
fetch(DATA_URL)
  .then(function(res) {
    return res.json();
  })
  .then(sort)
  .then(handleData)
  .then(function(html) {
    document.querySelector('.future-events-container').innerHTML =
      html.futureHTML;
  })
  .catch(console.err);

function sort(data) {
  var futureEvents = data.filter(function (event) {
    if (event.date === 'TBC') return false;
    return event.date >= TODAY;
  });
  return {
    futureEvents: futureEvents.reverse()
  };
}

function handleData(events) {
  var futureHTML;
  if (events.futureEvents.length === 0) {
    futureHTML =
      '<p class="flow-text no-events-text">\
      More events to be announced soon.<br/>Check back here or \
      <a target="_blank" href="https://www.twitter.com/nodegirls">on Twitter</a> \
      for updates!\
      </p>';
  } else {
    futureHTML = events.futureEvents.reduce(generateHTML, '');
  }
  return {
    futureHTML: futureHTML
  };
}

/***************/

function generateHTML(finalHTML, event) {
  var currentEventHTML = template;

  for (var key in event) {
    var value = '';
    switch (key) {
      case 'date':
        value = moment(event.date).format('dddd Do MMMM YYYY');
        break;
      case 'application_data':
        value = composeApplicationText(event);
        break;
      case 'sponsors':
        value = generateSponsors(event.sponsors);
        break;
      case 'city':
        value = event.city;
      default:
        value = event[key] || 'TBC';
    }
    currentEventHTML = currentEventHTML.replace(
      new RegExp('{{' + key + '}}', 'g'),
      value
    );
  }
  return finalHTML + currentEventHTML;
}

function composeApplicationText(eventArr) {
  let result = '<span class="application-text">';
  return eventArr.application_data.reduce((acc, event, i) => {
    acc += generateApplicationText(event);
    if (i === eventArr.length - 1) {
      return (acc += '</span>');
    }
    return acc;
  }, result);
}

function generateApplicationText(event) {
  // if the event is in the future, include application text
  // add a link if there is one
  var text = '';
  if (moment(event.date).isAfter(TODAY)) {
    text = '<span>' + event.application_text + '</span>';
    if (event.application_link && event.application_link.length > 0) {
      text = '<a href="' + event.application_link + '">' + text + '</a>';
    }
  }
  return text;
}

function generateSponsors(sponsors) {
  if (sponsors.length === 0) {
    return '';
  }
  return sponsors.reduce((html, sponsor) => {
    html =
      html +
      '<a target="_blank" href="' +
      sponsor.link +
      '">\
      <img class="sponsor" src="' +
      sponsor.logo +
      '" alt="' +
      sponsor.name +
      '">\
    </a>';
    return html;
  }, '');
}
