

import React, {FC, useEffect, useState} from 'react';
import {Platform, TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import Text from '../../components/Text';
import Icon, {IconTypes} from '../../components/Icon';
import colors from '../../config/colors';
import {ObservationsTile} from '../dashboard/TeacherDashboard';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  FilterType,
  ObservationStatus,
  resetObservationById,
  resetSaveEvidenceCardResponse,
  resetSaveObservationResponse,
  saveEvidenceCardDetails,
  saveNewEvidenceCardList,
  saveNewObservation,
  saveObservationId,
} from '../../redux/features/observationSlice';
import SearchWithFilter from '../../components/SearchWithFilter';
import {ItemType} from '../../config/types';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import {ObservationStackParamList} from '../../navigation/ObservationStack';
import moment from 'moment';
import {getAllUsers} from '../../redux/features/usersSlice';
import Image from '../../components/Image';
import PaginationBar from '../../components/PaginationBar';
import { FilterObject } from '../../components/Calendar';
import { FloatingButton, RenderEmptyPlaceholder } from '../observation/ObservationReportsMainPage';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsStack';
import { getAllObservations } from '../../redux/features/analyticsSlice';


type ObservationsListAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'ObservationsListAnalytics'
>;
type ObservationsListAnalyticsRouteProp = RouteProp<
AnalyticsStackParamList,
  'ObservationsListAnalytics'
>;


interface ObservationsListAnalyticsScreenProps {
    navigation: ObservationsListAnalyticsNavigationProp;
    route: ObservationsListAnalyticsRouteProp;
  }

const ObservationsListAnalytics: FC<ObservationsListAnalyticsScreenProps> = ({
    navigation,
    route,
  }) => {
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');
    const [search, setSearch] = useState<string>('');


    const dispatch = useAppDispatch();
    const {allObservations} = useAppSelector(state => state.analytics);
    const {userData} = useAppSelector(state => state.auth);

    const {allUsers}=useAppSelector(state=>state.users);

    
    useFocusEffect(
      React.useCallback(() => {
        dispatch(
          getAllObservations([
            userData.id,
            {
              filterType: 'All',
              paginationRequest: {
                page: 0,
                size: 15,
                type: 'all',
              },
            },
          ]),
        );
      }, []),
    );
  

  
  
    useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
        if (search.length >= 3) {
          dispatch(getAllUsers([ {
            page: 0,
            size: 15,
            type: 'all',
          },search]));
        }
      }, 200);
  
      return () => clearTimeout(delayDebounceFn);
    }, [search]);
  
    return (
      <>
        <Layout
          overridePaddingVertical
          icon={'search_reports_icon'}
          title={'Observation Reports'}
          focusedStack='AnalyticsStack'
          titleTransition>
          <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
            Observations
          </Text>
        
          <SearchWithFilter
            onTextChange={search => {
              setSearch(search)
            }}
            placeHolder='Search by user name'
            options={allUsers?.dataList?.map(item => ({
              value: item.userId?.toString(),
              label: item.name,
            }))}
            filterNotNeeded
            onProceed={filter => {
              dispatch(
                getAllObservations([
                  userData.id,
                  {
                    filterType: 'All',
                    userId: filter?.selectedItem?.value,
                    paginationRequest: {
                      page: 0,
                      size: 15,
                      type: 'all',
                    },
                  },
                ]),
              );
            }}
          />
          <View style={{marginBottom: 20}}>
            {allObservations ? (
              allObservations?.dataList?.observations?.length > 0 ? (
                allObservations?.dataList?.observations?.map((item, index) => (
                  <ObservationsTile
                    key={index}
                    rating={item.ratings?.toString()}
                    userAssisted={item.userAssessed}
                    image={item.userImage}
                    reportedBy={item.reportedBy}
                    onPress={() => {
                      console.log("hhhhhhhhhhhhh")
                      navigation.navigate('ObservationAnalytics',{observationId:item?.observationId});
                    }}
                    creationDate={moment(item.createdDate).format('DD/MM/YYYY')}
                    creationTime={moment(item.createdDate).format('h:mmA')}
                    status={item.observationStatus}
                  />
                ))
              ) : (
                <RenderEmptyPlaceholder />
              )
            ) : (
              <></>
            )}
          </View>
          <PaginationBar
            count={
              ((selectedFilter === 'All'
                ? allObservations?.dataList?.total
                : selectedFilter === 'byMe'
                ? allObservations?.dataList.byMe
                : allObservations?.dataList.forMe) || 0) / 15
            }
            onPressPageIndex={index => {
              if (selectedFilter) {
                dispatch(
                  getAllObservations([
                    userData.id,
                    {
                      filterType: 'All',
                      paginationRequest: {
                        page: index,
                        size: 15,
                        type: 'all',
                      },
                    },
                  ]),
                );
              }
            }}
          />
        </Layout>
  
 
      </>
    );
  };
  export default ObservationsListAnalytics;
  