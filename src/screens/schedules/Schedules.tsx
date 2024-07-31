// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions, Linking } from 'react-native';
// import { Calendar, Agenda } from 'react-native-calendars';
// import { useAppSelector } from '../../redux/store';
// import Layout from '../../components/Layout';
// import { Drawer } from 'react-native-drawer-layout';
// import { Button } from 'react-native-paper';
// import DrawerContent from '../../components/DrawerContent';
// import colors from '../../config/colors';

// const { width, height } = Dimensions.get('window');

// const CalendarScreen = () => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [view, setView] = useState<'month' | 'week' | 'day'>('month');
//   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
//   const { isLoggedIn } = useAppSelector(state => state.auth);

//   const closeDrawer = () => {
//     setIsDrawerOpen(false);
//   };

//   const openModal = (viewType: 'week' | 'day') => {
//     setView(viewType);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setView('month'); // Reset to month view when the modal is closed
//   };

//   const renderAgendaItem = (item) => (
//     <View style={styles.item}>
//       <Text>{item.name}</Text>
//     </View>
//   );

//   return (
//     <Drawer
//       open={isDrawerOpen}
//       onOpen={() => setIsDrawerOpen(true)}
//       onClose={() => setIsDrawerOpen(false)}
//       renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}
//     >
//       <Layout
//         overridePaddingHorizontal
//         overridePaddingVertical
//         style={{ paddingHorizontal: 15 }}
//         onPressBackArrow={() => {
//           navigation.goBack();
//         }}
//         onPressMenuIcon={() => {
//           setIsDrawerOpen(true);
//         }}
//         dashboard={isLoggedIn}
//         avoidBackButton={isLoggedIn}
//       >
//         <View style={styles.row}>
//           <Text style={styles.title}>Calendar</Text>
//           <Button mode="contained" style={styles.signInButton} onPress={()=>Linking.openURL('https://accounts.google.com/signin/oauth/error/v2?authError=Cg9pbnZhbGlkX3JlcXVlc3QSO1Blcm1pc3Npb24gZGVuaWVkIHRvIGdlbmVyYXRlIGxvZ2luIGhpbnQgZm9yIHRhcmdldCBkb21haW4uIJAD&client_id=52101966786-b6urbdbf1qlruls6v79lcj4lchv3pekg.apps.googleusercontent.com&flowName=GeneralOAuthFlow')}>
//             Sign-In Google
//           </Button>
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity style={styles.viewButton} onPress={() => setView('month')}>
//             <Text style={styles.buttonText}>Month</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.viewButton} onPress={() => openModal('week')}>
//             <Text style={styles.buttonText}>Week</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.viewButton} onPress={() => openModal('day')}>
//             <Text style={styles.buttonText}>Day</Text>
//           </TouchableOpacity>
//         </View>

//         {view === 'month' && (
//           <Calendar
//             onDayPress={(day) => {
//               console.log('selected day', day);
//             }}
//             theme={{
//               calendarBackground: '#ffffff',
//               textSectionTitleColor: '#b6c1cd',
//               selectedDayBackgroundColor: '#00adf5',
//               selectedDayTextColor: '#ffffff',
//               todayTextColor: '#00adf5',
//               dayTextColor: '#2d4150',
//               textDisabledColor: '#d9e1e8',
//               dotColor: '#00adf5',
//               selectedDotColor: '#ffffff',
//               arrowColor: 'orange',
//               monthTextColor: colors.blackColor,
//               indicatorColor: 'blue',
//               textDayFontFamily: 'monospace',
//               textMonthFontFamily: 'monospace',
//               textDayHeaderFontFamily: 'monospace',
//               textDayFontWeight: '300',
//               textMonthFontWeight: 'bold',
//               textDayHeaderFontWeight: '300',
//               textDayFontSize: 16,
//               textMonthFontSize: 16,
//               textDayHeaderFontSize: 16
//             }}
//           />
//         )}

//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalVisible}
//           onRequestClose={closeModal}
//         >
//           <View style={styles.modalView}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalText}>{view.charAt(0).toUpperCase() + view.slice(1)} View</Text>
//               <Button mode="contained" style={styles.closeButton} onPress={closeModal}>
//                 Close
//               </Button>
//             </View>
//             <Agenda
//               items={{
//                 '2024-07-28': [{ name: 'item 1 - any js object' }],
//                 '2024-07-29': [{ name: 'item 2 - any js object' }],
//                 '2024-07-30': [],
//                 '2024-07-31': [{ name: 'item 3 - any js object' }, { name: 'any js object' }]
//               }}
//               renderItem={renderAgendaItem}
//               style={styles.agenda}
//             />
//           </View>
//         </Modal>
//       </Layout>
//     </Drawer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff'
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//     //backgroundColor:"red"
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginTop: 20,
//     color:colors.blackColor
//   },
//   signInButton: {
//     backgroundColor:"#F4C24A",
//     marginTop: 20,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   viewButton: {
//     padding: 10,
//     backgroundColor: '#F4C24A',
//     borderRadius: 5,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   modalView: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     width: width,
//     height: height,
//     padding: 10,
//   },
//   modalHeader: {
//     width: '100%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   modalText: {
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
//   closeButton: {
//     backgroundColor: '#F4C24A',
//   },
//   agenda: {
//     width: '100%',
//   },
//   item: {
//     backgroundColor: 'white',
//     flex: 1,
//     borderRadius: 5,
//     padding: 10,
//     marginRight: 10,
//     marginTop: 17,
//   },
// });

// export default CalendarScreen;
import React, { useEffect, useState } from 'react';
import { Button, TouchableOpacity, View } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
//import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import moment from 'moment';
import RNCalendarEvents from 'react-native-calendar-events';
import Text from '../../components/Text';
//import { check, PERMISSIONS, requestMultiple } from 'react-native-permissions';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
  webClientId: 'YOUR_WEB_CLIENT_ID',
});

const GoogleSignInComponent = () => {
  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/calendar.events'],
      webClientId: 'YOUR_WEB_CLIENT_ID',
    });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      //const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
     // await auth().signInWithCredential(googleCredential);
      console.log('User signed in with Google:', userInfo);
    } catch (error) {
     // if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
    //  } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign-in is in progress already');
     // } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services are not available');
     // } else {
        console.error(error);
      }
    }
  //};

  return (
    <View>
      <Button title="Sign in with Google" onPress={signIn} />
    </View>
  );
};



const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
   // requestPermissions();
  }, []);

  // const requestPermissions = async () => {
  //   const statuses = await requestMultiple([
  //     PERMISSIONS.ANDROID.READ_CALENDAR,
  //     PERMISSIONS.ANDROID.WRITE_CALENDAR,
  //     PERMISSIONS.IOS.CALENDARS,
  //   ]);
  //   if (
  //     statuses[PERMISSIONS.ANDROID.READ_CALENDAR] === 'granted' &&
  //     statuses[PERMISSIONS.ANDROID.WRITE_CALENDAR] === 'granted'
  //   ) {
  //     fetchEvents();
  //   }
  // };

  const fetchEvents = async () => {
    const start = moment(selectedDate).startOf('day').toISOString();
    const end = moment(selectedDate).endOf('day').toISOString();
    try {
      const events = await RNCalendarEvents.fetchAllEvents(start, end);
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events: ', error);
    }
  };

  const createGoogleCalendarEvent = async () => {
    const user = await GoogleSignin.getCurrentUser();
    const accessToken = (await GoogleSignin.getTokens()).accessToken;

    const event = {
      summary: 'Google Meet with Client',
      description: 'Discuss project requirements and deliverables',
      start: {
        dateTime: moment(selectedDate).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: moment(selectedDate).add(1, 'hours').toISOString(),
        timeZone: 'UTC',
      },
      conferenceData: {
        createRequest: {
          requestId: 'sample123',
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
      attendees: [
        { email: 'user@example.com' },
      ],
    };

    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        event,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Event created: ', response.data);
      Alert.alert('Success', 'Event created and invitation sent!');
    } catch (error) {
      console.error('Error creating event: ', error.response.data);
      Alert.alert('Error', 'Could not create event. Please try again.');
    }
  };

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    fetchEvents();
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <GoogleSignInComponent />
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true },
        }}
      />
      <TouchableOpacity style={{ marginTop: 20 }} onPress={createGoogleCalendarEvent}>
        <Text>Create Event</Text>
      </TouchableOpacity>
      <View>
        {events.map((event, index) => (
          <View key={index}>
            <Text>{event.title}</Text>
            <Text>{moment(event.startDate).format('MMMM Do YYYY, h:mm:ss a')}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ScheduleScreen;
