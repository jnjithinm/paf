import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';

import RubricStack from './RubricStack';
import SampleScreen2 from '../screens/reports/SampleScreen2';
import ReportsMainPage from '../screens/reports/ReportsMainPage';
import AddNewObservation from '../screens/reports/AddNewObservation';

export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  ReportsMainPage: undefined;
  RubricStack: undefined;
  SampleScreen2: undefined;
  AddNewObservation: undefined;
};

const BorrowerTab = createBottomTabNavigator<DashboardTabBarStackParamList>();

const DashboardTabStack = () => {
  return (
    <BorrowerTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}
      tabBar={props => <DashboardTabBar {...props} />}>
      <BorrowerTab.Screen
        name="TeacherDashboard"
        component={TeacherDashboard}
      />

      <BorrowerTab.Screen name="ReportsMainPage" component={ReportsMainPage} />
      <BorrowerTab.Screen name="RubricStack" component={RubricStack} />
      <BorrowerTab.Screen
        name="AddNewObservation"
        component={AddNewObservation}
      />
    </BorrowerTab.Navigator>
  );
};

export default DashboardTabStack;
