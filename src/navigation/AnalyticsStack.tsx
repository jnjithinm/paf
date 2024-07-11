import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import UserAndRoleAnalyticsMainPage from '../screens/analytics/UserAndRoleAnalyticsMainPage';


export type AnalyticsStackParamList = {
  UserAndRoleAnalyticsMainPage: undefined;
  LocationAnalytics: undefined;
  TeacherObservationAnalytics: undefined;
  FlowsAndFormsAnalytics: undefined;
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

    </AnalyticsTab.Navigator>
  );
};

export default AnalyticsStack;
