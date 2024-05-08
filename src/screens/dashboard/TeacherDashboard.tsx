import React, {FC} from 'react';
import {TextInput, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {DashboardTabBarStackParamList} from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import colors from '../../config/colors';

type TeacherDashboardNavigationProp = StackNavigationProp<
  DashboardTabBarStackParamList,
  'TeacherDashboard'
>;
type TeacherDashboardRouteProp = RouteProp<
  DashboardTabBarStackParamList,
  'TeacherDashboard'
>;

interface TeacherDashboardScreenProps {
  navigation: TeacherDashboardNavigationProp;
  route: TeacherDashboardRouteProp;
}

type RenderTitleWithLinkTypes = {
  icon: IconTypes;
  titleText: string;
  link: string;
  linkText: string;
  style?:ViewStyle
};

const RenderTitleWithLink: FC<RenderTitleWithLinkTypes> = ({
  icon,
  titleText,
  link,
  linkText,
  style
}) => (
  <View style={{flexDirection: 'row',alignItems:'center',justifyContent:'space-between',...style}}>
    <View style={{flexDirection: 'row',alignItems:'center'}}>
    <View
      style={{
        height: 30,
        aspectRatio: 1,
        backgroundColor: '#F4C24A',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name={icon} />
    </View>
    <Text style={{marginLeft:5}} fontVariant='bold' size='body3'>{titleText}</Text>
    </View>
    <View style={{flexDirection: 'row',alignItems:'center'}}>
      <Text style={{borderBottomWidth: 1, borderBottomColor: '#EA7804',color:'#EA7804',marginRight:3}} size='small3'>
        {linkText}
      </Text>
      <Icon name="explore_icon" />
    </View>
  </View>
);

type ObservationFilterTileTypes={
  text:'All'|'By Me'|'For Me';
  count:number;
  onPress:()=>void;
}

// const ObservationFilterTile:FC<ObservationFilterTileTypes>=({text,count,onPress})=>(

// )

const TeacherDashboard: FC<TeacherDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      dashboard
      avoidBackButton>
      <View
        style={{
          marginTop: 30,
          backgroundColor: '#FCEBC5',
          borderRadius: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingTop: 10,
          flex: 1,
        }}>
        <View style={{justifyContent: 'space-evenly', width: '55%'}}>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Icon name="pro_pic_sample" />
            <View style={{marginLeft: 10, flex: 1}}>
              <Text fontVariant="bold" size="body4">
                Hi, Swaraj
              </Text>
              <Text style={{flex: 1}} size="small2">
                Nirmala Niketan High School
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: colors.backgroundColor,
              paddingHorizontal: 15,
              alignItems: 'center',
              paddingVertical: 10,
              borderRadius: 10,
              justifyContent: 'space-between',
            }}>
            <Text size="body5" fontVariant="bold">
              4.0
            </Text>
            <View style={{justifyContent: 'space-around'}}>
              <View style={{flexDirection: 'row'}}>
                {Array.from({length: 4}, () => '').map(item => (
                  <Icon name="star_icon" />
                ))}
                <Icon name="star_unfilled_icon" />
              </View>
              <Text size="verysmall3">from 1000 ratings</Text>
            </View>
          </View>
        </View>

        <Icon
          name="rating_celebration_icon"
          width={130}
          height={130}
          style={{alignSelf: 'flex-end'}}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 20,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '85%',
            backgroundColor: '#F5F7FA',
            borderRadius: 10,
            paddingHorizontal: 10,
          }}>
          <TextInput
            style={{flex: 1, color: colors.blackColor, paddingVertical: 5}}
            placeholder="Search"
            placeholderTextColor={colors.darkGrey}
            // onChangeText={text => {
            //   setSearchText(text);
            // }}
          />
          <Icon name="search_icon" />
        </View>
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.primaryColor,
            padding: 8,
            borderRadius: 10,
          }}>
          <Icon name="filter_icon" />
        </View>
      </View>
      <View style={{marginTop: 40}}>
        <RenderTitleWithLink
          icon="analytics_icon"
          titleText="Analytics"
          linkText="Learn More"
          link=''
        />
          <RenderTitleWithLink
          icon='observation_icon'
          titleText="Observations"
          linkText="All Observations"
          link=''
        />
      </View>
    </Layout>
  );
};
export default TeacherDashboard;
