Date.prototype.yyyymmdd = function () {
 let mm = this.getMonth() + 1; // getMonth() is zero-based
 let dd = this.getDate();

 return [this.getFullYear(),
         (mm > 9 ? '' : '0') + mm,
         (dd > 9 ? '' : '0') + dd
       ].join('-');
};
const template = document.querySelector('#event-template').innerHTML;
const destination = document.querySelector('.events');
const jsonUrl = "https://rawgit.com/node-girls/node-girls-website/json/events.json";

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
  const now = new Date().yyyymmdd();
  const futureEvents = data.filter(event => event.date >= now);
  const pastEvents = data.filter(event => event.date < now);
  return { futureEvents, pastEvents };
}

function handleData ({ futureEvents, pastEvents }) {
  const futureHTML = futureEvents.reduce(generateHTML, '');
  const pastHTML = pastEvents.reduce(generateHTML, '');
  return { futureHTML, pastHTML };
}

function generateHTML (finalHTML, event) {
  let currentEventHTML = template;
  for (let key in event) {
    if (key === 'date') {
      currentEventHTML = currentEventHTML.replace(/{{date}}/, moment(event.date).format('dddd Do MMMM YYYY'));
    } else if (key === 'application_text') {
      let text = '';
      // if the event is in the future, include application text
      if (moment(event.date).isAfter(new Date().yyyymmdd()))  {
        text = `<span class="application-text">${event.application_text}</span>`;
        // add a link if there is one
        if (event.application_link && event.application_link.length > 0) {
          text = `<a href="${event.application_link}">${text}</a>`;
        }
      }
      currentEventHTML = currentEventHTML.replace(/{{application_text}}/, text);
    } else if (key === 'sponsors') {
      currentEventHTML = currentEventHTML.replace(/{{sponsors}}/, generateSponsors(event.sponsors));
    } else {
      currentEventHTML = currentEventHTML.replace(new RegExp('{{' + key + '}}', 'g'), event[key] || 'TBC');
    }
  }
  return finalHTML + currentEventHTML;
}

function generateSponsors (sponsors) {
  return sponsors.reduce((html, sponsor) => {
    html = html + `<a target="_blank" href="${sponsor.link}">
      <img class="sponsor" src="${sponsor.logo}" alt="${sponsor.name}">
    </a>`
    return html;
  }, '');
}
