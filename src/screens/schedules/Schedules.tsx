//schedule real code
import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  TextInput,
  FlatList,
  SectionList,
  Linking,
  ToastAndroid,
} from 'react-native';
import {Calendar, ICalendarEventBase} from 'react-native-big-calendar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import moment from 'moment';
import {Button} from 'react-native-paper';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import Layout from '../../components/Layout';
import DrawerContent from '../../components/DrawerContent';
import {Drawer} from 'react-native-drawer-layout';
//import CalendarPicker from '../../components/ScheduleContaint';
import SearchWithFilter from '../../components/ScheduleFilter';
import CalendarPicker from '../../components/ScheduleContaint';
//import CalendarPicker from '../../components/AnalyticsCalendar';
import {Picker} from '@react-native-picker/picker';
//import LabelDropdown from '../../components/NewDropDown';
import {ItemType} from '../../config/types';
import LabeledDropdown from '../../components/TimeDropdown';
import EventModal from '../../components/EventList';
import {ScrollView} from 'react-native-gesture-handler';
import EventDetailModal from './Event';
import {navigate} from '../../utils/helpers/navigationHelpers';
import { date } from 'yup';

interface Event extends ICalendarEventBase {
  isHoliday: any;
  description?: string;
  location?: string;
  guests?: any[];
  hangoutLink?: string;
}

const {width, height} = Dimensions.get('window');

const CalendarScreen = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [eventDetailModalVisible, setEventDetailModalVisible] = useState(false);
  const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventGuests, setNewEventGuests] = useState<string[]>([]);
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const drawerRef = useRef<DrawerLayout>(null);
  const [viewMode, setViewMode] = useState<
    'month' | 'schedule' | 'day' | '3days' | 'week'
  >('day');
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());
  const [newEventStartTime, setNewEventStartTime] = useState<Date | null>(null);
  const [newEventEndTime, setNewEventEndTime] = useState<Date | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPmOpen, setIsPmOpen] = useState<boolean>(false);
  const [selectedSip, setSelectedSip] = useState<ItemType | undefined>(
    undefined,
  );
  const [isEventsModalVisible, setIsEventsModalVisible] = useState(false);

  const [isClickedAdd, setIsClickedAdd] = useState<boolean>(false);

  const [selectedPmSip, setSelectedPmSip] = useState<ItemType | undefined>(
    undefined,
  );
  const [selectedDateEvents, setSelectedDateEvents] = useState<Event[]>([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // Filtered events based on search
  const [search, setSearch] = useState('');

  const handleChange = (event: any, date?: Date, type: string) => {
    if (type === 'start' && date) {
      setNewEventStartTime(date);
      setStartDate(moment(date).format('YYYY-MM-DD'));
      setShowStartPicker(false);
    } else if (type === 'end' && date) {
      setNewEventEndTime(date);
      setEndDate(moment(date).format('YYYY-MM-DD'));
      setShowEndPicker(false);
    }
  };

  const handleFilterSelect = (
    filter: 'Schedule' | 'Today' | '3 Day' | 'Week' | 'Month',
  ) => {
    switch (filter) {
      case 'Schedule':
        setViewMode('schedule');
        break;
      case 'Today':
        setViewMode('day');
        break;
      case '3 Day':
        setViewMode('3days');
        break;
      case 'Week':
        setViewMode('week');
        break;
      case 'Month':
        setViewMode('month');
        break;
      default:
        setViewMode('month');
        break;
    }
  };

  useEffect(() => {
    // Filter events when the search text changes
    if (search.trim() !== '') {
      const filtered = events.filter(event =>
        (event.title || '').toLowerCase().includes(search.toLowerCase()),
      );

      // Sort filtered events to bring matching items to the top
      const sortedFiltered = [...filtered].sort((a, b) => {
        const aMatches = (a.title || '')
          .toLowerCase()
          .startsWith(search.toLowerCase());
        const bMatches = (b.title || '')
          .toLowerCase()
          .startsWith(search.toLowerCase());

        if (aMatches && !bMatches) return -1;
        if (!aMatches && bMatches) return 1;
        return 0;
      });

      setFilteredEvents(sortedFiltered);
      setViewMode('schedule'); // Switch to 'schedule' mode when searching
    } else {
      setFilteredEvents(events); // Reset to all events if search is cleared
      //setViewMode('month'); // Reset to 'month' mode when search is cleared
    }
  }, [search, events]);

  const handleSearch = (text: string) => {
    setSearch(text);
  };
  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        setIsSignedIn(true);
        fetchEvents(token);
      } else {
        setIsSignedIn(false);
      }
    }
    checkToken();
  }, []);

  const renderEventModalItem = ({item}: {item: Event}) => {
    console.log(item.start, 'itemitem');
    return (
      <TouchableOpacity
        style={styles.eventItem}
        onPress={() => handleEventPress(item.start)}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventTime}>
          {moment(item.start).format('HH:mm')} -{' '}
          {moment(item.end).format('HH:mm')}
        </Text>
        {item.description && (
          <Text style={styles.eventDescription}>{item.description}</Text>
        )}
      </TouchableOpacity>
    );
  };

  const handleEventPress = (eventDate: Date) => {
    // Set the calendar to day view mode
    setViewMode('day');
    // Update the selected date in the calendar
    setSelectedDate(eventDate);
    setIsEventsModalVisible(false); // Close the modal if it's open
  };

  const handleCalendarIconClick = () => {
    setIsClicked(!isClicked);
    setIsCalendarVisible(true);
  };
  const [initialDate, setInitialDate] = useState(new Date());

  const handleDateChange = (startDate: string, endDate: string) => {
    const selectedMoment = moment(startDate);
    const newMonth = selectedMoment.month();
    const newYear = selectedMoment.year();
    console.log(startDate, 'new Mntj');
    setInitialDate(startDate);
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
    setIsCalendarVisible(false);
    setSelectedDate(selectedMoment.toDate());

    // Fetch events for the selected month and year
    fetchEventsForCurrentMonthAndYear(newMonth, newYear);
  };

  const handleMonthChange = (date: Date) => {
    const newMonth = moment(date).month();
    const newYear = moment(date).year();
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);

    // Fetch events for the selected month and year
    fetchEventsForCurrentMonthAndYear(newMonth, newYear);
  };

  const fetchEvents = async (token: string) => {
    try {
      const minDate = moment().startOf('month').toISOString();
      const maxDate = moment().endOf('month').toISOString();

      const primaryCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${minDate}&timeMax=${maxDate}&singleEvents=true&orderBy=startTime`;
      const holidayCalendarId =
        'en.indian%23holiday%40group.v.calendar.google.com';
      const holidayCalendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${holidayCalendarId}/events?timeMin=${minDate}&timeMax=${maxDate}&singleEvents=true&orderBy=startTime`;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Fetch primary events and holiday events concurrently
      const [primaryEventsRes, holidayEventsRes] = await Promise.all([
        axios.get(primaryCalendarUrl, {headers}),
        axios.get(holidayCalendarUrl, {headers}).catch(error => {
          console.error('Error fetching holiday events:', error.message);
          return {data: {items: []}}; // Return an empty array if there's an error
        }),
      ]);

      // Log Holiday Event Names
      holidayEventsRes.data.items.forEach(event => {
        console.log('Holiday Event:', event.summary);
      });

      // Format and set events (this code remains the same)
      const events = primaryEventsRes.data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: new Date(
          event.start?.dateTime || event.start?.date || new Date(),
        ), // Ensure date is valid
        end: new Date(event.end?.dateTime || event.end?.date || new Date()), // Ensure date is valid
        createdBy: event.creator ? event.creator.self : 'N/A',
        description: event.description,
        location: event.location,
        guests: event.attendees,
        hangoutLink: event.hangoutLink,
        isHoliday: false, // Not a holiday event
      }));

      const holidays = holidayEventsRes.data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: new Date(
          event.start?.dateTime || event.start?.date || new Date(),
        ), // Ensure date is valid
        end: new Date(event.end?.dateTime || event.end?.date || new Date()), // Ensure date is valid
        createdBy: event.creator ? event.creator.self : 'N/A',
        isHoliday: true, // Mark as holiday
      }));

      const allEvents = [...events, ...holidays].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      );

      setEvents(allEvents);
    } catch (error) {
      console.error(
        'Error fetching events:',
        error.response?.data || error.message,
      );
    }
  };

  const refreshAccessToken = async () => {
    try {
      const {accessToken} = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('accessToken', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Failed to refresh access token', error);
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      let token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        token = await refreshAccessToken();
      }
      if (token) {
        setIsSignedIn(true);
        fetchEvents(token);
      } else {
        setIsSignedIn(false);
      }
    };
    checkToken();
  }, []);

  useEffect(() => {
    // Fetch events based on the view mode when it changes
    const token = AsyncStorage.getItem('accessToken');
    if (token) {
      fetchEvents(token);
    }
  }, [viewMode]);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {accessToken} = await GoogleSignin.getTokens();
      await AsyncStorage.setItem('accessToken', accessToken);
      setIsSignedIn(true);
      fetchEvents(accessToken);
    } catch (error) {
      console.log('Error --> ', error);
    }
  };

  const signOutWithGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      await AsyncStorage.removeItem('accessToken');
      setIsSignedIn(false);
      setEvents([]);
      console.log('User signed out');
    } catch (error) {
      console.log('Error signing out --> ', error);
    }
  };

  const createCalendarEvent = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    if (!token) {
      ToastAndroid.show('Please sign in first', ToastAndroid.SHORT);
      return;
    }

    if (!newEventTitle || !newEventStartTime || !newEventEndTime) {
      ToastAndroid.show(
        'Please fill in all required fields',
        ToastAndroid.SHORT,
      );
      return;
    }

    const event = {
      summary: newEventTitle,
      description: newEventDescription,
      start: {
        dateTime: moment(newEventStartTime).format(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: moment(newEventEndTime).format(),
        timeZone: 'Asia/Kolkata',
      },
      attendees: newEventGuests.map(email => ({email})),
      conferenceData: {
        createRequest: {
          requestId: 'sample123',
          conferenceSolutionKey: {type: 'hangoutsMeet'},
        },
      },
    };

    try {
      await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
        event,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      ToastAndroid.show('Event created successfully', ToastAndroid.SHORT);

      // Clear fields after successful creation
      setCreateEventModalVisible(false);
      setNewEventTitle('');
      setNewEventDescription('');
      setNewEventGuests([]);
      setNewEventStartTime(null);
      setNewEventEndTime(null);
      setStartDate('');
      setEndDate('');
      fetchEvents(token); // Refresh the events after creating the new event
    } catch (error) {
      console.error(
        'Error creating event:',
        error.response?.data || error.message,
      );
      ToastAndroid.show(
        `Error creating event: ${error.response?.data || error.message}`,
        ToastAndroid.LONG,
      );
    }
  };

  const generateTimeOptions = () => {
    const timeOptions = [];

    for (let i = 0; i < 24 * 4; i++) {
      // 24 hours * 4 intervals per hour (15 minutes each)
      const timeSlot = moment()
        .startOf('day')
        .add(i * 15, 'minutes'); // 15-minute intervals
      const formattedTime = timeSlot.format('hh:mm A'); // Format to show AM/PM
      timeOptions.push({label: formattedTime, value: formattedTime});
    }

    return {amOptions: timeOptions, pmOptions: timeOptions};
  };

  const {amOptions, pmOptions} = generateTimeOptions();

  const onPressEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventDetailModalVisible(true); // Show the EventDetailModal
  };

  const handleCloseEventDetailModal = () => {
    setEventDetailModalVisible(false);
  };

  const handleAddGuest = () => {
    if (newGuestEmail.trim() !== '') {
      setNewEventGuests([...newEventGuests, newGuestEmail]);
      setNewGuestEmail('');
    }
  };

  const handleRemoveGuest = email => {
    setNewEventGuests(newEventGuests.filter(guest => guest !== email));
  };
  const copyToClipboard = (text: string) => {
    Clipboard.setString(text);
    ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
  };

  const renderDrawerContent = () => (
    <View style={styles.drawerContent}>
      <Text style={styles.drawerTitle}>Google Calendar</Text>
      <TouchableOpacity onPress={() => setViewMode('schedule')}>
        <Text style={styles.drawerItem}>Schedule</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setViewMode('day')}>
        <Text style={styles.drawerItem}>Day</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setViewMode('3days')}>
        <Text style={styles.drawerItem}>3 Days</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setViewMode('week')}>
        <Text style={styles.drawerItem}>Week</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setViewMode('month')}>
        <Text style={styles.drawerItem}>Month</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.drawerItem}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );

  // const renderEvent = (event: Event) => (
  //   <View style={styles.eventContainer}>
  //     <Text style={styles.eventText}>{event.title}</Text>
  //   </View>
  // );
  const renderEvent = (event: Event) => {
    if (event.isHoliday) {
      // Render holiday event with specific styling
      return (
        <View style={[styles.eventContainer, styles.holidayEventContainer]}>
          <Text style={[styles.eventText, styles.holidayEventText]}>
            {event.title}
          </Text>
        </View>
      );
    } else {
      // Render primary event with specific styling
      return (
        <View style={[styles.eventContainer, styles.primaryEventContainer]}>
          <Text style={[styles.eventText, styles.primaryEventText]}>
            {event.title}
          </Text>
        </View>
      );
    }
  };
  const groupEventsByDate = (events: Event[]) => {
    const groupedEvents: {title: string; data: Event[]}[] = [];

    events.forEach(event => {
      const eventDate = moment(event.start).format('YYYY-MM-DD');
      const existingGroup = groupedEvents.find(
        group => group.title === eventDate,
      );

      if (existingGroup) {
        existingGroup.data.push(event);
      } else {
        groupedEvents.push({title: eventDate, data: [event]});
      }
    });

    return groupedEvents;
  };

  // const renderScheduleItem = ({item}: {item: Event}) => (
  //   <View style={styles.scheduleItem}>
  //     <Text style={styles.scheduleItemTitle}>{item.title}</Text>
  //     <Text style={styles.scheduleItemTime}>
  //       {moment(item.start).format('HH:mm')} -{' '}
  //       {moment(item.end).format('HH:mm')}
  //     </Text>
  //   </View>
  // );

  const renderScheduleItem = ({item}: {item: Event}) => (
    <View style={styles.scheduleItem}>
      <Text style={styles.scheduleItemTitle}>{item.title}</Text>
      <Text style={styles.scheduleItemTime}>
        {moment(item.start).format('HH:mm')} -{' '}
        {moment(item.end).format('HH:mm')}
      </Text>
    </View>
  );

  const renderScheduleSectionHeader = ({
    section,
  }: {
    section: {title: string};
  }) => (
    <View style={styles.scheduleSectionHeader}>
      <Text style={styles.scheduleSectionHeaderText}>
        {moment(section.title).format('dddd, MMMM Do YYYY')}
      </Text>
    </View>
  );

  const handleMonthSelect = (index: number) => {
    setCurrentMonth(index);
    setShowMonthDropdown(false);
    fetchEventsForCurrentMonthAndYear(index, currentYear);
  };

  const handleCloseCalendar = () => {
    setIsCalendarVisible(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentYear(year);
    setShowYearDropdown(false);
    fetchEventsForCurrentMonthAndYear(currentMonth, year);
  };

  const fetchEventsForCurrentMonthAndYear = async (
    month: number,
    year: number,
  ) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      const minDate = moment()
        .year(year)
        .month(month)
        .startOf('month')
        .toISOString();
      const maxDate = moment()
        .year(year)
        .month(month)
        .endOf('month')
        .toISOString();
      fetchEventsForDateRange(token, minDate, maxDate);
    }
  };

  const filterAndLimitEvents = (events: Event[], date: Date) => {
    const dayEvents = events.filter(event =>
      moment(event.start).isSame(date, 'day'),
    );

    // Separate into holiday and primary events
    const holidayEvents = dayEvents.filter(event => event.isHoliday);
    const primaryEvents = dayEvents.filter(event => !event.isHoliday);

    // Take one of each
    const limitedEvents = [
      ...holidayEvents.slice(0, 1),
      ...primaryEvents.slice(0, 1),
    ];

    return limitedEvents;
  };
  const fetchEventsForDateRange = async (
    token: string,
    minDate: string,
    maxDate: string,
  ) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${minDate}&timeMax=${maxDate}&singleEvents=true&orderBy=startTime`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const events = response.data.items.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description,
        location: event.location,
        guests: event.attendees,
        hangoutLink: event.hangoutLink,
      }));
      setEvents(events);
    } catch (error) {
      console.error(
        'Error fetching events:',
        error.response?.data || error.message,
      );
    }
  };
  const handleDateClick = (date: Date) => {
    console.log(date, 'date');
    const selectedDateString = moment(date).format('YYYY-MM-DD');
    const eventsForSelectedDate = events.filter(event =>
      moment(event.start).isSame(selectedDateString, 'day'),
    );
    setSelectedDate(date); // Set the selected date
    setSelectedDateEvents(eventsForSelectedDate); // Set events for the selected date
    setIsEventsModalVisible(true); // Open the modal to show events
  };
  const handleOpenModal = () => {
    setCreateEventModalVisible(true);
    setIsClickedAdd(false);
  };

  const handleCloseModal = () => {
    setCreateEventModalVisible(false);
  };
  const handleCloseEventsModal = () => {
    setIsEventsModalVisible(false);
    fetchEvents;
  };

  const currentDate = new Date(); // Current date

  // // Helper function to check if the given date is today
  const isToday = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return false;
    return (
      date.getDate() === currentDate.getDate() &&
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

  // Function to get the day name (e.g., Mon, Tue, etc.)
  const getDayName = (date) => {
    const options = { weekday: 'short' }; // Display short weekday name (Mon, Tue, etc.)
    return date.toLocaleDateString('en-US', options);
  };

  // Custom day header rendering logic
  const renderCustomDayHeader = (date) => {
    console.log('Received date:', date); // Debug the date format

    // Convert the input to a Date object if it's not already
    let parsedDate;
    if (typeof date === 'string' || typeof date === 'number') {
      parsedDate = new Date(date); // Parse string or number to Date
    } else if (date instanceof Date) {
      parsedDate = date;
    } else {
      parsedDate = new Date(); // Fallback to current date if invalid
    }

    // Safeguard against invalid dates
    if (isNaN(parsedDate.getTime())) {
      return (
        <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'black' }}>N/A</Text>
        </View>
      );
    }

    const isCurrentDate = isToday(parsedDate);

    const activeStyle = {
      backgroundColor: isCurrentDate ? '#EA7804' : '#F0F0F0', // Use light gray for inactive dates
      color: isCurrentDate ? 'white' : 'black',
    };

    return (
      <View>
         <Text style={{ color: '#EA7804', fontSize: 12,justifyContent:"center",alignItems:"center",alignSelf:"center" }}>{getDayName(parsedDate)}</Text>
      <View
        style={{
          backgroundColor: activeStyle.backgroundColor,
          width: 30, // Increase width to fit both day name and date
          height: 30,
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
        }}
      >
        {/* Display day name (Mon, Tue, etc.) */}
       
        {/* Display the actual date */}
        <Text style={{ color: activeStyle.color, fontSize: 16 }}>{parsedDate.getDate()}</Text>
      </View>
      </View>
    );
  };
  

  // const isSelectedDate = (date: Date) => {
  //   return selectedDate && 
  //     date.getDate() === selectedDate.getDate() &&
  //     date.getMonth() === selectedDate.getMonth() &&
  //     date.getFullYear() === selectedDate.getFullYear();
  // };

  // // Function to render the day headers with custom styles for active date
  // const renderCustomDayHeader = (date: Date) => {
  //   const isActiveDate = isSelectedDate(date);

  //   return (
  //     <View style={styles.dateContainer}>
  //       <Text style={[styles.dayName, { color: isActiveDate ? '#FFFFFF' : '#EA7804' }]}>
  //         {moment(date).format('ddd')} {/* Day name */}
  //       </Text>
  //       <View
  //         style={[
  //           styles.dateCircle,
  //           {
  //             backgroundColor: isActiveDate ? '#EA7804' : '#FFFFFF', // Highlight active date with orange background
  //             borderWidth: isActiveDate ? 0 : 1, // Add a border for non-active dates
  //             borderColor: '#EA7804',
  //           },
  //         ]}
  //       >
  //         <Text style={{ color: isActiveDate ? '#FFFFFF' : '#000000' }}>
  //           {moment(date).format('D')} {/* Day number */}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // };
  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <DrawerContent closeDrawer={() => setIsDrawerOpen(false)} />
      )}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        onPressBellIcon={() => navigate('Notifications')}
        onPressMenuIcon={() => setIsDrawerOpen(true)}
        focusedStack="AnalyticsStack"
        avoidBackButton
        dashboard>
        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
              <Icon
                name={
                  isCalendarVisible
                    ? 'calendar_color_icon'
                    : 'calendar_icon_black'
                }
                size={20}
              />
            </TouchableOpacity>
            <Text style={styles.monthText}>
              {moment().month(currentMonth).year(currentYear).format('MMMM')}
            </Text>
            <TouchableOpacity
              style={styles.googleSignInButton}
              onPress={isSignedIn ? signOutWithGoogle : signInWithGoogle}>
              <View style={styles.googleSignInButtonContent}>
                <Icon name="google_icon2" size={20} />
                <Text style={styles.googleSignInButtonText}>
                  {isSignedIn ? 'Sign Out' : 'Sign in with Google'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <SearchWithFilter
            onTextChange={handleSearch}
            onProceed={filter => handleFilterSelect(filter.dateFilterOption)}
            style={{marginVertical: 0}}
          />
          {isCalendarVisible && (
            <View style={styles.calendarContainer}>
              <CalendarPicker
                onDateChange={handleDateChange}
                onClose={handleCloseCalendar}
              />
            </View>
          )}
          {viewMode === 'month' ? (
            <Calendar<Event>
              events={events}
              height={700}
              renderEvent={event => {
                const filteredEvents = filterAndLimitEvents(
                  events,
                  event.start,
                );
                return filteredEvents.map(e => renderEvent(e));
              }}
              
              onPressEvent={onPressEvent}
              weekStartsOn={1}
              showTime={false}
              hideNowIndicator
              mode={viewMode}
              date={initialDate}
              onPressCell={handleDateClick}
              dayHeaderStyle={{
                dayText:"#EA7804",
                backgroundColor:"red"
              }}
              // style={{
              //   dayText: 'red',
              //   dayContainer: styles.dayContainer,
              // }}
              
              

              weekDayHeaderHighlightColor='red'
            />
          ) : viewMode === 'schedule' ? (
            <SectionList
              sections={groupEventsByDate(filteredEvents)}
              keyExtractor={item => item.id}
              renderItem={renderScheduleItem}
              renderSectionHeader={renderScheduleSectionHeader}
              contentContainerStyle={styles.scheduleList}
              
            />
          ) : (
            <Calendar<Event>
              events={events}
              height={600}
              renderEvent={renderEvent}
              onPressEvent={onPressEvent}
              weekStartsOn={1}
              showTime={false}
              hideNowIndicator
              date={initialDate}
              //dayHeaderHighlightColor='white'
           
              mode={viewMode}
             //dayHeaderStyle={{
                // backgroundColor:'#EA7804',
                // width:35,
                // height:35,
                // borderRadius:20,
                // alignSelf:"center",
                // justifyContent:"center",
                
             //}}
             //renderHeader={(date) => renderCustomDayHeader(date)}

              // weekDayHeaderHighlightColor='#EA7804'
              dayHeaderStyle={date => renderCustomDayHeader(date)} // pass the active date here
              weekDayHeaderHighlightColor="#EA7804"
              
            />
          )}
          <EventDetailModal
            isVisible={eventDetailModalVisible}
            onClose={handleCloseEventDetailModal}
            event={selectedEvent}
          />

          <Modal
            animationType="slide"
            transparent={true}
            visible={isEventsModalVisible}
            onRequestClose={handleCloseEventsModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalHeaderText}>
                  Events on {moment(selectedDate).format('MMMM Do YYYY')}
                </Text>

                <ScrollView
                  contentContainerStyle={{flexGrow: 1}}
                  scrollEnabled={true}>
                  <FlatList
                    data={selectedDateEvents} // Display all events for the selected date
                    keyExtractor={item => item.id}
                    renderItem={renderEventModalItem} // Render each event separately
                    scrollEnabled={false} // Disable FlatList's internal scroll to use ScrollView's scroll
                    style={{backgroundColor: '#FCEBC5'}}
                  />
                </ScrollView>

                <TouchableOpacity
                  //mode="contained"
                  style={{
                    backgroundColor: '#F4C24A',
                    marginTop: 20,
                    alignContent: 'center',
                    borderRadius: 10,
                  }}
                  onPress={handleCloseEventsModal}>
                  <Text
                    style={{textAlign: 'center', padding: 10, color: 'white'}}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <EventModal
            isVisible={createEventModalVisible}
            onClose={handleCloseModal}
            onSave={eventData => {
              console.log('Event Data:', eventData);
              handleCloseModal();
            }}
          />
        </View>
      </Layout>

      {isClickedAdd && (
        <TouchableOpacity
          style={styles.floatingButtoncreateevent}
          onPress={handleOpenModal}>
          <Icon name="create_event_icon" size={30} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.floatingButton,
          {backgroundColor: isClickedAdd ? '#FFFFFF' : colors.primaryColor},
        ]}
        onPress={() => setIsClickedAdd(!isClickedAdd)}>
        <Icon
          name={!isClickedAdd ? 'plus_icon' : 'cross_color_icon'}
          //size={30}
        />
      </TouchableOpacity>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    // backgroundColor: colors.backgroundColor,
  },
  headerTitle: {
    fontSize: 20,
    color: '#fff',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingHorizontal: 15,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.blackColor,
  },
  signInButton: {
    backgroundColor: '#F4C24A',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 10, // Keep it above the bottom to remain visible

    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // For Android shadow
    top: 670,
  },
  eventText: {
    color: '#000', // Primary event text color
    fontSize: 10,
  },
  holidayEventContainer: {
    backgroundColor: '#749E35', // Light green background for holidays
  },
  holidayEventText: {
    color: 'black', // Green text color for holidays
  },
  dayContainer: {
    flex: 1,
    width: 100,
  },

  floatingButtoncreateevent: {
    position: 'absolute',
    //elevation: 5, // For Android shadow
    top: 610,
    right: 12.5,
    alignItems: 'center',
  },
  floatingButtoncreateTask: {
    position: 'absolute',
    //elevation: 5, // For Android shadow
    top: 555,
    right: 12.5,
    alignItems: 'center',
  },
  floatingButtoncreateOutofoffice: {
    position: 'absolute',
    //elevation: 5, // For Android shadow
    top: 500,
    right: 12.5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: colors.blackColor,
  },
  datetimeContainer: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  datetimeText: {
    fontSize: 16,
    color: colors.blackColor,
  },
  guestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  eventDetailHeader: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  closeButton: {
    backgroundColor: '#F4C24A',
    width: 20,
  },
  eventDetails: {
    padding: 20,
    backgroundColor: 'pink',
    borderRadius: 10,
    width: '90%',
    height: '90%',
  },
  eventDetailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  guestEmail: {
    marginLeft: 5,
    color: 'red',
  },
  drawerContent: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgb(252, 235, 197)',
  },
  drawerTitle: {
    fontSize: 20,
    color: colors.blackColor,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  drawerItem: {
    fontSize: 16,
    color: colors.blackColor,
    marginBottom: 10,
    fontWeight: '500',
  },

  scheduleItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  scheduleItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2933',
  },
  scheduleItemTime: {
    fontSize: 14,
    color: '#666',
  },
  scheduleSectionHeader: {
    backgroundColor: '#FFF',
    padding: 10,
  },
  scheduleSectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2933',
  },
  scheduleList: {
    paddingBottom: 20,
    backgroundColor: '#FCEBC5',
  },
  dropdownContainer: {
    position: 'absolute',
    top: 60, // Adjust according to your layout
    left: 0,
    width: '100%',
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 5,
    maxHeight: 200, // Adjust height as needed
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    color: colors.blackColor,
  },
  selectedDropdownItem: {
    backgroundColor: colors.primaryColor,
    color: '#fff',
  },

  monthText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2933',
    marginLeft: -25,
  },
  googleSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#FFF',
    borderColor: '#EA7804',
    borderWidth: 2,
  },
  googleSignInButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.blackColor,
    left: 2,
  },
  googleSignInButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarContainer: {
    position: 'absolute',
    top: 55, // Adjust based on your layout
    left: 0, // Align with the calendar icon
    backgroundColor: '#FFF',
    borderRadius: 10,
    //padding: 15,
    width: '100%', // Adjust the width based on the design
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  guestEmailText: {
    color: colors.blackColor,
    fontSize: 16,
    marginRight: 10,
  },
  guestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#FCEBC5',
    borderColor: '#F4C24A',
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5,
    marginRight: 5,
  },
  picker: {
    height: 50, // Ensure the height is sufficient
    width: '100%', // Make it full-width within the container
    color: colors.blackColor, // Adjust text color if needed
    backgroundColor: colors.backgroundColor, // Set a background color if necessary
  },

  eventItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.blackColor,
  },
  eventTime: {
    fontSize: 14,
    color: colors.blackColor,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%', // Limit the height of the modal to 80% of the screen
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.blackColor,
  },
  eventContainer: {
    marginVertical: 1, // Space between events
    borderRadius: 5,
    //backgroundColor:"red"
  },

  primaryEventContainer: {
    backgroundColor: '#FCEBC5', // Light yellow background for primary events
    paddingVertical: 2,
    marginLeft: 0, // Align to the left
  },
  primaryEventText: {
    color: '#000', // Black text color for primary events
    fontSize: 12,
  },
  dayText: {
    color: 'red',
  },
});

export default CalendarScreen;
