import React, {FC} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';

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
