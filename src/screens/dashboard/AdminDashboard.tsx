import React, {FC, useEffect, useState} from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';

import Layout from '../../components/Layout';
import Icon, {IconTypes} from '../../components/Icon';
import Text from '../../components/Text';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getDashboardDetailsAndObservationList} from '../../redux/features/observationSlice';
import {navigate} from '../../utils/helpers/navigationHelpers';
import Calendar, {FilterObject} from '../../components/Calendar';
import SearchWithFilter from '../../components/SearchWithFilter';
import { MainStackParamList } from '../../navigation/MainStack';

type AdminDashboardNavigationProp = StackNavigationProp<
  MainStackParamList,
  'AdminDashboard'
>;
type AdminDashboardRouteProp = RouteProp<
MainStackParamList,
  'AdminDashboard'
>;

interface AdminDashboardScreenProps {
  navigation: AdminDashboardNavigationProp;
  route: AdminDashboardRouteProp;
}

type AdminDashboardMenuItemTypes={
  icon:IconTypes;
  onPress:()=>void;
  label:string
}
const AdminDashboardMenuItem:FC<AdminDashboardMenuItemTypes>=({icon,onPress,label})=>(
<TouchableOpacity>
  <Icon name={icon}/>
  <View style={{flexDirection:'row'}}>
  <Text>{label}</Text>
  <Icon name='arrow_narrow_right'/>
  </View>
</TouchableOpacity>
)
const AdminDashboard: FC<AdminDashboardScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterObject>();

  const dispatch = useAppDispatch();

  const {userData} = useAppSelector(state => state.auth);
  const {dashboardDetails} = useAppSelector(state => state.observation);

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getDashboardDetailsAndObservationList(userData?.id));
    }, []),
  );

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const menuItemArray:AdminDashboardMenuItemTypes[]=[
{icon:''}
  ]
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
          <Text style={{marginVertical:10}}>Welcome {userData.userName}!</Text>
          <View style={{flexDirection:'row'}}>
              
          </View>
      </Layout>
    </Drawer>
  );
};
export default AdminDashboard;
