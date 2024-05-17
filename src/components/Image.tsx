import React, { FC } from 'react';
import { ImageProps, Image as RNImage, StyleSheet } from 'react-native';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';

import evaluation_icon from '../assets/images/evaluation_icon.png';
import trash_icon from '../assets/images/trash_icon.png';
import list_icon from '../assets/images/list_icon.png';
import search_reports_icon from '../assets/images/search_reports_icon.png'
import reports_icon from '../assets/images/reports_icon.png'
import search_icon from '../assets/images/search_icon.png'
import edit_icon from '../assets/images/edit_icon.png'
import evidence_icon from '../assets/images/evidence_icon.png'

export type ImageIconNames =
  | 'evaluation_icon'
  | 'trash_icon'
  | 'list_icon'
  | 'search_reports_icon'
  | 'reports_icon'
  | 'search_icon'
  | 'edit_icon'
  | 'evidence_icon'




type ImagePropsTypes = {
  name: ImageIconNames;
  size?: number;
  style?: ImageProps['style'];
} & Omit<React.ComponentProps<typeof RNImage>, 'source'>;

const Image: FC<ImagePropsTypes> = ({ name, size = 1, style, ...rest }) => {
  const ImageSwitch = (param: ImageIconNames) => {
    let width, height;
    switch (param) {
      case 'evaluation_icon':
        width = 30 * size;
        height = 45 * size;
        return { Src: evaluation_icon, StyleConst: { width, height } };
      case 'trash_icon':
        width = 20 * size;
        height = 20 * size;
        return { Src: trash_icon, StyleConst: { width, height } };
      case 'list_icon':
        return { Src: list_icon, StyleConst: { width, height } };

      case 'reports_icon':
        return { Src: reports_icon, StyleConst: styles.Evaluation_icon };
      case 'search_icon':
        return { Src: search_icon, StyleConst: styles.search_icon };
      case 'edit_icon':
        return { Src: edit_icon, StyleConst: styles.edit_icon };
        case 'evidence_icon':
        return { Src: evidence_icon, StyleConst: styles.evidence_icon };


      case 'search_reports_icon':
        width = 85.5 * size;
        height = 60 * size;
        return { Src: search_reports_icon, StyleConst: { width, height } };

      default:
        return { Src: evaluation_icon, StyleConst: { width, height } };
    }
  };
  const { Src, StyleConst } = ImageSwitch(name);

  const mergedStyle = [StyleConst, style];

  return <RNImage source={Src} style={mergedStyle} {...rest} />;
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
  search_reports_icon: {
    height: normaliseDesigns(60),
    width: normaliseDesigns(85.5),
  },
  search_icon: {
    height: normaliseDesigns(18),
    width: normaliseDesigns(18),
  },
  edit_icon: {
    height: normaliseDesigns(18),
    width: normaliseDesigns(18),
  },
  evidence_icon: {
    height: normaliseDesigns(20),
    width: normaliseDesigns(20),
    margin: normaliseDesigns(5)
  },
});

