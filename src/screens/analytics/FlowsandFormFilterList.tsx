// import React, { FC, useState, useEffect } from 'react';
// import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// import Text from '../../components/Text';
// import moment from 'moment';
// import { Dropdown } from 'react-native-element-dropdown';
// import Icon from '../../components/Icon';
// import colors from '../../config/colors';

// const generateCalendar = (
//   month: number | undefined,
//   year: number | undefined,
// ) => {
//   const startOfMonth = moment([
//     year || moment().year(),
//     month ? month - 1 : moment().month(),
//   ]).startOf('month');
//   const endOfMonth = moment([
//     year || moment().year(),
//     month ? month - 1 : moment().month(),
//   ]).endOf('month');
//   const startOfCalendar = startOfMonth.startOf('week');
//   const endOfCalendar = endOfMonth.endOf('week');

//   const days = [];
//   let day = startOfCalendar;

//   while (day <= endOfCalendar) {
//     days.push(day.clone());
//     day = day.add(1, 'day');
//   }

//   return days;
// };

// type RenderDropdownTypes = {
//   label: 'Month' | 'Year';
//   selection: 'Start' | 'End';
//   value: number | undefined;
//   selectedStartMonth?: number;
//   selectedStartYear?: number;
//   selectedEndYear?: number;
//   onChange: (item: any) => void;
//   disabled?: boolean;
// };

// const RenderDropdown: FC<RenderDropdownTypes> = ({
//   label,
//   selection,
//   value,
//   onChange,
//   selectedStartMonth = 1,
//   selectedStartYear,
//   selectedEndYear,
//   disabled,
// }) => {
//   const generateMonths = () => {
//     const months = [];
//     for (let i = 1; i <= 12; i++) {
//       months.push({
//         label: i.toString(),
//         value: i.toString(),
//       });
//     }
//     return months;
//   };

//   const generateYears = () => {
//     const startYear = 1950;
//     const endYear = new Date().getFullYear();

//     const years = [];
//     for (
//       let year = endYear;
//       year >=
//       (selection === 'End' ? selectedStartYear || startYear : startYear);
//       year--
//     ) {
//       years.push({
//         label: year.toString(),
//         value: year.toString(),
//       });
//     }

//     return years;
//   };

//   return (
//     <View style={{ flexDirection: 'row', alignItems: 'center', width: '50%' }}>
//       <Dropdown
//         data={label === 'Month' ? generateMonths() : generateYears()}
//         labelField={'label'}
//         valueField={'value'}
//         onChange={onChange}
//         value={value?.toString()}
//         placeholder={label}
//         placeholderStyle={{ color: '#CBD2D9' }}
//         iconColor="transparent"
//         style={{ width: '100%' }}
//         itemTextStyle={{ color: colors.blackColor }}
//         selectedTextStyle={{ color: colors.blackColor }}
//         disable={disabled}
//       />
//       <Icon name="up_and_down_selection" style={{ right: 25 }} />
//     </View>
//   );
// };

// export type FilterObject = {
//   date?: {
//     startDate: string;
//     endDate: string;
//   };
// };

// interface CalendarPropsTypes {
//   onDateChange: (startDate: string, endDate: string) => void;
// }

// const Calendar: FC<CalendarPropsTypes> = ({ onDateChange }) => {
//   const [selectedStartMonth, setSelectedStartMonth] = useState<number | undefined>(undefined);
//   const [selectedStartYear, setSelectedStartYear] = useState<number | undefined>(undefined);
//   const [selectedEndMonth, setSelectedEndMonth] = useState<number | undefined>(undefined);
//   const [selectedEndYear, setSelectedEndYear] = useState<number | undefined>(undefined);
//   const [startDate, setStartDate] = useState<moment.Moment | undefined>(undefined);
//   const [endDate, setEndDate] = useState<moment.Moment | undefined>(undefined);

//   const weekdays = moment.weekdays();
//   const days = generateCalendar(selectedStartMonth, selectedStartYear);
//   const shortWeekdays = weekdays.map(day => day.slice(0, 2));

//   const handleStartDateChange = (month: number, year: number) => {
//     setSelectedStartMonth(month);
//     setSelectedStartYear(year);
//     setStartDate(undefined);
//     setSelectedEndMonth(undefined);
//     setSelectedEndYear(undefined);
//   };

//   const handleEndDateChange = (month: number, year: number) => {
//     setSelectedEndMonth(month);
//     setSelectedEndYear(year);
//     setEndDate(undefined);
//   };

//   const handleDateSelect = (day: moment.Moment) => {
//     if (!startDate || (startDate && endDate)) {
//       setStartDate(day);
//       setEndDate(undefined);
//       setSelectedStartMonth(day.month() + 1);
//       setSelectedStartYear(day.year());
//       setSelectedEndMonth(undefined);
//       setSelectedEndYear(undefined);
//     } else if (startDate && !endDate) {
//       if (day.isBefore(startDate, 'day')) {
//         setStartDate(day);
//         setSelectedStartMonth(day.month() + 1);
//         setSelectedStartYear(day.year());
//       } else {
//         setEndDate(day);
//         setSelectedEndMonth(day.month() + 1);
//         setSelectedEndYear(day.year());
//       }
//     }
//   };

//   useEffect(() => {
//     if (startDate && endDate) {
//       onDateChange(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
//     }
//   }, [startDate, endDate]);

//   const isDateInRange = (day: moment.Moment) => {
//     if (startDate && endDate) {
//       return day.isBetween(startDate, endDate, 'day', '[]');
//     }
//     return false;
//   };

//   const isStartDate = (day: moment.Moment) => {
//     return startDate && day.isSame(startDate, 'day');
//   };

//   const isEndDate = (day: moment.Moment) => {
//     return endDate && day.isSame(endDate, 'day');
//   };

//   return (
//     <View style={styles.CalendarContent}>
//       <ScrollView contentContainerStyle={styles.contentContainer}>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//           <View style={{ width: '50%' }}>
//             <Text style={{ color: selectedStartMonth ? colors.blackColor : '#ABB4BD' }} fontVariant={selectedStartMonth ? 'bold' : undefined} size="small3">
//               Start date
//             </Text>
//             <View style={{ flexDirection: 'row' }}>
//               <RenderDropdown label={'Month'} onChange={item => handleStartDateChange(Number(item.value), selectedStartYear || moment().year())} selection="Start" value={selectedStartMonth} />
//               <RenderDropdown label={'Year'} onChange={item => handleStartDateChange(selectedStartMonth || moment().month() + 1, Number(item.value))} selection="Start" value={selectedStartYear} />
//             </View>
//           </View>
//           <View style={{ height: 20, backgroundColor: '#E4E7EB', width: 1, alignSelf: 'flex-end' }} />
//           <View style={{ width: '50%' }}>
//             <Text style={{ color: selectedEndMonth ? colors.blackColor : '#ABB4BD' }} fontVariant={selectedEndMonth ? 'bold' : undefined} size="small3">
//               End date
//             </Text>
//             <View style={{ flexDirection: 'row' }}>
//               <RenderDropdown label={'Month'} onChange={item => handleEndDateChange(Number(item.value), selectedEndYear || moment().year())} selection="End" selectedStartMonth={selectedStartMonth || 1} selectedStartYear={selectedStartYear || 1950} selectedEndYear={selectedEndYear} disabled={startDate == undefined} value={selectedEndMonth} />
//               <RenderDropdown label={'Year'} onChange={item => handleEndDateChange(selectedEndMonth || moment().month() + 1, Number(item.value))} selection="End" selectedStartMonth={selectedStartMonth || 1} selectedEndYear={selectedEndYear} selectedStartYear={selectedStartYear || 1950} value={selectedEndYear} disabled={startDate == undefined} />
//             </View>
//           </View>
//         </View>
//         <View>
//           <View style={{ backgroundColor: '#E4E7EB', height: 1, width: '100%', marginVertical: 10 }} />
//           <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
//             {shortWeekdays.map((day, index) => (
//               <Text key={index} style={{ color: '#ABB4BD', flex: 1, textAlign: 'center' }}>
//                 {day}
//               </Text>
//             ))}
//           </View>

//           <View style={styles.daysRow}>
//             {days.map((day, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[
//                   styles.day,
//                   isStartDate(day) && styles.startDate,
//                   isEndDate(day) && styles.endDate,
//                   isDateInRange(day) && styles.inRangeDate,
//                   { opacity: day.isAfter(moment(), 'day') ? 0.1 : undefined },
//                 ]}
//                 onPress={() => handleDateSelect(day)}
//                 disabled={day.isAfter(moment(), 'day')}
//               >
//                 <Text style={{ color: day.month() === moment().month() ? colors.blackColor : day.isSame(moment(), 'day') ? '#000' : '#ABB4BD', fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal', textAlign: 'center' }} fontVariant="bold">
//                   {day.date()}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default Calendar;

// const styles = StyleSheet.create({
//   CalendarContent: {
//     backgroundColor: colors.backgroundColor,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingHorizontal: 15,
//     paddingTop: 15,
//   },
//   contentContainer: {
//     paddingHorizontal: 15,
//     paddingTop: 15,
//   },
//   weekdaysRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   weekday: {
//     width: '14.28%',
//     textAlign: 'center',
//     color: '#ABB4BD',
//   },
//   daysRow: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 10,
//   },
//   day: {
//     width: '14.28%',
//     textAlign: 'center',
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   startDate: {
//     backgroundColor: '#F4C24A',
//     borderRadius: 20,
//   },
//   endDate: {
//     backgroundColor: '#F4C24A',
//     borderRadius: 20,
//   },
//   inRangeDate: {
//     backgroundColor: '#FCEBC5',
//     borderRadius: 20,
//   },
// });

import React, { FC, useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Text from '../../components/Text';
import moment from 'moment';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from '../../components/Icon';
import colors from '../../config/colors';

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
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push({
        label: i.toString(),
        value: i.toString(),
      });
    }
    return months;
  };

  const generateYears = () => {
    const startYear = 1950;
    const endYear = new Date().getFullYear();

    const years = [];
    for (
      let year = endYear;
      year >=
      (selection === 'End' ? selectedStartYear || startYear : startYear);
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
}

const Calendar: FC<CalendarPropsTypes> = ({ onDateChange }) => {
  const [selectedStartMonth, setSelectedStartMonth] = useState<number | undefined>(undefined);
  const [selectedStartYear, setSelectedStartYear] = useState<number | undefined>(undefined);
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | undefined>(undefined);
  const [selectedEndYear, setSelectedEndYear] = useState<number | undefined>(undefined);
  const [days, setDays] = useState<moment.Moment[]>([]);
  const [startDate, setStartDate] = useState<moment.Moment | undefined>(undefined);
  const [endDate, setEndDate] = useState<moment.Moment | undefined>(undefined);

  const weekdays = moment.weekdays();
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  useEffect(() => {
    setDays(generateCalendar(selectedStartMonth, selectedStartYear));
  }, [selectedStartMonth, selectedStartYear]);

  useEffect(() => {
    setDays(generateCalendar(selectedEndMonth, selectedEndYear));
  }, [selectedEndMonth, selectedEndYear]);

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
    <View style={styles.CalendarContent}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ width: '50%' }}>
            <Text style={{ color: selectedStartMonth ? colors.blackColor : '#ABB4BD' }} fontVariant={selectedStartMonth ? 'bold' : undefined} size="small3">
              Start date
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <RenderDropdown label={'Month'} onChange={item => handleStartDateChange(Number(item.value), selectedStartYear || moment().year())} selection="Start" value={selectedStartMonth} />
              <RenderDropdown label={'Year'} onChange={item => handleStartDateChange(selectedStartMonth || moment().month() + 1, Number(item.value))} selection="Start" value={selectedStartYear} />
            </View>
          </View>
          <View style={{ height: 20, backgroundColor: '#E4E7EB', width: 1, alignSelf: 'flex-end' }} />
          <View style={{ width: '50%' }}>
            <Text style={{ color: selectedEndMonth ? colors.blackColor : '#ABB4BD' }} fontVariant={selectedEndMonth ? 'bold' : undefined} size="small3">
              End date
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <RenderDropdown label={'Month'} onChange={item => handleEndDateChange(Number(item.value), selectedEndYear || moment().year())} selection="End" selectedStartMonth={selectedStartMonth || 1} selectedStartYear={selectedStartYear || 1950} selectedEndYear={selectedEndYear} disabled={startDate == undefined} value={selectedEndMonth} />
              <RenderDropdown label={'Year'} onChange={item => handleEndDateChange(selectedEndMonth || moment().month() + 1, Number(item.value))} selection="End" selectedStartMonth={selectedStartMonth || 1} selectedEndYear={selectedEndYear} selectedStartYear={selectedStartYear || 1950} value={selectedEndYear} disabled={startDate == undefined} />
            </View>
          </View>
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
                  { opacity: day.isAfter(moment(), 'day') ? 0.1 : undefined },
                ]}
                onPress={() => handleDateSelect(day)}
                disabled={day.isAfter(moment(), 'day')}
              >
                <Text style={{ color: day.month() === moment().month() ? colors.blackColor : day.isSame(moment(), 'day') ? '#000' : '#ABB4BD', fontWeight: day.isSame(moment(), 'day') ? 'bold' : 'normal', textAlign: 'center' }} fontVariant="bold">
                  {day.date()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  CalendarContent: {
    backgroundColor: colors.backgroundColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
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


