import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AddNewObservation from '../screens/observation/AddNewObservation';
import {RubricIndicatorItem, RubricItem} from '../redux/features/rubricSlice';
import RubricIndicatorDescription from '../screens/rubric/RubricIndicatorDescription';
import RubricEvaluationIndicatorList from '../screens/rubric/RubricEvaluationIndicatorList';
import RubricMainPage from '../screens/rubric/RubricMainPage';

export type RubricStackParamList = {
  RubricMainPage: undefined;
  AddNewObservation: undefined;
  RubricEvaluationIndicatorList: {rubricItem: RubricItem};
  RubricIndicatorDescription: {indicator: RubricIndicatorItem; title: string};
};

const RubricStackTab = createStackNavigator<RubricStackParamList>();

const RubricStack = ({}) => {
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
      <RubricStackTab.Screen name="RubricMainPage" component={RubricMainPage} />
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
