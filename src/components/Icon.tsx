import React, {FC} from 'react';
import {SvgProps} from 'react-native-svg';

import app_logo from '../assets/svg/app_logo.svg'
import eye_off from '../assets/svg/eye-off.svg'
import checkbox from '../assets/svg/checkbox.svg'
import security_question from '../assets/svg/security_question.svg';
import back_button from '../assets/svg/back_button.svg'
import tabbar_icon_home from '../assets/svg/tabbar_icon_home.svg';
import tabbar_icon_graph from '../assets/svg/tabbar_icon_graph.svg'
import tabbar_icon_observation from '../assets/svg/tabbar_icon_observation.svg';
import tabbar_icon_rubric from '../assets/svg/tabbar_icon_rubric.svg';
import tabbar_icon_home_focused from '../assets/svg/tabbar_icon_home_focused.svg'
import tabbar_icon_observation_focused from '../assets/svg/tabbar_icon_observation_focused.svg'
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
import evaluation_star_icon from '../assets/svg/evaluation_star_icon.svg'
import monitor_courses_icon from '../assets/svg/monitor_courses_icon.svg'
import courses_1_sample from '../assets/svg/courses_1_sample.svg';
import courses_2_sample from '../assets/svg/courses_2_sample.svg';
import right_icon from '../assets/svg/right_icon.svg'
import clock_icon from '../assets/svg/clock_icon.svg'
import drawer_icon_observation_reports from '../assets/svg/drawer_icon_observation_reports.svg'
import drawer_icon_teaching_aids from '../assets/svg/drawer_icon_teaching_aids.svg'
import drawer_icon_session_schedules from '../assets/svg/drawer_icon_session_schedules.svg'
import drawer_icon_give_feedback from '../assets/svg/drawer_icon_give_feedback.svg'
import drawer_icon_settings from '../assets/svg/drawer_icon_settings.svg'
import drawer_icon_home from '../assets/svg/drawer_icon_home.svg';
import left_arrow_orange_icon from '../assets/svg/left_arrow_orange_icon.svg'
import cross_icon from '../assets/svg/cross_icon.svg';
import evidence_card_icon from '../assets/svg/evidence_card_icon.svg'
import evidence_card_sample_image from '../assets/svg/evidence_card_sample_image.svg'
import evidence_card_note_icon from '../assets/svg/evidence_card_note_icon.svg'
import evidence_card_photo_icon from '../assets/svg/evidence_card_photo_icon.svg'
import evidence_card_video_clip_icon from '../assets/svg/evidence_card_video_clip_icon.svg'
import evidence_card_voice_clip_icon from '../assets/svg/evidence_card_voice_clip_icon.svg'

const Icons = {
  app_logo,
  eye_off,
  checkbox,
  security_question,
  back_button,
  tabbar_icon_home,
  tabbar_icon_graph,
  tabbar_icon_observation,
  tabbar_icon_rubric,
  tabbar_icon_home_focused,
  tabbar_icon_observation_focused,
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
  observation_icon,
  evaluation_star_icon,
  monitor_courses_icon,
  courses_1_sample,
  courses_2_sample,
  right_icon,
  clock_icon,
  drawer_icon_observation_reports,
  drawer_icon_teaching_aids,
  drawer_icon_session_schedules,
  drawer_icon_give_feedback,
  drawer_icon_settings,
  drawer_icon_home,
  left_arrow_orange_icon,
  cross_icon,
  evidence_card_icon,
  evidence_card_sample_image,
  evidence_card_note_icon,
  evidence_card_photo_icon,
  evidence_card_video_clip_icon,
  evidence_card_voice_clip_icon
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
