import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AddNewObservation from '../screens/observation/AddNewObservation';
import {RubricIndicatorItem, RubricItem} from '../redux/features/rubricSlice';
import RubricIndicatorDescription from '../screens/rubric/RubricIndicatorDescription';
import RubricEvaluationIndicatorList from '../screens/rubric/RubricEvaluationIndicatorList';
import RubricMainPage from '../screens/rubric/RubricMainPage';
import UsersMainPage from '../screens/userManagement/UsersMainPage';

export type UserManagementStackParamList = {
UsersMainPage:undefined;

};

const UserManagementStackTab = createStackNavigator<UserManagementStackParamList>();

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
      <UserManagementStackTab.Screen name='UsersMainPage' component={UsersMainPage} />

    </UserManagementStackTab.Navigator>
  );
};

export default UserManagementStack;
