import React, { FC } from 'react';
import { ImageProps, Image as RNImage, StyleSheet } from 'react-native';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';

import evaluation_icon from '../assets/images/evaluation_icon.png';
import list_icon from '../assets/images/list_icon.png';
import search_reports_icon from '../assets/images/search_reports_icon.png';
import reports_icon from '../assets/images/reports_icon.png';
import search_icon from '../assets/images/search_icon.png';
import evidence_icon from '../assets/images/evidence_icon.png';
import img_upload_icon from '../assets/images/img_upload_icon.png';
import upload_icon from '../assets/images/upload_icon.png';
import cross_icon from '../assets/images/cross_icon.png';
import mic_icon from '../assets/images/mic_icon.png';
import attachment from '../assets/images/attachment.png';
import video_icon from '../assets/images/video_icon.png';
import flow_icon from '../assets/images/flow_icon.png';
import response_card_icon from '../assets/images/response_card_icon.png';
import success_icon from '../assets/images/success_icon.jpg';
import send_reminder_success_icon from '../assets/images/send_reminder_success_icon.png';
import reset_password_icon from '../assets/images/reset_password_icon.png';
import email_icon from '../assets/images/email_icon.png';
import notification_icon from '../assets/images/notification_icon.png';
import users_icon from '../assets/images/users_icon.png';
import user_groups_icon from '../assets/images/user_groups_icon.png';
import role_and_app_access_icon from '../assets/images/role_and_app_access_icon.png';
import location_icon from '../assets/images/location_icon.png';
import calendar_reminder_success_icon from '../assets/images/calendar_reminder_success_icon.png';
import empty_cart_icon from '../assets/images/empty_placholder_icon.png'



export type ImageIconNames =
  | 'evaluation_icon'
  | 'list_icon'
  | 'search_reports_icon'
  | 'reports_icon'
  | 'search_icon'
  | 'edit_icon'
  | 'evidence_icon'
  | 'img_upload_icon'
  | 'upload_icon'
  | 'cross_icon'
  | 'attachment'
  | 'mic_icon'
  | 'video_icon'
  | 'flow_icon'
  | 'response_card_icon'
  | 'success_icon'
  | 'send_reminder_success_icon'
  | 'reset_password_icon'
  | 'email_icon'
  | 'notification_icon'
  | 'users_icon'
  | 'user_groups_icon'
  | 'role_and_app_access_icon'
  | 'location_icon'
  | 'calendar_reminder_success_icon'
  | 'empty_cart_icon'

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
        width = 107.833333 * size;
        height = 85.333333 * size;
        return { Src: evaluation_icon, StyleConst: { width, height } };
      case 'list_icon':
        return { Src: list_icon, StyleConst: { width, height } };
      case 'reports_icon':
        return { Src: reports_icon, StyleConst: styles.Evaluation_icon };
      case 'search_icon':
        return { Src: search_icon, StyleConst: styles.search_icon };
      case 'evidence_icon':
        return { Src: evidence_icon, StyleConst: styles.evidence_icon };
      case 'img_upload_icon':
        return { Src: img_upload_icon, StyleConst: styles.img_upload_icon };
      case 'upload_icon':
        return { Src: upload_icon, StyleConst: styles.mic_icon };
      case 'cross_icon':
        return { Src: cross_icon, StyleConst: styles.cross_icon };
      case 'attachment':
        return { Src: attachment, StyleConst: styles.mic_icon };
      case 'mic_icon':
        return { Src: mic_icon, StyleConst: styles.mic_icon };
      case 'video_icon':
        return { Src: video_icon, StyleConst: styles.mic_icon };
      case 'search_reports_icon':
        width = 85.5 * size;
        height = 60 * size;
        return { Src: search_reports_icon, StyleConst: { width, height } };
      case 'flow_icon':
        width = 109.35 * size;
        height = 76.8 * size;
        return { Src: flow_icon, StyleConst: { width, height } };
      case 'response_card_icon':
        width = 99 * size;
        height = 64 * size;
        return { Src: response_card_icon, StyleConst: { width, height } };
      case 'success_icon':
        width = 114 * size;
        height = 80 * size;
        return { Src: success_icon, StyleConst: { width, height } };
      case 'send_reminder_success_icon':
        width = 91.1 * size;
        height = 51.2 * size;
        return { Src: send_reminder_success_icon, StyleConst: { width, height } };
      case 'reset_password_icon':
        width = 110.625 * size;
        height = 64 * size;
        return { Src: reset_password_icon, StyleConst: { width, height } };
      case 'email_icon':
        width = 110.75 * size;
        height = 64 * size;
        return { Src: email_icon, StyleConst: { width, height } };
      case 'notification_icon':
        width = 91.125 * size;
        height = 64 * size;
        return { Src: notification_icon, StyleConst: { width, height } };
      case 'users_icon':
        width = 91.2 * size;
        height = 64 * size;
        return { Src: users_icon, StyleConst: { width, height } };
      case 'user_groups_icon':
        width = 91.2 * size;
        height = 64 * size;
        return { Src: user_groups_icon, StyleConst: { width, height } };
      case 'role_and_app_access_icon':
        width = 91.2 * size;
        height = 64 * size;
        return { Src: role_and_app_access_icon, StyleConst: { width, height } };
      case 'location_icon':
        width = 91.2 * size;
        height = 64 * size;
        return { Src: location_icon, StyleConst: { width, height } };
      case 'calendar_reminder_success_icon':
        width = 91.2 * size;
        height = 51.2 * size;
        return { Src: calendar_reminder_success_icon, StyleConst: { width, height } };
      case 'empty_cart_icon':
        width = 25 * size;
        height = 25 * size;
        return { Src: empty_cart_icon, StyleConst: { width, height } };

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
  mic_icon: {
    height: normaliseDesigns(18),
    width: normaliseDesigns(18),
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
  },
  img_upload_icon: {
    height: normaliseDesigns(18),
    width: normaliseDesigns(18),
    tintColor: 'black',
    // margin: normaliseDesigns(5)
  },
  cross_icon: {
    height: normaliseDesigns(10),
    width: normaliseDesigns(10),
  },
});
