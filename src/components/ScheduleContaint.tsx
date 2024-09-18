import React, { FC, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Modal } from 'react-native';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../config/colors';
import Icon from './Icon';
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

type RenderDropdownTypes = {
  label: 'Month' | 'Year';
  selection: 'Start' | 'End';
  value: number | undefined;
  selectedStartMonth?: number;
  selectedStartYear?: number;
  selectedEndYear?: number;
  onChange: (item: any) => void;
  disabled?: boolean;
};

const RenderDropdown: FC<RenderDropdownTypes> = ({
  label,
  selection,
  value,
  onChange,
  selectedStartMonth = 1,
  selectedStartYear,
  selectedEndYear,
  disabled,
}) => {
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
    for (
      let year = endYear;
      year >= (selection === 'End' ? selectedStartYear || startYear : startYear);
      year--
    ) {
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
        disable={disabled}
      />
      <Icon name="up_and_down_selection" style={{ right: 25 }} />
    </View>
  );
};

export type FilterObject = {
  date?: {
    startDate: string;
    endDate: string;
  };
};

interface CalendarPropsTypes {
  onDateChange: (startDate: string, endDate: string) => void;
  visible: boolean;
  onClose: () => void;
}

const CalendarPicker: FC<CalendarPropsTypes> = ({ onDateChange, visible, onClose }) => {
  const [selectedStartMonth, setSelectedStartMonth] = useState<number | undefined>(undefined);
  const [selectedStartYear, setSelectedStartYear] = useState<number | undefined>(undefined);
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | undefined>(undefined);
  const [selectedEndYear, setSelectedEndYear] = useState<number | undefined>(undefined);
  const [startDate, setStartDate] = useState<moment.Moment | undefined>(undefined);
  const [endDate, setEndDate] = useState<moment.Moment | undefined>(undefined);

  const weekdays = moment.weekdays();
  const days = generateCalendar(selectedStartMonth, selectedStartYear);
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  const handleStartDateChange = (month: number, year: number) => {
    setSelectedStartMonth(month);
    setSelectedStartYear(year);
    setStartDate(undefined);
    setSelectedEndMonth(undefined);
    setSelectedEndYear(undefined);
  };

  const handleEndDateChange = (month: number, year: number) => {
    setSelectedEndMonth(month);
    setSelectedEndYear(year);
    setEndDate(undefined);
  };

  const handleDateSelect = (day: moment.Moment) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(undefined);
      setSelectedStartMonth(day.month() + 1);
      setSelectedStartYear(day.year());
      setSelectedEndMonth(undefined);
      setSelectedEndYear(undefined);
    } else if (startDate && !endDate) {
      if (day.isBefore(startDate, 'day')) {
        setStartDate(day);
        setSelectedStartMonth(day.month() + 1);
        setSelectedStartYear(day.year());
      } else {
        setEndDate(day);
        setSelectedEndMonth(day.month() + 1);
        setSelectedEndYear(day.year());
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

  useEffect(() => {
    if (startDate && endDate) {
      onDateChange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  }, [startDate, endDate]);

  const isDateInRange = (day: moment.Moment) => {
    if (startDate && endDate) {
      return day.isBetween(startDate, endDate, 'day', '[]');
    }
    return false;
  };

  const isStartDate = (day: moment.Moment) => {
    return startDate && day.isSame(startDate, 'day');
  };

  const isEndDate = (day: moment.Moment) => {
    return endDate && day.isSame(endDate, 'day');
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.calendarContainer}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ width: '75%' }}>
                <View style={{ flexDirection: 'row' }}>
                  <RenderDropdown
                    label={'Month'}
                    onChange={item => handleStartDateChange(Number(item.value), selectedStartYear || moment().year())}
                    selection="Start"
                    value={selectedStartMonth}
                  />
                  <RenderDropdown
                    label={'Year'}
                    onChange={item => handleStartDateChange(selectedStartMonth || moment().month() + 1, Number(item.value))}
                    selection="Start"
                    value={selectedStartYear}
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
                      day.isSame(moment(), 'day') && styles.today, // Highlight today's date
                    ]}
                    onPress={() => handleDateSelect(day)}
                  >
                    <Text
                      style={{
                        color: day.month() === moment().month() ? colors.blackColor : '#ABB4BD',
                        fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal',
                        textAlign: 'center'
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
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
    width: '80%', // Adjust the width as necessary
    maxWidth: 400, // Ensures a max width for larger screens
    bottom: 130,
    right: 25,
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
  today: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    borderRadius: 20,
  },
});
