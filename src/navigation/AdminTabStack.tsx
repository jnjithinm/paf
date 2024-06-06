import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AdminFormResponses from '../screens/admin/AdminFormResponses';

export type AdminTabStackTabBarStackParamList = {
  AdminFlowsMainPage: undefined;
  AdminFormList: undefined;
  AdminFormResponses: undefined;
};

const AdminTabStackTab =
  createStackNavigator<AdminTabStackTabBarStackParamList>();

const AdminTabStack = () => {
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
    <AdminTabStackTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      {/* <AdminTabStackTab.Screen
        name="AdminFlowsMainPage"
        component={AdminFlowsMainPage}
      />
      <AdminTabStackTab.Screen name="AdminFormList" component={AdminFormList} /> */}
      <AdminTabStackTab.Screen
        name="AdminFormResponses"
        component={AdminFormResponses}
      />
    </AdminTabStackTab.Navigator>
  );
};

export default AdminTabStack;
