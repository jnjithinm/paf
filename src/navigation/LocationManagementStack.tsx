import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import UsersMainPage from '../screens/userManagement/UsersMainPage';
import UserGroups from '../screens/userManagement/UserGroups';
import RolesAndAppAccess from '../screens/userManagement/RolesAndAppAccess';

export type LocationManagementStackParamList = {
  UsersMainPage: undefined;
  UserGroups: undefined;
  RolesAndAppAccess:undefined;
};

const LocationManagementStack =
  createStackNavigator<LocationManagementStackParamList>();

const LocationManagementStackNavigator = ({}) => {
  const customTransition = ({
    current,
    layouts,
  }: StackCardInterpolationProps) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [500, 0],
            }),
          },
        ],
      },
    };
  };
  return (
    <LocationManagementStack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <LocationManagementStack.Screen
        name="UsersMainPage"
        component={UsersMainPage}
      />
      <LocationManagementStack.Screen name="UserGroups" component={UserGroups} />
      <LocationManagementStack.Screen name='RolesAndAppAccess' component={RolesAndAppAccess} />
    </LocationManagementStack.Navigator>
  );
};

export default LocationManagementStackNavigator;
