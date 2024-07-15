import React, {FC, useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {TouchableOpacity, View} from 'react-native';
import {Drawer} from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {
  getUserAndRoleCountAnalytics,
  getUserCountAnalytics,
} from '../../redux/features/analyticsSlice';
import {FormAndFlowAnalyticsCountLabelTypes} from './FlowsAndFormAnalytics';
import {navigate} from '../../utils/helpers/navigationHelpers';
import LineChart, {LineDataItem} from '../../components/CurvedLineChart';
import moment from 'moment';
import { TeacherObservatioAnalyticsCountLabelTypes } from './TeacherObservationAnalytics';

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
  text: UserAndRoleAnalyticsLabelTypes | FormAndFlowAnalyticsCountLabelTypes | TeacherObservatioAnalyticsCountLabelTypes;
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
      {count} {text == 'Avg Response Time' ? 'hr' : ''}
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
export const getMonthsArray = () => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const monthName = moment().month(i).format('MMMM');
    months.push(monthName);
  }
  return months;
};


const UserAndRoleAnalyticsMainPage: FC<
  UserAndRoleAnalyticsMainPageScreenProps
> = ({navigation, route}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const dispatch = useAppDispatch();
  const {userCountAnalytics, userAndRoleCountAnalytics} = useAppSelector(
    state => state.analytics,
  );

  useEffect(() => {
    dispatch(getUserCountAnalytics());
    dispatch(
      getUserAndRoleCountAnalytics({
        userStatusType: null,
        roleStatusType: null,
        userGroupStatusType: null,
        stateId: null,
        districtId: null,
        area: null,
        dateType: 'selected_date',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }),
    );
  }, []);


  const dataList = {
    UserAndRole: [
      ['Month Name', 'Count of Users', 'Count of Roles', 'Count of UserGroups'],
      ['April', 6, 3, 0],
      ['December', 0, 8, 0],
      ['February', 41, 0, 0],
      ['January', 4, 0, 0],
      ['July', 7, 0, 0],
      ['June', 14, 0, 1],
      ['March', 100, 0, 13],
      ['May', 45, 3, 7],
    ],
  };

  // const formattedUserAndRoleCountAnalytics =
  // dataList.UserAndRole.slice(1).map(row => ({
  //   month: row[0],
  //   countOfUsers: row[1],
  //   countOfRoles: row[2],
  //   countOfUserGroups: row[3],
  // }));


  const formattedUserAndRoleCountAnalytics =
    userAndRoleCountAnalytics?.dataList.UserAndRole.slice(1).map(row => ({
      month: row[0],
      countOfUsers: row[1],
      countOfRoles: row[2],
      countOfUserGroups: row[3],
    }));

  const countOfUsers: number[] = formattedUserAndRoleCountAnalytics?.map(
    item => ( item.countOfUsers),
  ) || []
  const countOfRoles: number[] = formattedUserAndRoleCountAnalytics?.map(
    item => ( item.countOfRoles),
  ) || []

  const countOfUserGroups:number[] = formattedUserAndRoleCountAnalytics?.map(
    item => ( item.countOfUserGroups),
  ) || []

  const months =
    formattedUserAndRoleCountAnalytics?.map(item =>
      moment().month(item.month).format('MMM'),
    ) || getMonthsArray();

  console.log('month', months, countOfUsers);

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
        onPressBellIcon={() => {
          navigate('Notifications');
        }}
        onPressMenuIcon={() => {
          setIsDrawerOpen(true);
        }}
        focusedStack="AnalyticsStack"
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
            count={userCountAnalytics?.dataList?.totalRoleCount[0] || 0}
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
        {userAndRoleCountAnalytics && (
          <>
        <LineChart
          value1={countOfUsers}
          value2={countOfRoles}
          value3={countOfUserGroups}
          labels={months || ['']}
          indicators={['Count of users','Count of roles','User groups']}
        />
        <LineChart value1={countOfUsers}  labels={months || ['']} />
        </>
       ) }
      </Layout>
    </Drawer>
  );
};
export default UserAndRoleAnalyticsMainPage;
