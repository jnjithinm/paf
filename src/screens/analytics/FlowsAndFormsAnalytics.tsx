export type FormAndFlowAnalyticsCountLabelTypes='Total Forms Created' | 'Responses Collected' | 'Avg Response Time';


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
import {getFormCountAnalytics, getUserCountAnalytics} from '../../redux/features/analyticsSlice';
import { AnalyticsCountTile } from './UserAndRoleAnalyticsMainPage';


type FlowsAndFormsAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'FlowsAndFormsAnalytics'
>;
type FlowsAndFormsAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'FlowsAndFormsAnalytics'
>;

interface FlowsAndFormsAnalyticsScreenProps {
  navigation: FlowsAndFormsAnalyticsNavigationProp;
  route: FlowsAndFormsAnalyticsRouteProp;
}

type UserAndRoleAnalyticsLabelTypes='Total Roles'|'Total Users'|'Total Groups';

const FlowsAndFormsAnalytics: FC<
  FlowsAndFormsAnalyticsScreenProps
> = ({navigation, route}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const dispatch = useAppDispatch();
  const {formCountAnalytics} = useAppSelector(state => state.analytics);

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
      renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}
      >
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        focusedStack='AnalyticsStack'
        dashboard>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          User and Role Analytics
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AnalyticsCountTile
            text={'Total Forms Created'}
            color={'green'}
            count={formCountAnalytics?.dataList.totalFormCount[0]||0}
            onPress={() => {}}
          />
               <AnalyticsCountTile
            text={'Responses Collected'}
            color={'orange'}
            count={formCountAnalytics?.dataList?.totalResponseCount[0]||0}
            onPress={() => {}}
          />
               <AnalyticsCountTile
            text={'Avg Response Time'}
            color={'red'}
            count={formCountAnalytics?.dataList?.totalResponseAverageTime[0]||0}
            onPress={() => {}}
          />
        </View>
      </Layout>
    </Drawer>
  );
};
export default FlowsAndFormsAnalytics;
