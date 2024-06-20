import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import ReportsMainPage from '../screens/reports/ObservationReportsMainPage';
import ReportsEvidenceCard from '../screens/reports/ReportsEvidenceCard';
import AddNewObservation from '../screens/reports/AddNewObservation';
import AddNewEvidenceCard from '../screens/reports/AddNewEvidenceCard';
import ViewEvidenceCard from '../screens/reports/ViewEvidenceCard';
import {
  EvidenceResponse,
  ObservationData,
} from '../redux/features/observationSlice';
import {FileObject} from '../config/types';
import PlayFile from '../screens/reports/PlayFile';
import ObservationReportsMainPage from '../screens/reports/ObservationReportsMainPage';
import ObservationReport from '../screens/reports/ObservationReport';

export type ReportsTabBarStackParamList = {
  ObservationReportsMainPage: undefined;
  ReportsEvidenceCard: {userAccessed: string};
  AddNewObservation: undefined;
  AddNewEvidenceCard: {
    observationStatus: 'New' | 'Pending' | 'Completed';
    evidenceCardDetails?: EvidenceResponse;
  };
  //  {
  //   selectedUserGroup: DropdownObject;
  //   selectedUser: DropdownObject;
  //   selectedDate: string;
  // };
  ViewEvidenceCard: {evidenceId: string};
  ObservationReport: {observationItem: ObservationData};
  PlayFile: {file: FileObject};
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
        name="ObservationReportsMainPage"
        component={ObservationReportsMainPage}
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
        name="ObservationReport"
        component={ObservationReport}
      />
      <ReportsStackTab.Screen
        name="ViewEvidenceCard"
        component={ViewEvidenceCard}
      />
      <ReportsStackTab.Screen name="PlayFile" component={PlayFile} />
    </ReportsStackTab.Navigator>
  );
};

export default ReportsStack;
