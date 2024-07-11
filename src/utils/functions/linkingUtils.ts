import {Linking, Platform} from 'react-native';

export const openEmailApp = async () => {
  if (Platform.OS === 'android') {
    const intentUrl =
      'intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.DEFAULT;category=android.intent.category.APP_EMAIL;end';

    try {
      Linking.openURL('https://gmail.app.goo.gl');
    } catch (err) {
      console.error('An error occurred', err);
    }
  } else if (Platform.OS === 'ios') {
    const mailtoURL = 'mailto:';

    try {
      const supported = await Linking.canOpenURL(mailtoURL);
      if (supported) {
        await Linking.openURL(mailtoURL);
      } else {
        console.log("Don't know how to open URI: " + mailtoURL);
      }
    } catch (err) {
      console.error('An error occurred', err);
    }
  } else {
    console.log('Platform not supported');
  }
};

export const sendEmail = (emailId: string, subject: string, body: string) => {
  const url = `mailto:${emailId}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  Linking.openURL(url)
    .then(() => {
      console.log('Email client opened successfully');
    })
    .catch(error => {
      console.error('Error opening email:', error);
      if (Platform.OS === 'android') {
        console.warn('Ensure an email client is installed and set up on your device.');
      }
    });
};
