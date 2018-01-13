# Adding and updating events

Event info for `london.html` is generated dynamically from `js/template.js`.  Events are listed in a JSON array, stored in the [events-data](https://github.com/node-girls/events-data/tree/master/events.json) repository.

### How does it actually work?
At the bottom of the html page is a template.  Anything wrapped in `{{handlebars}}` is replaced by the corresponding data in the events JSON.

`js/all-events-template.js` and `js/next-event-template.js` fetch the JSON from [RawGit](https://rawgit.com/), which hosts files in your GitHub on a CDN for free.  Then the templates are populated with the relevant data and injected into the page.

Our JSON lives inside the [events-data repo](https://github.com/node-girls/events-data).

# Instructions


### Step 1 - edit the JSON
- Go to the [events-data repo](https://github.com/node-girls/events-data) and create a new branch off master

- Edit the `events.json` file (see the **Data Structure** section [here](https://github.com/node-girls/events-data#data-structure))

- Push to your working branch

### Step 2 - check it worked :)

In `js/variables.js`, check the site still works by switching to the development url and loading the page locally.  Can also check the JSON updated by pasting the development url in your browser.

If 👍, raise a pull request on the events-data master branch

The URLs for the events data look like this:
```js
// DEVELOPMENT - updates quickly
`https://rawgit.com/node-girls/events-data/${yourWorkingBranchName}/events.json`

// PRODUCTION - updates slowly
`https://cdn.rawgit.com/node-girls/events-data/${commitHash}/events.json`
```

### Step 3 - update the website's CDN link
After the PR for the event data is merged:

- Create a new branch off `gh-pages`

- In the events-data repo, grab the latest commit hash from master.

- In `js/variables.js`, assign it to the `commitHash` variable.

- Raise a PR to `gh-pages`


## ⏳ The passage of time ⏳
- When an event's date comes, any links to apply will be hidden.

- When **all** the events in the JSON are in the past, i.e. when we haven't got any new events lined up, a message will appear saying:

> More events to be announced soon. Check back here or on Twitter for updates!
