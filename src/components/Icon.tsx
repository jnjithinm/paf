import React, {FC} from 'react';
import {SvgProps} from 'react-native-svg';

import app_logo from '../assets/svg/app_logo.svg'
import eye_off from '../assets/svg/eye_off.svg'
import checkbox from '../assets/svg/checkbox.svg'
import security_question from '../assets/svg/security_question.svg';
import back_button from '../assets/svg/back_button.svg'
import tabbar_icon_home from '../assets/svg/tabbar_icon_home.svg';
import tabbar_icon_graph from '../assets/svg/tabbar_icon_graph.svg'
import tabbar_icon_graph_focused from '../assets/svg/tabbar_icon_graph_focused.svg'
import tabbar_icon_observation from '../assets/svg/tabbar_icon_observation.svg';
import tabbar_icon_rubric from '../assets/svg/tabbar_icon_rubric.svg';
import tabbar_icon_rubric_focused from '../assets/svg/tabbar_icon_rubric_focused.svg';
import tabbar_icon_home_focused from '../assets/svg/tabbar_icon_home_focused.svg'
import tabbar_icon_observation_focused from '../assets/svg/tabbar_icon_observation_focused.svg';
import tabbar_icon_flows_and_forms from '../assets/svg/tabbar_icon_flows_and_forms.svg';
import tabbar_icon_flows_and_forms_focused from '../assets/svg/tabbar_icon_flows_and_forms_focused.svg';
import tabbar_icon_user_management from '../assets/svg/tabbar_icon_user_management.svg';
import tabbar_icon_user_management_focused from '../assets/svg/tabbar_icon_user_management_focused.svg';
import profile_icon from '../assets/svg/profile_icon.svg';
import bell_icon from '../assets/svg/bell_icon.svg'
import menu_icon from '../assets/svg/menu_icon.svg'
import rating_celebration_icon from '../assets/svg/rating_celebration_icon.svg'
import pro_pic_sample from '../assets/svg/pro_pic_sample.svg'
import star_icon from '../assets/svg/star_icon.svg';
import star_unfilled_icon from '../assets/svg/star_unfilled_icon.svg'
import search_icon from '../assets/svg/search_icon.svg';
import search_icon_light from '../assets/svg/seact_icon_light.svg';
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
import plus_icon from '../assets/svg/plus_icon.svg'
import cross_icon_white from '../assets/svg/cross_icon_white.svg'
import calendar_icon from '../assets/svg/calendar_icon.svg'
import star_half_filled_icon from '../assets/svg/star_half_filled_icon.svg'
import up_and_down_selection from '../assets/svg/up_and_down_selection.svg';
import admin_flows_icon from '../assets/svg/admin_flows_icon.svg'
import form_list from '../assets/svg/form_list_icon.svg'
import admin_response_clock from '../assets/svg/admin_response_clock.svg'
import trash_icon from '../assets/svg/trash_icon.svg'
import rating_card_icon from '../assets/svg/rating_card_icon.svg';
import arrow_narrow_right from '../assets/svg/arrow_narrow_right.svg';
import rating_star_display from '../assets/svg/rating_star_display.svg'
import alarm_clock from '../assets/svg/alarm_clock.svg'
import cross_icon_thin from '../assets/svg/cross_icon_thin.svg'
import logout_icon from '../assets/svg/logout_icon.svg';
import warning_icon from '../assets/svg/warning_icon.svg'
import chevron_up_black_icon from '../assets/svg/chevron_up_black_icon.svg'
import eye from '../assets/svg/eye.svg'
import eye_off_disabled from '../assets/svg/eye_off_disabled.svg'
import edit_icon from '../assets/svg/edit_icon.svg'
import google_icon from '../assets/svg/google_icon.svg'
import facebook_icon from '../assets/svg/facebook_icon.svg'
import rating_deselected_icon from '../assets/svg/rating_deselected_icon.svg'
import print_icon from '../assets/svg/print_icon.svg'
import user_and_usergroup_icon from '../assets/svg/user_and_usergroup_icon.svg'
import  admin_dashboard_user_management_icon from '../assets/svg/admin_dashboard_user_management_icon.svg'
import  admin_dashboard_location_management_icon from '../assets/svg/admin_dashboard_location_management_icon.svg'
import  admin_dashboard_analytics_icon from '../assets/svg/admin_dashboard_analytics_icon.svg'
import  admin_dashboard_schedules_icon from '../assets/svg/admin_dashboard_schedules_icon.svg'
import  extend_item_level_1_icon from '../assets/svg/extend_item_level_1_icon.svg'
import  extend_item_level_2_icon from '../assets/svg/extend_item_level_2_icon.svg'
import drawer_icon_analytics from '../assets/svg/drawer_icon_analytics.svg'
import drawer_icon_user_management from '../assets/svg/drawer_icon_user_management.svg'
import music_player_icon from '../assets/svg/music_player_icon.svg'
import play_button_music_player_icon from '../assets/svg/play_button_music_player_icon.svg'
import toast_message_warning_icon from '../assets/svg/toast_message_warning_icon.svg'
import drawer_icon_teacher_evaluation from '../assets/svg/drawer_icon_teacher_evaluation.svg'
import arrow_right_pagination from '../assets/svg/arrow_right_pagination.svg'
import arrow_left_icon from '../assets/svg/arrow_left_icon.svg'
import trash_icon_red from '../assets/svg/trash_icon_red.svg'
import edit_icon_red from '../assets/svg/edit_icon_red.svg'
import informative_message_icon from '../assets/svg/informative_message_icon.svg'
import list_of_flows_icon from '../assets/svg/list_of_flows_icon.svg'
import three_dots from '../assets/svg/three_dots.svg'
import sorting_icon from '../assets/svg/sorting_icon.svg'
import zoomout_icon from '../assets/svg/zoomout_icon.svg'
import downloads_icon  from '../assets/svg/downloads_icon.svg'
import share_icon from '../assets/svg/share_icon.svg'
import three_dots_orange from '../assets/svg/three_dots_orange.svg'
import crosscircle from '../assets/svg/crosscircle.svg'
import calendar_meet_icon from '../assets/svg/calendar_meet_icon.svg'
import email_icon from '../assets/svg/email_icon.svg'
import google_meet_icon from '../assets/svg/google_meet_icon.svg'
import person_icon from '../assets/svg/person_icon.svg'
import google_icon2 from '../assets/svg/google_icon 2.svg'
import calendar_color_icon from '../assets/svg/calendar_color_icon.svg'
import calendar_icon_black from '../assets/svg/calendar_icon_black.svg'
import filter_icon_contain from '../assets/svg/filter_icon.svg'
import filter_icon_contain_color from '../assets/svg/filter_icon_contain_color.svg'
import filter_icon_contain_copy from '../assets/svg/filter_icon_contain copy.svg'
import meet from "../assets/svg/meet.svg"
import cross_color_icon from '../assets/svg/cross_color_icon.svg'
import create_task_icon from '../assets/svg/create_task_Icon.svg'
import create_event_icon from '../assets/svg/create_event_icon.svg'
import outof_office_icon from '../assets/svg/outof_office_Icon.svg'
import down_arrow_icon from '../assets/svg/down_arrow_icon.svg'
import refresh_icon from '../assets/svg/refresh_icon.svg'
import users_event_icon from '../assets/svg/users_event_icon.svg'
import event_clock_Icon from '../assets/svg/event_clock_Icon.svg'
import bell_icon_light from '../assets/svg/bell_icon_light.svg'
import right_icon_new from '../assets/svg/righ_icon_new.svg'
import star_half_filed_new_icon from '../assets/svg/star_half_filed_new_icon.svg'
import filter_colored_icon from '../assets/svg/filter_colored_icon.svg'
import dots_colred_icon from '../assets/svg/dots_colored_icon.svg'

const Icons = {
  calendar_meet_icon,
  app_logo,
  email_icon,
  google_meet_icon,
  person_icon,
  eye_off,
  checkbox,
  security_question,
  back_button,
  tabbar_icon_home,
  tabbar_icon_graph,
  tabbar_icon_graph_focused,
  tabbar_icon_observation,
  tabbar_icon_rubric,
  tabbar_icon_rubric_focused,
  tabbar_icon_home_focused,
  tabbar_icon_observation_focused,
  tabbar_icon_user_management_focused,
  tabbar_icon_user_management,
  tabbar_icon_flows_and_forms_focused,
  tabbar_icon_flows_and_forms,
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
  evidence_card_voice_clip_icon,
  plus_icon,
  cross_icon_white,
  calendar_icon,
  star_half_filled_icon,
  up_and_down_selection,
  admin_flows_icon,
  form_list,
  admin_response_clock,
  trash_icon,
  edit_icon_red,
  trash_icon_red,
  rating_card_icon,
  arrow_narrow_right,
  rating_star_display,
  alarm_clock,
  cross_icon_thin,
  logout_icon,
  warning_icon,
  chevron_up_black_icon,
  eye,
  eye_off_disabled,
  edit_icon,
  google_icon,
  facebook_icon,
  rating_deselected_icon,
  print_icon,
  user_and_usergroup_icon,
  admin_dashboard_user_management_icon,
  admin_dashboard_analytics_icon,
  admin_dashboard_schedules_icon,
  admin_dashboard_location_management_icon,
  extend_item_level_1_icon,
  extend_item_level_2_icon,
  drawer_icon_analytics,
  drawer_icon_user_management,
  music_player_icon,
  play_button_music_player_icon,
  toast_message_warning_icon,
  drawer_icon_teacher_evaluation,
  arrow_right_pagination,
  arrow_left_icon,
  informative_message_icon,
  list_of_flows_icon,
  three_dots,
  sorting_icon,
  zoomout_icon,
  share_icon,
  downloads_icon,
  three_dots_orange,
  crosscircle,
  search_icon_light,
  google_icon2,
  calendar_color_icon,
  calendar_icon_black,
  filter_icon_contain,
  filter_icon_contain_color,
  filter_icon_contain_copy,
  meet,
  cross_color_icon,
  create_event_icon,
  create_task_icon,
  outof_office_icon,
  down_arrow_icon,
  refresh_icon,
  users_event_icon,
  event_clock_Icon,
  bell_icon_light,
  right_icon_new,
  star_half_filed_new_icon ,
  filter_colored_icon,
  dots_colred_icon
  
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
