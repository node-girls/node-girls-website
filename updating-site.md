# Adding and updating events

Event info for `london.html` is generated dynamically from `js/template.js`.  Events are listed in a JSON array, stored on the [`json` branch](https://github.com/node-girls/node-girls-website/tree/json) of this repo.

### How does it actually work?
At the bottom of the html page is a template.  Anything wrapped in `{{handlebars}}` is replaced by the corresponding data in the events JSON.

`js/template.js` fetches the JSON from [RawGit](https://rawgit.com/), which hosts files in your GitHub on a CDN for free.  Then the template is populated with the relevant data and injected into the page.

# Instructions



### Step 1 - edit the JSON
- Pull down the `json` branch

- Edit the `events.json` file (see the **Data Structure** section below)
- Push to your working branch

### Step 2 - check it worked :)

In `js/template.js`, check the site still works by switching to the development url and loading the page locally.  Can also check the JSON updated by pasting the development url in your browser.

If 👍, raise a pull request on the `json` branch (**not** gh-pages or master)

The URLs for the events data look like this:
```js
// DEVELOPMENT - updates quickly
`https://rawgit.com/node-girls/node-girls-website/${yourWorkingBranchName}/events.json`

// PRODUCTION - updates slowly
`https://cdn.rawgit.com/node-girls/node-girls-website/${commitHash}/events.json`
```

### Step 3 - update the website's CDN link
After the PR for the event data is merged:

- Create a new branch off `gh-pages`

- Grab the latest commit hash from the `json` branch.  
- In `js/template.js`, assign it to the `commitHash` variable.

- Raise a PR to `gh-pages`

# Data structure

An event object has the following structure:

```js
{
  "date": "YYYY-MM-DD", // hyphens required
  "start_time": "HH:mm", // 24hr clock, with colon (:) and leading zero
  "end_time": "HH:mm",
  "title": "",
  "synopsis": "",
  "application_link": "",
  "application_text": "",
  "venue": "",
  "sponsors": [ // always an array, in case of multiple sponsors
    {
      "name": "",
      "link": "valid url",
      "logo": "image url - remote or local file"
    }
  ]
}
```

Note: you might want line breaks for `application_text` or `synopsis`. Use `<br/>` as part of your string and it will be parsed correctly.

#### `date`
Date of the event.  **Must** be in the YYYY-MM-DD format, including hyphens.  This is parsed by Moment.js to generate a more friendly format.  It's also used by `js/template.js` to sort the data properly.

#### `start_time`, `end_time`
When the event is due to start and end.  This must be 24 hour clock format, with a leading zero where needed.
Valid: "18:00", "08:00"
Invalid: "6.00" (missing leading zero), "06.00" (missing colon), "17.00" (missing colon)

#### `title`
This is the name of the event, e.g. "Introduction to JavaScript"

#### `synopsis`
Space to go into detail about the event, who it's aimed at, what people will learn etc.

#### `application_link`
URL that points to wherever people should sign up.  Revert to "" when applications have closed.

#### `application_text`
General info about applying.  This could say one of 3 things:
1. Applications are not live yet
2. Applications are live (see below)
3. Applications have closed

`application_text` will need to be updated throughout the lifecycle of the event, so that the text actually tells people what's going on :)

** When live**
`application_text` is made into a hyperlink, using the value at `application_link`.

#### `venue`
Name of the good people who are hosting us

#### `sponsors`
An **array** of sponsor objects.  Sponsor object contains
- name
  name of the sponsor (might be the same as `venue`)
- link
  Url pointing to the sponsor's website
- logo
  An image of the sponsor's logo.  Can be a local image on the repo or something grabbed from online.

## ⏳ The passage of time ⏳
- When an event's date comes, any links to apply will be hidden.

- When **all** the events in the JSON are in the past, i.e. when we haven't got any new events lined up, a message will appear saying:

> More events to be announced soon. Check back here or on Twitter for updates!
