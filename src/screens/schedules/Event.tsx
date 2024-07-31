import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { TOKEN_KEY } from '../utils/constants';
import AddEditEvent from '../../components/AddEditEventModal';
import localStorage from 'redux-persist/lib/storage';

const Events = ({ }) => {
  const [showError, setShowError] = useState({ error: false, message: '' });
  const [listOfEvents, setListOfEvents] = useState([]);
  const [showEventCreationModal, setShowEventCreationModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    totalEvents: 0,
  });

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      fetchEvents(token);
    } else {
      setShowError({
        error: true,
        message: 'Please login to google account from share calendar. ',
      });
      setLoading(false);

      setTimeout(() => {
        setShowError({ error: false, message: '' });
      }, 3000);
    }
  }, [refresh]);

  const fetchEvents = async (token) => {
    try {
      let minDate = '2024-06-01T00:00:00Z';
      await axios
        .get(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${minDate}&singleEvents=true&orderBy=startTime`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          if (res && res.data) {
            setListOfEvents(
              res.data.items
                .map((event) => ({
                  id: event.id,
                  title: event.summary,
                  start: event.start.dateTime || event.start.date,
                  end: event.end.dateTime || event.end.date,
                  createdDate: moment(event.created).format('DD-MM-YYYY'),
                  createdBy: event.creator ? event.creator.self : 'N/A',
                }))
                .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
            );
            setPagination({
              ...pagination,
              totalEvents: res.data.items?.length || 0,
            });
            setLoading(false);
          }
        });
    } catch (error) {
      console.error('Error fetching events:', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text>{moment(item.start).format('DD-MM-YYYY')} - {moment(item.end).format('DD-MM-YYYY')}</Text>
      <Text>Created by: {item.createdBy}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Events</Text>
      <Button
        title="Create New Event"
        onPress={() => setShowEventCreationModal(true)}
      />
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <FlatList
          data={listOfEvents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onRefresh={() => setRefresh(!refresh)}
          refreshing={loading}
        />
      )}
      <Modal visible={showEventCreationModal} animationType="slide">
        <AddEditEvent
          onClose={() => setShowEventCreationModal(false)}
          onRefresh={() => setRefresh(!refresh)}
        />
      </Modal>
      {showError.error && <Text style={styles.error}>{showError.message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  eventItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 16,
  },
});

export default Events;
