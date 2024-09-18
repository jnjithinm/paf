import {getApps, initializeApp} from '@react-native-firebase/app';
import {getDatabase} from '@react-native-firebase/database';
import Config from 'react-native-config';
const {
  REACT_APP_GOOGLE_FIREBASE_APIKEY,
  REACT_APP_GOOGLE_FIREBASE_AUTH_DOMAIN,
  REACT_APP_GOOGLE_FIREBASE_DB_URL,
  REACT_APP_GOOGLE_FIREBASE_PROJECT_ID,
  REACT_APP_GOOGLE_FIREBASE_STORAGE_BUCKET,
  REACT_APP_GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
  REACT_APP_GOOGLE_FIREBASE_APP_ID,
} = Config;

const firebaseConfig = {
  apiKey: REACT_APP_GOOGLE_FIREBASE_APIKEY,
  authDomain: REACT_APP_GOOGLE_FIREBASE_AUTH_DOMAIN,
  databaseURL: REACT_APP_GOOGLE_FIREBASE_DB_URL,
  projectId: REACT_APP_GOOGLE_FIREBASE_PROJECT_ID,
  storageBucket: REACT_APP_GOOGLE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_GOOGLE_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_APP_GOOGLE_FIREBASE_APP_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // If already initialized, use the existing app
}

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export {database};
