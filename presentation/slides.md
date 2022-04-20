---
theme: default
layout: cover
---

<!-- # Integrasjonstesting med Firebase Emulators -->
# E2E-tester med Firebase Emulators

---

# Hva skal du sitte igjen med?

* Spennende teknologier
* Nysgjerrighet

<!--
* Hørt om noen nye teknologier
* Lært et par fordeler med å ha en hel emulator suite lokalt
* Fordelen med å ha ende til ende tester på et tilnærmet likt prod miljø
-->

---

# Teknologier

- **Firebase**
- **Firebase Emulators**
- **Github Actions**
- **Cypress**

<!--
Kanskje noen av teknologiene er litt kjente for folk her?
Eller er alt nytt kanskje?
-->

---

# Firebase

- Hosting with domain and HTTPS
- Database with Firestore
- Functions
- Authentication

<!-- Spør rommet om kjennskap - kanskje denne kan sløyfes -->
---

# Firebase Emulators

<img src="https://firebase.google.cn/docs/emulator-suite/images/emulator-suite-usecase.png" class="h-100 rounded shadow" />

<!-- ![emulator-suite](https://firebase.google.cn/docs/emulator-suite/images/emulator-suite-usecase.png) -->

<!--
Gjør seg i en kommentar kanskje? "Integration Tests: each individual product emulator in the Emulator Suite responds to SDK and REST API calls just like production Firebase services. So you can use your own testing tools to write self-contained integration tests that use the Local Emulator Suite as the backend."
-->

---
layout: two-cols
---

<template v-slot:default>

# Firebase Emulators

*Eksempel på en konfigurasjon firebase.json*

</template>
<template v-slot:right>

```json {all|16-21}
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/user",
        "function": "user"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "hosting": { "port": 5000 },
    "ui": { "enabled": true }
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

<!--
Standard ports and configuration for the emulators.
This is all you need for setting up these emulators.
-->

</template>

---

# Firebase Emulators

```bash
# First time
firebase emulators:start

# ... create test data using your application ...

# Export data created within the emulators
firebase emulators:export mock-data

# Start emulators with mock data
firebase emulators:start --import mock-data

# Alternatively
git add mock-data/

```

<!--
- *Run emulators with mock data*
- Integration Tests: each individual product emulator in the Emulator Suite responds to SDK and REST API calls just like production Firebase services. So you can use your own testing tools to write self-contained integration tests that use the Local Emulator Suite as the backend.
- Save in commit history
- Use these test data for your integration tests

-->

---


# Kode for applikasjonen

```js{all|8|15-18|all}
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

Nevn at kalling av functions ikke trenger noe mer magi enn det som er definert i firebase.json
 -->

---

# Github Action - pipeline

- Installer emulatorene
- Bygg "prodbygg"
- Flytt "prodbygg" til firebase hosting mappen
- Start emulatorene
- Kjør integrasjonstester

<!--
Forklar hvorfor "prodbygg" (siden jeg har definert at
import.meta.env.DEV er måten jeg bestemmer om jeg skal kommunisere med emulatorene), kan jeg ikke bruke prodbygget.
Viser kun de mest relevante delene av integration-tests.yml
-->

---

# Github Action - Integration test

```yml
- name: Install dependencies
  uses: bahmutov/npm-install@v1
  with:
    working-directory: |
      firebase/functions
      frontend
      firebase
```

Full action-fil kan sees i [Github repo](https://github.com/halv00rsen/today-i-learned)

<!--
- Webapp (./frontend/)
- Diverse firebase (./firebase/)
- Funksjoner (./firebase/functions)
-->

---

# Github Action - Integration test

```yml
- name: Build frontend CI app
  run: |
    tsc && vite build --mode test
    cp -R dist ../firebase/public
  working-directory: frontend
```

<!--
npm run build-test creates a build for the CI/CD env. Similar to the local build just for hosting/prod

Verd å nevne at flere av kommandoene kommer fra package.json
De er skrevet full ut for enkelhets skyld.

Siden vi har definert at hosting emulatoren skal bruke /public for
hosting av nettsiden, må vi flytte bygde filer dit.
 -->

---

# Github Action - Integration test

```yml {all|3,6}
- name: Start Firebase emulators
  run: |
    firebase emulators:start --import integration-test-data &
  env:
    FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
  working-directory: firebase
```

<!--
Note the last '&' - this comes from bash/linux and runs that command in the background

Note that we include the test data folder here
Kommandoen kan puttes inn i package.json

Nevn hvorfor firebase token er her - er kanskje overflødig?

Kanskje nevn at funksjonene (om de er der) også må installeres og
bygges

Dette steget er faktisk alt som skal til for å ha en fullt kjørende
versjon av applikasjonen med emulatorene og webappen.
-->

---

# Github Action - Integration test

```yml {all|4,5|6}
- name: Cypress run
  uses: cypress-io/github-action@v2
  with:
    command: cypress run --config baseUrl=http://localhost:5000
    working-directory: frontend
    wait-on: "http://localhost:5000" # as defined in firebase.json
```

<!--
* Kanskje ha en kort intro til Cypress her? Luft stemninga

* This action gives some setup from Cypress out of the box.

If this step goes OK, the tests have passed and we can merge to main.

Den "wait-on" er ganske viktig, forklar denne
-->

---

# Github Action - Integration test

```yml
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
If the tests fail, persist artifacts

Save artifacts from failed build straight into the view.
TODO: Add screenshot of failure

Denne er mest for bonus, har jeg lite tid så sløyfer jeg denne
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
    cy.url().should('include', '/profile');
    cy.get('[data-test-id="profile-view"]').should('exist');
  });
});
```

<!--
* Comment on usage of data-test-id

* Forklar hvilke firebase tjenester som er i bruk på hvert steg
  Typ hosting, auth, database, functions etc.

* Vurder å legge inn flere test caser her, en som bruker functions,
  firestore etc
 -->

---

# Spørsmål?

---

# Docs

- [TIL-side](https://til.jorgehal.no)
- [Github-repo](https://github.com/halv00rsen/today-i-learned)
- [Firebase emulators](https://firebase.google.cn/docs/emulator-suite?hl=en&%3Bskip_cache=false&skip_cache=false)
- [Cypress](https://www.cypress.io/)
- [Github Actions](https://github.com/features/actions)
