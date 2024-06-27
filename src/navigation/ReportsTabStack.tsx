import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import ReportsMainPage from '../screens/observation/ObservationReportsMainPage';
import AddNewObservation from '../screens/observation/AddNewObservation';
import {
  EvidenceResponse,
  ObservationData,
} from '../redux/features/observationSlice';
import {FileObject} from '../config/types';
import PlayFile from '../screens/observation/PlayFile';
import ObservationReportsMainPage from '../screens/observation/ObservationReportsMainPage';
import ObservationReport from '../screens/observation/ObservationReport';
import CreateViewEvidenceCard from '../screens/observation/CreateViewEvidenceCard';

export type ReportsTabBarStackParamList = {
  ObservationReportsMainPage: undefined;
  ReportsEvidenceCard: {userAccessed: string};
  AddNewObservation: undefined;
  CreateViewEvidenceCard: {
    observationStatus: 'New' | 'Pending' | 'Completed';
    evidenceCardDetails?: EvidenceResponse;
  };
  //  {
  //   selectedUserGroup: ItemType;
  //   selectedUser: ItemType;
  //   selectedDate: string;
  // };
  ObservationReport: {observationId: number};
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
        name="AddNewObservation"
        component={AddNewObservation}
      />
      <ReportsStackTab.Screen
        name="CreateViewEvidenceCard"
        component={CreateViewEvidenceCard}
      />
      <ReportsStackTab.Screen
        name="ObservationReport"
        component={ObservationReport}
      />

      <ReportsStackTab.Screen name="PlayFile" component={PlayFile} />
    </ReportsStackTab.Navigator>
  );
};

export default ReportsStack;
