import React, {Dispatch, SetStateAction, useState, FC, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import Text from './Text';
import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';

type RadioButtonGroupPropsTypes = {
  options: string[];
  onChange: Dispatch<SetStateAction<string>>;
  onChangeValues?: () => void;
  value?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const RadioButtonGroup: FC<RadioButtonGroupPropsTypes> = ({
  options,
  onChange,
  value = '',
  disabled = false,
  onChangeValues,
  style,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const newValueIndex = options.findIndex(option => option === value);

    if (newValueIndex !== -1) {
      setSelectedIndex(newValueIndex);
    } else {
      setSelectedIndex(-1);
    }
  }, [value, options]);

  const handlePress = (index: number, label: string) => {
    if (onChangeValues) {
      onChangeValues();
    }
    onChange(label);
  };

  let modifiedOptions = [...options];
  const remainder = options.length % 3;
  if (remainder === 1 || remainder === 2) {
    const numToAdd = 3 - remainder;
    for (let i = 0; i < numToAdd; i++) {
      modifiedOptions.push('');
    }
  }

  return (
    <View>
      {modifiedOptions.map((item, index) => (
        <View
          style={{
            width: '100%',
            flex: 1,
          }}
          key={index}>
          {item !== '' && (
            <TouchableOpacity
              key={index}
              disabled={disabled}
              onPress={() => handlePress(index, item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: '#E4E7EB',
                borderWidth: 1,
                width: '65%',
                padding:5,
                borderRadius:7,
                marginVertical:3
              }}>
              <View
                style={[
                  styles.RadioButton,
                  selectedIndex === index
                    ? {borderColor: colors.secondaryColor}
                    : null,
                ]}>
                {selectedIndex === index && (
                  <View style={styles.RadioButtonSelected} />
                )}
              </View>
              <Text fontVariant="regular" size="small1" style={{width: '100%',color:'#4E565F'}}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

export default RadioButtonGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  RadioButton: {
    width: normaliseDesigns(12),
    height: normaliseDesigns(12),
    borderRadius: 12,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderColor:'#ABB4BD'
  },
  RadioButtonSelected: {
    width: normaliseDesigns(11),
    height: normaliseDesigns(11),
    borderRadius: 8,
    backgroundColor: colors.secondaryColor,
  },
});
