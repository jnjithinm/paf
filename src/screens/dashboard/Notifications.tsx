// import React, {FC, useEffect} from 'react';
// import {RouteProp} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {View, ScrollView, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
// import Layout from '../../components/Layout';
// import Text from '../../components/Text';
// import {MainStackParamList} from '../../navigation/MainStack';
// import Icon from '../../components/Icon';
// import colors from '../../config/colors';
// import {useAppDispatch, useAppSelector} from '../../redux/store';
// import {allUserNotification} from '../../redux/features/masterSlice';
// import moment from 'moment';

// type NotificationsNavigationProp = StackNavigationProp<
//   MainStackParamList,
//   'Notifications'
// >;
// type NotificationsRouteProp = RouteProp<MainStackParamList, 'Notifications'>;

// interface NotificationsScreenProps {
//   navigation: NotificationsNavigationProp;
//   route: NotificationsRouteProp;
// }

// const Notifications: FC<NotificationsScreenProps> = ({navigation, route}) => {
//   const dispatch = useAppDispatch();
//   const {notificationResponse} = useAppSelector(state => state.master);
//   const {userData} = useAppSelector(state => state.auth);

//   useEffect(() => {
//     dispatch(
//       allUserNotification([
//         userData.id,
//         {
//           page: 0,
//           size: 0,
//           type: 'all',
//         },
//       ]),
//     );
//   }, [dispatch, userData.id]);

//   const handleNotificationPress = (templateId: number) => {
//     if ([1, 3, 4, 6].includes(templateId)) {
//       navigation.navigate('FlowsAndFormsStack');
//     } else if ([2, 7, 8, 9].includes(templateId)) {
//       navigation.navigate('Schedules');
//     } else if ([5, 10].includes(templateId)) {
//       navigation.navigate('MyAccount');
//     }
//   };

//   const renderNotificationItem = ({item}: {item: any}) => {
//     moment.updateLocale('en', {
//       relativeTime: {
//         future: 'in %s',
//         past: '%s ago',
//         s: 'a few seconds',
//         m: 'a min',
//         mm: '%d min',
//         h: 'an hour',
//         hh: '%d hours',
//         d: 'a day',
//         dd: '%d days',
//         M: 'a month',
//         MM: '%d months',
//         y: 'a year',
//         yy: '%d years'
//       }
//     });
//     return (
//       <TouchableOpacity onPress={() => handleNotificationPress(item.templateId)}>
//         <View style={styles.notificationItem}>
//           <View style={{flexDirection: 'row'}}>
//             {item.isRead && <View style={styles.notificationDot} />}
//             <Text style={styles.notificationText}>
//               {item.content}
//             </Text>
//           </View>
//           <Text style={styles.notificationTime}>{moment(item.createdDate).fromNow()}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <Layout
//       overridePaddingHorizontal
//       overridePaddingVertical
//       style={styles.layout}
//       icon="notification_icon"
//       titleTransition>
//       <Text size="body4" fontVariant="bold" style={styles.headerText}>
//         Notifications
//       </Text>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>

//         {/* Today Section */}
//         <View style={styles.sectionContainer}>
//           <View style={styles.sectionHeader}>
//             <Text size="body1" fontVariant="bold">
//               Today
//             </Text>
//             <View style={styles.iconContainer}>
//               <Icon name="bell_icon_light" size={20} />
//               <Text size="caption" style={styles.notificationCount}>
//                 {notificationResponse?.dataList?.todayCount}
//               </Text>
//             </View>
//           </View>
//           <FlatList
//             data={notificationResponse?.dataList?.today}
//             renderItem={renderNotificationItem}
//             keyExtractor={item => item.userNotificationId.toString()}
//           />
//         </View>

//         {/* Yesterday Section */}
//         <View style={styles.sectionContainer}>
//           <View style={styles.sectionHeader}>
//             <Text size="body1" fontVariant="bold">
//               Yesterday
//             </Text>
//             <View style={styles.iconContainer}>
//               <Icon name="bell_icon_light" size={20} />
//               <Text size="caption" style={styles.notificationCount}>
//                 {notificationResponse?.dataList?.yesterdayCount}
//               </Text>
//             </View>
//           </View>
//           <FlatList
//             data={notificationResponse?.dataList?.yesterday}
//             renderItem={renderNotificationItem}
//             keyExtractor={item => item.userNotificationId.toString()}
//           />
//         </View>

//         {/* This Week Section */}
//         <View style={styles.sectionContainer}>
//           <View style={styles.sectionHeader}>
//             <Text size="body1" fontVariant="bold">
//               This Week
//             </Text>
//             <View style={styles.iconContainer}>
//               <Icon name="bell_icon_light" size={20} />
//               <Text size="caption" style={styles.notificationCount}>
//                 {notificationResponse?.dataList?.weekCount}
//               </Text>
//             </View>
//           </View>
//           <FlatList
//             data={notificationResponse?.dataList?.week}
//             renderItem={renderNotificationItem}
//             keyExtractor={item => item.userNotificationId.toString()}
//           />
//         </View>

//         {/* This Month Section */}
//         <View style={styles.sectionContainer}>
//           <View style={styles.sectionHeader}>
//             <Text size="body1" fontVariant="bold">
//               This Month
//             </Text>
//             <View style={styles.iconContainer}>
//               <Icon name="bell_icon_light" size={20} />
//               <Text size="caption" style={styles.notificationCount}>
//                 {notificationResponse?.dataList?.monthCount}
//               </Text>
//             </View>
//           </View>
//           <FlatList
//             data={notificationResponse?.dataList?.month}
//             renderItem={renderNotificationItem}
//             keyExtractor={item => item.userNotificationId.toString()}
//           />
//         </View>
//       </ScrollView>
//     </Layout>
//   );
// };

// const styles = StyleSheet.create({
//   layout: {
//     paddingHorizontal: 15,
//   },
//   headerText: {
//     marginBottom: 10,
//     marginTop: 50,
//   },
//   scrollContainer: {
//     paddingBottom: 20,
//   },
//   sectionContainer: {
//     borderColor: '#F4C24A',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 20,
//     padding: 10,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F7FA',
//     borderRadius: 8,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//   },
//   notificationCount: {
//     marginLeft: 5,
//     color: '#4E565F',
//     fontSize: 14,
//   },
//   notificationItem: {
//     backgroundColor: '#FFFFFF',
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 10,
//     borderBottomWidth: 1,
//     borderColor: '#E4E7EB',
//   },
//   notificationText: {
//     color: '#4E565F',
//     marginLeft: 8,
//     fontSize: 14,
//     fontWeight: '600',
//     flex: 1, // To make sure text doesn't overlap
//   },
//   notificationTime: {
//     color: '#A0A0A0',
//     marginTop: 5,
//     fontSize: 12,
//     fontWeight: '500',
//     left: 23,
//   },
//   notificationDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#D62828',
//     marginRight: 10,
//     marginTop: 6,
//   },
// });

// export default Notifications;

import React, {FC, useEffect} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  View,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  allUserNotification,
  readNotification,
} from '../../redux/features/masterSlice';
import moment from 'moment';

type NotificationsNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Notifications'
>;
type NotificationsRouteProp = RouteProp<MainStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsNavigationProp;
  route: NotificationsRouteProp;
}

const Notifications: FC<NotificationsScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();
  const {notificationResponse} = useAppSelector(state => state.master);
  const {userData} = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(
      allUserNotification([
        userData.id,
        {
          page: 0,
          size: 0,
          type: 'all',
        },
      ]),
    );
  }, [dispatch, userData.id]);

  const handleNotificationPress = (
    templateId: number,
    userNotificationId: number,
  ) => {
    dispatch(readNotification(userNotificationId));

    // Navigate based on templateId after marking notification as read
    if ([1, 3, 4, 6].includes(templateId)) {
      navigation.navigate('FlowsAndFormsStack');
    } else if ([2, 7, 8, 9].includes(templateId)) {
      navigation.navigate('Schedules');
    } else if ([5, 10].includes(templateId)) {
      navigation.navigate('MyAccount');
    }
  };

  const renderNotificationItem = ({item}: {item: any}) => {
   
    moment.updateLocale('en', {
      relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a min',
        mm: '%d min',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
      },
    });
    return (
      <TouchableOpacity
        onPress={() =>
          handleNotificationPress(item.templateId, item.userNotificationId)
        }>
        <View style={styles.notificationItem}>
          <View style={{flexDirection: 'row'}}>
            {!item.isRead && <View style={styles.notificationDot} />}
            <Text style={styles.notificationText}>{item.content}</Text>
          </View>
          <Text style={styles.notificationTime}>
            {moment(item.createdDate).fromNow()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={styles.layout}
      icon="notification_icon"
      titleTransition>
      <Text size="body4" fontVariant="bold" style={styles.headerText}>
        Notifications
      </Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Today Section */}
        <View style={styles.sectionContainerToday}>
          <View style={styles.sectionHeader}>
            <Text size="body1" fontVariant="bold">
              Today
            </Text>
            <View style={styles.iconContainer}>
              <Icon name="bell_icon_light" size={20} />
              <Text size="caption" style={styles.notificationCount}>
                {notificationResponse?.dataList?.todayCount}
              </Text>
            </View>
          </View>
          <FlatList
            data={notificationResponse?.dataList?.today}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.userNotificationId.toString()}
          />
        </View>

        {/* Yesterday Section */}
        {/* <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text size="body1" fontVariant="bold">
              Yesterday
            </Text>
            <View style={styles.iconContainer}>
              <Icon name="bell_icon_light" size={20} />
              <Text size="caption" style={styles.notificationCount}>
                {notificationResponse?.dataList?.yesterdayCount}
              </Text>
            </View>
          </View>
          <FlatList
            data={notificationResponse?.dataList?.yesterday}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.userNotificationId.toString()}
          />
        </View> */}

        {/* This Week Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text size="body1" fontVariant="bold">
              This Week
            </Text>
            <View style={styles.iconContainer}>
              <Icon name="bell_icon_light" size={20} />
              <Text size="caption" style={styles.notificationCount}>
                {notificationResponse?.dataList?.weekCount}
              </Text>
            </View>
          </View>
          <FlatList
            data={notificationResponse?.dataList?.week}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.userNotificationId.toString()}
          />
        </View>

        {/* This Month Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text size="body1" fontVariant="bold">
              This Month
            </Text>
            <View style={styles.iconContainer}>
              <Icon name="bell_icon_light" size={20} />
              <Text size="caption" style={styles.notificationCount}>
                {notificationResponse?.dataList?.monthCount}
              </Text>
            </View>
          </View>
          <FlatList
            data={notificationResponse?.dataList?.month}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.userNotificationId.toString()}
          />
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    paddingHorizontal: 15,
  },
  headerText: {
    marginBottom: 15,
    marginTop: 40,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  sectionContainer: {
    borderColor: '#CBD2D9',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  sectionContainerToday:{
    borderColor: '#F4C24A',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  notificationCount: {
    marginLeft: 5,
    color: '#4E565F',
    fontSize: 14,
  },
  notificationItem: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E4E7EB',
  },
  notificationText: {
    color: '#4E565F',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
    flex: 1, // To make sure text doesn't overlap
  },
  notificationTime: {
    color: '#A0A0A0',
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    left: 23,
  },
  notificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D62828',
    marginRight: 10,
    marginTop: 6,
  },
});

export default Notifications;
