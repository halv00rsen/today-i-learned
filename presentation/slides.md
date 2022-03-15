---
theme: default
layout: cover
---

# Firebase Emulators with Cypress in Github Actions

Integration tests in a CI/CD envioronment with Firebase Emulators

---

# Motivation

- Test setup almost equal to production setup

---

# Technologies

- **Firebase**
- **Firebase emulators**
- **Github Actions**
- **Cypress**

---
layout: two-cols
---

# What is Firebase?

Simple and easy way of hosting a proof of consept with strong capabilities.

<v-clicks>

## Some Features

- Hosting with domain and HTTPS
- Database with Firestore
- Functions
- Authentication

## !! Firebase Emulators !!

</v-clicks>

::right::

<img src="images/firebase-logo.svg" class="m-20 h-20"/>

<!--
This is a note on multiple lines
-->

---

# Firebase Emulators

Emulate the entire setup locally or in a CI/CD environment. No need of an internet connection for full development.

---

# Additional Technologies

- Github Actions
- Cypress
- Web application

<!-- Describe each technology briefly -->

---

# firebase.json

```json
{
  // ...
  "emulators": {
    "auth": {
        "port": 9099
    },
    "firestore": {
        "port": 8080
    },
    "hosting": {
        "port": 5000
    },
    "ui": {
        "enabled": true
    }
    // ... other emulators supported as well
  },
  // ...
}
```

<!--
Standard ports and configuration for the emulators.
This is all you need for setting up these emulators.
-->

---

# Web app code for interaction with Firebase

```js
// Configuration for Firebase project
const firebaseConfig = { ... };

const firebaseApp = initializeApp(firebaseConfig);
const isCypress = import.meta.env.DEV && window.Cypress;

initializeFirestore(firebaseApp, {
  experimentalForceLongPolling: isCypress,
  ignoreUndefinedProperties: true,
});

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

if (import.meta.env.DEV) {
  connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export { firestore, firebaseAuth };

```
<!--
Cypress intercepts some XHR-requests (fetch?). This doesn't work quite well with the connection with firestore which uses some kind of sockets. This forces each request within the socket to be handled correctly.

experimentalForceLongPolling: isCypress
 -->

---

# Mocking of test data

Play around in your web application, for example create some test users in authenticator. Create test data which can be used for integration tests and local development.

```bash
# Start emulators
firebase emulators:start --import mock-data

# Export data created within the emulators
firebase emulators:export mock-data
```

- Save in commit history
- Use these test data for your integration tests

---

# CI/CD setup

- Build frontend application
- Move assets to firebase folder
- Build and install dependencies for emulators
- Start emulators with hosting, functions, database
- Run integrations tests

---

# Directory setup

```bash
cd application

firebase/
firebase/functions
frontend/
```

---

# Github Action

My app consists of three different applications

- frontend app
- firebase emulators/app
- custom firebase functions

Each of these is built independent

```yml
- name: Install dependencies
  uses: bahmutov/npm-install@v1
  with:
    working-directory: |
    firebase/functions
    frontend
    firebase
```

---

# Github Action

```yml {all|3|4}
- name: Build frontend CI app
  run: |
    npm run build-test
    cp -R dist ../firebase/public
  working-directory: frontend
```

<!--
npm run build-test creates a build for the CI/CD env. Similar to the local build just for hosting/prod
 -->

---

# Github Action

Start emulators in the background

```yml {all|3,4|6}
- name: Start Firebase emulators
  run: |
    firebase emulators:start --import integration-test-data &
    # npm run start-e2e-server &
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
  working-directory: firebase
```

<!--
Note the last '&' - this comes from bash/linux and runs that command in the background

Note that we include the test data folder here
-->

---

# Github Action

Run the integration tests.

```yml {all|2|4,5|7}
- name: Cypress run
  uses: cypress-io/github-action@v2
  with:
    # cypress run --config baseUrl=http://localhost:5000
    command: npm run e2e:run
    working-directory: frontend
    wait-on: "http://localhost:5000" # as defined in firebase.json
```

If this step goes OK, the tests have passed and we can merge to main.

<!--
* This action gives some setup from Cypress out of the box.
-->

---

# Github Action

If the tests fail, persist artifacts

```yml {all|1|2|3,4|10,11|all}
- uses: actions/upload-artifact@v2
  if: failure()
  with:
    name: cypress-screenshots
    path: frontend/cypress/screenshots
    retention-days: 1
- uses: actions/upload-artifact@v2
  if: failure()
  with:
    name: firebase-logs
    path: firebase/*.log
    retention-days: 1
```

<!--
Save artifacts from failed build straight into the view.
TODO: Add screenshot of failure
-->

---

# Cypress Tests

```ts {all|4,5|6,7|8-10|11,12|all}
// authentication.spec.ts
describe('authentication', () => {
  it('logs into application and redirects to home', () => {
    cy.visit('/');
    cy.get('[data-test-id="header-title"]').should('exist');
    cy.get('[data-test-id="header-login"]').click();
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('admin@admin.admin');
    cy.get('input[name="password"]').type('passord');
    cy.get('button[name="submit"]').click();
    cy.isUrl(View.HOME);
    cy.get('[data-test-id="profile-view"]').should('exist');
  });
});
```

<!--
Comment on usage of data-test-id
 -->

---

# Known flaws and things to think about

- Need to maintain mock/test data
- Divide test data and data used for integration tests
- Cannot replace a full testing environment in Firebase
- Indexing of database queries isn't supported/needed in Firebase Emulators

---

# Questions?

---

# Docs

Used for my [today I learned site](https://til.jorgehal.no), [repository](https://github.com/halv00rsen/today-i-learned)
