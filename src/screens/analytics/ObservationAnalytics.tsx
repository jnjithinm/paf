import React, {FC, useEffect} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Image from '../../components/Image';
import EvidenceCard from '../../components/EvidenceCard';
import {ObservationStackParamList} from '../../navigation/ObservationStack';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  EvidenceResponse,
  getObservationById,
  resetSaveEvidenceCardResponse,
  resetSaveObservationResponse,
  saveEvidenceCardDetails,
  saveObservation,
} from '../../redux/features/observationSlice';
import {RatingStars, RenderProfileIcon} from '../dashboard/TeacherDashboard';

import FooterWithButtons from '../../components/FooterWithButtons';

import moment from 'moment';
import {getUser} from '../../redux/features/usersSlice';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {RenderCompleteStatus} from '../observation/ObservationReportsMainPage';
import CurvedLineChart from '../../components/CurvedLineChart';

type ObservationAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'ObservationAnalytics'
>;
type ObservationAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'ObservationAnalytics'
>;

interface ObservationAnalyticsScreenProps {
  navigation: ObservationAnalyticsNavigationProp;
  route: ObservationAnalyticsRouteProp;
}

const ObservationAnalytics: FC<ObservationAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  // const {observationId}=route.params
  const observationId = 32;
  const dispatch = useAppDispatch();
  const {observationById} = useAppSelector(state => state.observation);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getObservationById(observationId));
    }, []),
  );
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15, paddingVertical: 0}}
        icon="reports_icon"
        title="Observation Report">
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RenderProfileIcon
              image={observationById?.userImage}
              name={observationById?.userName?.toString() || ''}
              size={50}
            />
            <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '70%',
                }}>
                <Text fontVariant="bold" size="body2">
                  {`${observationById?.userName || ''} (${
                    observationById?.userGroup || ''
                  })`}
                </Text>
                <RenderCompleteStatus
                  style={{marginLeft: 5}}
                  status={observationById?.observationStatus}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RatingStars
                  rating={Number(
                    observationById?.observationAvgRatings?.toFixed(1),
                  )}
                />
                <View
                  style={{
                    height: 10,
                    backgroundColor: '#E4E7EB',
                    width: 1,
                    marginHorizontal: 5,
                  }}
                />
                <Text style={{color: '#4E565F'}} size="small3">
                  {Number(
                    observationById?.observationAvgRatings?.toFixed(1) || '',
                  )}
                  /5
                </Text>
              </View>
            </View>
          </View>
        </View>
        {/* <CurvedLineChart
          value1={countOfUsers}
          value2={countOfRoles}
          value3={countOfUserGroups}
          labels={months || ['']}
          indicators={['Count of users','Count of roles','User groups']}
        /> */}
      </Layout>
    </KeyboardAvoidingView>
  );
};

export default ObservationAnalytics;
