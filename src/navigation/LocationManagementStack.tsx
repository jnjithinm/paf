import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import States from '../screens/locationManagement/States';
import Districts from '../screens/locationManagement/Districts';
import Areas from '../screens/locationManagement/Areas';
import School from '../screens/locationManagement/Schools';

export type LocationManagementStackParamList = {
  States: undefined;
  Districts: undefined;
  Areas: undefined;
  Schools: undefined;
};

const LocationManagementTab =
  createStackNavigator<LocationManagementStackParamList>();

const LocationManagementStack = ({}) => {
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
    <LocationManagementTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <LocationManagementTab.Screen name="States" component={States} />
      <LocationManagementTab.Screen name="Districts" component={Districts} />
      <LocationManagementTab.Screen name="Areas" component={Areas} />
      <LocationManagementTab.Screen name="Schools" component={School} />
    </LocationManagementTab.Navigator>
  );
};

export default LocationManagementStack;
