import React, {FC, useEffect, useState} from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';

import {DashboardTabBarStackParamList} from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getDashboardDetailsAndObservationList} from '../../redux/features/observationSlice';

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
  onPress: () => void;
  linkText: string;
  style?: ViewStyle;
};

const RenderTitleWithLink: FC<RenderTitleWithLinkTypes> = ({
  icon,
  titleText,
  onPress,
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
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EA7804',
      }}
      onPress={onPress}>
      <Text
        style={{
          color: '#EA7804',
          marginRight: 3,
        }}
        size="small3">
        {linkText}
      </Text>
      <Icon name="explore_icon" />
    </TouchableOpacity>
  </View>
);

type ObservationTileTypes = {
  rating: string;
  userAssisted: string;
  image: string;
  onPress: () => void;
  reportedBy: string;
  style?: ViewStyle;
};

export const ObservationsTile: FC<ObservationTileTypes> = ({
  rating,
  userAssisted,
  image,
  onPress,
  reportedBy,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    return () => {
      setIsPressed(false);
    };
  }, [isPressed]);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsPressed(true);
        onPress();
      }}
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
        backgroundColor: isPressed ? '#FCEBC5' : colors.backgroundColor,
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
          flex: 1,
          justifyContent: 'center',
          // flex:1
        }}>
        <Text size="small1" fontVariant="bold">
          {rating}
        </Text>
        <Icon style={{marginLeft: 5}} name="star_icon" width={10} />
      </View>
      <View style={{flex: 4, marginLeft: 10}}>
        <Text size="verysmall3" opacity="0.50">
          User Assessed
        </Text>
        <View style={{flexDirection:'row'}}>
          <Image source={{uri:`data:image/jpeg;base64,${image}`}}/>
        <Text fontVariant="bold" size="small3">
          {userAssisted}
        </Text>
        
        </View>
      </View>
      <View style={{flex: 4}}>
        <Text size="verysmall3" opacity="0.50">
          Reported By
        </Text>
        <Text size="small3"> {reportedBy}</Text>
      </View>
    </TouchableOpacity>
  );
};

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

type RenderSearchTypes = {
  placeHolder?: string;
  onTextChange: () => void;
  style?: ViewStyle;
};

const RenderSearch: FC<RenderSearchTypes> = ({
  placeHolder = 'Search',
  onTextChange,
  style,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      ...style,
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
);type RatingProps = {
  rating: number; // Pass the rating as a prop
};

const RatingStars: React.FC<RatingProps> = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const maxStars = 5;

    for (let i = 0; i < maxStars; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<Icon key={i} name="star_icon" />); 
      } else if (i < rating) {
        stars.push(<Icon key={i} name='star_half_filled_icon'  width={15} height={15}/>); 
      } else {
        stars.push(<Icon key={i} name="star_unfilled_icon" />);
      }
    }

    return stars;
  };

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
};



const TeacherDashboard: FC<TeacherDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {userData} = useAppSelector(state => state.auth);
  const {dashboardDetails} = useAppSelector(state => state.observation);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getDashboardDetailsAndObservationList(userData?.id));
    }, []),
  );

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  console.log('user', userData.userImage);
  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}>
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
              <Image
                source={{uri: `data:image/jpeg;base64,${userData?.userImage}`}}
                style={{
                  width: normaliseDesigns(50),
                  height: normaliseDesigns(50),
                  borderRadius: 40,
                }}
              />
              <View style={{marginLeft: 10, flex: 1}}>
                <Text fontVariant="bold" size="body2">
                  Hi, {userData?.name}
                </Text>
                <Text style={{flex: 1}} size="small2">
                  {dashboardDetails?.schoolName}
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
                {dashboardDetails?.averageRating}
              </Text>
              <View style={{justifyContent: 'space-around'}}>
              <RatingStars rating={Number(dashboardDetails?.averageRating)} />
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
        <RenderSearch onTextChange={() => {}} />
        <View style={{marginTop: 40}}>
          <RenderTitleWithLink
            icon="analytics_icon"
            titleText="Analytics"
            linkText="Learn More"
            onPress={() => {}}
          />
        </View>
        <View>
          <RenderTitleWithLink
            icon="observation_icon"
            titleText="Observations"
            linkText="All Observations"
            onPress={() => {
              navigation.navigate('ReportsStack');
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ObservationFilterTile
              count={Number(dashboardDetails?.total)}
              color="green"
              text="All"
              onPress={() => {}}
            />
            <ObservationFilterTile
              count={Number(dashboardDetails?.byMe)}
              color="orange"
              text="By Me"
              onPress={() => {}}
            />
            <ObservationFilterTile
              count={Number(dashboardDetails?.forMe)}
              color="yellow"
              text="For Me"
              onPress={() => {}}
            />
          </View>
          {dashboardDetails?.observations?.slice(0, 4).map((item, index) => (
            <ObservationsTile
              key={index}
              rating={item.ratings?.toString()}
              userAssisted={item.userAssessed}
              image={item.reportedByImage}
              reportedBy={item.reportedBy}
              onPress={() => {  
                navigation.navigate('ReportsStack', {
                  screen: 'ObservationReport',
                  params: {
                    observationItem: item,
                  },
                });
              }}
            />
          ))}
        </View>
        <View>
          <RenderTitleWithLink
            icon="monitor_courses_icon"
            titleText="Courses"
            linkText="View All"
            style={{marginTop: 25}}
            onPress={() => {}}
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
