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

const UserManagementStackTab =
  createStackNavigator<UserManagementStackParamList>();

const UserManagementStack = ({}) => {
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
    <UserManagementStackTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <UserManagementStackTab.Screen
        name="UsersMainPage"
        component={UsersMainPage}
      />
      <UserManagementStackTab.Screen name="UserGroups" component={UserGroups} />
      <UserManagementStackTab.Screen name='RolesAndAppAccess' component={RolesAndAppAccess} />
    </UserManagementStackTab.Navigator>
  );
};

export default UserManagementStack;
