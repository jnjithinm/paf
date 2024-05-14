import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import RubricStack from './RubricTabStack';
import SampleScreen2 from '../screens/reports/SampleScreen2';
import ReportsMainPage from '../screens/reports/ReportsMainPage';

import AddNewObservation from '../screens/newObservation/AddNewObservation';

import ReportsStack from './ReportsTabStack';


export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  ReportsStack: undefined;
  RubricStack: undefined;
  SampleScreen2: undefined;
  AddNewObservation: undefined;
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
      <DashboardTab.Screen
        name="SampleScreen2"
        component={SampleScreen2}

      />
    </DashboardTab.Navigator>
  );
};

export default DashboardTabStack;
