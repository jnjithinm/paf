import React, {FC, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {
  getFormCountAnalytics,
  getUserCountAnalytics,
} from '../../redux/features/analyticsSlice';
import {AnalyticsCountTile} from './UserAndRoleAnalyticsMainPage';
import CurvedLineChart from '../../components/CurvedLineChart';
import {RenderTitleWithLink} from '../dashboard/TeacherDashboard';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import {FlowsItem} from '../flowsAndForms/FlowsMainPage';
import moment from 'moment';
import {getAllFlows} from '../../redux/features/flowsSlice';

type FlowsAndFormAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'FlowsAndFormAnalytics'
>;
type FlowsAndFormAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'FlowsAndFormAnalytics'
>;

interface FlowsAndFormAnalyticsScreenProps {
  navigation: FlowsAndFormAnalyticsNavigationProp;
  route: FlowsAndFormAnalyticsRouteProp;
}

export type FormAndFlowAnalyticsCountLabelTypes =
  | 'Total Forms Created'
  | 'Responses Collected'
  | 'Avg Response Time';

const FlowsAndFormAnalytics: FC<FlowsAndFormAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const dispatch = useAppDispatch();
  const {formCountAnalytics} = useAppSelector(state => state.analytics);
  const {userData} = useAppSelector(state => state.auth);
  const {allFlows} = useAppSelector(state => state.flows);

  useEffect(() => {
    dispatch(
      getFormCountAnalytics({
        dateType: 'selected_date',
        startDate: '2024-04-19',
        endDate: '2024-06-19',
      }),
    );
    dispatch(
      getAllFlows([
        userData.userName,
        userData.id,
        {
          page: 0,
          size: 2,
          type: 'all',
        },
      ]),
    );
  }, []);

  const formattedFormCountAnalytics =
    formCountAnalytics?.dataList?.formAnalytics.slice(1).map(row => ({
      months: row[0],
      countOfForms: row[1],
      countOfResponses: row[2],
      averageResponseTime: row[3],
    }));

  const months: string[] =
    formattedFormCountAnalytics?.map(item => item.months) || [];
  const countOfForms: number[] =
    formattedFormCountAnalytics?.map(item => Number(item.countOfForms)) || [];
  const countOfResponses: number[] =
    formattedFormCountAnalytics?.map(item => Number(item.countOfResponses)) ||
    [];

  const averageResponseTime: number[] =
    formattedFormCountAnalytics?.map(item =>
      Number(item.averageResponseTime),
    ) || [];

  const filteredFlows = allFlows?.dataList?.filter(item =>
    item?.flowName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

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
        focusedStack="AnalyticsStack"
        dashboard>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          Flows and Form Analytics
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <AnalyticsCountTile
            text={'Total Forms Created'}
            color={'green'}
            count={formCountAnalytics?.dataList?.totalFormCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Responses Collected'}
            color={'orange'}
            count={formCountAnalytics?.dataList?.totalResponseCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Avg Response Time'}
            color={'red'}
            count={
              Number(formCountAnalytics?.dataList?.totalResponseAverageTime[0]?.toFixed(1)) || 0
            }
            onPress={() => {}}
          />
        </View>
        {formCountAnalytics &&
          formCountAnalytics?.dataList?.formAnalytics?.length !== 0 && (
            <CurvedLineChart
              value1={countOfForms}
              value2={countOfResponses}
              value3={averageResponseTime}
              labels={months || ['']}
              indicators={[
                'Count of forms',
                'Count of Responses',
                'Average Response Time',
              ]}
            />
          )}
        <RenderTitleWithLink
          icon="list_of_flows_icon"
          titleText="List of Flows"
          linkText="View All"
          onPress={() => {
            navigation.navigate('FlowsListAnalytics');
          }}
        />

        {filteredFlows ? (
          filteredFlows.length > 0 ? (
            filteredFlows
              ?.filter(item =>
                item.flowName
                  ?.toLocaleLowerCase()
                  ?.includes(search?.toLocaleLowerCase()),
              )
              ?.slice(0, 2)
              ?.map(ele => (
                <FlowsItem
                  active={ele.status}
                  createdBy={ele.createdBy}
                  createdDate={moment(ele.createdDate).format('DD/MM/YYYY')}
                  title={ele.flowName}
                  userCount={ele.responses}
                  key={ele.flowId}
                  onPress={() => {
                    navigation.navigate('FormsListAnalytics', {flowItem: ele});
                  }}
                />
              ))
          ) : (
            <RenderEmptyPlaceholder />
          )
        ) : (
          <></>
        )}
      </Layout>
    </Drawer>
  );
};
export default FlowsAndFormAnalytics;
