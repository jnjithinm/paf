import React, { FC, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';

import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import Text from './Text';
import colors from '../config/colors';
import Icon from './Icon';

const generateCalendar = (
  month: number | undefined,
  year: number | undefined,
) => {
  const startOfMonth = moment([
    year || moment().year(),
    month ? month - 1 : moment().month(),
  ]).startOf('month');
  const endOfMonth = moment([
    year || moment().year(),
    month ? month - 1 : moment().month(),
  ]).endOf('month');
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
  value: number | undefined;
  onChange: (item: any) => void;
};

const RenderDropdown: FC<RenderDropdownTypes> = ({
  label,
  value,
  onChange,
}) => {
  const generateMonths = () => {
    return moment.months().map((month, index) => ({
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
    <View style={{ width: label === 'Month' ? '50%' : '30%' }}>
      <Dropdown
        data={label === 'Month' ? generateMonths() : generateYears()}
        labelField={'label'}
        valueField={'value'}
        onChange={onChange}
        value={value?.toString()}
        placeholder={label}
        placeholderStyle={{ color: '#1F2933' }}
        iconColor="transparent"
        style={{ width: '100%', backgroundColor: '#FFF', padding: 10, borderRadius: 5, borderColor: '#E4E7EB', borderWidth: 1 }}
        itemTextStyle={{ color: colors.blackColor }}
        selectedTextStyle={{ color: colors.blackColor }}
      />
    </View>
  );
};

const CalendarPicker: FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [days, setDays] = useState<moment.Moment[]>([]);

  useEffect(() => {
    const generatedDays = generateCalendar(selectedMonth, selectedYear);
    setDays(generatedDays);
  }, [selectedMonth, selectedYear]);

  const shortWeekdays = moment.weekdaysShort();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.calendarContainer}>
          <View style={styles.header}>
            <RenderDropdown
              label="Month"
              value={selectedMonth}
              onChange={item => setSelectedMonth(item.value)}
            />
           
            <RenderDropdown
              label="Year"
              value={selectedYear}
              onChange={item => setSelectedYear(item.value)}
            />

            <TouchableOpacity onPress={onClose}>
              <Icon name='cross_icon_thin' size={30} style={{ marginLeft: 10,bottom:20 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.weekdaysContainer}>
            {shortWeekdays.map((day, index) => (
              <Text key={index} style={styles.weekdayText}>{day}</Text>
            ))}
          </View>
          <View style={styles.daysContainer}>
            {days.map((day, index) => (
              <TouchableOpacity key={index} style={styles.dayContainer}>
 <Text style={{ color: day.month() === moment().month() ? colors.blackColor : day.isSame(moment(), 'day') ? '#000' : '#ABB4BD', fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal', textAlign: 'center' }} fontVariant="bold">
                  {day.date()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarPicker;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayText: {
    color: '#ABB4BD',
    fontWeight: '600',
    width: '14%',
    textAlign: 'center',
    fontSize:14
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayContainer: {
    width: '14%',
    paddingVertical: 10,
    alignItems: 'center',
  },
 
});
