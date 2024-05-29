import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import ReportsMainPage from '../screens/reports/ReportsMainPage';
import ReportsEvidenceCard from '../screens/reports/ReportsEvidenceCard';
import AddNewObservation from '../screens/reports/AddNewObservation';
import AddNewEvidenceCard from '../screens/reports/AddNewEvidenceCard';
import ViewEvidenceCard from '../screens/reports/ViewEvidenceCard';
import { DropdownObject } from '../components/LabeledDropdown';
import { ObservationData } from '../redux/features/observationSlice';
import ObservationReport from '../screens/reports/ObservationReport';

export type ReportsTabBarStackParamList = {
  ReportsMainPage: undefined;
  ReportsEvidenceCard: {userAccessed: string};
  AddNewObservation: undefined;
  AddNewEvidenceCard: {
    selectedUserGroup: DropdownObject;
    selectedUser: DropdownObject;
    selectedDate: string;
  };
  ViewEvidenceCard: {observationItem:ObservationData};
  ObservationReport:{observationItem:ObservationData};
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
         <ReportsStackTab.Screen
        name="AddNewObservation"
        component={AddNewObservation}
      />
      <ReportsStackTab.Screen
        name="AddNewEvidenceCard"
        component={AddNewEvidenceCard}
      />
      <ReportsStackTab.Screen
        name="ViewEvidenceCard"
        component={ViewEvidenceCard}
      />
           <ReportsStackTab.Screen
        name='ObservationReport'
        component={ObservationReport}
      />
    </ReportsStackTab.Navigator>
  );
};

export default ReportsStack;
