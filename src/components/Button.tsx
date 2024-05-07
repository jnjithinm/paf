import React, {FC} from 'react';
import {
  DimensionValue,
  Platform,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';


import Icon, {IconTypes} from './Icon';
import { ColorTypes } from '../config/types';
import colors from '../config/colors';
import { FONT_SIZES, FONT_VARIANT } from '../config/themes';


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
}) => {
  let bgColor = colors[backgroundColor];

  return (
    <TouchableOpacity
      style={{
        height: 50,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        flexDirection: 'row',
        width: halfSize ? '48%' : '100%',
        opacity:active?undefined:0.3,
        marginVertical,
        ...style,
      }}
      disabled={!active}
      onPress={onPress}>
      {icon && (
        <Icon
          name={icon}
          stroke={colors.backgroundColor}
          width={15}
          height={15}
        />
      )}
      <Text
        style={[
          {
            color:active? colors.backgroundColor:colors.blackColor,
            fontSize: FONT_SIZES.body1,
            fontFamily: FONT_VARIANT.semiBold,
            ...textStyle,
          },
        ]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
export default Button;
