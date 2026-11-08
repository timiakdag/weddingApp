# Wedding Website & RSVP App

A wedding website where guests look up their name, RSVP for their entire party, share dietary
requirements, and request songs for the reception.

## Project

I built my own wedding website to gain experience and knowledge as a full stack developer, and to
use AI tools in the build. I wanted to learn about React, JavaScript, CSS, website deployment and
the various tools used to create full stack applications. I used Claude Code as a reviewer and
guide along the way: getting peer review on my changes, having concepts explained using my own
code, and keeping project notes up to date.

## Tech stack

- **React 19** (Create React App) with **react-router-dom** for page routing
- **Tailwind CSS** for styling
- **Firebase**: Firestore for data, Firebase Hosting with separate test and production projects
- **Cloudinary** for hosting and resizing the home page photos
- **Fuse.js** for fuzzy name search

## Learning

I think one of the coolest aspects of React is the reusable components. My background is in
MUMPS, a procedural language co-created by one of the founders of the company I worked for, so we
did not follow the object-oriented programming model. What surprised me is that modern React is
also not object oriented: a component is just a function that takes in data (props and state) and
returns what the UI should look like. You build pages by composing small components together
rather than by inheritance. Learning to break down the UI and establish these components was
challenging but made sense once the project started coming together.

Using Firebase, I was surprised by how much functionality Google provides in the free tier. They
provide a lot of data storage and functionality for free, which is something I appreciate as I am
not building the website for profit.

## Design decisions

The use case of my application is fairly small, with a maximum of 150 guests. I still wanted to
design each piece carefully, with two goals in mind: guests should be able to find themselves
easily, and the data should stay clean no matter how many times someone submits.

**Data model.** Each guest is stored with a unique identifier, and each guest also carries a party
identifier shared by everyone in their party, similar to a foreign key in a relational database.
When a guest searches for their name, their entire party is pulled up. This allows guests to RSVP
for their entire party. The RSVP answers are saved to a separate collection in the database, and
each response is keyed by the party identifier. This means that resubmitting an RSVP overwrites
the data and does not create duplicates. It also lets a returning guest pick up where they left
off with their previous answers.

**Name search.** Guests misspell names and use nicknames, so the search runs in two steps. It first
tries an exact match against a normalized list of each guest's name variations. If that fails, it
falls back to a fuzzy search that tolerates typos. The search waits until the guest pauses typing
before it runs.

**Environments.** There are separate test and production Firebase projects, so I can try out
changes against test data before deploying to the real site.

## Known tradeoffs and next steps

- **Security:** the guest list is currently loaded into the browser and searched there, and RSVP
  responses are protected only by an unguessable ID rather than by sign-in. That was a deliberate
  tradeoff for a small private site. Next I plan to move the name search into a Firebase Cloud
  Function, so the browser only receives the party that matches the search and never sees the full
  guest list.
- **Deployment:** builds and deploys are run by hand. CI that builds and deploys automatically is a
  future improvement.
- **Forms:** the RSVP form uses plain React state. Moving it to react-hook-form with zod validation
  is planned.

## Running locally

1. `npm install`
2. Create a `.env` file with your own Firebase config (`REACT_APP_FIREBASE_API_KEY`,
   `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`,
   `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`,
   `REACT_APP_FIREBASE_APP_ID`) and `REACT_APP_CLOUDINARY_CLOUD_NAME`.
3. `npm start`, then open http://localhost:3000
