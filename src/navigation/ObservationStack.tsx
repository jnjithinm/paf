import React from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AddNewObservation from '../screens/observation/AddNewObservation';
import {
  EvidenceResponse,
  ObservationStatus,
} from '../redux/features/observationSlice';
import {FileObject} from '../config/types';
import PlayFile from '../screens/observation/PlayFile';
import ObservationReportsMainPage from '../screens/observation/ObservationReportsMainPage';
import ObservationReport from '../screens/observation/ObservationReport';
import CreateViewEvidenceCard from '../screens/observation/CreateViewEvidenceCard';

export type ObservationStackParamList = {
  ObservationReportsMainPage: undefined;
  ReportsEvidenceCard: {userAccessed: string};
  AddNewObservation: {isEvidenceCardCreated: boolean}|undefined;
  CreateViewEvidenceCard: {
    evidenceCardDetails: EvidenceResponse;
    observationStatus:ObservationStatus;
  }|undefined;
  ObservationReport: {observationId: number};
  PlayFile: {file: FileObject};
};

const ObservationStackTab = createStackNavigator<ObservationStackParamList>();

const ObservationStack = () => {
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
    <ObservationStackTab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        keyboardHidesTabBar: true,
      })}>
      <ObservationStackTab.Screen
        name="ObservationReportsMainPage"
        component={ObservationReportsMainPage}
      />
      <ObservationStackTab.Screen
        name="AddNewObservation"
        component={AddNewObservation}
      />
      <ObservationStackTab.Screen
        name="CreateViewEvidenceCard"
        component={CreateViewEvidenceCard}
      />
      <ObservationStackTab.Screen
        name="ObservationReport"
        component={ObservationReport}
      />

      <ObservationStackTab.Screen name="PlayFile" component={PlayFile} />
    </ObservationStackTab.Navigator>
  );
};

export default ObservationStack;
