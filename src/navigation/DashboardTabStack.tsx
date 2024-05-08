import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import RubricDashboard from '../screens/rubric/RubricDashboard';

import RubricStack from './RubricStack';
import SampleScreen2 from '../screens/reports/SampleScreen2';
import SampleScreen from '../screens/reports/SampleScreen';

export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  SampleScreen: undefined;
  RubricStack: undefined;
  SampleScreen2: undefined;
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

      <BorrowerTab.Screen name="SampleScreen" component={SampleScreen} />
      <BorrowerTab.Screen name="RubricStack" component={RubricStack} />
      <BorrowerTab.Screen
        name="SampleScreen2"
        component={SampleScreen2}
      />
    </BorrowerTab.Navigator>
  );
};

export default DashboardTabStack;
