import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import ReportsMainPage from '../screens/reports/ReportsMainPage';
import ReportsEvidenceCard from '../screens/reports/ReportsEvidenceCard';


export type ReportsTabBarStackParamList = {
    ReportsMainPage: undefined;
    ReportsEvidenceCard:{userAccessed:string};
};

const ReportsStackTab = createStackNavigator<ReportsTabBarStackParamList>();

const ReportsStack = () => {
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
    <ReportsStackTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <ReportsStackTab.Screen
        name="ReportsMainPage"
        component={ReportsMainPage}
      />
         <ReportsStackTab.Screen
        name="ReportsEvidenceCard"
        component={ReportsEvidenceCard}
      />
      

      
    </ReportsStackTab.Navigator>
  );
};

export default ReportsStack;
