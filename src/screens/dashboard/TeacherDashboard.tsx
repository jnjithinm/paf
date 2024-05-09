import React, {FC, useState} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';

import {DashboardTabBarStackParamList} from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DrawerContent from '../../components/DrawerContent';

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
  style?: ViewStyle;
};

const RenderTitleWithLink: FC<RenderTitleWithLinkTypes> = ({
  icon,
  titleText,
  link,
  linkText,
  style,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 5,
      ...style,
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <View
        style={{
          height: normaliseDesigns(20),
          aspectRatio: 1,
          backgroundColor: '#F4C24A',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name={icon} />
      </View>
      <Text style={{marginLeft: 5}} fontVariant="bold" size="body2">
        {titleText}
      </Text>
    </View>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EA7804',
      }}>
      <Text
        style={{
          color: '#EA7804',
          marginRight: 3,
        }}
        size="small3">
        {linkText}
      </Text>
      <Icon name="explore_icon" />
    </View>
  </View>
);

type ObservationTileTypes = {
  rating: string;
  userAssisted: string;
  image: string;
  reportedBy: string;
  style?: ViewStyle;
};

export const ObservationsTile: FC<ObservationTileTypes> = ({
  rating,
  userAssisted,
  image,
  reportedBy,
  style,
}) => (
  <View
    style={{
      width: '100%',
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#F4C24A',
      justifyContent: 'space-between',
      height: normaliseDesigns(50),
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 5,
      ...style,
    }}>
    <View
      style={{
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#EAF1FE',
        borderRadius: 10,
        alignSelf: 'flex-start',
        alignItems: 'center',
        // flex:1
      }}>
      <Text size="small1" fontVariant="bold">
        {rating}
      </Text>
      <Icon style={{marginLeft: 5}} name="star_icon" width={10} />
    </View>
    <View style={{flex: 1, marginLeft: 10}}>
      <Text size="verysmall3" opacity="0.50">
        User Assessed
      </Text>
      <Text fontVariant="bold" size="small3">
        {userAssisted}
      </Text>
    </View>
    <View style={{flex: 1}}>
      <Text size="verysmall3" opacity="0.50">
        Reported By
      </Text>
      <Text size="small3"> {reportedBy}</Text>
    </View>
  </View>
);

type ObservationFilterTileTypes = {
  text: 'All' | 'By Me' | 'For Me';
  color: 'green' | 'yellow' | 'orange';
  count: number;
  onPress: () => void;
};

const ObservationFilterTile: FC<ObservationFilterTileTypes> = ({
  text,
  color,
  count,
  onPress,
}) => (
  <TouchableOpacity
    style={{
      backgroundColor:
        color === 'green'
          ? '#EBF9D9'
          : color === 'orange'
          ? '#FDF0E3'
          : '#FEF8EC',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        color === 'green'
          ? '#749E35'
          : color === 'orange'
          ? '#D29804'
          : '#EA7804',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      width: '30%',
      paddingHorizontal: 10,
      height: 40,
      borderRadius: 10,
    }}>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
      }}
      fontVariant="bold"
      onPress={onPress}>
      ({count})
    </Text>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
      }}
      fontVariant="semiBold">
      {text}
    </Text>
  </TouchableOpacity>
);

type CoursesInProgressTileTypes = {
  percentage: number;
  minutesLeft: number;
  courseDescription: string;
};

const CourseInProgresssTile: FC<CoursesInProgressTileTypes> = ({
  percentage,
  minutesLeft,
  courseDescription,
}) => (
  <View
    style={{
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#FEF8EC',
      borderWidth: 1,
      borderColor: '#F4C24A',
      height: normaliseDesigns(60),
      borderRadius: 10,
      paddingLeft: 10,
      marginVertical: 5,
      // paddingHorizontal: 10,
    }}>
    <View>
      <Text fontVariant="bold">{courseDescription}</Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text size="small1">Continue Learning</Text>
        <Icon name="right_icon" />
      </View>
    </View>
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: '#F4C24A',
        padding: 6,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderRadius: 8,
      }}>
      <Icon name="clock_icon" />
      <Text size="small2" style={{left: 4}}>
        {minutesLeft} Mins Left
      </Text>
    </View>
  </View>
);

type CoursesTileTypes = {
  courseImage: string;
  courseTitle: string;
  courseDuration: string;
};

const CourseTile: FC<CoursesTileTypes> = ({
  courseTitle,
  courseImage,
  courseDuration,
}) => (
  <View
    style={{
      backgroundColor: '#FEF8EC',
      borderWidth: 1,
      borderColor: '#F4C24A',
      width: '47%',
      borderRadius: 10,
      paddingBottom: 10,
    }}>
    <Icon width={150} height={150} name="courses_1_sample" />
    <Text
      fontVariant="bold"
      size="body1"
      style={{marginVertical: 4, marginLeft: 4}}>
      {courseTitle}
    </Text>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
        marginVertical: 6,
      }}>
      <Icon name="clock_icon" stroke={'#D29804'} />
      <Text style={{color: '#D29804', marginLeft: 4}}>{courseDuration}</Text>
    </View>
    <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
      <Text size="small3">Enroll now</Text>
      <Icon style={{marginLeft: 4}} name="right_icon" />
    </View>
  </View>
);

// type RenderSearchTypes={

// }

// const RenderSearch:FC<RenderSearchTypes>=({})=>(

// )

const TeacherDashboard: FC<TeacherDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => <DrawerContent />}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        onPressMenuIcon={() => {
          setIsDrawerOpen(true);
        }}
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
            link=""
          />
        </View>
        <View>
          <RenderTitleWithLink
            icon="observation_icon"
            titleText="Observations"
            linkText="All Observations"
            link=""
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ObservationFilterTile
              count={20}
              color="green"
              text="All"
              onPress={() => {}}
            />
            <ObservationFilterTile
              count={15}
              color="orange"
              text="By Me"
              onPress={() => {}}
            />
            <ObservationFilterTile
              count={41}
              color="yellow"
              text="For Me"
              onPress={() => {}}
            />
          </View>
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
          />
        </View>
        <View>
          <RenderTitleWithLink
            icon="monitor_courses_icon"
            titleText="Courses"
            linkText="View All"
            style={{marginTop: 25}}
            link=""
          />
          <Text size="small3" style={{marginVertical: 10}}>
            5 in progress courses
          </Text>
          <CourseInProgresssTile
            percentage={0}
            minutesLeft={10}
            courseDescription={'Preparing lesson plans'}
          />
          <CourseInProgresssTile
            percentage={0}
            minutesLeft={10}
            courseDescription={'Preparing lesson plans'}
          />
          <Text size="small3" style={{marginTop: 20, marginBottom: 10}}>
            12 available courses
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <CourseTile
              courseImage={''}
              courseTitle={'Creating safe spaces'}
              courseDuration={'4h 45 Mins'}
            />
            <CourseTile
              courseImage={''}
              courseTitle={'Student discipline'}
              courseDuration={'4h 45 Mins'}
            />
          </View>
        </View>
      </Layout>
    </Drawer>
  );
};
export default TeacherDashboard;
