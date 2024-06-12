import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserCredentialTypes } from '../../config/types';

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.log('Error saving screen name: ', error);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log('Error saving screen name: ', error);
  }
};

export const storeUserCredentials = async (
  emailId: string,
  password: string,

) => {
  try {
    if (emailId) {
      await AsyncStorage.setItem('emailId', emailId);
    }
    if (password) {
      await AsyncStorage.setItem('password', password);
    }

    
  } catch (error) {
    console.log('Error saving screen name: ', error);
  }
};

export const getUserCredentials = async (): Promise<UserCredentialTypes | null> => {
  try {
    const emailId = await AsyncStorage.getItem('emailId');
    const password = await AsyncStorage.getItem('password');

    if (
      emailId === null ||
      password === null

    ) {
      return null;
    }
    return {emailId, password};
  } catch (error) {
    console.log('Error getting user details: ', error);
    return null;
  }
};

export const clearUserCredentials = async () => {
  try {
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('mobileNo');
    await AsyncStorage.removeItem('emailId');
    await AsyncStorage.removeItem('fullName');
  } catch (error) {
    console.log('Error clearing user details: ', error);
  }
};
