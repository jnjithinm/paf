import React, {FC, ReactNode, useEffect, useState} from 'react';
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
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {sendEmail} from '../../utils/functions/linkingUtils';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {
  getFormCountAnalytics,
  getUserCountAnalytics,
} from '../../redux/features/analyticsSlice';
import {FormAndFlowAnalyticsCountLabelTypes} from './FlowsAndFormsAnalytics';

type UserAndRoleAnalyticsMainPageNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'UserAndRoleAnalyticsMainPage'
>;
type UserAndRoleAnalyticsMainPageRouteProp = RouteProp<
  AnalyticsStackParamList,
  'UserAndRoleAnalyticsMainPage'
>;

interface UserAndRoleAnalyticsMainPageScreenProps {
  navigation: UserAndRoleAnalyticsMainPageNavigationProp;
  route: UserAndRoleAnalyticsMainPageRouteProp;
}

type UserAndRoleAnalyticsLabelTypes =
  | 'Total Roles'
  | 'Total Users'
  | 'Total Groups';

type AnalyticsCountTileTypes = {
  text: UserAndRoleAnalyticsLabelTypes | FormAndFlowAnalyticsCountLabelTypes;
  color: 'green' | 'red' | 'orange';
  count: number;
  onPress: () => void;
  disabled?: boolean;
};

export const AnalyticsCountTile: FC<AnalyticsCountTileTypes> = ({
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
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor:
        color === 'green'
          ? '#749E35'
          : color === 'orange'
          ? '#D29804'
          : '#EA7804',
      justifyContent: 'center',
      width: '32%',
      paddingHorizontal: 13,
      borderRadius: 10,
      paddingVertical: 7,
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
      size="body3"
      onPress={onPress}>
      {count} {color == 'red' ? 'hr' : ''}
    </Text>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
        marginTop: 5,
      }}
      size="small3"
      fontVariant="semiBold">
      {text}
    </Text>
  </TouchableOpacity>
);
const UserAndRoleAnalyticsMainPage: FC<
  UserAndRoleAnalyticsMainPageScreenProps
> = ({navigation, route}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const dispatch = useAppDispatch();
  const {userCountAnalytics} = useAppSelector(state => state.analytics);

  useEffect(() => {
    dispatch(
      getUserCountAnalytics({
        userStatusType: 'all',
        dateType: 'selected_date',
        startDate: '2024-07-09',
        endDate: '2024-07-09',
      }),
    );
  }, []);

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
        onPressMenuIcon={() => {
          setIsDrawerOpen(true);
        }}
        avoidBackButton
        dashboard>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          User and Role Analytics
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <AnalyticsCountTile
            text={'Total Roles'}
            color={'green'}
            count={userCountAnalytics?.dataList.totalRoleCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Users'}
            color={'orange'}
            count={userCountAnalytics?.dataList?.totalUserCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Groups'}
            color={'red'}
            count={userCountAnalytics?.dataList?.totalUserGroupCount[0] || 0}
            onPress={() => {}}
          />
        </View>
      </Layout>
    </Drawer>
  );
};
export default UserAndRoleAnalyticsMainPage;
