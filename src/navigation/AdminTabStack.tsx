import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AdminFormResponses from '../screens/admin/AdminFormResponses';
import AdminFlowsMainPage from '../screens/admin/AdminFlowsDashboard';
import AdminFormList from '../screens/admin/AdminFormList';
import {FlowDetailItem, FlowItem} from '../redux/features/flowsSlice';
import FormFilling from '../screens/admin/FormFilling';

export type AdminTabStackTabBarStackParamList = {
  AdminFlowsMainPage: undefined;
  AdminFormList: {flowItem: FlowItem};
  AdminFormResponses: {flowDetailItem: FlowDetailItem};
  FormFilling: undefined;
};

const AdminTabStackTab =
  createStackNavigator<AdminTabStackTabBarStackParamList>();

const AdminTabStack = () => {
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
    <AdminTabStackTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      {/* <AdminTabStackTab.Screen
        name="AdminFlowsMainPage"
        component={AdminFlowsMainPage}
      />
      <AdminTabStackTab.Screen name="AdminFormList" component={AdminFormList} />
      <AdminTabStackTab.Screen
        name="AdminFormResponses"
        component={AdminFormResponses}
      /> */}
      <AdminTabStackTab.Screen name="FormFilling" component={FormFilling} />
    </AdminTabStackTab.Navigator>
  );
};

export default AdminTabStack;
