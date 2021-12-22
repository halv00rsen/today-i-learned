import admin from 'firebase-admin';
import { createInterface } from 'readline';

const databaseURL =
  'https://vanligfyr-default-rtdb.europe-west1.firebasedatabase.app';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL,
});

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Email? ', async (email) => {
  console.log(`Finding user ${email}`);
  if (email) {
    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const claims = userRecord.customClaims || { roles: [] };
      const roles = claims.roles as string[];
      const isAdmin = roles.includes('admin');
      if (isAdmin) {
        console.log(`The user is admin`);
      } else {
        console.log('The user is NOT admin');
      }
      readline.question('Make admin? (y/n/C) ', (input) => {
        if (input === 'y') {
          const newRoles = isAdmin
            ? [...roles]
            : [...roles, 'admin'];
          admin.auth().setCustomUserClaims(userRecord.uid, {
            ...claims,
            roles: newRoles,
          });
          console.log('user is made admin');
        } else if (input === 'n') {
          admin.auth().setCustomUserClaims(userRecord.uid, {
            ...claims,
            roles: roles.filter((role) => role !== 'admin'),
          });
          console.log('admin privileges is removed');
        } else {
          console.log('No change made to user.');
        }
        readline.close();
      });
    } catch (error) {
      console.log(`Error: ${error.code}`);
      readline.close();
    }
  } else {
    console.log('Please input a non empty email.');
    readline.close();
  }
});
