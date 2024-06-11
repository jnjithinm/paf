import React, { Dispatch, SetStateAction, useState, FC, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import colors from '../config/colors';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';

type CheckboxGroupPropsTypes = {
  options: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
  values?: string[];
  disabled?: boolean;
  style?: ViewStyle;
};

const CheckboxGroup: FC<CheckboxGroupPropsTypes> = ({
  options,
  onChange,
  values = [],
  disabled = false,
  style,
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const newIndexes = options.map((option, index) =>
      values.includes(option) ? index : -1
    ).filter(index => index !== -1);

    if (JSON.stringify(newIndexes) !== JSON.stringify(selectedIndexes)) {
      setSelectedIndexes(newIndexes);
    }
  }, [values, options]);

  const handlePress = (index: number, label: string) => {
    let newSelectedIndexes;
    let newValue;

    if (selectedIndexes.includes(index)) {
      newSelectedIndexes = selectedIndexes.filter(i => i !== index);
      newValue = values.filter(v => v !== label);
    } else {
      newSelectedIndexes = [...selectedIndexes, index];
      newValue = [...values, label];
    }

    setSelectedIndexes(newSelectedIndexes);
    onChange(newValue);
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
                padding: 5,
                borderRadius: 7,
                marginVertical: 3
              }}>
              <View
                style={[
                  styles.Checkbox,
                  selectedIndexes.includes(index)
                    ? { borderColor: colors.secondaryColor }
                    : null,
                ]}>
                {selectedIndexes.includes(index) && (
                  <View style={styles.CheckboxSelected} />
                )}
              </View>
              <Text fontVariant="regular" size="small1" style={{ width: '100%', color: '#4E565F' }}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

export default CheckboxGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  Checkbox: {
    width: normaliseDesigns(12),
    height: normaliseDesigns(12),
    borderRadius: 2,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderColor: '#ABB4BD'
  },
  CheckboxSelected: {
    width: normaliseDesigns(8),
    height: normaliseDesigns(8),
    borderRadius: 1,
    backgroundColor: colors.secondaryColor,
  },
});
