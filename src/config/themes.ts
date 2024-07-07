import {TextStyle, ViewStyle} from 'react-native';

import colors from './colors';
import {normaliseDesigns, normaliseFont} from '../utils/helpers/responsiveHelpers';

export const OPACITY = {
  '0': 0,
  '0.05': 0.05,
  '0.1': 0.1,
  '0.2': 0.2,
  '0.25': 0.25,
  '0.30': 0.3,
  '0.40': 0.4,
  '0.50': 0.5,
  '0.60': 0.6,
  '0.70': 0.7,
  '0.75': 0.75,
  '0.80': 0.8,
  '0.90': 0.9,
  '0.95': 0.95,
  '1': 1,
};

export const FONT_SIZES = {
  verysmall1: normaliseFont(8),
  verysmall2: normaliseFont(9),
  verysmall3: normaliseFont(10),
  small1: normaliseFont(11),
  small2: normaliseFont(12),
  small3: normaliseFont(13),
  normal: normaliseFont(15),
  heading1: normaliseFont(32),
  heading2: normaliseFont(30),
  numeric: normaliseFont(28),
  numberic1:normaliseFont(20),
  body1: normaliseFont(14),
  body2: normaliseFont(16),
  body3: normaliseFont(18),
  body4: normaliseFont(20),
  body5: normaliseFont(22),
  body6: normaliseFont(25),
};

export const FONT_VARIANT = {
  bold: 'Lato-Bold',
  semiBold: 'Lato-SemiBold',
  medium: 'Lato-Black',
  regular: 'Lato-Regular',
  light: 'Lato-Light',
};

type FontStyles = {
  [key: string]: TextStyle;
};

export const FONT_STYLES = {
  normal: {
    fontFamily: 'Lato-Regular',
    fontSize: FONT_SIZES.normal,
    color:colors.blackColor,
  },
  
} as const;

export const STYLES: {
  buttonback: ViewStyle;
  buttonProceed: ViewStyle;
} = {
  buttonback: {
    borderRadius: 7,
    backgroundColor: colors.backgroundColor,
    borderWidth: 1,
    borderColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    width: normaliseDesigns(100),
    height:normaliseDesigns(30),
  },
  buttonProceed: {
    borderRadius: 7,
    backgroundColor: colors.primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    width:normaliseDesigns(100),
    height: normaliseDesigns(30),
  },
};

const appTheme = {
  FONT_SIZES,
  FONT_STYLES,
  FONT_VARIANT,
  STYLES,
};

export default appTheme;
