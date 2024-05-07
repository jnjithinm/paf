import React, {FC} from 'react';
import {SvgProps} from 'react-native-svg';

import app_logo from '../assets/svg/app_logo.svg'
import eye_off from '../assets/svg/eye-off.svg'
import checkbox from '../assets/svg/checkbox.svg'
import security_question from '../assets/svg/security_question.svg';
import back_button from '../assets/svg/back_button.svg'
import home_icon_tabbar from '../assets/svg/home_icon_tabbar.svg';
import graph_icon_tabbar from '../assets/svg/home_icon_tabbar.svg'
import profile_icon from '../assets/svg/profile_icon.svg';
import bell_icon from '../assets/svg/bell_icon.svg'
import menu_icon from '../assets/svg/menu_icon.svg'
import rating_celebration_icon from '../assets/svg/rating_celebration_icon.svg'
import pro_pic_sample from '../assets/svg/pro_pic_sample.svg'
import star_icon from '../assets/svg/star_icon.svg';
import star_unfilled_icon from '../assets/svg/star_unfilled_icon.svg'
import search_icon from '../assets/svg/search_icon.svg';
import filter_icon from '../assets/svg/filter_icon.svg'
import analytics_icon from '../assets/svg/analytics_icon.svg';
import explore_icon from '../assets/svg/explore_icon.svg';
import observation_icon from '../assets/svg/observation_icon.svg'

const Icons = {
  app_logo,
  eye_off,
  checkbox,
  security_question,
  back_button,
  home_icon_tabbar,
  graph_icon_tabbar,
  profile_icon,
  bell_icon,
  menu_icon,
  rating_celebration_icon,
  pro_pic_sample,
  star_icon,
  star_unfilled_icon,
  search_icon,filter_icon,
  explore_icon,
  analytics_icon,
  observation_icon
};

export type IconTypes = keyof typeof Icons;

export type IconPropsTypes = {
  name: keyof typeof Icons;
} & SvgProps;

const Icon: FC<IconPropsTypes> = ({name, children, ...restProps}) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    return null;
  }
  return <IconComponent {...restProps} />;
};

export default Icon;
