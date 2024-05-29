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
import { RatingInput } from '../screens/reports/AddNewEvidenceCard';


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

type RenderButtonsTypes = {
  proceedButtonText: string;
  cancelButtonText?: string;
  onPressProceedButton: () => void;
  onPressCancelButton: () => void;
  style?: ViewStyle;
};

const RenderButtons: FC<RenderButtonsTypes> = ({
  proceedButtonText,
  cancelButtonText = 'Cancel',
  onPressProceedButton,
  onPressCancelButton,
  style,
}) => (
  <View
    style={{
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      ...style,
    }}>
    <TouchableOpacity
      style={{
        backgroundColor: '#EA7804',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 5,
        width: '47%',
      }}
      onPress={onPressProceedButton}>
      <Text color="backgroundColor">{proceedButtonText}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        borderColor: '#EA7804',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 8,
        width: '47%',
      }}
      onPress={onPressCancelButton}>
      <Text style={{color: '#EA7804'}}>{cancelButtonText}</Text>
    </TouchableOpacity>
  </View>
);

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

interface ModalPropsTypes {
  onProceed: () => void;
  onClose: () => void;
  isVisible: boolean;
  title?: string;
  content?: ReactNode;
  Close?: string;
  isOKCancelButtonsNeeded?: boolean;
  closeButton?: boolean;
  renderButton?: ReactNode;
}

const Modal: FC<ModalPropsTypes> = ({
  onProceed,
  onClose,
  isVisible,
  title,
  content,
  isOKCancelButtonsNeeded,
  closeButton,
  renderButton,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<
    number | undefined
  >();
  const [selectedStartMonth, setSelectedStartMonth] = useState<
    number | undefined
  >(undefined);
  const [selectedStartYear, setSelectedStartYear] = useState<
    number | undefined
  >(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<number | undefined>();
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
  // Map through weekdays to get the first 2 letters of each day
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  //   const handleOnChange=(item:any)=>{
  // se
  //   }
  // console.log("see",selectedMonth,selectedYear)
  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {title && (
            <View style={styles.header}>
              <Text
                color="blackColor"
                style={{justifyContent: 'flex-start'}}
                fontVariant="semiBold"
                size="body1">
                {title}
              </Text>
              {closeButton && (
                <TouchableOpacity onPress={() => onClose()}>
                  <Icon name="cross_icon" width={20} height={20} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text size="body2" fontVariant="bold">
              Filter
            </Text>
            <Text size="body1" fontVariant="bold">
              sort by filtering
            </Text>
            <RatingInput label={''} rating={0} onChangeRating={() => {}} />
            <Text size="body1" fontVariant="bold">
              By date
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-evenly',
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

            {renderButton}
            {isOKCancelButtonsNeeded && (
              <RenderButtons
                onPressCancelButton={onClose}
                onPressProceedButton={onProceed}
                proceedButtonText="Apply"
                style={{marginTop: 25, alignSelf: 'flex-end'}}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 150,
    height: '100%',
  },
  modalContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    // width: '80%',
  },
  header: {
    backgroundColor: colors.secondaryColor,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingHorizontal: 10,
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
