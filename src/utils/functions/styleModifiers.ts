import {TextStyle, ViewStyle, StyleProp} from 'react-native';

import colors from '../../config/colors'
import {FONT_SIZES, FONT_STYLES, FONT_VARIANT} from '../../config/themes'
import {
  ColorTypes,
  FontSizeValuesTypes,
  FontStyleValuesTypes,
  FontVariantValuesTypes,
  OpacityValuesTypes,
} from '../../config/types';

interface CommonStyleModifiers {
  fontVariant?: FontVariantValuesTypes;
  color?: ColorTypes;
  opacity?: OpacityValuesTypes;
  size?: FontSizeValuesTypes;
  fontStyle?: FontStyleValuesTypes;
  backgroundColor?: ColorTypes;
  borderColor?: ColorTypes;
}

function applyStyleModifiers<T extends TextStyle | ViewStyle>(
  baseStyle: StyleProp<T>,
  modifiers: CommonStyleModifiers,
): StyleProp<T> | undefined {
  let style: StyleProp<T>;

  if (Array.isArray(baseStyle)) {
    style = [...baseStyle];
  } else {
    style = {...(baseStyle as T)};
  }

  if (modifiers.fontStyle) {
    style = {
      ...(style as T),
      ...FONT_STYLES[modifiers.fontStyle],
    };
  }

  if (modifiers.backgroundColor) {
    (style as T).backgroundColor = colors[modifiers.backgroundColor];
  }
  if (modifiers.borderColor) {
    (style as T).borderColor = colors[modifiers.borderColor];
  }

  if (modifiers.fontVariant) {
    (style as TextStyle).fontFamily = FONT_VARIANT[modifiers.fontVariant];
  }

  if (modifiers.color) {
    (style as TextStyle).color = colors[modifiers.color];
  }

  if (modifiers.size) {
    (style as TextStyle).fontSize = FONT_SIZES[modifiers.size];
  }

  return style;
}

export default applyStyleModifiers;
