import { initializeApp, getApps } from '@firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
} from '@firebase/firestore';
import { getAuth, connectAuthEmulator } from '@firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCxk3gdF6plLqNWwnGGtGTNh-BbuyTTGQM',
  authDomain: 'vanligfyr.firebaseapp.com',
  databaseURL:
    'https://vanligfyr-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'vanligfyr',
  storageBucket: 'vanligfyr.appspot.com',
  messagingSenderId: '395117634570',
  appId: '1:395117634570:web:5630f98224e7c5f2972bf3',
};

const environment = process.env.NODE_ENV;

const appName = 'vanligfyr';

const allApps = getApps();

const firebaseApp =
  allApps.find((app) => app.name === appName) ??
  initializeApp(firebaseConfig);

const firestore = getFirestore(firebaseApp);
const firebaseAuth = getAuth(firebaseApp);

if (environment === 'development') {
  connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
  connectFirestoreEmulator(firestore, 'localhost', 8080);
}

export { firestore, firebaseAuth };
