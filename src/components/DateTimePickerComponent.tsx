import React, {FC, useState} from 'react';
import {View, Button, Platform, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimePickerProps {
  selectedDate: Date;
  onDateChange: (date: string) => void;
  showPicker: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
}

const DateTimePickerComponent: FC<DateTimePickerProps> = ({
  selectedDate,
  onDateChange,
  showPicker,
  minimumDate,
  maximumDate,
}) => {
  const onChange = (event: any, selectedDate: Date | undefined) => {
    onDateChange( selectedDate?.toString()||'');
  };

  // const minDate = new Date();
  // minDate.setDate(minDate.getDate() - 3);

  // console.log("fffff",new Date(), minDate);

  return (
    <View>
      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate || new Date()}
          mode={'date'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
};

export default DateTimePickerComponent;
