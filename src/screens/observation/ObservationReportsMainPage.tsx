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
  getAllObservations,
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

type ObservationReportsMainPageNavigationProp = StackNavigationProp<
  ObservationStackParamList,
  'ObservationReportsMainPage'
>;
type ObservationReportsMainPageRouteProp = RouteProp<
  ObservationStackParamList,
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
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        bottom: normaliseDesigns(75),
        right: normaliseDesigns(20),
        flexDirection: 'row',
        backgroundColor: '#EA7804',
        borderRadius: 13,
        zIndex: 1,
        ...Platform.select({
          ios: {
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 7,
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

type RenderCompleteStatusTypes = {
  status: ObservationStatus | undefined;
  style?: ViewStyle;
};
export const RenderCompleteStatus: FC<RenderCompleteStatusTypes> = ({
  status,
  style,
}) => (
  <View
    style={{
      ...style,
      flexDirection: 'row',
      backgroundColor: status === 'Completed' ? '#EBF9D9' : '#FFEDED',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 8,
      justifyContent: 'space-evenly',
    }}>
    <View
      style={{
        aspectRatio: 1,
        height: 7,
        backgroundColor: status === 'Completed' ? '#749E35' : '#D62828',
        borderRadius: 10,
      }}
    />
    <Text
      style={{
        color: status === 'Completed' ? '#749E35' : '#D62828',
        marginLeft: 5,
        letterSpacing: 0.32,
      }}
      size="verysmall3"
      fontVariant="bold">
      {status === 'Completed' ? 'Completed' : 'Pending'}
    </Text>
  </View>
);

export const RenderEmptyPlaceholder: FC = () => (
  <View
    style={{marginTop: '40%', alignItems: 'center', justifyContent: 'center'}}>
    <Image name="empty_cart_icon" size={3.5} />
    <Text color="blackColor" size="body3" fontVariant="bold">
      No results found.!
    </Text>
  </View>
);

const ObservationReportsMainPage: FC<ObservationReportsMainPageScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('All');

  const dispatch = useAppDispatch();
  const {allObservations} = useAppSelector(state => state.observation);
  const {userData} = useAppSelector(state => state.auth);
  const {allUsers} = useAppSelector(state => state.users);

  const handleTabClick = (title: ItemType) => {
    setSelectedFilter(title?.value as FilterType);
  };

  useFocusEffect(
    React.useCallback(() => {
      dispatch(
        getAllObservations([
          userData.id,
          {
            filterType: selectedFilter,
            paginationRequest: {
              page: 0,
              size: 15,
              type: 'all',
            },
          },
        ]),
      );
      dispatch(resetSaveEvidenceCardResponse());
      dispatch(resetSaveObservationResponse());
      dispatch(saveNewObservation(null));
      dispatch(saveObservationId(null));
      dispatch(saveEvidenceCardDetails(null));
      dispatch(saveNewEvidenceCardList(null));
      dispatch(resetObservationById());
    }, []),
  );

  useEffect(() => {
    dispatch(
      getAllUsers({
        page: 0,
        size: 10,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (selectedFilter) {
      dispatch(
        getAllObservations([
          userData.id,
          {
            filterType: selectedFilter,
            paginationRequest: {
              page: 0,
              size: 15,
              type: 'all',
            },
          },
        ]),
      );
    }
  }, [selectedFilter]);

  return (
    <>
      <Layout
        overridePaddingVertical
        icon={'search_reports_icon'}
        title={'Observation Reports'}
        focusedStack="ObservationStack"
        titleTransition>
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Observation Reports
        </Text>
        <Tab
          tabs={[
            {
              value: 'All',
              label: `All (${allObservations?.dataList?.total || ''})`,
            },
            {
              value: 'byMe',
              label: `By me (${allObservations?.dataList?.byMe || ''})`,
            },
            {
              value: 'forMe',
              label: `For me (${allObservations?.dataList?.forMe || ''})`,
            },
          ]}
          onClick={title => handleTabClick(title)}
        />
        <SearchWithFilter
          onTextChange={() => {}}
          options={allUsers?.dataList?.map(item => ({
            value: item.userId?.toString(),
            label: item.name,
          }))}
          onProceed={filter => {
            dispatch(
              getAllObservations([
                userData.id,
                {
                  filterType: selectedFilter,
                  userId: filter?.selectedItem?.value,
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
                    dispatch(saveObservationId(item.observationId));
                    navigation.navigate('ObservationReport');
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
          count={(allObservations?.dataList?.total || 0) / 10}
          onPressPageIndex={(index) => {
            dispatch(
              getAllObservations([
                userData.id,
                {
                  filterType: selectedFilter,
                  paginationRequest: {
                    page: index,
                    size: 10,
                    type: 'all',
                  },
                },
              ]),
            );
          }}
        />
      </Layout>

      <FloatingButton
        icon="plus_icon"
        onPress={() => {
          navigation.navigate('AddNewObservation');
        }}
        style={{bottom:150}}
        iconSize={20}
      />
    </>
  );
};
export default ObservationReportsMainPage;
