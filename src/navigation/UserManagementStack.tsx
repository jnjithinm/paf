import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import UsersMainPage from '../screens/userManagement/UsersMainPage';
import UserGroups from '../screens/userManagement/UserGroups';
import RolesAndAppAccess from '../screens/userManagement/RolesAndAppAccess';

export type UserManagementStackParamList = {
  UsersMainPage: undefined;
  UserGroups: undefined;
  RolesAndAppAccess:undefined;
};

const UserManagementStack =
  createStackNavigator<UserManagementStackParamList>();

const UserManagementStackNavigator = ({}) => {
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
    <UserManagementStack.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <UserManagementStack.Screen
        name="UsersMainPage"
        component={UsersMainPage}
      />
      <UserManagementStack.Screen name="UserGroups" component={UserGroups} />
      <UserManagementStack.Screen name='RolesAndAppAccess' component={RolesAndAppAccess} />
    </UserManagementStack.Navigator>
  );
};

export default UserManagementStackNavigator;
