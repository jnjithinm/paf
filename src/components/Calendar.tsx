import React, {FC, ReactNode, useState} from 'react';
import {
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import Text from './Text';
import Icon from './Icon';
import colors from '../config/colors';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import Button from './Button';
import RatingInput from './RatingInput';

const generateCalendar = (
  month: number | undefined,
  year: number | undefined,
) => {
  const startOfMonth = moment([
    year || moment().year(),
    month ? month - 1 : moment().month() - 1,
  ]).startOf('month');
  const endOfMonth = moment([
    year || moment().year(),
    month ? month - 1 : moment().month() - 1,
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

const RenderDropdown: FC<RenderDropdownTypes> = ({label, value, onChange}) => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const monthNumber = i + 1;
    months.push({
      label: monthNumber?.toString(),
      value: monthNumber?.toString(),
    });
  }
  const startYear = 1900;
  const endYear = 2024;

  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push({label: year?.toString(), value: year?.toString()});
  }
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', width: '50%'}}>
      <Dropdown
        data={label === 'Month' ? months : years}
        labelField={'label'}
        valueField={'label'}
        onChange={onChange}
        value={
          value !== undefined
            ? value?.toString()
            : label === 'Year'
            ? moment().year()
            : moment().month()
        }
        placeholder={label}
        placeholderStyle={{color: '#CBD2D9'}}
        iconColor="transparent"
        style={{width: '100%'}}
      />
      <Icon name="up_and_down_selection" style={{right: 25}} />
    </View>
  );
};

const dateFilterOptions: string[] = [
  'Last week',
  'This week',
  'Past 3 months',
  'Past 1 year',
];

interface CalendarPropsTypes {
  onProceed: () => void;
  onClose: () => void;
  isVisible: boolean;
  rating?:number;
}

type FilterObject={
  rating:number,
  date:{
    startDate:string,
    endDate:string
  }
}

const Calendar: FC<CalendarPropsTypes> = ({
  onProceed,
  onClose,
  isVisible,
  rating
}) => {

  const [selectedStartMonth, setSelectedStartMonth] = useState<
    number | undefined
  >(undefined);
  const [selectedStartYear, setSelectedStartYear] = useState<
    number | undefined
  >(undefined);

  const [selectedEndMonth, setSelectedEndMonth] = useState<number | undefined>(
    undefined,
  );
  const [selectedEndYear, setSelectedEndYear] = useState<number | undefined>(
    undefined,
  );
  const [selectedFilterByDate, setSelectedFilterByDate] = useState<
    string | undefined
  >(undefined);
  
  const weekdays = moment.weekdays();
  const days = generateCalendar(selectedStartMonth, selectedStartYear);
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <View style={styles.CalendarOverlay} />
      <View style={styles.CalendarContainer}>
        <View style={styles.CalendarContent}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
              <Text size="body2" fontVariant="bold">
                Filter
              </Text>
              <TouchableOpacity
                style={{justifyContent: 'flex-end'}}
                onPress={() => onClose()}>
                <Icon name="cross_icon_thin" width={10} height={10} />
              </TouchableOpacity>
            </View>
            <Text size="body1" fontVariant="bold" style={{marginVertical:5}}>
              sort by filtering
            </Text>
            <RatingInput label={''} rating={0} onChangeRating={() => {}} showRating={false}/>
            <Text size="body1" fontVariant="bold" style={{marginVertical:5}}>
              By date
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
                width:'85%',
                alignContent:'flex-start'
              }}>
              {dateFilterOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    borderColor:
                      selectedFilterByDate === item ? '#F4C24A' : '#E4E7EB',
                    borderWidth: 1,
                    backgroundColor:
                      selectedFilterByDate === item ? '#FCEBC5' : undefined,
                    paddingHorizontal: 20,
                    paddingVertical: 5,
                    borderRadius: 5,
                    marginBottom: 10,
                    alignContent:'flex-start'
                  }}
                  onPress={() => {
                    setSelectedFilterByDate(item);
                  }}>
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View style={{width: '50%'}}>
                <Text style={{color: '#ABB4BD'}} size="small1">
                  Start date
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <RenderDropdown
                    label={'Month'}
                    onChange={item => {
                      setSelectedStartMonth(Number(item.value));
                    }}
                    value={selectedStartMonth}
                  />
                  <RenderDropdown
                    label={'Year'}
                    onChange={item => {
                      setSelectedStartYear(Number(item.value));
                    }}
                    value={selectedStartYear}
                  />
                </View>
              </View>
              <View
                style={{
                  height: 20,
                  backgroundColor: '#E4E7EB',
                  width: 1,
                  alignSelf: 'flex-end',
                }}
              />
              <View style={{width: '50%'}}>
                <Text style={{color: '#ABB4BD'}} size="small1">
                  End date
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <RenderDropdown
                    label={'Month'}
                    onChange={item => {
                      setSelectedEndMonth(Number(item.value));
                    }}
                    value={selectedEndMonth}
                  />
                  <RenderDropdown
                    label={'Year'}
                    onChange={item => {
                      setSelectedEndYear(Number(item.value));
                    }}
                    value={selectedEndYear}
                  />
                </View>
              </View>
            </View>
            <View>
              <View
                style={{
                  backgroundColor: '#E4E7EB',
                  height: 1,
                  width: '100%',
                  marginVertical: 10,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  justifyContent: 'space-between',
                }}>
                {shortWeekdays.map((day, index) => (
                  <Text
                    key={index}
                    style={{color: '#ABB4BD', flex: 1, textAlign: 'center'}}>
                    {day}
                  </Text>
                ))}
              </View>

              <View style={styles.daysRow}>
                {days.map((day, index) => (
                  <TouchableOpacity style={styles.day}>
                    <Text
                      key={index}
                      style={{
                        color:
                          selectedStartMonth !== undefined &&
                          selectedStartYear !== undefined &&
                          day.month() === selectedStartMonth - 1 &&
                          day.year() === selectedStartYear
                            ? '#000'
                            : '#ABB4BD',
                        fontWeight: day.isSame(moment(), 'day')
                          ? 'bold'
                          : 'normal',
                        textAlign: 'center',
                      }}
                      fontVariant="bold">
                      {day.date()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Button
              text="Apply"
              style={{marginTop: 20}}
              active
              onPress={() => {}}
            />
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  CalendarOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  CalendarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: normaliseDesigns(150),
    height: '100%',
  },
  CalendarContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    // width: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  buttonsContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: 20,
    right: 20,
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
});
