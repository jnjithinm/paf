import React, {FC, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TextInput as RNTextInput} from 'react-native';

import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Image from '../../components/Image';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import EvidenceCard from '../../components/EvidenceCard';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getObservationById} from '../../redux/features/observationSlice';
import {RatingStars, RenderProfileIcon} from '../dashboard/TeacherDashboard';
import FooterWithButtons from '../../components/FooterWithButtons';

type ObservationReportNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'ObservationReport'
>;
type ObservationReportRouteProp = RouteProp<
  ReportsTabBarStackParamList,
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
  const [feedbackNote, setFeedbackNote] = useState('');
  const {observationItem} = route.params;
  const dispatch = useAppDispatch();
  const {observationById} = useAppSelector(state => state.observation);

  useEffect(() => {
    dispatch(getObservationById(observationItem.observationId));
  }, []);

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
              <View>
                <Text fontVariant="bold" size="body2">
                  {observationById?.userName} ({observationById?.userGroup})
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RatingStars
                  rating={Number(observationById?.observationAvgRatings)}
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
                  {observationById?.observationAvgRatings}/5
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
              }}>
              {`Evidence cards (${observationById?.evidenceResponseList?.length})`}
            </Text>
          </View>

          {observationById?.evidenceResponseList?.map((item, index) => (
            <EvidenceCard
              key={index}
              title={`Evidence Card ${index + 1}`}
              description={item?.domainName}
              voiceClipCount={item?.fileCount?.Audio}
              videoClipCount={item?.fileCount?.Video}
              noteCount={item?.fileCount?.Document}
              photoCount={item?.fileCount?.Image}
              onPressEvidenceCard={() => {
                navigation.navigate('CreateViewEvidenceCard', {
                  observationStatus: observationById?.observationStatus,
                  evidenceCardDetails: item,
                });
              }}
            />
          ))}

          {observationById?.feedbackDescription && (
            <View style={{marginTop: 10}}>
              <Text
                style={{
                  color: colors.blackColor,
                  marginBottom: 0,
                }}
                fontVariant="bold">
                Feedback note for teacher
              </Text>
              <RNTextInput
                value={observationById?.feedbackDescription?.toString() || ''}
                onChangeText={setFeedbackNote}
                style={{color: '#4E565F'}}
                multiline
                maxLength={200}
                editable={false}
              />
            </View>
          )}
        </View>
      </Layout>
      <FooterWithButtons
        onPressProceedButton={() => {}}
        onPressCancelButton={() => {}}
        icon="edit_icon"
        proceedButtonText="Edit card"
        isActiveProceedButton
      />
    </KeyboardAvoidingView>
  );
};
export default ObservationReport;
