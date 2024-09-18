import React, {FC, useState, useEffect, useRef} from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import Text from './Text';
import Icon from './Icon';
import colors from '../config/colors';
import TextInput from './TextInput';
import CalendarPicker from './EventCalandar';
import moment from 'moment';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import endPoints from '../config/endPoints';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {createNotification} from '../redux/features/masterSlice';
import {color} from '@rneui/themed/dist/config';

interface EventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (eventData: any) => void;
}

const EventModal: FC<EventModalProps> = ({isVisible, onClose, onSave}) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [repeatOption, setRepeatOption] = useState('Does not repeat');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newEventGuests, setNewEventGuests] = useState<string[]>([]);
  const [videoConferencing, setVideoConferencing] = useState('');
  const [description, setDescription] = useState('');
  const [attachments, setAttachments] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [activeDateSetter, setActiveDateSetter] = useState<
    'startDate' | 'endDate'
  >('startDate');
  const [isClickedStartTime, setIsClickedStartTime] = useState(false);
  const [isClickedEndTime, setIsClickedEndTime] = useState(false);
  const {userData} = useAppSelector(state => state.auth);
  const scrollViewRef = useRef<ScrollView>(null); // Ref for ScrollView
  const [dropdownPosition, setDropdownPosition] = useState<number>(0);

  useEffect(() => {
    if (!isVisible) {
      // Reset the modal state when it is closed
      clearEventForm();
    } else {
      // Initialize default values when the modal is opened
      const now = moment();
      setStartDate(now.format('dddd, MMM D'));
      setEndDate(now.format('dddd, MMM D'));
      setStartTime(now.format('hh:mm A'));
      setEndTime(now.add(1, 'hour').format('hh:mm A'));
    }
  }, [isVisible]);

  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState);
    setAllDay(!allDay); // Toggle the allDay state
    if (!allDay) {
      // If switching to all-day
      setStartTime('');
      setEndTime('');
    }
  };

  const generateTimeOptions = () => {
    const timeOptions = [];

    for (let i = 0; i < 24 * 4; i++) {
      const timeSlot = moment()
        .startOf('day')
        .add(i * 15, 'minutes');
      const formattedTime = timeSlot.format('hh:mm A');
      timeOptions.push({label: formattedTime, value: formattedTime});
    }

    return timeOptions;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (time: string) => {
    if (isClickedStartTime) {
      setStartTime(time);
      setIsClickedStartTime(false);
    } else if (isClickedEndTime) {
      setEndTime(time);
      setIsClickedEndTime(false);
    }
    setSelectedTime(time);
  };

  const handleAddGuest = () => {
    if (newGuestEmail.trim() !== '') {
      setNewEventGuests([...newEventGuests, newGuestEmail]);
      setNewGuestEmail('');
    }
  };

  const handleRemoveGuest = (email: string) => {
    setNewEventGuests(newEventGuests.filter(guest => guest !== email));
  };

  const handleEmailChange = (email: string) => {
    setNewGuestEmail(email);
  };

  const validateAndAddGuest = () => {
    if (validateEmail(newGuestEmail)) {
      handleAddGuest();
    }
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const renderTimeOption = ({item}) => (
    <TouchableOpacity
      style={[
        styles.timeOption,
        selectedTime === item.value && styles.selectedTimeOption,
      ]}
      onPress={() => handleTimeSelect(item.value)}>
      <Text style={styles.timeOptionText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdownItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        setRepeatOption(item);
        setIsDropdownOpen(false);
      }}>
      <Text style={styles.dropdownItemText}>{item}</Text>
    </TouchableOpacity>
  );

  const repeatOptions = ['Daily', 'Weekly', 'Monthly', 'Annually', 'Custom'];
  //   const handleSave = () => {
  //     if (title && startDate && endDate && newEventGuests.length > 0 && description) {
  //         const eventData = {
  //             title,
  //             allDay,
  //             startDate,
  //             endDate,
  //             startTime,
  //             endTime,
  //             repeatOption,
  //             guests: newEventGuests,
  //             videoConferencing,
  //             description,
  //             attachments,
  //         };
  //         onSave(eventData);
  //         onClose();
  //     } else {
  //         // Show error or toast message
  //         console.log('Please fill in all required fields.');
  //     }
  // };

  // const handleSave = async () => {
  //   if (title && startDate && endDate && newEventGuests.length > 0 && description) {
  //     const token = await AsyncStorage.getItem('accessToken'); // Retrieve the access token
  //     if (!token) {
  //       console.log('No access token found. Please sign in.');
  //       return;
  //     }

  //     const eventStartDateTime = moment(`${startDate} ${startTime}`, 'dddd, MMM D hh:mm A').toISOString();
  //     const eventEndDateTime = moment(`${endDate} ${endTime}`, 'dddd, MMM D hh:mm A').toISOString();

  //     const eventData = {
  //       summary: title,
  //       description,
  //       start: {
  //         dateTime: eventStartDateTime,
  //         timeZone: 'Asia/Kolkata', // Set your timezone
  //       },
  //       end: {
  //         dateTime: eventEndDateTime,
  //         timeZone: 'Asia/Kolkata', // Set your timezone
  //       },
  //       attendees: newEventGuests.map(email => ({ email })),
  //       conferenceData: {
  //         createRequest: {
  //           requestId: 'sample123',
  //           conferenceSolutionKey: { type: 'hangoutsMeet' },
  //         },
  //       },
  //     };

  //     try {
  //       await axios.post(
  //         'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
  //         eventData,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       console.log('Event created successfully');
  //       onClose(); // Close the modal after saving the event
  //     } catch (error) {
  //       console.error('Error creating event:', error.response?.data || error.message);
  //     }
  //   } else {
  //     console.log('Please fill in all required fields.');
  //   }
  // };
  // const handleSave = async () => {
  //   if (!title || !startDate || !endDate || !newEventGuests.length || !description) {
  //     console.log('Please fill in all required fields.');
  //     return;
  //   }

  //   const token = await AsyncStorage.getItem('accessToken');
  //   if (!token) {
  //     console.log('No access token found. Please sign in.');
  //     return;
  //   }

  //   try {
  //     // Ensure startDate and endDate are correctly formatted as valid dates
  //     const eventStartDate = moment(startDate, 'dddd, MMM D').format('YYYY-MM-DD');
  //     const eventEndDate = moment(endDate, 'dddd, MMM D').format('YYYY-MM-DD');

  //     let eventData;

  //     if (allDay) {
  //       // For all-day events, pass only the date
  //       eventData = {
  //         summary: title,
  //         description,
  //         start: { date: eventStartDate },
  //         end: { date: eventEndDate },
  //         attendees: newEventGuests.map(email => ({ email })),
  //         recurrence: getRecurrenceRule(repeatOption),
  //       };
  //     } else {
  //       // For timed events, pass both date and time
  //       const eventStartDateTime = moment(`${startDate} ${startTime}`, 'dddd, MMM D hh:mm A').toISOString();
  //       const eventEndDateTime = moment(`${endDate} ${endTime}`, 'dddd, MMM D hh:mm A').toISOString();

  //       eventData = {
  //         summary: title,
  //         description,
  //         start: { dateTime: eventStartDateTime, timeZone: 'Asia/Kolkata' },
  //         end: { dateTime: eventEndDateTime, timeZone: 'Asia/Kolkata' },
  //         attendees: newEventGuests.map(email => ({ email })),
  //         recurrence: getRecurrenceRule(repeatOption),
  //       };
  //     }

  //     // Log the event data to check its structure
  //     console.log('Event Data:', JSON.stringify(eventData, null, 2));

  //     const response = await axios.post(
  //       'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
  //       eventData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     ToastAndroid.show('Event created successfully', ToastAndroid.SHORT);
  //     console.log('Event created successfully:', response.data);

  //     // Clear all the input fields
  //     clearEventForm();
  //     onClose(); // Close the modal after saving the event
  //   } catch (error) {
  //     console.error('Error creating event:', error.response?.data || error.message);
  //   }
  // };
  // const handleSave = async () => {
  //   if (!title || !startDate || !endDate) {
  //     console.log('Please fill in all required fields.');
  //     return;
  //   }

  //   const token = await AsyncStorage.getItem('accessToken');
  //   if (!token) {
  //     console.log('No access token found. Please sign in.');
  //     return;
  //   }

  //   let eventData;

  //   if (allDay) {
  //     const eventStartDate = moment(startDate, 'dddd, MMM D').format(
  //       'YYYY-MM-DD',
  //     );
  //     const eventEndDate = moment(endDate, 'dddd, MMM D').format('YYYY-MM-DD');

  //     eventData = {
  //       summary: title,
  //       description,
  //       start: {date: eventStartDate},
  //       end: {date: eventEndDate},
  //       attendees: newEventGuests.map(email => ({email})),
  //       conferenceData: {
  //         createRequest: {
  //           requestId: Math.random().toString(36).substring(2, 15),
  //           conferenceSolutionKey: {type: 'hangoutsMeet'},
  //           status: {statusCode: 'success'},
  //         },
  //       },
  //     };
  //   } else {
  //     const eventStartDateTime = moment(
  //       `${startDate} ${startTime}`,
  //       'dddd, MMM D hh:mm A',
  //     ).toISOString();
  //     const eventEndDateTime = moment(
  //       `${endDate} ${endTime}`,
  //       'dddd, MMM D hh:mm A',
  //     ).toISOString();

  //     eventData = {
  //       summary: title,
  //       description,
  //       start: {dateTime: eventStartDateTime, timeZone: 'Asia/Kolkata'},
  //       end: {dateTime: eventEndDateTime, timeZone: 'Asia/Kolkata'},
  //       attendees: newEventGuests.map(email => ({email})),
  //       recurrence: getRecurrenceRule(repeatOption),
  //       conferenceData: {
  //         createRequest: {
  //           requestId: Math.random().toString(36).substring(2, 15),
  //           conferenceSolutionKey: {type: 'hangoutsMeet'},
  //           status: {statusCode: 'success'},
  //         },
  //       },
  //     };
  //   }

  //   try {
  //     const response = await axios.post(
  //       'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
  //       eventData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     ToastAndroid.show('Event created successfully', ToastAndroid.SHORT);

  //     // Refresh events list
  //     await refreshEventsList();

  //     clearEventForm();
  //     onClose();
  //   } catch (error) {
  //     console.error(
  //       'Error creating event:',
  //       error.response?.data || error.message,
  //     );
  //   }
  // };
  const handleSave = async () => {
    if (!title || !startDate || !endDate) {
      console.log('Please fill in all required fields.');
      return;
    }

    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      console.log('No access token found. Please sign in.');
      return;
    }

    let eventData;
    let startDateTime, endDateTime;

    if (allDay) {
      const eventStartDate = moment(startDate, 'dddd, MMM D').format(
        'YYYY-MM-DD',
      );
      const eventEndDate = moment(endDate, 'dddd, MMM D').format('YYYY-MM-DD');

      eventData = {
        summary: title,
        description,
        start: {date: eventStartDate},
        end: {date: eventEndDate},
        attendees: newEventGuests.map(email => ({email})),
        conferenceData: {
          createRequest: {
            requestId: Math.random().toString(36).substring(2, 15),
            conferenceSolutionKey: {type: 'hangoutsMeet'},
            status: {statusCode: 'success'},
          },
        },
      };

      // Since it's an all-day event, set the time to midnight
      startDateTime = moment(eventStartDate).toISOString();
      endDateTime = moment(eventEndDate).toISOString();
    } else {
      startDateTime = moment(
        `${startDate} ${startTime}`,
        'dddd, MMM D hh:mm A',
      ).toISOString();
      endDateTime = moment(
        `${endDate} ${endTime}`,
        'dddd, MMM D hh:mm A',
      ).toISOString();

      eventData = {
        summary: title,
        description,
        start: {dateTime: startDateTime, timeZone: 'Asia/Kolkata'},
        end: {dateTime: endDateTime, timeZone: 'Asia/Kolkata'},
        attendees: newEventGuests.map(email => ({email})),
        recurrence: getRecurrenceRule(repeatOption),
        conferenceData: {
          createRequest: {
            requestId: Math.random().toString(36).substring(2, 15),
            conferenceSolutionKey: {type: 'hangoutsMeet'},
            status: {statusCode: 'success'},
          },
        },
      };
    }

    try {
      const response = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      ToastAndroid.show('Event created successfully', ToastAndroid.SHORT);

      // Extract the conference URL from the response
      const eventUrl = response.data.hangoutLink;

      // Prepare notification payload
      const notificationPayload = {
        userId: userData.id, // Assuming userData has user ID
        startDateTime: startDateTime
          ? moment(startDateTime).format('YYYY-MM-DDTHH:mm:ss')
          : moment().format('YYYY-MM-DDTHH:mm:ss'),
        endDateTime: endDateTime
          ? moment(endDateTime).format('YYYY-MM-DDTHH:mm:ss')
          : moment().format('YYYY-MM-DDTHH:mm:ss'),
        emailList: newEventGuests.map(email => email),
        title: title,
      };

      // Call the notification API

      dispatch(createNotification([notificationPayload]));

      // Refresh events list
      await refreshEventsList();

      clearEventForm();
      onClose();
    } catch (error) {
      console.error(
        'Error creating event:',
        error.response?.data || error.message,
      );
    }
  };

  const refreshEventsList = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const events = response.data.items;
      // Assuming you have a function to update your UI with the latest events
      updateEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const clearEventForm = () => {
    setTitle('');
    setAllDay(false);
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('');
    setNewEventGuests([]);
    setDescription('');
    setIsEnabled(false);
    setIsClickedStartTime(false);
    setIsClickedEndTime(false);
    setRepeatOption('Does not repeat');
  };

  const getRecurrenceRule = repeatOption => {
    switch (repeatOption) {
      case 'Daily':
        return ['RRULE:FREQ=DAILY'];
      case 'Weekly':
        return ['RRULE:FREQ=WEEKLY'];
      case 'Monthly':
        return ['RRULE:FREQ=MONTHLY'];
      case 'Annually':
        return ['RRULE:FREQ=YEARLY'];
      default:
        return [];
    }
  };

  const isSaveEnabled = title && startDate && endDate;

  const handleDateChange = (startDate: string, endDate: string) => {
    if (activeDateSetter === 'startDate') {
      setStartDate(moment(startDate).format('dddd, MMM D'));
    } else {
      setEndDate(moment(endDate).format('dddd, MMM D'));
    }
    setShowCalendar(false);
  };

  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text size="body2" fontVariant="bold">
              Create Event
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="cross_icon_thin" width={20} height={20} />
            </TouchableOpacity>
          </View>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            ref={scrollViewRef}>
            <TextInput
              placeholder="Add Title"
              value={title}
              onChangeText={setTitle}
            />

            <View style={styles.row}>
              <Icon name="event_clock_Icon" size={20} style={styles.icon} />
              <Text style={styles.allDayText}>All day</Text>
              <Switch
                onValueChange={toggleSwitch}
                value={isEnabled}
                trackColor={{
                  false: colors.borderColor,
                  true: colors.primaryColor,
                }}
                thumbColor={'#FFFFFF'}
                ios_backgroundColor="#3e3e3e"
              />
            </View>

            <View style={styles.dateTimeContainer}>
              <View style={styles.dateTimeRow}>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => {
                    setActiveDateSetter('startDate');
                    setShowCalendar(true);
                  }}>
                  <Text style={styles.dateText}>
                    {startDate || 'Start Date'}
                  </Text>
                </TouchableOpacity>
                {!allDay && (
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setIsClickedStartTime(!isClickedStartTime)}>
                    <Text style={styles.timeText}>
                      {startTime || 'Start Time'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.dateTimeRow}>
                {!allDay && (
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => {
                      setActiveDateSetter('endDate');
                      setShowCalendar(true);
                    }}>
                    <Text style={styles.dateText}>{endDate || 'End Date'}</Text>
                  </TouchableOpacity>
                )}
                {!allDay && (
                  <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setIsClickedEndTime(!isClickedEndTime)}>
                    <Text style={styles.timeText}>{endTime || 'End Time'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {isClickedStartTime && (
              <View style={[styles.timeDropdown, {top: 150}]}>
                <FlatList
                  data={timeOptions}
                  renderItem={renderTimeOption}
                  keyExtractor={item => item.value}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            {isClickedEndTime && (
              <View style={[styles.timeDropdown, {top: 176}]}>
                <FlatList
                  data={timeOptions}
                  renderItem={renderTimeOption}
                  keyExtractor={item => item.value}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            )}

            <TextInput
              placeholder="Add Guest Email"
              value={newGuestEmail}
              onChangeText={handleEmailChange}
              onBlur={validateAndAddGuest}
            />

            <FlatList
              data={newEventGuests}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <View style={styles.guestItem}>
                  <Text style={styles.guestEmailText}>{item}</Text>
                  <TouchableOpacity onPress={() => handleRemoveGuest(item)}>
                    <Icon name="cross_icon" width={10} height={10} />
                  </TouchableOpacity>
                </View>
              )}
              numColumns={2} // Display items in two columns
              contentContainerStyle={styles.container}
              columnWrapperStyle={styles.columnWrapper} // Style for the row
            />

            {/* <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                <Icon name="refresh_icon" style={styles.leftIcon} />
                <Text style={styles.dropdownText}>{repeatOption}</Text>
                <Icon
                  name="down_arrow_icon"
                  size={20}
                  style={styles.rightIcon}
                />
              </TouchableOpacity>
              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  <FlatList
                    data={repeatOptions}
                    renderItem={renderDropdownItem}
                    keyExtractor={item => item}
                  />
                </View>
              )}
            </View> */}
            <View
              style={styles.dropdownContainer}
              onLayout={event => {
                const {y} = event.nativeEvent.layout;
                setDropdownPosition(y); // Capture dropdown position
              }}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  if (!isDropdownOpen) {
                    // Scroll to the dropdown when opened
                    scrollViewRef.current?.scrollTo({
                      y: dropdownPosition, // Position where the dropdown is located
                      animated: true,
                    });
                  }
                }}>
                <Icon name="refresh_icon" style={styles.leftIcon} />
                <Text style={styles.dropdownText}>{repeatOption}</Text>
                <Icon
                  name="down_arrow_icon"
                  size={20}
                  style={styles.rightIcon}
                />
              </TouchableOpacity>

              {isDropdownOpen && (
                <View style={styles.dropdownList}>
                  <FlatList
                    data={repeatOptions}
                    renderItem={renderDropdownItem}
                    keyExtractor={item => item}
                    contentContainerStyle={{maxHeight: 200}} // Limit height to prevent overlap
                  />
                </View>
              )}
            </View>

            {!isDropdownOpen && <TextInput
              placeholder="Add description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />}

            <TouchableOpacity
              style={[
                styles.saveButton,
                !isSaveEnabled && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={!isSaveEnabled}>
              <Text style={{color: !isSaveEnabled ? '#CBD2D9' : '#FFFFFF'}}>
                {/* styles.saveButtonText,
                  !isSaveEnabled && styles.saveButtonTextDisabled, */}
                Save
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {showCalendar && (
        <CalendarPicker
          visible={showCalendar}
          onDateChange={handleDateChange}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  // overlay: {
  //   position: 'absolute',
  //   top: 0,
  //   bottom: 0,
  //   left: 0,
  //   right: 0,
  //   backgroundColor: 'rgba(0,0,0,0.5)',
  // },
  // modalContainer: {
  //   flex: 1,
  //   // justifyContent: 'center',
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   // marginVertical: 80,
  // },
  // contentContainer: {
  //   paddingHorizontal: 10,
  //   paddingVertical: 15,
  // },
  // modalContent: {
  //   backgroundColor: colors.backgroundColor,
  //   borderRadius: 20,
  //   width: '100%',
  // },
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  columnWrapper: {
    justifyContent: 'space-between', // Distribute items evenly
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginVertical: 80,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    width: '100%',
  },
  header: {
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  allDayText: {
    flex: 1,
    fontSize: 16,
    color: colors.blackColor,
  },
  dateTimeContainer: {
    marginBottom: 15,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  dateButton: {
    padding: 2,
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  timeButton: {
    padding: 2,
    borderBottomColor: colors.borderColor,
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  dateText: {
    fontSize: 16,
    color: colors.blackColor,
  },
  timeText: {
    fontSize: 16,
    color: colors.blackColor,
  },
  timeDropdown: {
    position: 'absolute',
    left: '77%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    height: 200, // Set height to make it scrollable
    width: 120,
  },
  timeOption: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  timeOptionText: {
    fontSize: 16,
    color: colors.blackColor,
  },
  selectedTimeOption: {
    backgroundColor: '#F4C24A',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderColor: '#ABB4BD',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  leftIcon: {
    marginRight: 10,
  },
  dropdownText: {
    flex: 1,
    color: '#1F2933',
    fontSize: 16,
  },
  rightIcon: {
    marginLeft: 10,
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EB',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#1F2933',
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#FCEBC5',
    borderColor: '#F4C24A',
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
    marginRight: 5,
    width: normaliseDesigns(150),
    right: normaliseDesigns(12),
  },
  guestEmailText: {
    color: colors.blackColor,
    fontSize: 12,
    marginRight: 10,
  },
  guestListContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  // saveButton: {
  //   backgroundColor: colors.primaryColor,
  //   borderRadius: 8,
  //   paddingVertical: 15,
  //   alignItems: 'center',
  //   marginTop: 20,
  // },
  // saveButtonText: {
  //   color: '#fff',
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
  saveButton: {
    backgroundColor: colors.primaryColor,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#FDF0E3', // or any color indicating disabled state
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#CBD2D9',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default EventModal;
// import React, { FC, useState, useEffect, useRef } from 'react';
// import {
//   Modal as RNModal,
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
//   Switch,
//   ToastAndroid,
//   ScrollView,
// } from 'react-native';
// import Text from './Text';
// import Icon from './Icon';
// import colors from '../config/colors';
// import TextInput from './TextInput';
// import CalendarPicker from './EventCalandar';
// import moment from 'moment';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import endPoints from '../config/endPoints';
// import { useAppDispatch, useAppSelector } from '../redux/store';
// import { createNotification } from '../redux/features/masterSlice';

// interface EventModalProps {
//   isVisible: boolean;
//   onClose: () => void;
//   onSave: (eventData: any) => void;
// }

// const EventModal: FC<EventModalProps> = ({ isVisible, onClose, onSave }) => {
//   const dispatch = useAppDispatch();
//   const [title, setTitle] = useState('');
//   const [allDay, setAllDay] = useState(false);
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [repeatOption, setRepeatOption] = useState('Does not repeat');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [newGuestEmail, setNewGuestEmail] = useState('');
//   const [newEventGuests, setNewEventGuests] = useState<string[]>([]);
//   const [description, setDescription] = useState('');
//   const [isEnabled, setIsEnabled] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [activeDateSetter, setActiveDateSetter] = useState<
//     'startDate' | 'endDate'
//   >('startDate');
//   const [isClickedStartTime, setIsClickedStartTime] = useState(false);
//   const [isClickedEndTime, setIsClickedEndTime] = useState(false);
//   const { userData } = useAppSelector(state => state.auth);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const [dropdownPosition, setDropdownPosition] = useState<number>(0);

//   useEffect(() => {
//     if (!isVisible) {
//       clearEventForm();
//     } else {
//       const now = moment();
//       setStartDate(now.format('dddd, MMM D'));
//       setEndDate(now.format('dddd, MMM D'));
//       setStartTime(now.format('hh:mm A'));
//       setEndTime(now.add(1, 'hour').format('hh:mm A'));
//     }
//   }, [isVisible]);

//   const toggleSwitch = () => {
//     setIsEnabled(previousState => !previousState);
//     setAllDay(!allDay);
//     if (!allDay) {
//       setStartTime('');
//       setEndTime('');
//     }
//   };

//   const generateTimeOptions = () => {
//     const timeOptions = [];

//     for (let i = 0; i < 24 * 4; i++) {
//       const timeSlot = moment()
//         .startOf('day')
//         .add(i * 15, 'minutes');
//       const formattedTime = timeSlot.format('hh:mm A');
//       timeOptions.push({ label: formattedTime, value: formattedTime });
//     }

//     return timeOptions;
//   };

//   const timeOptions = generateTimeOptions();

//   const handleTimeSelect = (time: string) => {
//     if (isClickedStartTime) {
//       setStartTime(time);
//       setIsClickedStartTime(false);
//     } else if (isClickedEndTime) {
//       setEndTime(time);
//       setIsClickedEndTime(false);
//     }
//     setSelectedTime(time);
//   };

//   const handleAddGuest = () => {
//     if (newGuestEmail.trim() !== '') {
//       setNewEventGuests([...newEventGuests, newGuestEmail]);
//       setNewGuestEmail('');
//     }
//   };

//   const handleRemoveGuest = (email: string) => {
//     setNewEventGuests(newEventGuests.filter(guest => guest !== email));
//   };

//   const handleEmailChange = (email: string) => {
//     setNewGuestEmail(email);
//   };

//   const validateAndAddGuest = () => {
//     if (validateEmail(newGuestEmail)) {
//       handleAddGuest();
//     }
//   };

//   const validateEmail = (email: string) => {
//     const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailPattern.test(email);
//   };

//   const renderTimeOption = ({ item }) => (
//     <TouchableOpacity
//       style={[
//         styles.timeOption,
//         selectedTime === item.value && styles.selectedTimeOption,
//       ]}
//       onPress={() => handleTimeSelect(item.value)}
//     >
//       <Text style={styles.timeOptionText}>{item.label}</Text>
//     </TouchableOpacity>
//   );

//   const renderDropdownItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.dropdownItem}
//       onPress={() => {
//         setRepeatOption(item);
//         setIsDropdownOpen(false);
//       }}
//     >
//       <Text style={styles.dropdownItemText}>{item}</Text>
//     </TouchableOpacity>
//   );

//   const repeatOptions = ['Daily', 'Weekly', 'Monthly', 'Annually', 'Custom'];

//   const handleSave = async () => {
//     if (!title || !startDate || !endDate) {
//       console.log('Please fill in all required fields.');
//       return;
//     }

//     const token = await AsyncStorage.getItem('accessToken');
//     if (!token) {
//       console.log('No access token found. Please sign in.');
//       return;
//     }

//     let eventData;
//     let startDateTime, endDateTime;

//     if (allDay) {
//       const eventStartDate = moment(startDate, 'dddd, MMM D').format(
//         'YYYY-MM-DD'
//       );
//       const eventEndDate = moment(endDate, 'dddd, MMM D').format('YYYY-MM-DD');

//       eventData = {
//         summary: title,
//         description,
//         start: { date: eventStartDate },
//         end: { date: eventEndDate },
//         attendees: newEventGuests.map(email => ({ email })),
//       };

//       startDateTime = moment(eventStartDate).toISOString();
//       endDateTime = moment(eventEndDate).toISOString();
//     } else {
//       startDateTime = moment(
//         `${startDate} ${startTime}`,
//         'dddd, MMM D hh:mm A'
//       ).toISOString();
//       endDateTime = moment(
//         `${endDate} ${endTime}`,
//         'dddd, MMM D hh:mm A'
//       ).toISOString();

//       eventData = {
//         summary: title,
//         description,
//         start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
//         end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' },
//         attendees: newEventGuests.map(email => ({ email })),
//         recurrence: getRecurrenceRule(repeatOption),
//       };
//     }

//     try {
//       await axios.post(
//         'https://www.googleapis.com/calendar/v3/calendars/primary/events',
//         eventData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       ToastAndroid.show('Event created successfully', ToastAndroid.SHORT);
//       clearEventForm();
//       onClose();
//     } catch (error) {
//       console.error('Error creating event:', error.response?.data || error.message);
//     }
//   };

//   const getRecurrenceRule = (repeatOption: string) => {
//     switch (repeatOption) {
//       case 'Daily':
//         return ['RRULE:FREQ=DAILY'];
//       case 'Weekly':
//         return ['RRULE:FREQ=WEEKLY'];
//       case 'Monthly':
//         return ['RRULE:FREQ=MONTHLY'];
//       case 'Annually':
//         return ['RRULE:FREQ=YEARLY'];
//       default:
//         return [];
//     }
//   };

//   const isSaveEnabled = title && startDate && endDate;

//   const handleDateChange = (date: string) => {
//     if (activeDateSetter === 'startDate') {
//       setStartDate(moment(date).format('dddd, MMM D'));
//     } else {
//       setEndDate(moment(date).format('dddd, MMM D'));
//     }
//     setShowCalendar(false);
//   };

//   return (
//     <RNModal visible={isVisible} animationType="slide" transparent>
//       <View style={styles.overlay} />
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <View style={styles.header}>
//             <Text size="body2" fontVariant="bold">
//               Create Event
//             </Text>
//             <TouchableOpacity onPress={onClose}>
//               <Icon name="cross_icon_thin" width={20} height={20} />
//             </TouchableOpacity>
//           </View>
//           <ScrollView
//             contentContainerStyle={styles.contentContainer}
//             ref={scrollViewRef}
//           >
//             <TextInput
//               placeholder="Add Title"
//               value={title}
//               onChangeText={setTitle}
//             />

//             <View style={styles.row}>
//               <Icon name="event_clock_Icon" size={20} style={styles.icon} />
//               <Text style={styles.allDayText}>All day</Text>
//               <Switch
//                 onValueChange={toggleSwitch}
//                 value={isEnabled}
//                 trackColor={{
//                   false: colors.borderColor,
//                   true: colors.primaryColor,
//                 }}
//                 thumbColor={'#FFFFFF'}
//               />
//             </View>

//             <View style={styles.dateTimeContainer}>
//               <View style={styles.dateTimeRow}>
//                 <TouchableOpacity
//                   style={styles.dateButton}
//                   onPress={() => {
//                     setActiveDateSetter('startDate');
//                     setShowCalendar(true);
//                   }}
//                 >
//                   <Text style={styles.dateText}>
//                     {startDate || 'Start Date'}
//                   </Text>
//                 </TouchableOpacity>
//                 {!allDay && (
//                   <TouchableOpacity
//                     style={styles.timeButton}
//                     onPress={() => setIsClickedStartTime(!isClickedStartTime)}
//                   >
//                     <Text style={styles.timeText}>
//                       {startTime || 'Start Time'}
//                     </Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//               <View style={styles.dateTimeRow}>
//                 {!allDay && (
//                   <TouchableOpacity
//                     style={styles.dateButton}
//                     onPress={() => {
//                       setActiveDateSetter('endDate');
//                       setShowCalendar(true);
//                     }}
//                   >
//                     <Text style={styles.dateText}>{endDate || 'End Date'}</Text>
//                   </TouchableOpacity>
//                 )}
//                 {!allDay && (
//                   <TouchableOpacity
//                     style={styles.timeButton}
//                     onPress={() => setIsClickedEndTime(!isClickedEndTime)}
//                   >
//                     <Text style={styles.timeText}>{endTime || 'End Time'}</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             </View>

//             {isClickedStartTime && (
//               <View style={[styles.timeDropdown, { top: 150 }]}>
//                 <FlatList
//                   data={timeOptions}
//                   renderItem={renderTimeOption}
//                   keyExtractor={item => item.value}
//                   showsVerticalScrollIndicator={false}
//                 />
//               </View>
//             )}

//             {isClickedEndTime && (
//               <View style={[styles.timeDropdown, { top: 176 }]}>
//                 <FlatList
//                   data={timeOptions}
//                   renderItem={renderTimeOption}
//                   keyExtractor={item => item.value}
//                   showsVerticalScrollIndicator={false}
//                 />
//               </View>
//             )}

//             <TextInput
//               placeholder="Add Guest Email"
//               value={newGuestEmail}
//               onChangeText={handleEmailChange}
//               onBlur={validateAndAddGuest}
//             />

//             <FlatList
//               data={newEventGuests}
//               keyExtractor={item => item}
//               renderItem={({ item }) => (
//                 <View style={styles.guestItem}>
//                   <Text style={styles.guestEmailText}>{item}</Text>
//                   <TouchableOpacity onPress={() => handleRemoveGuest(item)}>
//                     <Icon name="cross_icon" width={10} height={10} />
//                   </TouchableOpacity>
//                 </View>
//               )}
//               numColumns={2}
//               contentContainerStyle={styles.container}
//               columnWrapperStyle={styles.columnWrapper}
//             />

//             <View
//               style={styles.dropdownContainer}
//               onLayout={event => {
//                 const { y } = event.nativeEvent.layout;
//                 setDropdownPosition(y);
//               }}
//             >
//               <TouchableOpacity
//                 style={styles.dropdown}
//                 onPress={() => {
//                   setIsDropdownOpen(!isDropdownOpen);
//                   if (!isDropdownOpen) {
//                     scrollViewRef.current?.scrollTo({
//                       y: dropdownPosition,
//                       animated: true,
//                     });
//                   }
//                 }}
//               >
//                 <Icon name="refresh_icon" style={styles.leftIcon} />
//                 <Text style={styles.dropdownText}>{repeatOption}</Text>
//                 <Icon
//                   name="down_arrow_icon"
//                   size={20}
//                   style={styles.rightIcon}
//                 />
//               </TouchableOpacity>

//               {isDropdownOpen && (
//                 <View style={styles.dropdownList}>
//                   <FlatList
//                     data={repeatOptions}
//                     renderItem={renderDropdownItem}
//                     keyExtractor={item => item}
//                     contentContainerStyle={{ maxHeight: 200 }}
//                   />
//                 </View>
//               )}
//             </View>

//             <TextInput
//               placeholder="Add description"
//               value={description}
//               onChangeText={setDescription}
//               multiline
//               numberOfLines={4}
//             />

//             <TouchableOpacity
//               style={[
//                 styles.saveButton,
//                 !isSaveEnabled && styles.saveButtonDisabled,
//               ]}
//               onPress={handleSave}
//               disabled={!isSaveEnabled}
//             >
//               <Text style={{ color: !isSaveEnabled ? '#CBD2D9' : '#FFFFFF' }}>
//                 Save
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </View>
//       </View>

//       {showCalendar && (
//         <CalendarPicker
//           visible={showCalendar}
//           onDateChange={handleDateChange}
//           onClose={() => setShowCalendar(false)}
//         />
//       )}
//     </RNModal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalContainer: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   contentContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//   },
//   modalContent: {
//     backgroundColor: colors.backgroundColor,
//     borderRadius: 20,
//     width: '100%',
//   },
//   header: {
//     backgroundColor: colors.backgroundColor,
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderTopRightRadius: 20,
//     borderTopLeftRadius: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   allDayText: {
//     flex: 1,
//     fontSize: 16,
//     color: colors.blackColor,
//   },
//   dateTimeContainer: {
//     marginBottom: 15,
//   },
//   dateTimeRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 5,
//   },
//   dateButton: {
//     padding: 2,
//     borderBottomColor: colors.borderColor,
//     borderBottomWidth: 1,
//     backgroundColor: 'white',
//   },
//   timeButton: {
//     padding: 2,
//     borderBottomColor: colors.borderColor,
//     borderBottomWidth: 1,
//     backgroundColor: 'white',
//   },
//   dateText: {
//     fontSize: 16,
//     color: colors.blackColor,
//   },
//   timeText: {
//     fontSize: 16,
//     color: colors.blackColor,
//   },
//   timeDropdown: {
//     position: 'absolute',
//     left: '77%',
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//     zIndex: 1000,
//     height: 200,
//     width: 120,
//   },
//   timeOption: {
//     paddingVertical: 10,
//     paddingHorizontal: 10,
//   },
//   timeOptionText: {
//     fontSize: 16,
//     color: colors.blackColor,
//   },
//   selectedTimeOption: {
//     backgroundColor: '#F4C24A',
//   },
//   dropdownContainer: {
//     marginBottom: 15,
//   },
//   dropdown: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     height: 40,
//     borderColor: '#ABB4BD',
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 10,
//   },
//   leftIcon: {
//     marginRight: 10,
//   },
//   dropdownText: {
//     flex: 1,
//     color: '#1F2933',
//     fontSize: 16,
//   },
//   rightIcon: {
//     marginLeft: 10,
//   },
//   dropdownList: {
//     backgroundColor: '#FFFFFF',
//     borderColor: '#E4E7EB',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginTop: 5,
//   },
//   dropdownItem: {
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//   },
//   dropdownItemText: {
//     fontSize: 16,
//     color: '#1F2933',
//   },
//   guestItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     backgroundColor: '#FCEBC5',
//     borderColor: '#F4C24A',
//     borderWidth: 1,
//     borderRadius: 15,
//     marginVertical: 5,
//     marginRight: 5,
//     width: normaliseDesigns(150),
//     right: normaliseDesigns(12),
//   },
//   guestEmailText: {
//     color: colors.blackColor,
//     fontSize: 12,
//     marginRight: 10,
//   },
//   saveButton: {
//     backgroundColor: colors.primaryColor,
//     borderRadius: 8,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   saveButtonDisabled: {
//     backgroundColor: '#FDF0E3',
//   },
// });

// export default EventModal;
