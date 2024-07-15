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
  getObservationAnalytics,
  getUserCountAnalytics,
} from '../../redux/features/analyticsSlice';
import {
  AnalyticsCountTile,
  getMonthsArray,
} from './UserAndRoleAnalyticsMainPage';
import LineChart from '../../components/CurvedLineChart';
import moment from 'moment';
import {
  ObservationsTile,
  RenderTitleWithLink,
} from '../dashboard/TeacherDashboard';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import { getAllObservations } from '../../redux/features/observationSlice';

type TeacherObservationAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'TeacherObservationAnalytics'
>;
type TeacherObservationAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'TeacherObservationAnalytics'
>;

interface TeacherObservationAnalyticsScreenProps {
  navigation: TeacherObservationAnalyticsNavigationProp;
  route: TeacherObservationAnalyticsRouteProp;
}

export type TeacherObservatioAnalyticsCountLabelTypes =
  | 'Total Observations'
  | 'Total Indicators'
  | 'Average Score';

const TeacherObservationAnalytics: FC<
  TeacherObservationAnalyticsScreenProps
> = ({navigation, route}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const dispatch = useAppDispatch();
  const {
    observationAnalytics,
    observationCountAnalytics,
    rubricWiseObservationAnalytics,
  } = useAppSelector(state => state.analytics);

  const {allObservations} = useAppSelector(state => state.observation);
  const {userData} = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(     getAllObservations([
      userData.id,
      {
        filterType: 'All',
        paginationRequest: {
          page: 0,
          size: 4,
          type: 'all',
        },
      },
    ]),)
    dispatch(getUserCountAnalytics());
    dispatch(
      getObservationAnalytics({
        userId: userData.id,
        "stateId": null,
        "districtId":null,
        "schoolId":null,
       "dateType":"selected_date",
        "startDate":"2024-01-01",
        "endDate":"2024-12-31"
      }),
    );
  }, []);



  const formattedUserAndRoleCountAnalytics = observationCountAnalytics?.dataList?.observationAndAverageCount
    .slice(1)
    .map(row => ({
      month: row[0],
      indicatorAverageRating: row[1],
    }));

  const formattedObservationsAnalytics =
    observationAnalytics?.dataList?.observationAndIndicatorCount
      ?.slice(1)
      .map((row: any[]) => ({
        month: row[0],
        observations: row[1],
        indicators: row[2],
        averageScore: row[3],
      }));

  const monthObservations: string[] =
    formattedObservationsAnalytics?.map((item: {month: any}) => item.month) ||
    [];
  const observations: number[] =
    formattedObservationsAnalytics?.map(
      (item: {observations: any}) => item.observations,
    ) || [];

  const indicators: number[] =
    formattedObservationsAnalytics?.map(
      (item: {indicators: any}) => item.indicators,
    ) || [];
  const averageScore: number[] =
    formattedObservationsAnalytics?.map(
      (item: {averageScore: any}) => item.averageScore,
    ) || [];

  const indicatorAverageRating: number[] =
    formattedUserAndRoleCountAnalytics?.map(
      item => item.indicatorAverageRating,
    ) || [];

  const months =
    formattedUserAndRoleCountAnalytics?.map(item =>
      moment().month(item.month).format('MMM'),
    ) || getMonthsArray();

    console.log("indicators",indicators)
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
        focusedStack="AnalyticsStack"
        dashboard>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          Teacher Observation Analytics
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <AnalyticsCountTile
            text={'Total Observations'}
            color={'green'}
            count={12 || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Indicators'}
            color={'orange'}
            count={13 || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Average Score'}
            color={'red'}
            count={53 || 0}
            onPress={() => {}}
          />
        </View>

        {observationAnalytics &&
          observationAnalytics?.dataList?.observationAndIndicatorCount?.length >
            0 && (
            <>
              {/* <LineChart
                value1={indicatorAverageRating}
                title="Rubric Analytics"
                labels={months || ['']}
              /> */}

              <LineChart
                value1={observations}
                value2={indicators}
                value3={averageScore}
                title="User Analytics"
                labels={monthObservations || ['']}
                indicators={['Observation', 'Indicators', 'Average Score']}
              />
            </>
          )}
        <View style={{marginVertical: 10}}>
          <RenderTitleWithLink
            icon="observation_icon"
            titleText="List of Observations"
            linkText="View All"
            onPress={() => {
              navigation.navigate('ObservationsListAnalytics');
            }}
          />
          <View style={{marginTop: 5,marginBottom:15}}>
            {allObservations ? (
              allObservations?.dataList?.observations?.length > 0 ? (
                allObservations?.dataList?.observations
                  ?.slice(0, 4)
                  ?.map((item, index) => (
                    <ObservationsTile
                      key={index}
                      rating={item.ratings?.toString()}
                      userAssisted={item.userAssessed}
                      image={item.userImage}
                      reportedBy={item.reportedBy}
                      creationDate={moment(item.createdDate).format(
                        'DD/MM/YYYY',
                      )}
                      creationTime={moment(item.createdDate).format('h:mmA')}
                      status="Completed"
                      disabled
                    />
                  ))
              ) : (
                <RenderEmptyPlaceholder style={{marginVertical: '20%'}} />
              )
            ) : (
              <></>
            )}
          </View>
        </View>
      </Layout>
    </Drawer>
  );
};
export default TeacherObservationAnalytics;
