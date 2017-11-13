const template = document.querySelector('#event-template').innerHTML;
const destination = document.querySelector('.events');
const jsonUrl = "https://rawgit.com/node-girls/node-girls-website/json/events.json";
const TODAY = moment().format('YYYY-MM-DD');

fetch(jsonUrl)
  .then(res => res.json())
  .then(sort)
  .then(handleData)
  .then(({ futureHTML, pastHTML }) => {
    document.querySelector('.future-events').innerHTML = futureHTML;
    document.querySelector('.past-events').innerHTML = pastHTML;
  })
  .catch(console.err);

function sort (data) {
  const futureEvents = data.filter(event => event.date >= TODAY);
  const pastEvents = data.filter(event => event.date < TODAY);
  return { futureEvents, pastEvents };
}

function handleData ({ futureEvents, pastEvents }) {
  const futureHTML = futureEvents.reduce(generateHTML, '');
  const pastHTML = pastEvents.reduce(generateHTML, '');
  return { futureHTML, pastHTML };
}

/***************/

function generateHTML (finalHTML, event) {
  let currentEventHTML = template;

  for (let key in event) {
    let value = '';
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
      value =  event[key] || 'TBC'
    }
    currentEventHTML = currentEventHTML.replace(new RegExp('{{' + key + '}}', 'g'), value);
  }
  return finalHTML + currentEventHTML;
}

function generateApplicationText (event) {
  // if the event is in the future, include application text
  // add a link if there is one
  let text = '';
  if (moment(event.date).isAfter(TODAY))  {
    text = `<span class="application-text">${event.application_text}</span>`;
    if (event.application_link && event.application_link.length > 0) {
      text = `<a href="${event.application_link}">${text}</a>`;
    }
  }
  return text;
}

function generateSponsors (sponsors) {
  return sponsors.reduce((html, sponsor) => {
    html = html + `<a target="_blank" href="${sponsor.link}">
      <img class="sponsor" src="${sponsor.logo}" alt="${sponsor.name}">
    </a>`
    return html;
  }, '');
}
