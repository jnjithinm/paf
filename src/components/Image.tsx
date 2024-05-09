import React, { FC } from 'react';
import { Image as RNImage, StyleSheet } from 'react-native';
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


type IconType = {
  name: ImageIconNames;
  size?: string;
};

const ImageSwitch = (param: ImageIconNames) => {
  switch (param) {
    case 'evaluation_icon':
      return { Src: evaluation_icon, StyleConst: styles.Evaluation_icon };
    case 'trash_icon':
      return { Src: trash_icon, StyleConst: styles.trash_icon };
    case 'list_icon':
      return { Src: list_icon, StyleConst: styles.trash_icon };
    case 'search_reports_icon':
      return { Src: search_reports_icon, StyleConst: styles.search_reports_icon };

    default:
      return { Src: evaluation_icon, StyleConst: styles.trash_icon };
  }
};

const Image: FC<IconType> = ({ name }) => {
  const { Src, StyleConst, } = ImageSwitch(name);

  return (
    <RNImage source={Src} style={StyleConst} />
  )
};
export default Image;
const styles = StyleSheet.create({
  Evaluation_icon: {
    height: normaliseDesigns(30),
    width: normaliseDesigns(45),
  },
  trash_icon: {
    height: normaliseDesigns(20),
    width: normaliseDesigns(20),

  },
  search_reports_icon:{
    height: normaliseDesigns(60),
    width: normaliseDesigns(85.5),
  }

});