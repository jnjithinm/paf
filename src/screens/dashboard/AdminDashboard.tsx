import React, {FC, useState} from 'react';
import {
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';

import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {navigate} from '../../utils/helpers/navigationHelpers';
import {MainStackParamList} from '../../navigation/MainStack';

type AdminDashboardNavigationProp = StackNavigationProp<
  MainStackParamList,
  'AdminDashboard'
>;
type AdminDashboardRouteProp = RouteProp<MainStackParamList, 'AdminDashboard'>;

interface AdminDashboardScreenProps {
  navigation: AdminDashboardNavigationProp;
  route: AdminDashboardRouteProp;
}

type AdminDashboardMenuItemTypes = {
  icon: IconTypes;
  onPress: () => void;
  label: string;
};
const AdminDashboardMenuItem: FC<AdminDashboardMenuItemTypes> = ({
  icon,
  onPress,
  label,
}) => (
  <TouchableOpacity
    style={[
      {
        width: '47%',
        paddingHorizontal: 12,
        backgroundColor: '#FEF8EC',
        borderWidth: 1,
        borderColor: '#F4C24A',
        marginVertical: 5,
        borderRadius: 8,
        paddingVertical: 18,
      },
    ]}
    onPress={onPress}>
    <Icon name={icon} />
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Text fontVariant="bold" style={{width: '85%'}}>
        {label}
      </Text>
      <Icon name="right_icon" />
    </View>
  </TouchableOpacity>
);
const AdminDashboard: FC<AdminDashboardScreenProps> = ({navigation, route}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const {userData, isLoading} = useAppSelector(state => state.auth);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };


  const menuItemArray: AdminDashboardMenuItemTypes[] = [
    {
      icon: 'admin_dashboard_user_management_icon',
      label: 'User Management',
      onPress: () => {
        navigation.navigate('UserManagementStack',{screen:'UsersMainPage'})
      },
    },
    {
      icon: 'admin_dashboard_location_management_icon',
      label: 'Location Management',
      onPress: () => {
        navigation.navigate('LocationManagementStack',{screen:'States'})
      },
    },
    {
      icon: 'admin_dashboard_analytics_icon',
      label: 'Analytics',
      onPress: () => {},
    },
    {
      icon: 'admin_dashboard_schedules_icon',
      label: 'Schedules',
      onPress: () => {},
    },
  ];
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
        onPressBellIcon={() => {
          navigate('Notifications');
        }}
        onPressProfileIcon={() => {}}
        dashboard
        focusedStack={isDrawerOpen ? undefined : 'AdminDashboard'}
        avoidBackButton>
        <Text fontVariant="bold" size="body3" style={{marginVertical: 20}}>
          Welcome {userData.name}!
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}>
          {menuItemArray.map((item, index) => (
            <AdminDashboardMenuItem
              key={index}
              icon={item.icon}
              label={item.label}
              onPress={item.onPress}
            />
          ))}
        </View>
      </Layout>
    </Drawer>
  );
};
export default AdminDashboard;
