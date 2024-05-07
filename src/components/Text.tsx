import React, {FC, ReactNode} from 'react';
import {
  Text as RNText,
  TextProps,
  TextStyle,
  StyleSheet,
} from 'react-native';

import {FONT_STYLES, OPACITY} from '../config/themes';
import {
  FontSizeValuesTypes,
  FontStyleValuesTypes,
  FontVariantValuesTypes,
  OpacityValuesTypes,
  ColorTypes,
} from '../config/types';
import applyStyleModifiers from '../utils/functions/styleModifiers';

export interface TextPropsTypes extends TextProps {
  children?: ReactNode;
  color?: ColorTypes;
  size?: FontSizeValuesTypes;
  opacity?: OpacityValuesTypes;
  fontVariant?: FontVariantValuesTypes;
  fontStyle?: FontStyleValuesTypes;
  style?: TextStyle;
}

const Text: FC<TextPropsTypes> = ({children, opacity, style, ...rest}) => {
  let selectedTextStyle: TextStyle = StyleSheet.flatten(
    applyStyleModifiers(FONT_STYLES.normal, rest),
  );
  if (opacity) {
    selectedTextStyle.opacity = OPACITY[opacity];
  }

  return (
    <RNText
      style={{
        ...selectedTextStyle,
        ...style
      }}
      {...rest}>
      {children}
      </RNText>
  );
};

export default Text;
