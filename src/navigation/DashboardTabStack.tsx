import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';



export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  ReportsDashboard: undefined;
  RubricDashboard: undefined;
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
      <BorrowerTab.Screen name="TeacherDashboard" component={TeacherDashboard} />


    </BorrowerTab.Navigator>
  );
};

export default DashboardTabStack;
