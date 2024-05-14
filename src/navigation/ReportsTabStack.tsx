import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import ReportsMainPage from '../screens/reports/ReportsMainPage';
import ReportsEvidenceCard from '../screens/reports/ReportsEvidenceCard';
import AddNewObservation from '../screens/newObservation/AddNewObservation';


export type ReportsTabBarStackParamList = {
    ReportsMainPage: undefined;
    ReportsEvidenceCard:{userAccessed:string};
    AddNewObservation:undefined;
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
