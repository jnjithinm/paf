import React, {FC, useEffect, useState} from 'react';
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
import {
  FloatingButton,
  RenderCompleteStatus,
} from './ObservationReportsMainPage';
import FooterWithButtons from '../../components/FooterWithButtons';
import {
  RenderFeedbackNote,
  convertEvidenceCardListToRequest,
} from './AddNewObservation';
import moment from 'moment';

type ObservationReportNavigationProp = StackNavigationProp<
  ObservationStackParamList,
  'ObservationReport'
>;
type ObservationReportRouteProp = RouteProp<
  ObservationStackParamList,
  'ObservationReport'
>;

interface ObservationReportScreenProps {
  navigation: ObservationReportNavigationProp;
  route: ObservationReportRouteProp;
}

const ObservationReport: FC<ObservationReportScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const {
    observationId,
    observationById,
    newObservation,
    newEvidenceCardsList,
    saveObservationResponse,
  } = useAppSelector(state => state.observation);

  useAppSelector(state => state.users);

  const {userData} = useAppSelector(state => state.auth);

  useFocusEffect(
    React.useCallback(() => {
      if (observationId) {  
        dispatch(saveEvidenceCardDetails(null));
        dispatch(resetSaveEvidenceCardResponse());
        dispatch(resetSaveObservationResponse());
        dispatch(getObservationById(observationId));
      }
    }, []),
  );

  useEffect(() => {
    if (saveObservationResponse) {
      newObservation && navigation.navigate('ObservationReportsMainPage');
    }
  }, [saveObservationResponse]);

  const onPressCreateEvidenceCard = () => {
    navigation.navigate('CreateViewEvidenceCard');
  };

  const onPressSubmit = () => {
    if (newEvidenceCardsList) {
      if (isPendingAndEvidenceCardCreated) {
        dispatch(
          saveObservation([
            {
              observationDate: observationById?.observationDate || '',
              userGroupId: Number(observationById?.userGroupId),
              userId: Number(observationById?.userId),
              observationStatus: 'Completed',
              feedbackDescription: observationById?.feedbackDescription || '',
              loggedInUserName: userData.userName,
              evidenceRequestList: convertEvidenceCardListToRequest(
                newEvidenceCardsList,
                userData.userName,
              ),
            },
            observationById?.observationId,
          ]),
        );
      } else {
        dispatch(
          saveObservation([
            {
              observationDate: moment(newObservation?.selectedDate).format(
                'YYYY-MM-DD',
              ),
              userGroupId: Number(newObservation?.selectedUserGroup?.value),
              userId: Number(newObservation?.selectedUser?.value),
              observationStatus: 'Completed',
              feedbackDescription:
                newObservation?.feedbackNote?.toString() || '',
              loggedInUserName: userData.userName,
              evidenceRequestList: convertEvidenceCardListToRequest(
                newEvidenceCardsList,
                userData.userName,
              ),
            },
          ]),
        );
      }
    }
  };

  const onPressSaveAsDraft = () => {
    if (newEvidenceCardsList) {
      if (isPendingAndEvidenceCardCreated) {
        dispatch(
          saveObservation([
            {
              observationDate: observationById?.observationDate || '',
              userGroupId: Number(observationById?.userGroupId),
              userId: Number(observationById?.userId),
              observationStatus: 'Pending',
              feedbackDescription: observationById?.feedbackDescription || '',
              loggedInUserName: userData.userName,
              evidenceRequestList: convertEvidenceCardListToRequest(
                newEvidenceCardsList,
                userData.userName,
              ),
            },
            observationById?.observationId,
          ]),
        );
      } else {
        dispatch(
          saveObservation([
            {
              observationDate: moment(newObservation?.selectedDate).format(
                'YYYY-MM-DD',
              ),
              userGroupId: Number(newObservation?.selectedUserGroup?.value),
              userId: Number(newObservation?.selectedUser?.value),
              observationStatus: 'Pending',
              feedbackDescription:
                newObservation?.feedbackNote?.toString() || '',
              loggedInUserName: userData.userName,
              evidenceRequestList: convertEvidenceCardListToRequest(
                newEvidenceCardsList,
                userData.userName,
              ),
            },
          ]),
        );
      }
    }
  };

  const evidenceCardList: EvidenceResponse[] = observationById
    ? observationById?.evidenceResponseList
    : newEvidenceCardsList || [];

  const feedback: string =
    observationById?.feedbackDescription || newObservation?.feedbackNote || '';

  const rating: number | undefined = observationId
    ? observationById?.observationAvgRatings
    : newEvidenceCardsList?.reduce((sum, item) => {
        return sum + item.averageRating;
      }, 0);

  let isPendingAndEvidenceCardCreated: boolean = Boolean(
    observationById?.observationStatus === 'Pending' && newEvidenceCardsList,
  );
  
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        onPressBackArrow={() => {
          newObservation
            ? navigation.navigate('AddNewObservation')
            : navigation.navigate('ObservationReportsMainPage');
        }}
        style={{paddingHorizontal: 15, paddingVertical: 0}}
        icon="reports_icon"
        title="Report">
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RenderProfileIcon
              image={observationById?.userImage}
              name={
                observationById?.userName?.toString() ||
                newObservation?.selectedUser?.label?.toString() ||
                ''
              }
              size={50}
            />
            <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text fontVariant="bold" size="body2">
                  {observationById
                    ? `${observationById?.userName || ''} (${
                        observationById?.userGroup || ''
                      })`
                    : `${newObservation?.selectedUser?.label || ''} (${
                        newObservation?.selectedUserGroup.label || ''
                      })`}
                </Text>
                <RenderCompleteStatus
                  style={{left: 5}}
                  status={observationById?.observationStatus}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RatingStars rating={Number(rating?.toFixed(1))} />
                <View
                  style={{
                    height: 10,
                    backgroundColor: '#E4E7EB',
                    width: 1,
                    marginHorizontal: 5,
                  }}
                />
                <Text style={{color: '#4E565F'}} size="small3">
                  {observationById?.observationAvgRatings?.toFixed(1) || ''}/5
                </Text>
              </View>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Image name="evidence_icon" />
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: FONT_VARIANT.bold,
                fontSize: FONT_SIZES.body1,
                marginLeft: 5,
              }}>
              Evidence cards{' '}
              {observationById
                ? `(${observationById?.evidenceResponseList?.length || ''})`
                : `(${newEvidenceCardsList?.length || ''})`}
            </Text>
          </View>
          <View style={{marginVertical: 15}}>
            {evidenceCardList?.map((item, index) => (
              <EvidenceCard
                key={index}
                title={`Evidence Card ${index + 1}`}
                description={item?.domainName}
                voiceClipCount={item?.fileCount?.Audio}
                videoClipCount={item?.fileCount?.Video}
                noteCount={item?.fileCount?.Document}
                photoCount={item?.fileCount?.Image}
                onPressEvidenceCard={() => {
                  dispatch(saveEvidenceCardDetails(item));
                  navigation.navigate('CreateViewEvidenceCard');
                }}
              />
            ))}
          </View>
          {feedback && (
            <RenderFeedbackNote showLabel disabled feedback={feedback} />
          )}
        </View>
      </Layout>
      {newObservation || isPendingAndEvidenceCardCreated ? (
        <View>
          <FloatingButton
            icon="edit_icon"
            onPress={onPressCreateEvidenceCard}
            iconSize={20}
            style={{bottom: 100}}
          />
          <FooterWithButtons
            onPressProceedButton={onPressSubmit}
            proceedButtonText={'Submit'}
            isActiveProceedButton
            cancelButtonText={'Save as Draft'}
            onPressCancelButton={onPressSaveAsDraft}
            style={{}}
          />
        </View>
      ) : (
        <FloatingButton
          icon="edit_icon"
          onPress={onPressCreateEvidenceCard}
          iconSize={20}
        />
      )}
    </KeyboardAvoidingView>
  );
};
export default ObservationReport;
