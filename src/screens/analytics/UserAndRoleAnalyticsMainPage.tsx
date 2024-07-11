import React, {FC, ReactNode, useState} from 'react';
import {StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import Button from '../../components/Button';
import {TouchableOpacity, View} from 'react-native';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import {Drawer} from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';
import {useAppSelector} from '../../redux/store';
import {sendEmail} from '../../utils/functions/linkingUtils';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsStack';

type UserAndRoleAnalyticsMainPageNavigationProp = StackNavigationProp<AnalyticsStackParamList, 'UserAndRoleAnalyticsMainPage'>;
type UserAndRoleAnalyticsMainPageRouteProp = RouteProp<AnalyticsStackParamList, 'UserAndRoleAnalyticsMainPage'>;

interface UserAndRoleAnalyticsMainPageScreenProps {
  navigation: UserAndRoleAnalyticsMainPageNavigationProp;
  route: UserAndRoleAnalyticsMainPageRouteProp;
}

type UserAndRoleAnalyticsCountTileTypes = {
  text: 'All' | 'By Me' | 'For Me';
  color: 'green' | 'yellow' | 'orange';
  count: number;
  onPress: () => void;
  disabled?: boolean;
};

export const UserAndRoleAnalyticsCountTile: FC<UserAndRoleAnalyticsCountTileTypes> = ({
  text,
  color,
  count,
  onPress,
  disabled,
}) => (
  <TouchableOpacity
    style={{
      backgroundColor:
        color === 'green'
          ? '#EBF9D9'
          : color === 'orange'
          ? '#FDF0E3'
          : '#FEF8EC',
      alignItems: 'center',
      borderWidth: 1,
      borderColor:
        color === 'green'
          ? '#749E35'
          : color === 'orange'
          ? '#D29804'
          : '#EA7804',
      justifyContent: 'space-evenly',
      flexDirection: 'row',
      width: '30%',
      paddingHorizontal: 10,
      height: 40,
      borderRadius: 10,
    }}
    disabled={disabled}
    onPress={() => {}}>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
      }}
      fontVariant="bold"
      onPress={onPress}>
      ({count})
    </Text>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
      }}
      fontVariant="semiBold">
      {text}
    </Text>
  </TouchableOpacity>
);
const UserAndRoleAnalyticsMainPage: FC<UserAndRoleAnalyticsMainPageScreenProps> = ({navigation, route}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const {isLoggedIn} = useAppSelector(state => state.auth);

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        onPressBackArrow={() => {
          navigation.goBack();
        }}
        onPressMenuIcon={() => {
          setIsDrawerOpen(true);
        }}
        dashboard={isLoggedIn}
        avoidBackButton={isLoggedIn}>
     <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
           User and Role Analytics
        </Text>
      </Layout>
    </Drawer>
  );
};
export default UserAndRoleAnalyticsMainPage;
