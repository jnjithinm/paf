import React, {Dispatch, SetStateAction, useState, FC, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import Text from './Text';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';

type RatingRadioButtonPropsTypes = {
  onChange: Dispatch<SetStateAction<number>>;
  value?: number;
  disabled?: boolean;
  style?: ViewStyle;
  lowLabel?: string;
  highLabel?: string;
};

const RatingRadioButton: FC<RatingRadioButtonPropsTypes> = ({
  onChange,
  value = 0,
  disabled = false,
  style,
  lowLabel = 'Low',
  highLabel = 'High',
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  useEffect(() => {
    setSelectedIndex(value - 1);
  }, [value]);

  const handlePress = (index: number) => {
    const newValue = index + 1;
    setSelectedIndex(index);
    onChange(newValue);
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelsContainer}>
        <Text fontVariant="regular" size="small1" style={styles.lowLabel}>
          {lowLabel}
        </Text>
        <View style={styles.numberContainer}>
          {[1, 2, 3, 4, 5].map((item, index) => (
            <View>
              <Text
                key={item}
                fontVariant="regular"
                size="small1"
                style={styles.numberLabel}>
                {item}
              </Text>
              <TouchableOpacity
                key={index}
                disabled={disabled}
                onPress={() => handlePress(index)}
                style={[
                  styles.radioButton,
                  selectedIndex === index ? styles.radioButtonSelected : null,
                ]}>
                {selectedIndex === index && (
                  <View style={styles.radioButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text fontVariant="regular" size="small1" style={styles.highLabel}>
          {highLabel}
        </Text>
      </View>
    </View>
  );
};

export default RatingRadioButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  lowLabel: {
    flex: 1,
    textAlign: 'left',
    top:10
  },
  highLabel: {
    flex: 1,
    textAlign: 'right',
    alignItems: 'flex-end',
    top:10
  },
  numberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 3,
  },
  numberLabel: {
    textAlign: 'center',
    flex: 1,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  radioButton: {
    width: normaliseDesigns(14),
    height: normaliseDesigns(14),
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderColor: '#ABB4BD',
    marginTop:5
  },
  radioButtonSelected: {
    borderColor: '#EA7804',
  },
  radioButtonInner: {
    width: normaliseDesigns(9),
    height: normaliseDesigns(9),
    borderRadius: 10,
    backgroundColor: '#EA7804',
  },
});
