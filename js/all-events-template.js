/*
 Used for /london and /events
*/
fetch(DATA_URL)
  .then(function(res) {
    return res.json();
  })
  .then(filterLocation)
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
    futureEvents: futureEvents.reverse(),
    pastEvents: pastEvents
  };
}

function filterLocation(data) {
  // keep all data for /events
  if (document.URL.indexOf('/events') !== -1) {
    return data;
  } else if (document.URL.indexOf('/london') !== -1) {
    // filters out non-London events for /london
    return data.filter(function(event) {
      return event.city === 'london';
    });
  } else if (document.URL.indexOf('/madrid') !== -1) {
    // filters out non-Madrid events for /madrid
    return data.filter(function(event) {
      return event.city === 'madrid';
    });
  }
}

function handleData(events) {
  var futureHTML;
  var twitterHandle = 'nodegirls';
  if (document.URL.indexOf('/events') === -1) {
    if (document.URL.indexOf('/london') !== -1) {
      twitterHandle += 'london';
    } else if (document.URL.indexOf('/madrid') !== -1) {
      twitterHandle += 'madrid';
    }
  }
  if (events.futureEvents.length === 0) {
    futureHTML = `<p class="flow-text no-events-text">\
      More events to be announced soon.<br/>Check back here or \
      <a target="_blank" href="https://www.twitter.com/${twitterHandle}">on Twitter</a> \
      for updates!\
      </p>`;
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
