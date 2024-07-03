import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import FlowsMainPage from '../screens/flowsAndForms/FlowsMainPage';
import { FlowDetailItem, FlowItem } from '../redux/features/flowsSlice';
import EvaluationForm from '../screens/flowsAndForms/EvaluationForm';
import FormListAndResponses from '../screens/flowsAndForms/FormListAndResponses';
import FormResponses from '../screens/flowsAndForms/FormResponses';

export type FlowsAndFormsStackParamList = {
  FlowsMainPage: undefined;
  FormListAndResponses: { flowItem: FlowItem };
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
        name="FormListAndResponses"
        component={FormListAndResponses}
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
