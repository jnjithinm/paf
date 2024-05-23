import React, { FC } from 'react';
import {
  DimensionValue,
  Platform,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';


import Icon, { IconTypes } from './Icon';
import Images, {ImageIconNames} from '../components/Image';
import { ColorTypes } from '../config/types';
import colors from '../config/colors';
import { FONT_SIZES, FONT_VARIANT } from '../config/themes';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';


interface ButtonPropsType {
  text: string;
  active: boolean;
  onPress: () => void;
  halfSize?: boolean;
  marginVertical?: DimensionValue;
  backgroundColor?: ColorTypes;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: IconTypes;
  image?: ImageIconNames;
}

const Button: FC<ButtonPropsType> = ({
  text,
  active,
  onPress,
  halfSize,
  marginVertical,
  backgroundColor = 'primaryColor',
  style,
  textStyle,
  icon,
  image
}) => {
  let bgColor = colors[backgroundColor];

  return (
    <TouchableOpacity
      style={{
        height: normaliseDesigns(35),
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        flexDirection: 'row',
        width: halfSize ? '48%' : '100%',
        opacity: active ? undefined : 0.3,
        marginVertical,
        ...style,
      }}
      disabled={!active}
      onPress={onPress}>
      {icon && (
        <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
          <Icon
            name={icon}
            stroke={colors.backgroundColor}
            width={15}
            height={15}
          />
        </View>
      )}
      {image && (
        <View style={{ width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center' , }}>
          <Images
            name={image}
            width={15}
            height={15}
          />
        </View>
      )}
      <View style={{ width: '80%',  height: '100%',justifyContent: 'center', alignItems: 'center' , }}>

        <Text
          style={[
            {
              color: active ? colors.backgroundColor : colors.blackColor,
              fontSize: FONT_SIZES.body1,
              fontFamily: FONT_VARIANT.semiBold,
              flexWrap: 'wrap',
              paddingHorizontal: 5,
              textAlign: 'center',
              ...textStyle,
            },

          ]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default Button;
