# Today I learned

[![Build and deploy](https://github.com/halv00rsen/vanligfyr/actions/workflows/firebase-hosting-merge.yml/badge.svg?branch=main)](https://github.com/halv00rsen/vanligfyr/actions/workflows/firebase-hosting-merge.yml)

Website for writing and editing personal TIL.

Built with Firebase and React with Vite.

To start local web application:

```bash
cd frontend && npm run dev
```

Run firebase emulators:

```bash
# Inside root dir
npm run firebase
```

Auto build functions while developing (must be done first time so functions are built for local testing):

```bash
cd firebase/functions && npm run watch
```

Deploy changes to firestore, hosting or functions:

```bash
cd firebase && firebase deploy
```

For interacting with the admin user scripts:

```
export GOOGLE_APPLICATION_CREDENTIALS="/home/user/Downloads/service-account-file.json"
```

For more information, take a look at the [documentation](https://firebase.google.com/docs/admin/setup).

## Todo

- Add warning when trying to exit site to another web page (url)
- Write automated tests with cypress
