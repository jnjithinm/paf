import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import RubricDashboard from '../screens/rubric/RubricDashboard';
import AddNewObservation from '../screens/reports/AddNewObservation';
import {RubricIndicatorItem, RubricItem} from '../redux/features/rubricSlice';
import RubricIndicatorDescription from '../screens/rubric/RubricIndicatorDescription';
import RubricEvaluationIndicatorList from '../screens/rubric/RubricEvaluationIndicatorList';

export type RubricTabBarStackParamList = {
  RubricDashboard: undefined;
  AddNewObservation: undefined;
  RubricEvaluationIndicatorList: {rubric: RubricItem};
  RubricIndicatorDescription: {indicator: RubricIndicatorItem,title:string};
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
      screenOptions={({route}) => ({
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
        name="RubricEvaluationIndicatorList"
        component={RubricEvaluationIndicatorList}
      />
      <RubricStackTab.Screen
        name="RubricIndicatorDescription"
        component={RubricIndicatorDescription}
      />
    </RubricStackTab.Navigator>
  );
};

export default RubricStack;
