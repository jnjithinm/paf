// src/components/EventList.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Event } from '../screens/schedules' // Adjust the import path as needed

interface EventListProps {
  events: Event[];
  onEventPress: (event: Event) => void;
}

const EventList: React.FC<EventListProps> = ({ events, onEventPress }) => {
  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventItem} onPress={() => onEventPress(item)}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>
        {item.start} - {item.end}
      </Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  eventItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventList;
