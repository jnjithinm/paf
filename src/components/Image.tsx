import React, { FC } from 'react';
import { ImageProps, Image as RNImage, StyleSheet } from 'react-native';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';

import evaluation_icon from '../assets/images/evaluation_icon.png';
import trash_icon from '../assets/images/trash_icon.png';
import list_icon from '../assets/images/list_icon.png';
import search_reports_icon from '../assets/images/search_reports_icon.png'

export type ImageIconNames =
  | 'evaluation_icon'
  | 'trash_icon'
  | 'list_icon'
  |'search_reports_icon'


  type ImagePropsTypes = {
    name: ImageIconNames;
    size?: number;
    style?: ImageProps['style'];
  } & Omit<React.ComponentProps<typeof RNImage>, 'source'>;
  
  const Image: FC<ImagePropsTypes> = ({name, size = 1, style, ...rest}) => {
    const ImageSwitch = (param: ImageIconNames) => {
      let width, height;
  switch (param) {
    case 'evaluation_icon':
      width = 30 * size;
      height = 45 * size;
      return { Src: evaluation_icon, StyleConst:{width,height}};
    case 'trash_icon':
      width = 20 * size;
      height = 20 * size;
      return { Src: trash_icon, StyleConst:{width,height} };
    case 'list_icon':
      return { Src: list_icon, StyleConst:{width,height} };
    case 'search_reports_icon':
      width = 85.5 * size;
      height = 60 * size;
      return { Src: search_reports_icon, StyleConst: {width,height}};

    default:
      return { Src: evaluation_icon, StyleConst:{width,height} };
  }
};
const {Src, StyleConst} = ImageSwitch(name);

const mergedStyle = [StyleConst, style];

return <RNImage source={Src} style={mergedStyle} {...rest} />;
};
export default Image;
