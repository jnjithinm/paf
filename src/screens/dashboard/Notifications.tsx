import React, {FC, useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import TextInput from '../../components/TextInput';
import useValidation from '../../utils/hooks/useValidation';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import {View} from 'react-native';
import Image from '../../components/Image';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';

type NotificationsNavigationProp = StackNavigationProp<
  MainStackParamList,
  'Notifications'
>;
type NotificationsRouteProp = RouteProp<MainStackParamList, 'Notifications'>;

interface NotificationsScreenProps {
  navigation: NotificationsNavigationProp;
  route: NotificationsRouteProp;
}




const Notifications: FC<NotificationsScreenProps> = ({navigation, route}) => {

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      icon='notification_icon'
      titleTransition>
      <Text
        size="body4"
        fontVariant="bold"
        style={{marginBottom: 10, marginTop: 50}}>
        Notifications
      </Text>
      <Text style={{color: '#4E565F'}} size="body1">
        Enter the email associated with your account and we will send an email
        with instructions to reset your password.
      </Text>

    </Layout>
  );
};
export default Notifications;
