import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import FlowsMainPage from '../screens/flowsAndForms/FlowsMainPage';
import { FlowDetailItem, FlowItem } from '../redux/features/flowsSlice';
import EvaluationForm from '../screens/flowsAndForms/EvaluationForm';
import FormResponses from '../screens/flowsAndForms/FormResponses';
import FormList from '../screens/flowsAndForms/FormList';

export type FlowsAndFormsStackParamList = {
  FlowsMainPage: undefined;
  FormList: { flowItem: FlowItem };
  FormResponses: { flowDetailItem: FlowDetailItem };
  EvaluationForm: { flowDetailItem: FlowDetailItem; flowItem: FlowItem };
};

const FlowsAndFormsStackTab =
  createStackNavigator<FlowsAndFormsStackParamList>();

const FlowsAndFormsStack = () => {
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
    <FlowsAndFormsStackTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <FlowsAndFormsStackTab.Screen
        name="FlowsMainPage"
        component={FlowsMainPage}
      />
      <FlowsAndFormsStackTab.Screen
        name="FormList"
        component={FormList}
      />
      <FlowsAndFormsStackTab.Screen
        name="FormResponses"
        component={FormResponses}
      />
      <FlowsAndFormsStackTab.Screen
        name="EvaluationForm"
        component={EvaluationForm}
      />
    </FlowsAndFormsStackTab.Navigator>
  );
};

export default FlowsAndFormsStack;
