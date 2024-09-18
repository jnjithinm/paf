import React, { FC, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../config/colors';
import Icon from './Icon';
import Text from './Text';

const generateCalendar = (month: number, year: number) => {
  const startOfMonth = moment([year, month - 1]).startOf('month');
  const endOfMonth = moment([year, month - 1]).endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  const days = [];
  let day = startOfCalendar;

  while (day <= endOfCalendar) {
    days.push(day.clone());
    day = day.add(1, 'day');
  }

  return days;
};

type RenderDropdownTypes = {
  label: 'Month' | 'Year';
  value: number;
  onChange: (item: any) => void;
};

const RenderDropdown: FC<RenderDropdownTypes> = ({ label, value, onChange }) => {
  const generateMonths = () => {
    const months = moment.monthsShort();
    return months.map((month, index) => ({
      label: month,
      value: index + 1,
    }));
  };

  const generateYears = () => {
    const startYear = 1950;
    const endYear = new Date().getFullYear();
    const years = [];

    for (let year = endYear; year >= startYear; year--) {
      years.push({ label: year.toString(), value: year });
    }

    return years;
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
      <Dropdown
        data={label === 'Month' ? generateMonths() : generateYears()}
        labelField={'label'}
        valueField={'value'}
        onChange={onChange}
        value={value}
        placeholder={label}
        placeholderStyle={{ color: '#CBD2D9' }}
        iconColor="transparent"
        style={{ width: '100%' }}
        itemTextStyle={{ color: colors.blackColor }}
        selectedTextStyle={{ color: colors.blackColor }}
      />
      <Icon name="up_and_down_selection" style={{ right: 25 }} />
    </View>
  );
};

interface CalendarPickerProps {
  onDateChange: (startDate: string, endDate: string) => void;
  visible: boolean;
  onClose: () => void;
}

const CalendarPicker: FC<CalendarPickerProps> = ({ onDateChange, visible, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(moment().month() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(moment().year());
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);

  const weekdays = moment.weekdays();
  const days = generateCalendar(selectedMonth, selectedYear);
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  const handleDateSelect = (day: moment.Moment) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (day.isBefore(startDate, 'day')) {
        setStartDate(day);
      } else {
        setEndDate(day);
      }
    }

    // Trigger the date change and close the calendar
    if (startDate && endDate) {
      onDateChange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
      onClose(); // Close the calendar modal after selection
    } else if (!endDate) {
      onDateChange(day.format('YYYY-MM-DD'), day.format('YYYY-MM-DD'));
      onClose(); // Close the calendar modal after selection
    }
  };

  const isDateInRange = (day: moment.Moment) => {
    if (startDate && endDate) {
      return day.isBetween(startDate, endDate, 'day', '[]');
    }
    return false;
  };

  const isStartDate = (day: moment.Moment) => startDate && day.isSame(startDate, 'day');
  const isEndDate = (day: moment.Moment) => endDate && day.isSame(endDate, 'day');

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.calendarContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ width: '75%' }}>
                <View style={{ flexDirection: 'row' }}>
                  <RenderDropdown
                    label="Month"
                    value={selectedMonth}
                    onChange={(item) => setSelectedMonth(item.value)}
                  />
                  <RenderDropdown
                    label="Year"
                    value={selectedYear}
                    onChange={(item) => setSelectedYear(item.value)}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={{ marginLeft: 'auto' }}>
                <Icon name='cross_icon_thin' size={30} style={{ marginLeft: 15, bottom: 10 }} />
              </TouchableOpacity>
            </View>
            <View>
              <View style={{ backgroundColor: '#E4E7EB', height: 1, width: '100%', marginVertical: 10 }} />
              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                {shortWeekdays.map((day, index) => (
                  <Text key={index} style={{ color: '#ABB4BD', flex: 1, textAlign: 'center' }}>
                    {day}
                  </Text>
                ))}
              </View>
              <View style={styles.daysRow}>
                {days.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.day,
                      isStartDate(day) && styles.startDate,
                      isEndDate(day) && styles.endDate,
                      isDateInRange(day) && styles.inRangeDate,
                    ]}
                    onPress={() => handleDateSelect(day)}
                  >
                    <Text
                      style={{
                        color: day.month() === (selectedMonth - 1) ? colors.blackColor : '#ABB4BD',
                        fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal',
                        textAlign: 'center',
                      }}
                      fontVariant="bold"
                    >
                      {day.date()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarPicker;

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    top: "42%",
    alignSelf: "center",
    position: 'absolute',
    zIndex: 1000,
    left: 10,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    width: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    color: '#ABB4BD',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  day: {
    width: '14.28%',
    textAlign: 'center',
    paddingVertical: 10,
    alignItems: 'center',
  },
  startDate: {
    backgroundColor: '#F4C24A',
    borderRadius: 20,
  },
  endDate: {
    backgroundColor: '#F4C24A',
    borderRadius: 20,
  },
  inRangeDate: {
    backgroundColor: '#FCEBC5',
    borderRadius: 20,
  },
});
