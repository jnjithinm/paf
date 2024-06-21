import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardTabBar from '../components/DashboardTabBar';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import RubricStack, { RubricTabBarStackParamList } from './RubricTabStack';
import ReportsStack, { ReportsTabBarStackParamList } from './ReportsTabStack';
import AdminTabStack, { AdminTabStackTabBarStackParamList } from './AdminTabStack';
import {useAppSelector} from '../redux/store';
import { NavigatorScreenParams } from '@react-navigation/native';

export type DashboardTabBarStackParamList = {
  TeacherDashboard: undefined;
  ReportsStack:  NavigatorScreenParams<ReportsTabBarStackParamList>;
  RubricStack: NavigatorScreenParams<RubricTabBarStackParamList>;
  AdminStack: NavigatorScreenParams<AdminTabStackTabBarStackParamList>;
};

const DashboardTab = createBottomTabNavigator<DashboardTabBarStackParamList>();

const DashboardTabStack = () => {

  // const {isBottomTabBarVisible} = useAppSelector(state => state.auth);

  return (
    <DashboardTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}
      tabBar={props => {
        return <DashboardTabBar {...props} />;
      }}>
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
      />
    </DashboardTab.Navigator>
  );
};

export default DashboardTabStack;
