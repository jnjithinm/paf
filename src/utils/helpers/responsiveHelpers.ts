import {Platform, PixelRatio, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const scale = width / 320;

export const normaliseFont = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === 'android') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
};

export const normaliseDesigns = (value: number) => {
  const newSize = value * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};
