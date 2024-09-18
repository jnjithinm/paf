import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import FlowsAndFormAnalytics from '../screens/analytics/FlowsAndFormAnalytics';
import TeacherObservationAnalytics from '../screens/analytics/TeacherObservationAnalytics';
import ObservationAnalytics from '../screens/analytics/ObservationAnalytics';
import ObservationsListAnalytics from '../screens/analytics/ObservationsListAnalytics';
import { FlowDetailItem, FlowItem } from '../redux/features/flowsSlice';
import FormsListAnalytics from '../screens/analytics/FormsListAnalytics';
import FlowsListAnalytics from '../screens/analytics/FlowsListAnalytics';
import UserAndRoleAnalyticsMainPage from '../screens/analytics/UserAndRoleAnalyticsMainPage';
import FormResponsesAnalytics from '../screens/analytics/FormResponsesAnalytics';
import LocationAnalytics from '../screens/analytics/LocationAnalytics';
import UsageAnalytics from '../screens/analytics/UsageAnalytics';


export type AnalyticsStackParamList = {
  UserAndRoleAnalyticsMainPage: undefined;
  LocationAnalytics: undefined;
  TeacherObservationAnalytics: undefined;
  FlowsAndFormAnalytics: undefined;
  FlowsListAnalytics: undefined;
  FormsListAnalytics:{ flowItem: FlowItem };
  ObservationsListAnalytics:undefined
  ObservationAnalytics:{observationId:number};
  FormResponsesAnalytics:{flowDetailItem:FlowDetailItem}
  UsageAnalytics:undefined
};

const AnalyticsTab =
  createStackNavigator<AnalyticsStackParamList>();

const AnalyticsStack = ({}) => {
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
    <AnalyticsTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <AnalyticsTab.Screen name="UserAndRoleAnalyticsMainPage" component={UserAndRoleAnalyticsMainPage} />
      <AnalyticsTab.Screen name='LocationAnalytics' component={LocationAnalytics} />
      <AnalyticsTab.Screen name='FlowsAndFormAnalytics' component={FlowsAndFormAnalytics} />
      <AnalyticsTab.Screen name='FlowsListAnalytics' component={FlowsListAnalytics} />
      <AnalyticsTab.Screen name='FormsListAnalytics' component={FormsListAnalytics} />
      <AnalyticsTab.Screen name='FormResponsesAnalytics' component={FormResponsesAnalytics} />
      <AnalyticsTab.Screen name='TeacherObservationAnalytics' component={TeacherObservationAnalytics} />
      <AnalyticsTab.Screen name='ObservationsListAnalytics' component={ObservationsListAnalytics} />
      <AnalyticsTab.Screen name='ObservationAnalytics' component={ObservationAnalytics} />
      <AnalyticsTab.Screen name='UsageAnalytics' component={UsageAnalytics} />
    </AnalyticsTab.Navigator>
  );
};

export default AnalyticsStack;
