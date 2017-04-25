import admin from 'firebase-admin';

const serviceAccount = require(`../../../../${process.env.FIREBASE_SERVICE_ACCOUNT_JSON}`);

const config = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_URL,
};

admin.initializeApp(config);

export default admin;
