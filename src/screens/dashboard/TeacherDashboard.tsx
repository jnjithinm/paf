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

import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getDashboardDetailsAndObservationList} from '../../redux/features/observationSlice';
import {navigate} from '../../utils/helpers/navigationHelpers';
import {FilterObject} from '../../components/Calendar';
import SearchWithFilter from '../../components/SearchWithFilter';
import {MainStackParamList} from '../../navigation/MainStack';

type TeacherDashboardNavigationProp = StackNavigationProp<
  MainStackParamList,
  'TeacherDashboard'
>;
type TeacherDashboardRouteProp = RouteProp<
  MainStackParamList,
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
  image: string | null | undefined;
  onPress?: () => void;
  reportedBy: string;
  style?: ViewStyle;
  disabled?:boolean
};

export const ObservationsTile: FC<ObservationTileTypes> = ({
  rating,
  userAssisted,
  image,
  onPress,
  reportedBy,
  style,
  disabled
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
        if(onPress){
        onPress();
        }
      }}
      disabled={disabled}
      style={{
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F4C24A',
        justifyContent: 'space-between',
        minHeight: normaliseDesigns(50),
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 3,
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <RenderProfileIcon image={image} name={userAssisted} />
          <View style={{flex: 1}}>
            <Text fontVariant="bold" size="small3" style={{marginLeft: 5}}>
              {userAssisted}
            </Text>
          </View>
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

export const ObservationFilterTile: FC<ObservationFilterTileTypes> = ({
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
    }}
    onPress={() => {}}>
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

type RatingProps = {
  rating: number;
};

export const RatingStars: FC<RatingProps> = ({rating}) => {
  const renderStars = () => {
    const stars = [];
    const maxStars = 5;

    for (let i = 0; i < maxStars; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<Icon key={i} name="star_icon" />);
      } else if (i < rating) {
        stars.push(
          <Icon key={i} name="star_half_filled_icon" width={15} height={15} />,
        );
      } else {
        stars.push(<Icon key={i} name="star_unfilled_icon" />);
      }
    }
    return stars;
  };

  return <View style={{flexDirection: 'row'}}>{renderStars()}</View>;
};

type RenderProfileIconTypes = {
  image: string | null | undefined;
  name: string;
  size?: number;
};

const getInitials = (name: string): string => {
  const nameParts = name.trim().split(' ');
  if (nameParts.length > 1) {
    const firstNameInitial = nameParts[0][0];
    const lastNameInitial = nameParts[nameParts.length - 1][0];
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  } else {
    const firstInitial = name[0];
    const lastInitial = name[name.length - 1];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }
};

export const RenderProfileIcon: FC<RenderProfileIconTypes> = ({
  image,
  name,
  size = 20,
}) => {
  if (image) {
    return (
      <Image
        source={{uri: image}}
        style={{width: size, height: size, borderRadius: size / 2}}
      />
    );
  } else {
    const initials = name ? getInitials(name) : '';
    return (
      <View
        style={[
          {
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#CBD2D9',
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}>
        <Text style={{fontSize: size / 2}}>{initials}</Text>
      </View>
    );
  }
};

const TeacherDashboard: FC<TeacherDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterObject>();

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
        onPressBellIcon={() => {
          navigate('Notifications');
        }}
        onPressProfileIcon={() => {}}
        focusedStack={isDrawerOpen ? undefined : 'TeacherDashboard'}
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
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
              }}>
              <RenderProfileIcon
                image={userData?.userImage}
                name={userData?.name || ''}
                size={45}
              />
              <View style={{marginLeft: 10}}>
                <Text fontVariant="bold" size="body2">
                  Hi, {userData?.name}
                </Text>
                <Text size="small2">{dashboardDetails?.schoolName}</Text>
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
        <SearchWithFilter
          onTextChange={() => {}}
          onProceed={filter => {
            setFilter(filter);
          }}
        />
        <View style={{marginTop: 10}}>
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
              navigation.navigate('ReportsStack', {
                screen: 'ObservationReportsMainPage',
              });
            }}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ObservationFilterTile
              count={Number(dashboardDetails?.total) || 0}
              color="green"
              text="All"
              onPress={() => {}}
            />
            <ObservationFilterTile
              count={Number(dashboardDetails?.byMe) || 0}
              color="orange"
              text="By Me"
              onPress={() => {}}
            />
            <ObservationFilterTile
              count={Number(dashboardDetails?.forMe) || 0}
              color="yellow"
              text="For Me"
              onPress={() => {}}
            />
          </View>
          <View style={{marginTop: 20}}>
            {dashboardDetails?.observations?.slice(0, 4)?.map((item, index) => (
              <ObservationsTile
                key={index}
                rating={item.ratings?.toString()}
                userAssisted={item.userAssessed}
                image={item.reportedByImage}
                reportedBy={item.reportedBy}
                disabled
              />
            ))}
          </View>
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
