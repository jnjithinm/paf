import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import RubricDashboard from '../screens/RubricDashboard/RubricDashboard';
import RubricSubDashboard from '../screens/RubricDashboard/RubricSubDashboard';



export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  ReportsDashboard: undefined;
  RubricDashboard: undefined;
  RubricSubDashboard: undefined;

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
      <BorrowerTab.Screen name="RubricDashboard" component={RubricDashboard} />
      <BorrowerTab.Screen name="RubricSubDashboard" component={RubricSubDashboard} />



    </BorrowerTab.Navigator>
  );
};

export default DashboardTabStack;
