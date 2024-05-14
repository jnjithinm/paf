import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import RubricDashboard from '../screens/rubric/RubricDashboard';
import AddNewObservation from '../screens/newObservation/AddNewObservation';
import RubricBMCTeacherEvaluationIndicatorList from '../screens/rubric/RubricBMCTeacherEvaluationIndicatorList';
import RubricBMCTeacherEvaluationIndicatorListDescription from '../screens/rubric/RubricBMCTeacherEvaluationIndicatorListDescription';

export type RubricTabBarStackParamList = {
  RubricDashboard: undefined;
  AddNewObservation: undefined;
  RubricBMCTeacherEvaluationIndicatorList: { title: string };
  RubricBMCTeacherEvaluationIndicatorListDescription: { title: string, description: string }
};

const RubricStackTab = createStackNavigator<RubricTabBarStackParamList>();

const RubricStack = () => {
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
    <RubricStackTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <RubricStackTab.Screen
        name="RubricDashboard"
        component={RubricDashboard}
      />
      <RubricStackTab.Screen
        name="AddNewObservation"
        component={AddNewObservation}
      />
      <RubricStackTab.Screen
        name="RubricBMCTeacherEvaluationIndicatorList"
        component={RubricBMCTeacherEvaluationIndicatorList}
      />
      <RubricStackTab.Screen
        name="RubricBMCTeacherEvaluationIndicatorListDescription"
        component={RubricBMCTeacherEvaluationIndicatorListDescription}
      />

    </RubricStackTab.Navigator>
  );
};

export default RubricStack;
