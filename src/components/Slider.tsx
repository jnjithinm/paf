import React, {Dispatch, FC, SetStateAction} from 'react';
import {Platform, StyleSheet, View} from 'react-native';

import {Slider as RNSlider} from '@rneui/themed';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';


interface SliderPropsTypes {
  minValue?: number;
  maxValue?: number;
  value: number;
  onChange:(text: number) => void;
  onChangeValue?: (text: string) => void;
  disabled?: boolean;
  stepWise?: boolean;
  step?: number;
}

const Slider: FC<SliderPropsTypes> = ({
  minValue = 0,
  maxValue = 100,
  value = 50,
  onChange,
  onChangeValue,
  disabled = false,
  stepWise,
  step = 1,
}) => {

  return (
    <View>
      <RNSlider
        value={value}
        onValueChange={value => {
          onChange(value);
          if (onChangeValue) onChangeValue(String(value));
        }}
        maximumValue={maxValue}
        minimumValue={minValue}
        disabled={disabled}
        minimumTrackTintColor={'#EA7804'}
        maximumTrackTintColor={'#E4E7EB'}
        step={step}
        // animateTransitions
        // allowTouchTrack
        // thumbTouchSize={}
        trackStyle={{
          height: 6.5,
          backgroundColor: 'transparent',
          borderRadius: 20,
        }}
        thumbStyle={{backgroundColor: 'transparent', height:normaliseDesigns(14), width: normaliseDesigns(14)}}
        thumbProps={{
          children: (
            <View
              style={{
                height:normaliseDesigns(14),
                width: normaliseDesigns(14),
                borderRadius: 20,
                backgroundColor: '#EA7804',
                alignItems: 'center',
                justifyContent: 'center',
                ...Platform.select({
                  ios: {
                    shadowColor: colors.blackColor,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                  },
                  android: {
                    elevation: 5,
                  },
                }),
                
              }}>
              <View
                style={{
                  height:normaliseDesigns(7),
                  width:  normaliseDesigns(7),
                  borderRadius: 20,
                  backgroundColor: colors.backgroundColor,
                }}
              />
            </View>
          ),
        }}
      />
      {stepWise && (
        <View
          style={{
            // width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {Array.from({length: (maxValue - minValue) / step + 1}).map(
            (item, index) => (
              <View
                key={index}
                style={[
                  styles.dottedLineContainer,
                  {
                    backgroundColor:
                      index !== (maxValue - minValue) / step &&
                      index !== 0 &&
                      index != (value - minValue) / step
                        ? colors.backgroundColor
                        : 'transparent',
                  },
                ]}
              />
            ),
          )}
        </View>
      )}
    </View>
  );
};

export default Slider;
const styles = StyleSheet.create({
  dottedLineContainer: {
    height: 3,
    width: 3,
    borderRadius: 10,
    bottom: 21.5,
    alignSelf: 'center',
    justifyContent: 'center',
  },
});
