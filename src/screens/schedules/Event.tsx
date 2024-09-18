import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Clipboard,
  ToastAndroid,
} from 'react-native';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import moment from 'moment';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';

const EventDetailModal = ({ isVisible, onClose, event }) => {
  if (!event) return null;

  const handleJoinMeeting = () => {
    if (event.hangoutLink) {
      Linking.openURL(event.hangoutLink);
    }
  };

  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
  };

  const renderGuests = () => {
    if (event.guests && event.guests.length > 0) {
      return event.guests.map((guest) => guest.email).join('\n');
    }
    return 'No participants';
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="cross_icon_thin" width={20} height={20} />
            </TouchableOpacity>
            <View style={styles.header}>
              <Icon name="text_icon" size={20} />
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
            <View style={styles.timeRow}>
              <Icon name="event_clock_Icon" />
              <Text style={styles.eventTime}>
                {moment(event.start).format('D MMMM YYYY h:mm A')} - {moment(event.end).format('D MMMM YYYY h:mm A')}
              </Text>
            </View>
            <Text style={styles.participantsTitle}>
              {event.guests?.length || 0} participants
            </Text>
            <View style={styles.guestRow}>
              <Icon name="person_icon" size={20} color={colors.blackColor} />
              <View style={styles.guestContainer}>
                <ScrollView>
                  <Text style={styles.guestEmails}>
                    {renderGuests()}
                  </Text>
                </ScrollView>
              </View>
            </View>
            {event.hangoutLink && (
              <View style={styles.meetingContainer}>
                <TouchableOpacity style={styles.joinButton} onPress={handleJoinMeeting}>
                  <Icon name='meet' size={20} style={styles.icon} />
                  <Text style={styles.joinButtonText}>Join Meeting Link</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(event.hangoutLink)}>
                  <Icon name='copy_icon' size={20} style={styles.icon} />
                  <Text style={styles.copyButtonText}>Copy Link</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', // Centers the modal vertically
    alignItems: 'center', // Centers the modal horizontally
  },
  modalContainer: {
    width: '90%', // Adjust the width as needed
    maxWidth: 400, // Max width for larger screens
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.blackColor,
    marginLeft: 10,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  eventTime: {
    fontSize: 14,
    color: colors.blackColor,
    marginLeft: 10,
  },
  participantsTitle: {
    fontSize: 14,
    color: colors.blackColor,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  guestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  guestContainer: {
    maxHeight: 100, // Limit the height for scrolling if there are many guests
    marginLeft: 10, // Add some space between the icon and the container
    padding: 10,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 5,
    backgroundColor: 'white', // Light background similar to the design
    flex: 1, // Make the container take up the remaining space
  },
  guestEmails: {
    color: colors.blackColor,
    textAlignVertical: 'top', // Align text at the top
  },
  meetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.primaryColor,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    width: '60%',
  },
  joinButtonText: {
    color: colors.primaryColor,
    fontSize: 14,
    marginLeft: 10,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.primaryColor,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    width: '35%',
  },
  copyButtonText: {
    color: colors.primaryColor,
    fontSize: 14,
    marginLeft: 10,
  },
});

export default EventDetailModal;
