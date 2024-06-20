import React, {FC, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import TextInput from '../../components/TextInput';
import Text from '../../components/Text';
import Image from '../../components/Image';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import EvidenceCard from '../../components/EvidenceCard';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getObservationById} from '../../redux/features/observationSlice';

type ViewEvidenceCardNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'ViewEvidenceCard'
>;
type ViewEvidenceCardRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'ViewEvidenceCard'
>;

interface ViewEvidenceCardScreenProps {
  navigation: ViewEvidenceCardNavigationProp;
  route: ViewEvidenceCardRouteProp;
}

const ViewEvidenceCard: FC<ViewEvidenceCardScreenProps> = ({
  navigation,
  route,
}) => {
  const [feedbackNote, setFeedbackNote] = useState('');
  const dispatch = useAppDispatch();
  const {observationById} = useAppSelector(state => state.observation);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}} // Ensure the component takes up the whole screen
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15, paddingVertical: 0}}
        icon="reports_icon"
        title="Evidence Card">
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name={'evidence_card_sample_image'} />
            <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
              <View>
                <Text fontVariant="bold" size="body2">
                  {observationById?.userName} ({observationById?.userGroup})
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {Array.from({length: 4}, () => '').map(item => (
                  <Icon name="star_icon" />
                ))}
                <Icon name="star_unfilled_icon" />
                <View
                  style={{
                    height: 10,
                    backgroundColor: '#E4E7EB',
                    width: 1,
                    marginHorizontal: 5,
                  }}
                />
                <Text style={{color: '#4E565F'}} size="small3">
                  3.2/5
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
              Add Evidence card
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
              onPressEvidenceCard={() => {}}
            />
          ))}
          <View style={{marginTop: 10}}>
            <Text
              style={{
                color: colors.blackColor,
                marginBottom: 5,
              }}
              fontVariant="bold">
              Feedback note
            </Text>
            <TextInput
              label=""
              value={observationById?.feedbackDescription?.toString() || ''}
              setValue={setFeedbackNote}
              multiline
              maxLength={200}
              editable={false}
            />
            <Text
              style={{
                alignSelf: 'flex-end',
                fontFamily: FONT_VARIANT.regular,
                fontSize: FONT_SIZES.small2,
                marginTop: 5,
              }}>{`${feedbackNote.length}/200`}</Text>
          </View>
        </View>
      </Layout>
    </KeyboardAvoidingView>
  );
};
export default ViewEvidenceCard;
