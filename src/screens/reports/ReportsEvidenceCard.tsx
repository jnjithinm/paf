import React, {FC,} from 'react';
import {View, } from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Icon, {IconTypes} from '../../components/Icon';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';

type ReportsEvidenceCardNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'ReportsEvidenceCard'
>;
type ReportsEvidenceCardRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'ReportsEvidenceCard'
>;

interface ReportsEvidenceCardScreenProps {
  navigation: ReportsEvidenceCardNavigationProp;
  route: ReportsEvidenceCardRouteProp;
}

type RenderEvidenceCardMultimediaCountsTypes = {
  icon: IconTypes;
  count: number;
  lastCount?: boolean;
};

const RenderEvidenceCardMultimediaCounts: FC<
  RenderEvidenceCardMultimediaCountsTypes
> = ({icon, count, lastCount}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Icon name={icon} />
    <Text size="small3" style={{marginLeft: 3}}>
      {count}
    </Text>
    {!lastCount && (
      <View
        style={{
          height: 10,
          width: 1,
          backgroundColor: '#E4E7EB',
          marginHorizontal: 5,
        }}
      />
    )}
  </View>
);

type EvidenceCardTypes = {
  title: string;
  description: string;
};

const EvidenceCard: FC<EvidenceCardTypes> = ({title, description}) => (
  <View
    style={{
      marginVertical: 5,
      borderWidth: 1,
      borderColor: '#F4C24A',
      padding: 5,
      borderRadius: 6,
    }}>
    <Text fontVariant="bold" size='small3'>{title}</Text>
    <Text size="small3" style={{marginTop: 5}}>
      {description}
    </Text>
    <View style={{flexDirection: 'row', marginTop: 6}}>
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_photo_icon"
        count={4}
      />
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_voice_clip_icon"
        count={6}
      />
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_video_clip_icon"
        count={42}
      />
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_note_icon"
        count={4}
        lastCount
      />
    </View>
  </View>
);
const ReportsEvidenceCard: FC<ReportsEvidenceCardScreenProps> = ({
  navigation,
  route,
}) => {
  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title={'Reports'}
      icon="search_reports_icon">
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name={'evidence_card_sample_image'} />
          <View style={{flex: 1,justifyContent:'center',marginLeft:10}}>
            <View>
            <Text fontVariant="bold" size="body2">
              Isha Dani (Maths)
            </Text>
            </View>
            <View style={{flexDirection: 'row',alignItems:'center'}}>
              {Array.from({length: 4}, () => '').map(item => (
                <Icon name="star_icon" />
              ))}
              <Icon name="star_unfilled_icon" />
              <View style={{height:10,backgroundColor:'#E4E7EB',width:1,marginHorizontal:5}}/>
                <Text style={{color:'#4E565F'}} size='small3'>3.2/5</Text>
            </View>
            
          </View>
        </View>
        <View style={{marginVertical:20}}>
          <View style={{flexDirection: 'row', alignItems: 'center',                marginBottom:10}}>
            <View
              style={{
                backgroundColor: '#F4C24A',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                borderRadius: 5,

              }}>
              <Icon name="evidence_card_icon" />
            </View>
            <Text fontVariant="bold" style={{marginLeft: 5}}>
              Evidence Cards (2)
            </Text>
          </View>
          <EvidenceCard
            title={'Evidence Card 1'}
            description={
              'Teacher is able to manage all students in class very well.'
            }
          />
          <EvidenceCard
            title={'Evidence Card 2'}
            description={
              'Teacher is able to manage all students in class very well.'
            }
          />
        </View>
            <View style={{width:'100%',backgroundColor:'#E4E7EB',height:1,marginBottom:10}}/>
        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Feedback note for teacher</Text>
          <Text size="small3" style={{marginTop: 5}}>
            You did very well in class today with classroom discipline however
            you need to do more work on answering the questions all students ask
            in class.
          </Text>
        </View>
      </View>
    </Layout>
  );
};
export default ReportsEvidenceCard;
