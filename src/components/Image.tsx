import React, {FC} from 'react';
import {Image as ReactNativeImage, ImageProps} from 'react-native';

import logo_splash from 'assets/images/logo_splash.png';
import search_icon from 'assets/images/search_icon.png';
import profile_icon from 'assets/images/profile_icon.png';
import logout_icon from 'assets/images/logout_icon.png'

const Images = {
  logo_splash,
  search_icon,
  profile_icon,
  logout_icon
};
export type ImageTypes = keyof typeof Images;

type ImagePropsTypes = {
  name: ImageTypes;
  size?: number;
  style?: ImageProps['style'];
} & Omit<React.ComponentProps<typeof ReactNativeImage>, 'source'>;

const Image: FC<ImagePropsTypes> = ({name, size = 1, style, ...rest}) => {
  const ImageSwitch = (param: ImageTypes) => {
    let width, height;
    switch (param) {
      case 'logo_splash':
        width = 26.8 * size;
        height = 10 * size;
        return {Src: logo_splash, StyleConst: {width, height}};
      case 'search_icon':
        width = 30 * size;
        height = 30 * size;
        return {Src: search_icon, StyleConst: {width, height}};
      case 'profile_icon':
        width = 30 * size;
        height = 30 * size;
        return {Src: profile_icon, StyleConst: {width, height}};
        case 'logout_icon':
          width = 20 * size;
          height = 20 * size;
          return {Src: logout_icon, StyleConst: {width, height}};
    }
  };

  const {Src, StyleConst} = ImageSwitch(name);

  const mergedStyle = [StyleConst, style];

  return <ReactNativeImage source={Src} style={mergedStyle} {...rest} />;
};

export default Image;
