import React, { FC, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from './Icon'; // Assuming you have an Icon component for the cross icon
import colors from '../config/colors';
import Text from './Text';

const generateCalendar = (month: number | undefined, year: number | undefined) => {
  const startOfMonth = moment([year || moment().year(), month ? month - 1 : moment().month()]).startOf('month');
  const endOfMonth = moment([year || moment().year(), month ? month - 1 : moment().month()]).endOf('month');
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

const RenderDropdown: FC<any> = ({ label, value, onChange }) => {
  const generateMonths = () => {
    const months = moment.monthsShort();
    return months.map((month, index) => ({
      label: month,
      value: (index + 1).toString(),
    }));
  };

  const generateYears = () => {
    const startYear = 1950;
    const endYear = new Date().getFullYear();
    const years = [];
    for (let year = endYear; year >= startYear; year--) {
      years.push({
        label: year.toString(),
        value: year.toString(),
      });
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
        value={value?.toString()}
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

const Calendar: FC<{ onDateChange: (startDate: string) => void, onClose: () => void }> = ({ onDateChange, onClose }) => {
  const currentMonth = moment().month() + 1;
  const currentYear = moment().year();

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [days, setDays] = useState<moment.Moment[]>([]);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | undefined>(undefined);

  const weekdays = moment.weekdays();
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  useEffect(() => {
    setDays(generateCalendar(selectedMonth, selectedYear));
  }, [selectedMonth, selectedYear]);

  const handleDateSelect = (day: moment.Moment) => {
    setSelectedDate(day);
    onDateChange(day.format('YYYY-MM-DD'));
  };

  return (
    <View style={styles.CalendarContent}>
      {/* Close Icon */}
      <TouchableOpacity style={styles.closeIconContainer} onPress={onClose}>
        <Icon name='cross_icon_thin' size={24} />
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <RenderDropdown
            label={'Month'}
            onChange={item => setSelectedMonth(Number(item.value))}
            value={selectedMonth}
          />
          <RenderDropdown
            label={'Year'}
            onChange={item => setSelectedYear(Number(item.value))}
            value={selectedYear}
          />
        </View>

        <View style={{ marginVertical: 10, borderTopWidth: 1, borderColor: '#E4E7EB' }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {shortWeekdays.map((day, index) => (
            <Text key={index} style={styles.weekday}>
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
                day.isSame(selectedDate, 'day') && styles.selectedDate,
              ]}
              onPress={() => handleDateSelect(day)}
            >
              <Text
                style={{
                  color: day.month() === moment().month() ? colors.blackColor : '#ABB4BD',
                  fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal',
                  textAlign: 'center',
                }}
              >
                {day.date()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  CalendarContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 15,
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
  selectedDate: {
    backgroundColor: '#F4C24A',
    borderRadius: 20,
  },
  closeIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
