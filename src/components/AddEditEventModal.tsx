import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button, Snackbar, Divider, IconButton, ActivityIndicator } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import dayjs from 'dayjs';
import colors from '../config/colors';
import localStorage from 'redux-persist/es/storage';

interface AddEditEventsProps {
  eventId?: number;
  eventDetails?: any;
  onCancelClick: () => void;
  handleRefresh: () => void;
}

const AddEditEvents: React.FC<AddEditEventsProps> = ({
  eventId = -999,
  eventDetails = null,
  onCancelClick,
  handleRefresh,
}) => {
  const [loading, setLoading] = useState(true);
  const [listOfAttendees, setListOfAttendees] = useState<{ email: string }[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState({ error: false, message: '' });
  const [showDatePicker, setShowDatePicker] = useState<{ start: boolean; end: boolean }>({ start: false, end: false });

  useEffect(() => {
    if (eventDetails) {
      // Load event details if provided
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      startEvent: null,
      endEvent: null,
      attendees: '',
      meetLink: '',
    },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Title is required'),
      startEvent: Yup.date()
        .test('startEvent-endEvent', 'If startEvent is provided, endEvent is mandatory', function (value) {
          const { endEvent } = this.parent;
          if (value && !endEvent) {
            return this.createError({ path: 'endEvent', message: 'End event is mandatory if start event is provided' });
          }
          return true;
        })
        .nullable(),
      endEvent: Yup.date()
        .test('endEvent-startEvent', 'If endEvent is provided, startEvent is mandatory', function (value) {
          const { startEvent } = this.parent;
          if (value && !startEvent) {
            return this.createError({ path: 'startEvent', message: 'Start event is mandatory if end event is provided' });
          }
          return true;
        })
        .nullable(),
      attendees: Yup.string().nullable(),
    }),
    onSubmit: (values) => {
      setLoading(true);
      if (eventId == -999) {
        createEvent(values);
      }
    },
  });

  const handleAddAttendee = () => {
    const newAttendee = { email: formik.values.attendees };

    if (
      Yup.string()
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .isValidSync(newAttendee.email)
    ) {
      setListOfAttendees([...listOfAttendees, newAttendee]);
      formik.setFieldValue('attendees', '');
    } else {
      formik.setFieldError('attendees', 'Enter valid email');
    }
  };

  const handleRemoveAttendee = (index: number) => {
    const updatedAttendees = listOfAttendees.filter((_, i) => i !== index);
    setListOfAttendees(updatedAttendees);
  };

  const createEvent = async (eventDetails: any) => {
    try {
      const response = await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?sendUpdates=all&conferenceDataVersion=1&key=${process.env.REACT_APP_GOOGLE_CALENDAR_API}`,
        {
          summary: eventDetails.title,
          start: {
            dateTime: eventDetails.startEvent
              ? dayjs(eventDetails.startEvent).format('YYYY-MM-DDTHH:mm:ss')
              : moment().format('YYYY-MM-DDTHH:mm:ss'),
            timeZone: 'Asia/Kolkata',
          },
          end: {
            dateTime: eventDetails.endEvent
              ? dayjs(eventDetails.endEvent).format('YYYY-MM-DDTHH:mm:ss')
              : moment().format('YYYY-MM-DDTHH:mm:ss'),
            timeZone: 'Asia/Kolkata',
          },
          attendees: [...listOfAttendees],
          conferenceData: {
            createRequest: {
              requestId: Math.random().toString(36).substring(2, 15),
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
              status: {
                statusCode: 'success',
              },
            },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('TOKEN_KEY')}`,
          },
        }
      );
      if (response.status === 200) {
        setShowSuccess(true);
        handleRefresh();
        setTimeout(() => onCancelClick(), 400);
      } else {
        setShowError({ error: true, message: 'Error creating event' });
        setLoading(false);
      }
    } catch (error) {
      setShowError({ error: true, message: 'Error creating event' });
      setLoading(false);
    }

    setTimeout(() => {
      setShowError({ error: false, message: '' });
    }, 3000);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {loading ? (
        <ActivityIndicator size="large" colors={colors.primaryColor} />
      ) : (
        <ScrollView>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={formik.values.title}
              onChangeText={formik.handleChange('title')}
              onBlur={formik.handleBlur('title')}
            />
            {formik.touched.title && formik.errors.title ? <Text style={styles.errorText}>{formik.errors.title}</Text> : null}

            <TouchableOpacity onPress={() => setShowDatePicker({ start: true, end: false })} style={styles.datePicker}>
              <Text style={styles.datePickerText}>
                {formik.values.startEvent ? moment(formik.values.startEvent).format('YYYY-MM-DD HH:mm') : 'Select Start Event Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker.start && (
              <DateTimePicker
                value={formik.values.startEvent ? new Date(formik.values.startEvent) : new Date()}
                mode="datetime"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker({ start: false, end: false });
                  formik.setFieldValue('startEvent', date);
                }}
              />
            )}

            <TouchableOpacity onPress={() => setShowDatePicker({ start: false, end: true })} style={styles.datePicker}>
              <Text style={styles.datePickerText}>
                {formik.values.endEvent ? moment(formik.values.endEvent).format('YYYY-MM-DD HH:mm') : 'Select End Event Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker.end && (
              <DateTimePicker
                value={formik.values.endEvent ? new Date(formik.values.endEvent) : new Date()}
                mode="datetime"
                display="default"
                minimumDate={formik.values.startEvent ? new Date(formik.values.startEvent) : new Date()}
                onChange={(event, date) => {
                  setShowDatePicker({ start: false, end: false });
                  formik.setFieldValue('endEvent', date);
                }}
              />
            )}

            {formik.touched.startEvent && formik.errors.startEvent ? <Text style={styles.errorText}>{formik.errors.startEvent}</Text> : null}
            {formik.touched.endEvent && formik.errors.endEvent ? <Text style={styles.errorText}>{formik.errors.endEvent}</Text> : null}

            <TextInput
              style={styles.input}
              placeholder="Add attendees email"
              value={formik.values.attendees}
              onChangeText={formik.handleChange('attendees')}
              onBlur={formik.handleBlur('attendees')}
              onSubmitEditing={handleAddAttendee}
              returnKeyType="done"
            />
            {formik.touched.attendees && formik.errors.attendees ? <Text style={styles.errorText}>{formik.errors.attendees}</Text> : null}

            <FlatList
              data={listOfAttendees}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.attendeeItem}>
                  <Text>{item.email}</Text>
                  <IconButton icon="close" size={20} onPress={() => handleRemoveAttendee(index)} />
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}
      <Divider style={styles.divider} />
      <View style={styles.buttonContainer}>
        <Button mode="contained" loading={loading} onPress={() => formik.handleSubmit()} style={styles.saveButton}>
          Save
        </Button>
        <Button mode="outlined" onPress={onCancelClick} style={styles.cancelButton}>
          Cancel
        </Button>
      </View>

      <Snackbar visible={showError.error} onDismiss={() => setShowError({ error: false, message: '' })} duration={3000}>
        {showError.message}
      </Snackbar>
      <Snackbar visible={showSuccess} onDismiss={() => setShowSuccess(false)} duration={3000}>
        Event created successfully...
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  },
  datePicker: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  datePickerText: {
    color: '#000',
  },
  attendeeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  saveButton: {
    backgroundColor: colors.primaryColor,
  },
  cancelButton: {
    borderColor: colors.primaryColor,
  },
});

export default AddEditEvents;
