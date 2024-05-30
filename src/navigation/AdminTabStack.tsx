import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AdminFlowsDashboard from '../screens/admin/AdminFlowsDashboard';
import AdminFormList from '../screens/admin/AdminFormList';

export type AdminTabStackTabBarStackParamList = {
    AdminFlowsDashboard: undefined;
    AdminFormList:undefined;

};

const AdminTabStackTab = createStackNavigator<AdminTabStackTabBarStackParamList>();

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
      <AdminTabStackTab.Screen
        name="AdminFlowsDashboard"
        component={AdminFlowsDashboard}
      />
       <AdminTabStackTab.Screen
        name="AdminFormList"
        component={AdminFormList}
      />
      
    </AdminTabStackTab.Navigator>
  );
};

export default AdminTabStack;
