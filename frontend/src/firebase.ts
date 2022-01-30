import {
  initializeApp,
  getApps,
  FirebaseOptions,
} from '@firebase/app';
import {
  getFirestore,
  initializeFirestore,
  connectFirestoreEmulator,
} from '@firebase/firestore';
import { getAuth, connectAuthEmulator } from '@firebase/auth';

declare global {
  interface Window {
    Cypress?: unknown;
  }
}

const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyCxk3gdF6plLqNWwnGGtGTNh-BbuyTTGQM',
  authDomain: 'vanligfyr.firebaseapp.com',
  databaseURL:
    'https://vanligfyr-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vanligfyr',
  storageBucket: 'vanligfyr.appspot.com',
  messagingSenderId: '395117634570',
  appId: '1:395117634570:web:5630f98224e7c5f2972bf3',
};

const appName = 'vanligfyr';

const allApps = getApps();

const firebaseApp =
  allApps.find((app) => app.name === appName) ??
  initializeApp(firebaseConfig);

if (import.meta.env.DEV && window.Cypress) {
  console.warn(
    "Only used for Cypress as XHR requests and firestore don't work."
  );
  initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
    ignoreUndefinedProperties: true,
  });
} else {
  initializeFirestore(firebaseApp, {
    ignoreUndefinedProperties: true,
  });
}

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

if (import.meta.env.DEV) {
  connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export { firestore, firebaseAuth };
