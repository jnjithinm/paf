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
  ObservationData,
  getAllObservations,
} from '../../redux/features/observationSlice';
import SearchWithFilter from '../../components/SearchWithFilter';

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
  const [rubricListData, setRubricListData] = useState<ObservationData[]>([]);
  const [isAddButtonPressed, setIsAddButtonPressed] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterObject | undefined>();

  const dispatch = useAppDispatch();
  const {allObservations, dashboardDetails} = useAppSelector(
    state => state.observation,
  );
  const {userData} = useAppSelector(state => state.auth);
  const handleTabClick = (title: string) => {
    if (allObservations?.dataList) {
      title == 'Active'
        ? setRubricListData(
            allObservations?.dataList?.filter(
              item => item.observationStatus === 'Completed',
            ),
          )
        : title == 'Non-Active'
        ? setRubricListData(
            allObservations?.dataList?.filter(
              item => item.observationStatus === 'Pending',
            ),
          )
        : setRubricListData(allObservations?.dataList);
    }
  };

  useEffect(() => {
    dispatch(
      getAllObservations([
        userData.id,
        {
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
  }, []);

  useEffect(() => {
    if (allObservations) {
      setRubricListData(allObservations?.dataList);
    }
  }, [allObservations]);

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
            `All (${dashboardDetails?.total || ''})`,
            `By me (${dashboardDetails?.byMe || ''})`,
            `For me (${dashboardDetails?.forMe || ''})`,
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
          {rubricListData?.map((item, index) => (
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

      {isAddButtonPressed ? (
        <View>
          <FloatingButton
            icon="plus_icon"
            text="New observation"
            iconSize={15}
            onPress={() => {
              navigation.navigate('AddNewObservation');
            }}
            style={{bottom: normaliseDesigns(70), width: normaliseDesigns(145)}}
          />
          <FloatingButton
            icon="cross_icon_white"
            iconSize={10}
            onPress={() => {
              setIsAddButtonPressed(false);
            }}
          />
        </View>
      ) : (
        <FloatingButton
          icon="plus_icon"
          onPress={() => {
            setIsAddButtonPressed(true);
          }}
          iconSize={20}
        />
      )}
    </>
  );
};
export default ObservationReportsMainPage;
