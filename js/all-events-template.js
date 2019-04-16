/*
 Only used for London events
*/
fetch(DATA_URL)
  .then(function(res) {
    return res.json();
  })
  .then(filterLondon)
  .then(sort)
  .then(handleData)
  .then(function(html) {
    document.querySelector('.future-events-container').innerHTML =
      html.futureHTML;
    document.querySelector('.past-events-container').innerHTML = html.pastHTML;
  })
  .catch(console.err);

function sort(data) {
  var futureEvents = data.filter(function(event) {
    return event.date >= TODAY;
  });
  var pastEvents = data.filter(function(event) {
    return event.date < TODAY;
  });

  return {
    futureEvents: futureEvents,
    pastEvents: pastEvents
  };
}

function filterLondon(data) {
  // filters out non-London events
  if (document.URL.indexOf('/events') !== -1) {
    return data;
  }
  return data.filter(function(event) {
    return event.city === 'london';
  });
}

function handleData(events) {
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
