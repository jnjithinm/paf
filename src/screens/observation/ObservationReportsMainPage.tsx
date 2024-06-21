import React, {FC, useEffect, useState} from 'react';
import {
  Platform,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import Text from '../../components/Text';
import Icon, {IconTypes} from '../../components/Icon';
import colors from '../../config/colors';
import {ObservationsTile} from '../dashboard/TeacherDashboard';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import Calendar, {FilterObject} from '../../components/Calendar';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  FilterType,
  ObservationData,
  getAllObservations,
} from '../../redux/features/observationSlice';
import SearchWithFilter from '../../components/SearchWithFilter';
import { DropdownObject } from '../../components/LabeledDropdown';

type ObservationReportsMainPageNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'ObservationReportsMainPage'
>;
type ObservationReportsMainPageRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'ObservationReportsMainPage'
>;

interface ObservationReportsMainPageScreenProps {
  navigation: ObservationReportsMainPageNavigationProp;
  route: ObservationReportsMainPageRouteProp;
}

type FloatingButtonTypes = {
  text?: string;
  icon?: IconTypes;
  iconSize?: number;
  onPress: () => void;
  style?: ViewStyle;
};

export const FloatingButton: FC<FloatingButtonTypes> = ({
  text,
  icon,
  onPress,
  style,
  iconSize = 20,
}) => {
  return (
    <TouchableOpacity
      style={{
        padding: 13,
        // aspectRatio: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        bottom: 30,
        right: 20,
        flexDirection: 'row',
        backgroundColor: '#EA7804',
        borderRadius: 10,
        zIndex: 1,
        ...Platform.select({
          ios: {
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
        ...style,
      }}
      onPress={onPress}>
      {icon && <Icon name={icon} width={iconSize} height={iconSize} />}
      {text && <Text style={{color: 'white'}}>{text}</Text>}
    </TouchableOpacity>
  );
};

const ObservationReportsMainPage: FC<ObservationReportsMainPageScreenProps> = ({
  navigation,
  route,
}) => {

  const [selectedFilter,setSelectedFilter]=useState<FilterType>('All')

  const dispatch = useAppDispatch();
  const {allObservations} = useAppSelector(
    state => state.observation,
  );
  const {userData} = useAppSelector(state => state.auth);

  const handleTabClick = (title: DropdownObject) => {
    setSelectedFilter(title?.value);
    
  };

  useEffect(() => {
    dispatch(
      getAllObservations([
        userData.id,
        {
          filterType:selectedFilter,
          // userId: undefined,
          // userGroupId:undefined,
          // ratings:filter?.rating,
          // dateType: filter?.dateFilterOption,
          // startDate: filter?.date?.startDate,
          // endDate: filter?.date?.endDate,
          paginationRequest: {
            page: 0,
            size: 15,
            type: 'all',
          },
        },
      ]),
    );
  }, [selectedFilter]);



  return (
    <>
      <Layout
        overridePaddingVertical
        icon={'search_reports_icon'}
        title={'Observation Reports'}
        titleTransition>
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Observation Reports
        </Text>
        <Tab
          tabs={[
            {value:'All',label:`All (${allObservations?.dataList?.total || ''})`},
            {value:'byMe',label:`By me (${allObservations?.dataList?.byMe || ''})`},
            {value:'forMe',label: `For me (${allObservations?.dataList?.forMe || ''})`},
          ]}
          onClick={title => handleTabClick(title)}
        />
        <SearchWithFilter
          onTextChange={() => {}}
          onProceed={filter => {
            dispatch(
              getAllObservations([
                userData.id,
                {
                  filterType:selectedFilter,
                  userId: undefined,
                  userGroupId: undefined,
                  ratings: filter?.rating,
                  dateType: filter?.dateFilterOption,
                  startDate: filter?.date?.startDate,
                  endDate: filter?.date?.endDate,
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
        <View style={{marginVertical: 10}}>
          {allObservations?.dataList?.observations?.map((item, index) => (
            <ObservationsTile
              key={index}
              rating={item.ratings?.toString()}
              userAssisted={item.userAssessed}
              image={item.userImage}
              reportedBy={item.reportedBy}
              onPress={() => {
                navigation.navigate('ObservationReport', {
                  observationItem: item,
                });
              }}
            />
          ))}
        </View>
      </Layout>

        <FloatingButton
          icon="plus_icon"
          onPress={() => {
            navigation.navigate('AddNewObservation');
          }}
          iconSize={20}
        />

    </>
  );
};
export default ObservationReportsMainPage;
