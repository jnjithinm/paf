/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    '494416240289-n9v9ut880eba23srv4t50vc3uo50d8gl.apps.googleusercontent.com',
  androidClientId:
    '494416240289-dl28s9rp074pk58sg0u2mocch3o28b1r.apps.googleusercontent.com',
  offlineAccess: true,
  scopes: ['profile',"email","https://www.googleapis.com/auth/calendar"], // Add calendar events scope
});
AppRegistry.registerComponent(appName, () => App);
LogBox.ignoreAllLogs();
