import React, { FC } from 'react';
import { Image, StyleSheet } from 'react-native';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';

import Evaluation_icon from '../assets/images/evaluation_icon.png';
import trash_icon from '../assets/images/trash_icon.png';
import list_icon from '../assets/images/list_icon.png';


export type IconNames =
  | 'Evaluation_icon'
  | 'trash_icon'
  | 'list_icon'


type IconType = {
  name: IconNames;
  size?: string;
};

const ImageSwitch = (param: IconNames) => {
  switch (param) {
    case 'Evaluation_icon':
      return { Src: Evaluation_icon, StyleConst: styles.Evaluation_icon };
    case 'trash_icon':
      return { Src: trash_icon, StyleConst: styles.trash_icon };
    case 'list_icon':
      return { Src: list_icon, StyleConst: styles.trash_icon };


    default:
      return { Src: Evaluation_icon, StyleConst: styles.trash_icon };
  }
};

const Images: FC<IconType> = ({ name }) => {
  const { Src, StyleConst, } = ImageSwitch(name);

  return (
    <Image source={Src} style={StyleConst} />
  )
};
export default Images;
const styles = StyleSheet.create({
  Evaluation_icon: {
    height: normaliseDesigns(30),
    width: normaliseDesigns(45),
  },
  trash_icon: {
    height: normaliseDesigns(20),
    width: normaliseDesigns(20),

  },

});