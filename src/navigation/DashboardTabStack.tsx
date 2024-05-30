import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import RubricStack from './RubricTabStack';
import SampleScreen2 from '../screens/reports/SampleScreen2';
import ReportsStack from './ReportsTabStack';
import AdminTabStack from './AdminTabStack';

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
        headerShown: false,
        keyboardHidesTabBar: true,
      })}
      tabBar={props => <DashboardTabBar {...props} />}>
      <DashboardTab.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
      />
      <DashboardTab.Screen name="ReportsStack" component={ReportsStack} />
      <DashboardTab.Screen name="RubricStack" component={RubricStack} />
      <DashboardTab.Screen name="AdminStack" component={AdminTabStack} />
    </DashboardTab.Navigator>
  );
};

export default DashboardTabStack;
