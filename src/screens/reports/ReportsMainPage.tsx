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
import {rubricData} from '../rubric/RubricDashboard';
import Text from '../../components/Text';
import Icon, {IconTypes} from '../../components/Icon';
import colors from '../../config/colors';
import {ObservationsTile} from '../dashboard/TeacherDashboard';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import {navigate} from '../../utils/helpers/navigationHelpers';
import Calendar from '../../components/Calendar';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getAllObservations} from '../../redux/features/observationSlice';

type ReportsMainPageNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'ReportsMainPage'
>;
type ReportsMainPageRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'ReportsMainPage'
>;

interface ReportsMainPageScreenProps {
  navigation: ReportsMainPageNavigationProp;
  route: ReportsMainPageRouteProp;
}

type FloatingButtonTypes = {
  text?: string;
  icon?: IconTypes;
  iconSize?: number;
  onPress: () => void;
  style?: ViewStyle;
};

const FloatingButton: FC<FloatingButtonTypes> = ({
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

const tabs: string[] = ['All (20)', 'By me (60)', 'For me (60)'];
const ReportsMainPage: FC<ReportsMainPageScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setrubricListData] = useState<any[]>([]);
  const [isAddButtonPressed, setIsAddButtonPressed] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {allObservations, dashboardDetails} = useAppSelector(
    state => state.observation,
  );
  const {userData} = useAppSelector(
    state => state.auth,
  );
  const handleTabClick = (title: string) => {
    title == 'Active'
      ? setrubricListData(rubricData.filter(item => item.active))
      : title == 'Non-Active'
      ? setrubricListData(rubricData.filter(item => item.active == false))
      : setrubricListData(rubricData);
  };

  useEffect(() => {
    dispatch(
      getAllObservations([userData.id,{
        page: 0,
        size: 15,
        type: 'all',
      }]),
    );
  }, []);
  return (
    <>
      <Layout
        overridePaddingVertical
        icon={'search_reports_icon'}
        title={'Observation Reports'}
        titleTransition>
        <Calendar
          onProceed={() => {}}
          onClose={() => {
            setIsFilterOpen(false);
          }}
          isVisible={isFilterOpen}
          isOKCancelButtonsNeeded
        />
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Observation Reports
        </Text>
        <Tab
          tabs={[
            `All (${dashboardDetails?.total})`,
            `By me (${dashboardDetails?.byMe})`,
            `For me (${dashboardDetails?.forMe})`,
          ]}
          onClick={title => handleTabClick(title)}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '85%',
              backgroundColor: '#F5F7FA',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <TextInput
              style={{flex: 1, color: colors.blackColor, paddingVertical: 5}}
              placeholder="Search"
              placeholderTextColor={colors.darkGrey}
              // onChangeText={text => {
              //   setSearchText(text);
              // }}
            />
            <Icon name="search_icon" />
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: colors.primaryColor,
              padding: 8,
              borderRadius: 10,
            }}
            onPress={() => {
              setIsFilterOpen(true);
            }}>
            <Icon name="filter_icon" />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 10}}>
          {allObservations?.dataList?.map((item, index) => (
            <ObservationsTile
              key={index}
              rating={item.ratings?.toString()}
              userAssisted={item.userAssessed}
              image={''}
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
              navigation.navigate('AddNewObservation')
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
export default ReportsMainPage;
