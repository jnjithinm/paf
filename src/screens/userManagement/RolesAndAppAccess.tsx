import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';

import colors from '../../config/colors';

type RolesAndAppAccessNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'RolesAndAppAccess'
>;
type RolesAndAppAccessRouteProp = RouteProp<
  UserManagementStackParamList,
  'RolesAndAppAccess'
>;


interface RolesAndAppAccessScreenProps {
  navigation: RolesAndAppAccessNavigationProp;
  route: RolesAndAppAccessRouteProp;
}

const RolesAndAppAccess: FC<RolesAndAppAccessScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<User>();

  const dispatch = useAppDispatch();

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="User Groups"
      icon='user_groups_icon'
      focusedStack="UserManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Users
      </Text>
      <View>

      </View>
    </Layout>
  );
};
export default RolesAndAppAccess;
