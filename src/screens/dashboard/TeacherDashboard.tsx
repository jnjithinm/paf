// import React, {FC, useEffect, useState} from 'react';
// import {TouchableOpacity, View, ViewStyle} from 'react-native';
// import {RouteProp, useFocusEffect} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {Drawer} from 'react-native-drawer-layout';
// import FastImage from 'react-native-fast-image';
// import moment from 'moment';

// import Layout from '../../components/Layout';
// import Icon, {IconTypes} from '../../components/Icon';
// import Text from '../../components/Text';
// import colors from '../../config/colors';
// import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
// import DrawerContent from '../../components/DrawerContent';
// import {useAppDispatch, useAppSelector} from '../../redux/store';
// import {
//   ObservationStatus,
//   getDashboardDetailsAndObservationList,
// } from '../../redux/features/observationSlice';
// import {navigate} from '../../utils/helpers/navigationHelpers';
// import SearchWithFilter from '../../components/SearchWithFilter';
// import {MainStackParamList} from '../../navigation/MainStack';
// import {RenderCompleteStatus} from '../observation/ObservationReportsMainPage';
// import {ItemType} from '../../config/types';
// import CurvedLineChart from '../../components/CurvedLineChart';
// import { getObservationCountAnalytics } from '../../redux/features/analyticsSlice';
// import endPoints from '../../config/endPoints';
// import api from '../../config/axios';

// type TeacherDashboardNavigationProp = StackNavigationProp<
//   MainStackParamList,
//   'TeacherDashboard'
// >;
// type TeacherDashboardRouteProp = RouteProp<
//   MainStackParamList,
//   'TeacherDashboard'
// >;

// interface TeacherDashboardScreenProps {
//   navigation: TeacherDashboardNavigationProp;
//   route: TeacherDashboardRouteProp;
// }

// type RenderTitleWithLinkTypes = {
//   icon: IconTypes;
//   titleText: string;
//   onPress: () => void;
//   linkText: string;
//   style?: ViewStyle;
// };

// export const RenderTitleWithLink: FC<RenderTitleWithLinkTypes> = ({
//   icon,
//   titleText,
//   onPress,
//   linkText,
//   style,
// }) => (
//   <View
//     style={{
//       flexDirection: 'row',
//       alignItems: 'center',
//       justifyContent: 'space-between',
//       marginVertical: 5,
//       ...style,
//     }}>
//     <View style={{flexDirection: 'row', alignItems: 'center'}}>
//       <View
//         style={{
//           height: normaliseDesigns(20),
//           aspectRatio: 1,
//           backgroundColor: '#F4C24A',
//           borderRadius: 10,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <Icon name={icon} />
//       </View>
//       <Text style={{marginLeft: 5}} fontVariant="bold" size="body2">
//         {titleText}
//       </Text>
//     </View>
//     <TouchableOpacity
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderBottomWidth: 1,
//         borderBottomColor: '#EA7804',
//       }}
//       onPress={onPress}>
//       <Text
//         style={{
//           color: '#EA7804',
//           marginRight: 3,
//         }}
//         size="small3">
//         {linkText}
//       </Text>
//       <Icon name="explore_icon" />
//     </TouchableOpacity>
//   </View>
// );

// type ObservationTileTypes = {
//   rating: string;
//   userAssisted: string;
//   image: string | null | undefined;
//   onPress?: () => void;
//   status: ObservationStatus | undefined;
//   creationDate: string;
//   creationTime: string;
//   reportedBy: string;
//   style?: ViewStyle;
//   disabled?: boolean;
// };

// export const ObservationsTile: FC<ObservationTileTypes> = ({
//   rating,
//   userAssisted,
//   image,
//   onPress,
//   status,
//   creationDate,
//   creationTime,
//   reportedBy,
//   style,
//   disabled,
// }) => {
//   const [isPressed, setIsPressed] = useState(false);
//   const dispatch = useAppDispatch();
//   const {userData} = useAppSelector(state => state.auth);
//   const [analyticsData, setAnalyticsData] = useState([]);

//   useEffect(() => {
//     return () => {
//       setIsPressed(false);
//     };
//   }, [isPressed]);

//   console.log('');

//   // useEffect(() => {
//   //     dispatch(
//   //       getObservationCountAnalytics({
//   //         userId: userData.id,
//   //         dateType: null,
//   //         startDate: null,
//   //         endDate: null,
//   //       })
//   //     );

//   // }, [dispatch]);

//   const fetchDataFromAPI = async (userData) => {
//     try {
//       const params = {
//         userId: userData.id,
//         dateType: null,
//         startDate: null,
//         endDate: null,
//       };

//       const response = await api.post(`${endPoints.OBSERVATION_ANALYTICS_BY_USER_ID}`, { params });
//       const data = response.data?.payload?.dataList;

//       console.log("res---", data);

//       // Update the state with the fetched data
//       setAnalyticsData(data || []);

//       return data;
//     } catch (error) {
//       console.error('Error fetching data from API:', error);
//       return []; // Return an empty array if there's an error
//     }
//   };

//   // Use effect to fetch data when the component mounts
//   useEffect(() => {
//     if (userData) {
//       fetchDataFromAPI(userData);
//     }
//   }, [userData]);

//   // Process the data into the desired format
//   const formattedObservationsAnalytics =
//   Array.isArray(analyticsData) && analyticsData.length > 0
//     ? analyticsData.slice(1).map((row) => ({
//         month: row[0],
//         observations: row[1],
//         averagerating: row[2],
//       }))
//     : [];

// const monthObservations = formattedObservationsAnalytics.map((item) => item.month);
// const observations = formattedObservationsAnalytics.map((item) => item.observations);
// const averagerating = formattedObservationsAnalytics.map((item) => item.averagerating);
//   useEffect(()=>{
//     fetchDataFromAPI(userData)
//   },[])

//   return (

//     <TouchableOpacity
//       onPress={() => {
//         setIsPressed(true);
//         if (onPress) {
//           onPress();
//         }
//       }}
//       disabled={disabled}
//       style={{
//         width: '100%',
//         flexDirection: 'row',
//         borderWidth: 1,
//         borderColor: '#F4C24A',
//         minHeight: normaliseDesigns(50),
//         borderRadius: 10,
//         marginVertical: 3,
//         backgroundColor: isPressed ? '#FCEBC5' : colors.backgroundColor,
//         justifyContent: 'space-between',
//         ...style,
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           padding: 8,
//           backgroundColor: '#EAF1FE',
//           height: 30,
//           maxWidth: '15%',
//           borderTopLeftRadius: 10,
//           borderBottomRightRadius: 10,
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         <Text size="small2" fontVariant="bold">
//           {Number(rating).toFixed(1)}
//         </Text>
//         <Icon style={{left: 5}} name="star_icon" width={10} />
//       </View>
//       <View style={{padding: 10, width: '85%'}}>
//         <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//           <View>
//             <Text size="verysmall3" opacity="0.50">
//               User Assessed
//             </Text>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 marginTop: 2,
//               }}>
//               <RenderProfileIcon image={image} name={userAssisted} />

//               <Text fontVariant="bold" size="small3" style={{left: 3}}>
//                 {userAssisted}
//               </Text>
//             </View>
//           </View>
//           <RenderCompleteStatus
//             status={status}
//             style={{paddingVertical: 2, height: 20}}
//           />
//         </View>

//         <View
//           style={{
//             flexDirection: 'row',
//             marginTop: 5,
//             width: '90%',
//             justifyContent: 'space-between',
//           }}>
//           <View>
//             <Text size="verysmall3" opacity="0.50">
//               Reported By
//             </Text>
//             <Text size="small2"> {reportedBy}</Text>
//           </View>
//           <View>
//             <Text size="verysmall3" opacity="0.50">
//               Creation Date
//             </Text>
//             <Text size="small2"> {creationDate}</Text>
//           </View>
//           <View>
//             <Text size="verysmall3" opacity="0.50">
//               Time
//             </Text>
//             <Text size="small2"> {creationTime}</Text>
//           </View>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// type ObservationFilterTileTypes = {
//   text: 'All' | 'By Me' | 'For Me';
//   color: 'green' | 'yellow' | 'orange';
//   count: number;
//   onPress: () => void;
//   disabled?: boolean;
// };

// export const ObservationFilterTile: FC<ObservationFilterTileTypes> = ({
//   text,
//   color,
//   count,
//   onPress,
//   disabled,
// }) => (
//   <TouchableOpacity
//     style={{
//       backgroundColor:
//         color === 'green'
//           ? '#EBF9D9'
//           : color === 'orange'
//           ? '#FDF0E3'
//           : '#FEF8EC',
//       alignItems: 'center',
//       borderWidth: 1,
//       borderColor:
//         color === 'green'
//           ? '#749E35'
//           : color === 'orange'
//           ? '#D29804'
//           : '#EA7804',
//       justifyContent: 'space-evenly',
//       flexDirection: 'row',
//       width: '30%',
//       paddingHorizontal: 10,
//       height: 40,
//       borderRadius: 10,
//     }}
//     disabled={disabled}
//     onPress={() => {}}>
//     <Text
//       style={{
//         color:
//           color === 'green'
//             ? '#749E35'
//             : color === 'orange'
//             ? '#D29804'
//             : '#EA7804',
//       }}
//       fontVariant="bold"
//       onPress={onPress}>
//       ({count})
//     </Text>
//     <Text
//       style={{
//         color:
//           color === 'green'
//             ? '#749E35'
//             : color === 'orange'
//             ? '#D29804'
//             : '#EA7804',
//       }}
//       fontVariant="semiBold">
//       {text}
//     </Text>
//   </TouchableOpacity>
// );

// type CoursesInProgressTileTypes = {
//   percentage: number;
//   minutesLeft: number;
//   courseDescription: string;
// };

// const CourseInProgresssTile: FC<CoursesInProgressTileTypes> = ({
//   percentage,
//   minutesLeft,
//   courseDescription,
// }) => (
//   <View
//     style={{
//       flexDirection: 'row',
//       width: '100%',
//       justifyContent: 'space-between',
//       alignItems: 'center',
//       backgroundColor: '#FEF8EC',
//       borderWidth: 1,
//       borderColor: '#F4C24A',
//       height: normaliseDesigns(60),
//       borderRadius: 10,
//       paddingLeft: 10,
//       marginVertical: 5,
//       // paddingHorizontal: 10,
//     }}>
//     <View>
//       <Text fontVariant="bold">{courseDescription}</Text>
//       <View style={{flexDirection: 'row', alignItems: 'center'}}>
//         <Text size="small1">Continue Learning</Text>
//         <Icon name="right_icon" />
//       </View>
//     </View>
//     <View
//       style={{
//         flexDirection: 'row',
//         alignSelf: 'flex-start',
//         justifyContent: 'flex-end',
//         backgroundColor: '#F4C24A',
//         padding: 6,
//         paddingHorizontal: 10,
//         alignItems: 'center',
//         borderRadius: 8,
//       }}>
//       <Icon name="clock_icon" />
//       <Text size="small2" style={{left: 4}}>
//         {minutesLeft} Mins Left
//       </Text>
//     </View>
//   </View>
// );

// type CoursesTileTypes = {
//   courseImage: string;
//   courseTitle: string;
//   courseDuration: string;
// };

// const CourseTile: FC<CoursesTileTypes> = ({
//   courseTitle,
//   courseImage,
//   courseDuration,
// }) => (
//   <View
//     style={{
//       backgroundColor: '#FEF8EC',
//       borderWidth: 1,
//       borderColor: '#F4C24A',
//       width: '47%',
//       borderRadius: 10,
//       paddingBottom: 10,
//     }}>
//     <Icon width={150} height={150} name="courses_1_sample" />
//     <Text
//       fontVariant="bold"
//       size="body1"
//       style={{marginVertical: 4, marginLeft: 4}}>
//       {courseTitle}
//     </Text>
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginLeft: 8,
//         marginVertical: 6,
//       }}>
//       <Icon name="clock_icon" stroke={'#D29804'} />
//       <Text style={{color: '#D29804', marginLeft: 4}}>{courseDuration}</Text>
//     </View>
//     <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
//       <Text size="small3">Enroll now</Text>
//       <Icon style={{marginLeft: 4}} name="right_icon" />
//     </View>
//   </View>
// );

// type RatingProps = {
//   rating: number;
// };

// export const RatingStars: FC<RatingProps> = ({rating}) => {
//   const renderStars = () => {
//     const stars = [];
//     const maxStars = 5;

//     for (let i = 0; i < maxStars; i++) {
//       if (i < Math.floor(rating)) {
//         stars.push(<Icon key={i} name="star_icon" />);
//       } else if (i < rating) {
//         stars.push(
//           <Icon key={i} name="star_half_filled_icon" width={15} height={15} />,
//         );
//       } else {
//         stars.push(<Icon key={i} name="star_unfilled_icon" />);
//       }
//     }
//     return stars;
//   };

//   return <View style={{flexDirection: 'row'}}>{renderStars()}</View>;
// };

// type RenderProfileIconTypes = {
//   image: string | null | undefined;
//   name: string;
//   size?: number;
// };

// const getInitials = (name: string): string => {
//   const nameParts = name.trim().split(' ');
//   if (nameParts.length > 1) {
//     const firstNameInitial = nameParts[0][0];
//     const lastNameInitial = nameParts[nameParts.length - 1][0];
//     return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
//   } else {
//     const firstInitial = name[0];
//     const lastInitial = name[name.length - 1];
//     return `${firstInitial}${lastInitial}`.toUpperCase();
//   }
// };

// export const RenderProfileIcon: FC<RenderProfileIconTypes> = ({
//   image,
//   name,
//   size = 20,
// }) => {
//   if (image) {
//     return (
//       <FastImage
//         style={{width: size, height: size, borderRadius: size / 2}}
//         source={{
//           uri: image,
//           priority: FastImage.priority.normal,
//         }}
//         resizeMode={FastImage.resizeMode.cover}
//         onLoadStart={() => console.log('Loading started')}
//         onLoadEnd={() => console.log('Loading finished')}
//         onError={() => console.log('Failed to load image')}
//       />
//     );
//   } else {
//     const initials = name ? getInitials(name) : '';
//     return (
//       <View
//         style={[
//           {
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: '#CBD2D9',
//             width: size,
//             height: size,
//             borderRadius: size / 2,
//           },
//         ]}>
//         <Text style={{fontSize: size / 2}}>{initials}</Text>
//       </View>
//     );
//   }
// };

// const menuItems: ItemType[] = [
//   {
//     label: 'Observation',
//     value: 'Observation',
//   },
//   {
//     label: 'Evaluation Flows',
//     value: 'Evaluation Flows',
//   },
// ];

// const TeacherDashboard: FC<TeacherDashboardScreenProps> = ({
//   navigation,
//   route,
// }) => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

//   const dispatch = useAppDispatch();

//   const {userData} = useAppSelector(state => state.auth);
//   const {dashboardDetails} = useAppSelector(state => state.observation);
//   const closeDrawer = () => {
//     setIsDrawerOpen(false);
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       dispatch(getDashboardDetailsAndObservationList(userData?.id));
//       closeDrawer();
//     }, []),
//   );

//   const onSelectMenu = (label: string | undefined) => {
//     switch (label) {
//       case 'Observation':
//         navigation.navigate('ObservationStack', {
//           screen: 'ObservationReportsMainPage',
//         });
//         break;
//       case 'Evaluation Flows':
//         navigation.navigate('FlowsAndFormsStack', {screen: 'FlowsMainPage'});
//         break;
//       default:
//         break;
//     }
//   };

//   return (
//     <Drawer
//       open={isDrawerOpen}
//       onOpen={() => setIsDrawerOpen(true)}
//       onClose={() => setIsDrawerOpen(false)}
//       renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}>
//       <Layout
//         overridePaddingHorizontal
//         overridePaddingVertical
//         style={{paddingHorizontal: 15}}
//         onPressMenuIcon={() => {
//           setIsDrawerOpen(true);
//         }}
//         onPressBellIcon={() => {
//           navigate('Notifications');
//         }}
//         onPressProfileIcon={() => {}}
//         focusedStack={isDrawerOpen ? undefined : 'TeacherDashboard'}
//         dashboard
//         avoidBackButton>
//         <View
//           style={{
//             marginTop: 30,
//             backgroundColor: '#FCEBC5',
//             borderRadius: 10,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             paddingHorizontal: 10,
//             paddingTop: 10,
//             flex: 1,
//           }}>
//           <View style={{justifyContent: 'space-evenly', width: '55%'}}>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 justifyContent: 'flex-start',
//                 alignItems: 'center',
//               }}>
//               <RenderProfileIcon
//                 image={userData?.userImageUrl || userData.userImageUrl}
//                 name={userData?.name || ''}
//                 size={45}
//               />
//               <View style={{marginLeft: 10}}>
//                 <Text fontVariant="bold" size="body2">
//                   Hi, {userData?.name}
//                 </Text>
//                 <Text size="small2">{dashboardDetails?.schoolName}</Text>
//               </View>
//             </View>
//             <View
//               style={{
//                 flexDirection: 'row',
//                 backgroundColor: colors.backgroundColor,
//                 paddingHorizontal: 15,
//                 alignItems: 'center',
//                 paddingVertical: 10,
//                 borderRadius: 10,
//                 justifyContent: 'space-between',
//               }}>
//               <Text size="body5" fontVariant="bold">
//                 {dashboardDetails?.averageRating?.toFixed(1)}
//               </Text>
//               <View style={{justifyContent: 'space-around'}}>
//                 <RatingStars rating={Number(dashboardDetails?.averageRating)} />
//                 <Text size="verysmall3">
//                   from {dashboardDetails?.forMe} ratings
//                 </Text>
//               </View>
//             </View>
//           </View>

//           <Icon
//             name="rating_celebration_icon"
//             width={130}
//             height={130}
//             style={{alignSelf: 'flex-end'}}
//           />
//         </View>
//         <SearchWithFilter
//           onTextChange={() => {}}
//           options={menuItems}
//           onProceed={filter => {
//             onSelectMenu(filter?.selectedItem?.label);
//           }}
//           filterNotNeeded
//         />
//         <View style={{marginTop: 10}}>
//           <RenderTitleWithLink
//             icon="analytics_icon"
//             titleText="Analytics"
//             linkText="Learn More"
//             onPress={() => {}}
//           />
//         </View>

//         <View>
//           <RenderTitleWithLink
//             icon="observation_icon"
//             titleText="Observations"
//             linkText="All Observations"
//             onPress={() => {
//               navigation.navigate('ObservationStack', {
//                 screen: 'ObservationReportsMainPage',
//               });
//             }}
//           />
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <ObservationFilterTile
//               count={Number(dashboardDetails?.total) || 0}
//               color="green"
//               text="All"
//               onPress={() => {}}
//               disabled
//             />
//             <ObservationFilterTile
//               count={Number(dashboardDetails?.byMe) || 0}
//               color="orange"
//               text="By Me"
//               onPress={() => {}}
//               disabled
//             />
//             <ObservationFilterTile
//               count={Number(dashboardDetails?.forMe) || 0}
//               color="yellow"
//               text="For Me"
//               onPress={() => {}}
//               disabled
//             />
//           </View>
//           <View style={{marginTop: 20}}>
//             {dashboardDetails?.observations?.slice(0, 4)?.map((item, index) => (
//               <ObservationsTile
//                 key={index}
//                 rating={item.ratings?.toString()}
//                 userAssisted={item.userAssessed}
//                 image={item.userImage}
//                 reportedBy={item.reportedBy}
//                 creationDate={moment(item.createdDate).format('DD/MM/YYYY')}
//                 creationTime={moment(item.createdDate).format('h:mmA')}
//                 status="Completed"
//                 disabled
//               />
//             ))}
//           </View>
//         </View>
//         <View>
//           <RenderTitleWithLink
//             icon="monitor_courses_icon"
//             titleText="Courses"
//             linkText="View All"
//             style={{marginTop: 25}}
//             onPress={() => {}}
//           />
//           <Text size="small3" style={{marginVertical: 10}}>
//             5 in progress courses
//           </Text>
//           <CourseInProgresssTile
//             percentage={0}
//             minutesLeft={10}
//             courseDescription={'Preparing lesson plans'}
//           />
//           <CourseInProgresssTile
//             percentage={0}
//             minutesLeft={10}
//             courseDescription={'Preparing lesson plans'}
//           />
//           <Text size="small3" style={{marginTop: 20, marginBottom: 10}}>
//             12 available courses
//           </Text>
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <CourseTile
//               courseImage={''}
//               courseTitle={'Creating safe spaces'}
//               courseDuration={'4h 45 Mins'}
//             />
//             <CourseTile
//               courseImage={''}
//               courseTitle={'Student discipline'}
//               courseDuration={'4h 45 Mins'}
//             />
//           </View>
//         </View>
//       </Layout>
//     </Drawer>
//   );
// };
// export default TeacherDashboard;

import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  ObservationStatus,
  getDashboardDetailsAndObservationList,
} from '../../redux/features/observationSlice';
import {navigate} from '../../utils/helpers/navigationHelpers';
import SearchWithFilter from '../../components/SearchWithFilter';
import {MainStackParamList} from '../../navigation/MainStack';
import {RenderCompleteStatus} from '../observation/ObservationReportsMainPage';
import {ItemType} from '../../config/types';
import CurvedLineChart from '../../components/CurvedLineChart';
import endPoints from '../../config/endPoints';
import api from '../../config/axios';
import Modal from '../../components/Modal';
import Calendar from '../analytics/FlowsandFormFilterList';
import Button from '../../components/Button';

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

export const RenderTitleWithLink: FC<RenderTitleWithLinkTypes> = ({
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
        top:5
      }}
      onPress={onPress}>
      <Text
        style={{
          color: '#EA7804',
          marginRight: 3,
          bottom:5
        }}
        size="small3">
        {linkText}
      </Text>
      <Icon name="explore_icon" style={{bottom:5}} />
    </TouchableOpacity>
  </View>
);

type ObservationTileTypes = {
  rating: string;
  userAssisted: string;
  image: string | null | undefined;
  onPress?: () => void;
  status: ObservationStatus | undefined;
  creationDate: string;
  creationTime: string;
  reportedBy: string;
  style?: ViewStyle;
  disabled?: boolean;
};

export const ObservationsTile: FC<ObservationTileTypes> = ({
  rating,
  userAssisted,
  image,
  onPress,
  status,
  creationDate,
  creationTime,
  reportedBy,
  style,
  disabled,
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
        if (onPress) {
          onPress();
        }
      }}
      disabled={disabled}
      style={{
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F4C24A',
        minHeight: normaliseDesigns(50),
        borderRadius: 10,
        marginVertical: 3,
        backgroundColor: isPressed ? '#FCEBC5' : colors.backgroundColor,
        justifyContent: 'space-between',
        ...style,
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          backgroundColor: '#EAF1FE',
          height: 30,
          maxWidth: '15%',
          borderTopLeftRadius: 10,
          borderBottomRightRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text size="small2" fontVariant="bold">
          {Number(rating).toFixed(1)}
        </Text>
        <Icon style={{left: 5}} name="star_icon" width={10} />
      </View>
      <View style={{padding: 10, width: '85%'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View>
            <Text size="verysmall3" opacity="0.50">
              User Assessed
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 2,
              }}>
              <RenderProfileIcon image={image} name={userAssisted} />

              <Text fontVariant="bold" size="small3" style={{left: 3}}>
                {userAssisted}
              </Text>
            </View>
          </View>
          <RenderCompleteStatus
            status={status}
            style={{paddingVertical: 2, height: 20}}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 5,
            width: '90%',
            justifyContent: 'space-between',
          }}>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Reported By
            </Text>
            <Text size="small2"> {reportedBy}</Text>
          </View>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Creation Date
            </Text>
            <Text size="small2"> {creationDate}</Text>
          </View>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Time
            </Text>
            <Text size="small2"> {creationTime}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type ObservationFilterTileTypes = {
  text: 'All' | 'By Me' | 'For Me';
  color: 'green' | 'yellow' | 'orange';
  count: number;
  onPress: () => void;
  disabled?: boolean;
};

export const ObservationFilterTile: FC<ObservationFilterTileTypes> = ({
  text,
  color,
  count,
  onPress,
  disabled,
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
    disabled={disabled}
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
  courseTitle: string;
  courseDuration: string;
};

const CourseTile: FC<CoursesTileTypes> = ({courseTitle, courseDuration}) => (
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

// export const RatingStars: FC<RatingProps> = ({rating}) => {
//   const renderStars = () => {
//     const stars = [];
//     const maxStars = 5;

//     for (let i = 0; i < maxStars; i++) {
//       if (i < Math.floor(rating)) {
//         stars.push(<Icon key={i} name="star_icon" />);
//       } else if (i < rating) {
//         stars.push(
//           <Icon key={i} name="star_half_filled_icon" width={15} height={15} />,
//         );
//       } else {
//         stars.push(
//           <Icon key={i} name="star_unfilled_icon" width={14} height={14} />,
//         );
//       }
//     }
//     return stars;
//   };

//   return <View style={{flexDirection: 'row'}}>{renderStars()}</View>;
// };

export const RatingStars: FC<RatingProps> = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const maxStars = 5;
    const starSize = { width: 15, height: 15 }; // Define uniform size for all stars

    for (let i = 0; i < maxStars; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <Icon
            key={i}
            name="star_icon"
            {...starSize} // Apply uniform size
          />
        );
      } else if (i < rating) {
        stars.push(
          <Icon
            key={i}
            name="star_half_filled_icon"
            {...starSize} // Apply uniform size
          />
        );
      } else {
        stars.push(
          <Icon
            key={i}
            name="star_unfilled_icon"
            {...starSize} // Apply uniform size
          />
        );
      }
    }
    return stars;
  };

  return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
};

type RenderProfileIconTypes = {
  image: string | null | undefined;
  name: string;
  size?: number;
};

export const RenderProfileIcon: FC<RenderProfileIconTypes> = ({
  image,
  name,
  size = 20,
}) => {
  if (image) {
    return (
      <FastImage
        style={{width: size, height: size, borderRadius: size / 2}}
        source={{
          uri: image,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => console.log('Loading started')}
        onLoadEnd={() => console.log('Loading finished')}
        onError={() => console.log('Failed to load image')}
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

const menuItems: ItemType[] = [
  {
    label: 'Observation',
    value: 'Observation',
  },
  {
    label: 'Evaluation Flows',
    value: 'Evaluation Flows',
  },
];

const TeacherDashboard: FC<TeacherDashboardScreenProps> = ({navigation}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [isSortIconClick, setIsSortIconClick] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const dispatch = useAppDispatch();

  const {userData} = useAppSelector(state => state.auth);
  const {dashboardDetails} = useAppSelector(state => state.observation);
  console.log('dashboardDetails----tech', dashboardDetails?.schoolName);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getDashboardDetailsAndObservationList(userData?.id));
      closeDrawer();
    }, [dispatch, userData?.id]),
  );

  const fetchDataFromAPI = async (filters: any) => {
    try {
      // Directly pass the parameters without wrapping them in an extra object
      const response = await api.post(
        `${endPoints.OBSERVATION_ANALYTICS_BY_USER_ID}`,
        {
          userId: filters.userId,
          dateType: filters.dateType || 'week', // Default to "week"
          startDate: filters.startDate || null,
          endDate: filters.endDate || null,
        },
      );

      const data = response.data?.payload?.dataList.observationAndAverageCount;
      setAnalyticsData(data || []);

      console.log('API response:', data);

      return data;
    } catch (error) {
      console.error('Error fetching data from API:', error);
      return []; // Return an empty array if there's an error
    }
  };
  useEffect(() => {
    if (userData) {
      fetchDataFromAPI(userData);
    }
  }, [userData]);

  console.log('analyticsData===', analyticsData);

  const formattedObservationsAnalytics =
    Array.isArray(analyticsData) && analyticsData.length > 0
      ? analyticsData.slice(1).map(row => ({
          month: row[0],
          observations: row[1],
          averagerating: row[2],
        }))
      : [];

  const monthObservations = formattedObservationsAnalytics.map(
    item => item.month,
  );
  const observations = formattedObservationsAnalytics.map(
    item => item.observations,
  );
  const averagerating = formattedObservationsAnalytics.map(
    item => item.averagerating,
  );

  console.log('.......', monthObservations, observations, averagerating);

  const onSelectMenu = (label: string | undefined) => {
    switch (label) {
      case 'Observation':
        navigation.navigate('ObservationStack', {
          screen: 'ObservationReportsMainPage',
        });
        break;
      case 'Evaluation Flows':
        navigation.navigate('FlowsAndFormsStack', {screen: 'FlowsMainPage'});
        break;
      default:
        break;
    }
  };

  type RenderFilterModalContentTypestwo = {
    onPressAssign: () => void;
  };

  const RenderAssignFormModalContenttwo: FC<
    RenderFilterModalContentTypestwo
  > = ({onPressAssign}) => {
    const [selectedUsers, setSelectedUsers] = useState<ItemType | undefined>(
      undefined,
    );
    const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState<string>('');
    const [groupSearch, setGroupSearch] = useState<string[]>([]);
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
      useState<boolean>(false);
    const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      undefined,
    );

    const {formAssignedUserAndUserGroups} = useAppSelector(
      state => state.forms,
    );
    const [selectedIndicator, setSelectedIndicator] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedSchool, setSelectedSchool] = useState<ItemType | undefined>(
      undefined,
    );
    const [selectedUserState, setSelectedUserState] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserDistrict, setSelectedUserDistrict] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserArea, setSelectedUserArea] = useState<
      ItemType | undefined
    >(undefined);

    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [dateType, setDateType] = useState<string>('');
    const [selectedDateType, setSelectedDateType] = useState<string>('');
    const [id, setId] = useState<number | undefined>(undefined);
    const [selectedDateRange, setSelectedDateRange] = useState<string>('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dateFilterOptions = [
      'Last week',
      'This month',
      'Past 3 months',
      'Past 1 year',
    ] as const;

    const handleDateChange = (startDate: string, endDate: string) => {
      console.log('startDate', startDate, endDate);
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
      setSelectedDateRange(`${startDate} - ${endDate}`);
      setDateType('selected_date');
    };
    const handlePressChartTwo = async () => {
      const filters = {
        userId: userData.id,
        dateType: dateType || null,
        startDate: selectedStartDate || null,
        endDate: selectedEndDate || null,
      };

      console.log('Filters applied:', filters);

      // Call the API with the updated filters
      const response = await fetchDataFromAPI(filters);

      // Update the state or perform further actions with the response if needed
      // For example, you might want to update some UI elements based on the response
      if (response) {
        // Process the response data as needed
        console.log('API response data:', response);
      }

      // Close the modal or perform any other UI updates
      onPressAssign();
      setFilterOpen(false);
    };

    const handleConfirm = (date: Date) => {
      if (pickerMode === 'start') {
        setSelectedStartDate(moment(date).format('YYYY-MM-DD'));
      } else {
        setSelectedEndDate(moment(date).format('YYYY-MM-DD'));
      }
      setIsDateTimePickerVisible(false);
      setDateType('selected_date');
    };

    const handleDateTypeChange = (type: string) => {
      setSelectedStartDate('');
      setSelectedEndDate('');
      setSelectedDateType(type);
      switch (type) {
        case 'Last week':
          setDateType('Week');
          break;
        case 'This month':
          setDateType('Month');
          break;
        case 'Past 3 months':
          setDateType('past_3_months');
          break;
        case 'Past 1 year':
          setDateType('Past_1_Year');
          break;
        default:
          setDateType('');
      }
    };

    const clearDate = () => {
      setSelectedStartDate('');
      setSelectedEndDate('');
      setDateType('');
      setSelectedDateType('');
    };

    const isApplyButtonActive =
      selectedUserState ||
      selectedUserDistrict ||
      selectedSchool ||
      (selectedStartDate && selectedEndDate) ||
      dateType;

    return (
      <View style={{paddingHorizontal: 10}}>
        <View style={{marginVertical: 10}}>
          <Text size="body1" fontVariant="bold" style={{marginBottom: 10}}>
            By date
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              width: '85%',
              alignContent: 'flex-start',
            }}>
            {dateFilterOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  borderColor:
                    selectedDateType === item ? '#F4C24A' : '#E4E7EB',
                  borderWidth: 1,
                  backgroundColor:
                    selectedDateType === item ? '#FCEBC5' : undefined,
                  paddingHorizontal: 20,
                  paddingVertical: 7,
                  borderRadius: 8,
                  marginBottom: 10,
                  alignContent: 'flex-start',
                }}
                onPress={() => {
                  handleDateTypeChange(item);
                }}>
                <Text size="small3">{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setIsCalendarVisible(true);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1">
            Date
          </Text>
          <View>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#CBD2D9',
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: normaliseDesigns(40),
              }}>
              <Text onPress={() => setIsCalendarVisible(true)}>
                {selectedDateRange || 'Select'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedDateRange('');
                  setSelectedStartDate('');
                  setSelectedEndDate('');
                  setIsCalendarVisible(false);
                }}
                style={{}}>
                <Icon
                  name={selectedDateRange ? 'crosscircle' : 'calendar_icon'}
                />
              </TouchableOpacity>
            </View>
            {isCalendarVisible && (
              <View style={styles.calendarContainer}>
                <Calendar onDateChange={handleDateChange} />
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={{marginBottom: 0, marginTop: 50}}>
          <Button
            text="Apply"
            active={isApplyButtonActive}
            onPress={handlePressChartTwo}
          />
        </View>
      </View>
    );
  };
  const handleSortIconClick = () => {
    setIsSortIconClick(true);
    setFilterOpen(true);
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
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOpen(false);
          }}
          isVisible={filterOpen}
          title="Chart 1 filter"
          closeButton
          contentStyle={{width: '100%'}}
          content={<RenderAssignFormModalContenttwo onPressAssign={() => {}} />}
        />

        {/* User Profile and Dashboard Details */}
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
                image={userData?.userImageUrl || userData.userImageUrl}
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
                {dashboardDetails?.averageRating?.toFixed(1)}
              </Text>
              <View style={{justifyContent: 'space-around'}}>
                <RatingStars rating={Number(dashboardDetails?.averageRating)} />
                <Text size="verysmall3">
                  from {dashboardDetails?.forMe} ratings
                </Text>
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

        {/* Search with Filter */}
        <SearchWithFilter
          onTextChange={() => {}}
          options={menuItems}
          onProceed={filter => {
            onSelectMenu(filter?.selectedItem?.label);
          }}
          filterNotNeeded
        />

        {/* Analytics Title and Chart */}
        <View style={{marginTop:normaliseDesigns(10)}}>
          <RenderTitleWithLink
            icon="analytics_icon"
            titleText="Analytics"
            linkText="Learn More"
            onPress={() => {}}
          />
        </View>
        <View style={{marginTop: normaliseDesigns(5)}}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={handleSortIconClick}
              style={styles.iconButton}>
              {filterOpen?<Icon name='dots_colred_icon'/>:<Icon name="sorting_icon" color={colors.blackColor} />}
            </TouchableOpacity>
          </View>
          <CurvedLineChart
            title="Rating Change Over Time"
            value1={observations}
            value2={averagerating}
            labels={monthObservations}
            indicators={['Observations', 'Rating Change']}
          />
        </View>

        {/* Observations Section */}
        <View>
          <RenderTitleWithLink
            icon="observation_icon"
            titleText="Observations"
            linkText="All Observations"
            onPress={() => {
              navigation.navigate('ObservationStack', {
                screen: 'ObservationReportsMainPage',
              });
            }}
            style={{marginVertical:normaliseDesigns(15)}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <ObservationFilterTile
              count={Number(dashboardDetails?.total) || 0}
              color="green"
              text="All"
              onPress={() => {}}
              disabled
            />
            <ObservationFilterTile
              count={Number(dashboardDetails?.byMe) || 0}
              color="orange"
              text="By Me"
              onPress={() => {}}
              disabled
            />
            <ObservationFilterTile
              count={Number(dashboardDetails?.forMe) || 0}
              color="yellow"
              text="For Me"
              onPress={() => {}}
              disabled
            />
          </View>
          <View style={{marginTop: 20}}>
            {dashboardDetails?.observations?.slice(0, 4)?.map((item, index) => (
              <ObservationsTile
                key={index}
                rating={item.ratings?.toString()}
                userAssisted={item.userAssessed}
                image={item.userImage}
                reportedBy={item.reportedBy}
                creationDate={moment(item.createdDate).format('DD/MM/YYYY')}
                creationTime={moment(item.createdDate).format('h:mmA')}
                status="Completed"
                disabled
              />
            ))}
          </View>
        </View>

        {/* Courses Section */}
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
              courseTitle={'Creating safe spaces'}
              courseDuration={'4h 45 Mins'}
            />
            <CourseTile
              courseTitle={'Student discipline'}
              courseDuration={'4h 45 Mins'}
            />
          </View>
        </View>
      </Layout>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
    top: 27,
    right: 5,
    flexDirection: 'row',
    zIndex: 1,
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 10,
    paddingVertical: 5,
    top: 5,
  },
});

export default TeacherDashboard;
