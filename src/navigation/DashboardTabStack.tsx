import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import RubricStack from './RubricTabStack';
import ReportsStack from './ReportsTabStack';
import AdminTabStack from './AdminTabStack';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';

export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  ReportsStack: undefined;
  RubricStack: undefined;
  AdminStack: undefined;
};

const DashboardTab = createBottomTabNavigator<DashboardTabBarStackParamList>();

const DashboardTabStack = () => {
  return (
    <DashboardTab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: (route => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';

          if (routeName === 'AdminStack') {
            return {display: 'none'};
          }
          return;
        })(route),
        tabBarVisible: false,
        headerShown: false,
        keyboardHidesTabBar: true,
      })}
      tabBar={props => {
        return <DashboardTabBar {...props} />}}>
      <DashboardTab.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
      />
      <DashboardTab.Screen name="ReportsStack" component={ReportsStack} />
      <DashboardTab.Screen
        name="RubricStack"
        component={RubricStack}
        options={{
          tabBarStyle: {display: 'none'},
        }}
      />
      <DashboardTab.Screen
        name="AdminStack"
        component={AdminTabStack}
        options={({route}) => ({
          tabBarStyle: {
            display: 'none',
          },
          title: 'AdminStack',
          tabBarButton: () => null,
          tabBarVisible: false,
          
        })}
      />
    </DashboardTab.Navigator>
  );
};

export default DashboardTabStack;
