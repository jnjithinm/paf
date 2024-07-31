import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Drawer} from 'react-native-drawer-layout';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import DrawerContent from '../../components/DrawerContent';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {
  getUserAndRoleCountAnalytics,
  getUserCountAnalytics,
  getDistricts,
  getStates,
  getAreas,
  State,
  Area,
  District,
  getUserCountAnalyticsUserAndRole,
} from '../../redux/features/analyticsSlice';
import moment from 'moment';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import LineChart from '../../components/CurvedLineChart';
import {showMessage} from 'react-native-flash-message';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot from 'react-native-view-shot';
import {FormAndFlowAnalyticsCountLabelTypes} from './FlowsAndFormAnalytics';
import Calendar, {DateFilterOption, FilterObject} from './UserAndRoleFilter';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import {ItemType} from '../../config/types';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import {TeacherObservatioAnalyticsCountLabelTypes} from './TeacherObservationAnalytics';
import LabeledDropdown from '../../components/LabeledDropdown';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import { items } from 'fusioncharts';

type UserAndRoleAnalyticsMainPageNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'UserAndRoleAnalyticsMainPage'
>;
type UserAndRoleAnalyticsMainPageRouteProp = RouteProp<
  AnalyticsStackParamList,
  'UserAndRoleAnalyticsMainPage'
>;

interface UserAndRoleAnalyticsMainPageScreenProps {
  navigation: UserAndRoleAnalyticsMainPageNavigationProp;
  route: UserAndRoleAnalyticsMainPageRouteProp;
}

type UserAndRoleAnalyticsLabelTypes =
  | 'Total Roles'
  | 'Total Users'
  | 'Total Groups';

type AnalyticsCountTileTypes = {
  text:
    | UserAndRoleAnalyticsLabelTypes
    | FormAndFlowAnalyticsCountLabelTypes
    | TeacherObservatioAnalyticsCountLabelTypes;
  color: 'green' | 'red' | 'orange';
  count: number;
  onPress: () => void;
  disabled?: boolean;
};

export const AnalyticsCountTile: FC<AnalyticsCountTileTypes> = ({
  text,
  color,
  count,
  onPress,
  disabled,
}) => (
  <TouchableOpacity
    style={{
      backgroundColor:
        color === 'green'
          ? '#EBF9D9'
          : color === 'orange'
          ? '#FDF0E3'
          : '#FEF8EC',
      alignItems: 'flex-start',
      borderWidth: 1,
      borderColor:
        color === 'green'
          ? '#749E35'
          : color === 'orange'
          ? '#D29804'
          : '#EA7804',
      justifyContent: 'center',
      width: '32%',
      paddingHorizontal: 13,
      borderRadius: 10,
      paddingVertical: 7,
    }}
    disabled={disabled}
    onPress={() => {}}>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
      }}
      fontVariant="bold"
      size="body3"
      onPress={onPress}>
      {count} {text == 'Avg Response Time' ? 'hr' : ''}
    </Text>
    <Text
      style={{
        color:
          color === 'green'
            ? '#749E35'
            : color === 'orange'
            ? '#D29804'
            : '#EA7804',
        marginTop: 5,
      }}
      size="small3"
      fontVariant="semiBold">
      {text}
    </Text>
  </TouchableOpacity>
);

export const getMonthsArray = () => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const monthName = moment().month(i).format('MMMM');
    months.push(monthName);
  }
  return months;
};

const UserAndRoleAnalyticsMainPage: FC<
  UserAndRoleAnalyticsMainPageScreenProps
> = ({navigation}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isModalVisibleTwo, setIsModalVisibleTwo] = useState<boolean>(false);
  const [isModalVisibleOne, setIsModalVisibleOne] = useState<boolean>(false);
  const [isZoomedone, setIsZoomedone] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState<string>('');
  const viewShotRefs = useRef<{[key: string]: ViewShot | null}>({});
  const [charactive, setCharactive] = useState<string>('');
  const dispatch = useAppDispatch();
  const {
    userCountAnalytics,
    userAndRoleCountAnalytics,
    states,
    districts,
    areas,
    userCountAnalyticsUserAndRole,
  } = useAppSelector(state => state.analytics);

  const [filterOneOpen, setFilterOneOpen] = useState(false);
  const [filtersChartTwo, setFiltersChartTwo] = useState(false);

  // Separate state for each chart's filter criteria
  // const [filtersChartOne, setFiltersChartOne] = useState({
  //   userGroup: null,
  //   userStatus: null,
  //   stateId: null,
  //   districtId: null,
  //   area: null,
  //   date: null,
  // });
  // const [filtersChartTwo, setFiltersChartTwo] = useState({
  //   userGroup: null,
  //   userStatus: null,
  //   stateId: null,
  //   districtId: null,
  //   area: null,
  //   date: null,
  // });

  const [dateFilter, setDateFilter] = useState<
    {startDate: string; endDate: string} | undefined
  >(undefined);

  const [statesList, setStatesList] = useState<State[]>();
  const [districtList, setDistrictList] = useState<District[]>();
  const [areatList, setAreaList] = useState<Area[]>();
  const [search, setSearch] = useState<string>('');
  const [isSortIconClickOne, setIsSortIconClickOne] = useState(false);
  const [isZoomButtonClickedOne, setIsZoomButtonClickedOne] = useState(false);
  const [isDownloadButtonClickedOne, setIsDownloadButtonClickedOne] =
    useState(false);
  const [isShareButtonClickedOne, setIsShareButtonClickedOne] = useState(false);
  const [isZoomedOne, setIsZoomedOne] = useState<boolean>(false);
  const [isZoomButtonClickedTwo, setIsZoomButtonClickedTwo] = useState(false);
  const [isDownloadButtonClickedTwo, setIsDownloadButtonClickedTwo] =
    useState(false);
  const [isShareButtonClickedTwo, setIsShareButtonClickedTwo] = useState(false);
  const [isZoomedTwo, setIsZoomedTwo] = useState<boolean>(false);
  const [isSortIconClickTwo, setIsSortIconClickTwo] = useState(false);
  const [filterOpenTwo, setFilterOpenTwo] = useState(false);
  const [chartone, setChartOne] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getUserCountAnalytics());
    dispatch(
      getUserCountAnalyticsUserAndRole({
        userStatusType: 'all',
        dateType: 'selected_date' ||
          'Week' ||
          'Month' ||
          'past_3_months' ||
          'Past_1_Year',
        startDate: null,
        endDate: null,
      }),
    );
    dispatch(
      getUserAndRoleCountAnalytics({
        userStatusType: null,
        roleStatusType: null,
        userGroupStatusType: null,
        stateId: null,
        districtId: null,
        area: null,
        dateType:
          'selected_date' ||
          'Week' ||
          'Month' ||
          'past_3_months' ||
          'Past_1_Year',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }),
    );
  }, []);

  useEffect(() => {
    if (states) {
      setStatesList(states?.dataList);
    }
  }, [states]);

  useEffect(() => {
    dispatch(
      getStates({
        page: 0,
        size: 0,
        type: 'true',
      }),
    );
  }, []);

  useEffect(() => {
    if (districts) {
      setDistrictList(districts.dataList);
    }
  }, [districts]);

  useEffect(() => {
    dispatch(
      getDistricts({
        page: 0,
        size: 0,
        type: 'true',
      }),
    );
  }, []);

  useEffect(() => {
    if (areas) {
      setAreaList(areas.dataList);
    }
  }, [areas]);

  useEffect(() => {
    dispatch(
      getAreas({
        page: 0,
        size: 0,
        type: 'true',
      }),
    );
  }, []);

  if (!userAndRoleCountAnalytics || !userCountAnalytics) {
    return null; // Ensure data is available before rendering
  }

  console.log('userCountAnalytics=========', userCountAnalyticsUserAndRole?.dataList?.userCount);

  const formattedUserAndRoleCountAnalytics =
    userAndRoleCountAnalytics?.dataList?.UserAndRole?.slice(1).map(row => ({
      month: row[0],
      countOfUsers: row[1],
      countOfRoles: row[2],
      countOfUserGroups: row[3],
    })) || [];

  const countOfUsers: number[] = formattedUserAndRoleCountAnalytics.map(
    item => item.countOfUsers,
  );

//   const formattedUserAndRoleCountAnalyticsUserAndRole =
//   userCountAnalyticsUserAndRole?.dataList?.userCount?.slice(1).map(row => ({
//     userCount: typeof row[0] === 'number' ? row[0] : 0, // Ensure it's a number
//   })) || [];

// const countOfUsersCharttwo: number[] = formattedUserAndRoleCountAnalyticsUserAndRole.map(
//   item => item.userCount
// );

  const countOfRoles: number[] = formattedUserAndRoleCountAnalytics.map(
    item => item.countOfRoles,
  );
  const countOfUserGroups: number[] = formattedUserAndRoleCountAnalytics.map(
    item => item.countOfUserGroups,
  );
  const months =
    formattedUserAndRoleCountAnalytics.map(item =>
      moment().month(item.month).format('MMM'),
    ) || getMonthsArray();

  const handleProceed = (filterObject: FilterObject) => {
    setDateFilter(filterObject.date);
  };

  const captureAndDownloadTwo = async (
    viewShotRef: React.RefObject<ViewShot>,
  ) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();

        const downloadDir =
          Platform.OS === 'android'
            ? RNFetchBlob.fs.dirs.DownloadDir
            : RNFetchBlob.fs.dirs.DocumentDir;
        const fileName = 'chart_screenshot.jpg';
        const filePath = `${downloadDir}/${fileName}`;

        const data = await RNFetchBlob.fs.readFile(uri, 'base64');

        await RNFetchBlob.fs.writeFile(filePath, data, 'base64');

        showMessage({
          message: 'Success',
          description: 'File Downloaded successfully',
          type: 'success',
        });
      } else {
        console.error('ViewShot ref is not available');
      }
    } catch (error) {
      console.error('Failed to capture or download:', error);
      showMessage({
        message: 'failure',
        description: 'Failed to Download image',
        type: 'warning',
      });
    }
  };

  const shareImageTwo = async (viewShotRef: React.RefObject<ViewShot>) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();

        const shareOptions = {
          title: 'Share Chart Image',
          url: uri,
          failOnCancel: false,
        };

        Share.share(shareOptions)
          .then(res => console.log(res))
          .catch(err => console.log('Error =>', err));
        setIsModalVisibleTwo(false);
      } else {
        console.error('ViewShot ref is not available');
      }
    } catch (error) {
      console.error('Failed to capture or share:', error);
    }
  };

  const ModalContentTwo: FC<{onClose: () => void}> = ({onClose}) => {
    const handleZoomClickTwo = () => {
      setIsZoomButtonClickedTwo(true);
      setIsDownloadButtonClickedTwo(false);
      setIsShareButtonClickedTwo(false);
      setIsZoomedTwo(true);
      onClose();
    };

    const handleDownloadClickTwo = () => {
      setIsZoomButtonClickedTwo(false);
      setIsDownloadButtonClickedTwo(true);
      setIsShareButtonClickedTwo(false);
      captureAndDownloadTwo(viewShotRefs);
    };

    const handleShareClickTwo = () => {
      setIsZoomButtonClickedTwo(false);
      setIsDownloadButtonClickedTwo(false);
      setIsShareButtonClickedTwo(true);
      shareImageTwo(viewShotRefs);
    };

    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isZoomButtonClickedOne && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleZoomClickTwo}>
          <Icon name="zoomout_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isDownloadButtonClickedOne && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleDownloadClickTwo}>
          <Icon name="downloads_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isShareButtonClickedOne && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleShareClickTwo}>
          <Icon name="share_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ZoomedChartViewTwo = ({onClose}) => (
    <View style={styles.zoomedChartContainertwo}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="cross_icon" />
      </TouchableOpacity>
      {/* <LineChart value1={countOfUsers} labels={months || ['']} /> */}
    </View>
  );

  const handleSortIconClickTwo = () => {
    setIsSortIconClickTwo(true);
    setFilterOpenTwo(true);
    setIsModalVisibleTwo(false);
  };

  const captureAndDownloadOne = async (
    viewShotRef: React.RefObject<ViewShot>,
  ) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();

        const downloadDir =
          Platform.OS === 'android'
            ? RNFetchBlob.fs.dirs.DownloadDir
            : RNFetchBlob.fs.dirs.DocumentDir;
        const fileName = 'chart_screenshot.jpg';
        const filePath = `${downloadDir}/${fileName}`;

        const data = await RNFetchBlob.fs.readFile(uri, 'base64');

        await RNFetchBlob.fs.writeFile(filePath, data, 'base64');

        showMessage({
          message: 'Success',
          description: 'File Downloaded successfully',
          type: 'success',
        });
        setIsModalVisibleOne(false);
      } else {
        console.error('ViewShot ref is not available');
      }
    } catch (error) {
      console.error('Failed to capture or download:', error);
      showMessage({
        message: 'failure',
        description: 'Failed to Download image',
        type: 'warning',
      });
    }
  };

  const shareImageOne = async (viewShotRef: React.RefObject<ViewShot>) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();

        const shareOptions = {
          title: 'Share Chart Image',
          url: uri,
          failOnCancel: false,
        };
        setIsModalVisibleOne(false);
        Share.share(shareOptions)
          .then(res => console.log(res))
          .catch(err => console.log('Error =>', err));
      } else {
        console.error('ViewShot ref is not available');
      }
    } catch (error) {
      console.error('Failed to capture or share:', error);
    }
  };

  const ModalContentOne: FC<{onClose: () => void}> = ({onClose}) => {
    const handleZoomClickOne = () => {
      setIsZoomButtonClickedOne(true);
      setIsDownloadButtonClickedOne(false);
      setIsShareButtonClickedOne(false);
      setIsZoomedOne(true);
      onClose();
    };

    const handleDownloadClickOne = () => {
      setIsZoomButtonClickedOne(false);
      setIsDownloadButtonClickedOne(true);
      setIsShareButtonClickedOne(false);
      captureAndDownloadOne(viewShotRefs);
    };

    const handleShareClickOne = () => {
      setIsZoomButtonClickedOne(false);
      setIsDownloadButtonClickedOne(false);
      setIsShareButtonClickedOne(true);
      shareImageOne(viewShotRefs);
    };

    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isZoomButtonClickedOne && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleZoomClickOne}>
          <Icon name="zoomout_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isDownloadButtonClickedOne && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleDownloadClickOne}>
          <Icon name="downloads_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isShareButtonClickedOne && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleShareClickOne}>
          <Icon name="share_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ZoomedChartViewOne = ({onClose}) => (
    <View style={styles.zoomedChartContainerone}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="cross_icon" />
      </TouchableOpacity>
      <LineChart
        value1={countOfUsers}
        value2={countOfRoles}
        value3={countOfUserGroups}
        labels={months || ['']}
        indicators={['Count of users', 'Count of roles', 'User groups']}
      />
    </View>
  );

  const handleSortIconClickOne = () => {
    setIsSortIconClickOne(true);
    setFilterOneOpen(true);
    setIsModalVisibleOne(false);
  };

  type RenderFilterModalContentTypestwo = {
    onPressAssign: () => void;
  };

  const RenderAssignFormModalContenttwo: FC<
    RenderFilterModalContentTypestwo
  > = ({onPressAssign}) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState<string>('');
    const [groupSearch, setGroupSearch] = useState<string>('');
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
      useState<boolean>(false);
    const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      undefined,
    );

    const {formAssignedUserAndUserGroups} = useAppSelector(
      state => state.forms,
    );
    const [selectedUserGroup, setSelectedUserGroup] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserStatus, setSelectedUserStatus] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserState, setSelectedUserState] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserDistrict, setSelectedUserDistrict] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserArea, setSelectedUserArea] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [dateType, setDateType] = useState<string>('');

    console.log('lllll');
    const handlePressChartTwo = () => {
      const filters = {
        userStatusType:selectedUserStatus?.value || 'all',
        dateType:  dateType || null,
        startDate: selectedStartDate || null,
        endDate: selectedEndDate || null,
      };
      onPressAssign();
      dispatch(getUserCountAnalyticsUserAndRole(filters));
      setFilterOpenTwo(false);
    };

    const handleConfirm = (date: Date) => {
      if (pickerMode === 'start') {
        setSelectedStartDate(moment(date).format('YYYY-MM-DD'));
      } else {
        setSelectedEndDate(moment(date).format('YYYY-MM-DD'));
      }
      setIsDateTimePickerVisible(false);
      setDateType('selected_date');
    };

    const handleDateTypeChange = (type: string) => {
      setDateType(type);
      setSelectedStartDate('');
      setSelectedEndDate('');
    };

    const clearDate = () => {
      setSelectedStartDate('');
      setSelectedEndDate('');
      setDateType('');
    };

    const isApplyButtonActive =
      //selectedUserGroup ||
      selectedUserState ||
      //selectedUserDistrict ||
      //selectedUserArea ||
      (selectedStartDate &&
        selectedEndDate) ||
      dateType;

    const stateOptions = statesList?.map(state => ({
      value: state.stateId,
      label: state.stateName,
    }));

    const districtOptions = selectedUserState
      ? districtList
          .filter(item => item.stateId === selectedUserState.value)
          .map(district => ({
            value: district.districtId,
            label: district.districtName,
          }))
      : [];

    const areaOptions = selectedUserDistrict
      ? areatList
          .filter(item => item.districtId === selectedUserDistrict.value)
          .map(area => ({
            value: area.area,
            label: area.area,
          }))
      : [];

    let userGroupsList: ItemType[] = [
      {value: 'allUsers', label: 'All Users'},
      {value: 'activeUsers', label: 'Active Users'},
      {value: 'inactiveUsers', label: 'Inactive Users'},
    ];

    let userStatusList: ItemType[] = [
      {value: 'allUsers', label: 'All Users'},
      {value: 'activeUsers', label: 'Active Users'},
      {value: 'inactiveUsers', label: 'Inactive Users'},
    ];

    return (
      <View style={{paddingHorizontal: 10}}>
        <DateTimePickerComponent
          selectedDate={selectedDate || new Date()}
          onDateChange={handleConfirm}
          showPicker={isDateTimePickerVisible}
        />

        {/* <LabeledDropdown
          label="Select user"
          placeHolder="Select"
          options={userGroupsList}
          setSelectedItem={setSelectedUserGroup}
          defaultValue={selectedUserGroup?.value || ''}
        />
        <LabeledDropdown */}
        {/* label="User Status"
          placeHolder="Select"
          options={userStatusList}
          setSelectedItem={setSelectedUserStatus}
          defaultValue={selectedUserStatus?.value || ''}
        />
  
        <LabeledDropdown
          label="State"
          placeHolder="Select"
          options={stateOptions}
          setSelectedItem={setSelectedUserState}
          defaultValue={selectedUserState?.value || ''}
        />
  
        <LabeledDropdown
          label="District"
          placeHolder="Select"
          options={districtOptions}
          setSelectedItem={setSelectedUserDistrict}
          defaultValue={selectedUserDistrict?.value || ''}
        />
  
        <LabeledDropdown
          label="Area"
          placeHolder="Select"
          options={areaOptions}
          setSelectedItem={setSelectedUserArea}
          defaultValue={selectedUserArea?.value || ''}
        /> */}

        <TouchableOpacity
          onPress={() => {
            setPickerMode('start');
            setIsDateTimePickerVisible(true);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1">
            Select Date
          </Text>
          <View>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#CBD2D9',
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: normaliseDesigns(40),
              }}>
              <Text
                style={{
                  color: selectedStartDate ? colors.blackColor : '#ABB4BD',
                }}
                size="body1">
                {selectedStartDate
                  ? moment(selectedStartDate).format('DD-MM-YYYY').toString()
                  : 'Select start date'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  selectedStartDate || selectedEndDate
                    ? clearDate()
                    : setPickerMode('start');
                }}
                style={{}}>
                <Icon
                  name={
                    selectedStartDate || selectedEndDate
                      ? 'crosscircle'
                      : 'calendar_icon'
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setPickerMode('end');
            setIsDateTimePickerVisible(true);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1"></Text>
          <View>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#CBD2D9',
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: normaliseDesigns(40),
              }}>
              <Text
                style={{color: selectedEndDate ? colors.blackColor : '#ABB4BD'}}
                size="body1">
                {selectedEndDate
                  ? moment(selectedEndDate).format('DD-MM-YYYY').toString()
                  : 'Select end date'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  selectedEndDate ? clearDate() : setPickerMode('end');
                }}
                style={{}}>
                <Icon
                  name={selectedEndDate ? 'crosscircle' : 'calendar_icon'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{marginVertical: 20}}>
          <Text fontVariant="bold" size="body1">
            Date Type
          </Text>
          <View style={styles.dateTypeOptions}>
            <TouchableOpacity onPress={() => handleDateTypeChange('Week')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'Week' && styles.selectedDateTypeOption,
                ]}>
                Last week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDateTypeChange('Month')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'Month' && styles.selectedDateTypeOption,
                ]}>
                This month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDateTypeChange('past_3_months')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'past_3_months' && styles.selectedDateTypeOption,
                ]}>
                Past 3 months
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDateTypeChange('Past_1_Year')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'Past_1_Year' && styles.selectedDateTypeOption,
                ]}>
                Past 1 year
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{marginBottom: 0, marginTop: 50}}>
          <Button
            text="Apply"
            active={isApplyButtonActive}
            onPress={handlePressChartTwo}
          />
        </View>
      </View>
    );
  };

  //   type RenderFilterModalContentTypesone = {
  //     onPressAssign: () => void;
  //   };

  //   const RenderAssignFormModalContentone: FC<
  //     RenderFilterModalContentTypesone
  //   > = ({onPressAssign}) => {
  //     const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  //     const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  //     const [userSearch, setUserSearch] = useState<string>('');
  //     const [groupSearch, setGroupSearch] = useState<string>('');
  //     const [isCalenderOpen, setIsCalenderOpen] = useState<boolean>(false);

  //     const {formAssignedUserAndUserGroups} = useAppSelector(
  //       state => state.forms,
  //     );
  //     const [selectedUserGroup, setSelectedUserGroup] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedUserStatus, setSelectedUserStatus] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedUserState, setSelectedUserState] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedUserDistrict, setSelectedUserDistrict] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedUserArea, setSelectedUserArea] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedUserDate, setSelectedUserDate] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  //     const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  //     const [dateFilter, setDateFilter] = useState<
  //       {startDate: string; endDate: string} | undefined
  //     >(undefined);
  //     const [dateType, setDateType] = useState<string>('');

  //     const [dateFilterOption, setDateFilterOption] = useState<
  //       DateFilterOption | undefined
  //     >(undefined);
  //     // const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  //     // const handlePressChartOne = () => {
  //     //   const filters = {
  //     //     ...filtersChartOne,
  //     //     userGroup: selectedUserGroup?.value || null,
  //     //     userStatus: selectedUserStatus?.value || null,
  //     //     stateId: selectedUserState?.value || null,
  //     //     districtId: selectedUserDistrict?.value || null,
  //     //     area: selectedUserArea?.value || null,
  //     //     date: selectedDate || null,
  //     //   };
  //     //   setFiltersChartOne(filters);
  //     //   dispatch(getUserAndRoleCountAnalytics(filters));
  //     //   setFilterOneOpen(false);
  //     // };

  //     const handleProceed = (filterObject: FilterObject) => {
  //       setDateFilter(filterObject.date);
  //       setDateFilterOption(filterObject.dateFilterOption);
  //     };
  //     // const handlePressChartOne = () => {
  //     //   const filters = {
  //     //     userGroup: selectedUserGroup?.value || null,
  //     //     userStatus: selectedUserStatus?.value || null,
  //     //     stateId: selectedUserState?.value || null,
  //     //     districtId: selectedUserDistrict?.value || null,
  //     //     area: selectedUserArea?.value || null,
  //     //     startDate: selectedStartDate || null,
  //     //     endDate: selectedEndDate || null,
  //     //   };
  //     //   onPressAssign();
  //     //   dispatch(getUserAndRoleCountAnalytics(filters));
  //     //   setFilterOneOpen(false);
  //     // };
  //     //const handlePressChartTwo = () => {
  //     //   const filters = {
  //     //     ...filtersChartTwo,
  //     //     userGroup: selectedUserGroup?.value || null,
  //     //     userStatus: selectedUserStatus?.value || null,
  //     //     stateId: selectedUserState?.value || null,
  //     //     districtId: selectedUserDistrict?.value || null,
  //     //     area: selectedUserArea?.value || null,
  //     //     date: selectedDate || null,
  //     //   };
  //     //   setFiltersChartTwo(filters);
  //     //   dispatch(getUserAndRoleCountAnalytics(filters));
  //     //   setFilterOpenTwo(false);
  //     // };

  //     const stateOptions = statesList?.map(state => ({
  //       value: state.stateId,
  //       label: state.stateName,
  //     }));

  //     const districtOptions = selectedUserState
  //       ? districtList
  //           .filter(item => item.stateId === selectedUserState.value)
  //           .map(district => ({
  //             value: district.districtId,
  //             label: district.districtName,
  //           }))
  //       : [];

  //     const areaOptions = selectedUserDistrict
  //       ? areatList
  //           .filter(item => item.districtId === selectedUserDistrict.value)
  //           .map(area => ({
  //             value: area.area,
  //             label: area.area,
  //           }))
  //       : [];

  //     let userGroupsList: ItemType[] = [
  //       {value: 'allUsers', label: 'All Users'},
  //       {value: 'activeUsers', label: 'Active Users'},
  //       {value: 'inactiveUsers', label: 'Inactive Users'},
  //     ];

  //     let userStatusList: ItemType[] = [
  //       {value: 'allUsers', label: 'All Users'},
  //       {value: 'activeUsers', label: 'Active Users'},
  //       {value: 'inactiveUsers', label: 'Inactive Users'},
  //     ];

  //     const handlePressChartOne = () => {
  //       const filters = {
  //         userGroup: selectedUserGroup?.value || null,
  //         userStatus: selectedUserStatus?.value || null,
  //         stateId: selectedUserState?.value || null,
  //         districtId: selectedUserDistrict?.value || null,
  //         area: selectedUserArea?.value || null,
  //         startDate: selectedStartDate || null,
  //         endDate: selectedEndDate || null,
  //         dateType: dateType || null,
  //       };
  //       onPressAssign();
  //       dispatch(getUserAndRoleCountAnalytics(filters));
  //       setFilterOneOpen(false);
  //     };

  //     const handleDateChange = (start: string, end: string) => {
  //       setSelectedStartDate(start);
  //       setSelectedEndDate(end);
  //       setDateType('selected_date');
  //     };

  //     const handleDateTypeChange = (type: string) => {
  //       setDateType(type);
  //       setSelectedStartDate('');
  //       setSelectedEndDate('');
  //     };

  //     const clearDate = () => {
  //       setSelectedStartDate('');
  //       setSelectedEndDate('');
  //       setDateType('');
  //     };

  //     const isApplyButtonActive =
  //       selectedUserGroup ||
  //       selectedUserStatus ||
  //       selectedUserState ||
  //       selectedUserDistrict ||
  //       selectedUserArea ||
  //       selectedStartDate ||
  //       selectedEndDate ||
  //       dateType;

  //     console.log('selectedDate', selectedStartDate, selectedEndDate);
  //     return (
  //       <View style={{paddingHorizontal: 10}}>
  //         {/* <DateTimePickerComponent
  //           selectedDate={selectedDate}
  //           onDateChange={handleDateSelection}
  //           showPicker={isCalendarOpen}
  //         /> */}
  //         {/* <Calendar
  //           onProceed={()=>{handleDateSelection}}
  //           onClose={() => setIsCalenderOpen(false)}
  //           isVisible={isCalenderOpen}
  //         /> */}

  // <Calendar
  //         onProceed={() => setIsCalenderOpen(false)}
  //         onClose={() => setIsCalenderOpen(false)}
  //         isVisible={isCalenderOpen}
  //         onDateChange={handleDateChange} // Pass date change callback for start and end dates
  //       />

  //         <LabeledDropdown
  //           label="Select user"
  //           placeHolder="Select"
  //           options={userGroupsList}
  //           setSelectedItem={setSelectedUserGroup}
  //           defaultValue={selectedUserGroup?.value || ''}
  //         />
  //         <LabeledDropdown
  //           label="User Status"
  //           placeHolder="Select"
  //           options={userStatusList}
  //           setSelectedItem={setSelectedUserStatus}
  //           defaultValue={selectedUserStatus?.value || ''}
  //         />

  //         <LabeledDropdown
  //           label="State"
  //           placeHolder="Select"
  //           options={stateOptions}
  //           setSelectedItem={setSelectedUserState}
  //           defaultValue={selectedUserState?.value || ''}
  //         />

  //         <LabeledDropdown
  //           label="District"
  //           placeHolder="Select"
  //           options={districtOptions}
  //           setSelectedItem={setSelectedUserDistrict}
  //           defaultValue={selectedUserDistrict?.value || ''}
  //         />

  //         <LabeledDropdown
  //           label="Area"
  //           placeHolder="Select"
  //           options={areaOptions}
  //           setSelectedItem={setSelectedUserArea}
  //           defaultValue={selectedUserArea?.value || ''}
  //         />
  //  <TouchableOpacity
  //         onPress={() => {
  //           setIsCalenderOpen(true);
  //         }}
  //         style={{}}>
  //         <Text fontVariant="bold" size="body1">
  //           Select date
  //         </Text>
  //         <View>
  //           <View
  //             style={{
  //               width: '100%',
  //               borderWidth: 1,
  //               borderColor: '#CBD2D9',
  //               marginTop: 10,
  //               borderRadius: 10,
  //               paddingHorizontal: 10,
  //               flexDirection: 'row',
  //               justifyContent: 'space-between',
  //               alignItems: 'center',
  //               height: normaliseDesigns(40),
  //             }}>
  //             <Text
  //               style={{color: selectedStartDate ? colors.blackColor : '#ABB4BD'}}
  //               size="body1">
  //               {selectedStartDate
  //                 ? moment(selectedStartDate).format('DD-MM-YYYY').toString()
  //                 : 'Select start date'}
  //             </Text>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 selectedStartDate || selectedEndDate ? clearDate() : setIsCalenderOpen(true);
  //               }}
  //               style={{}}>
  //               <Icon name={selectedStartDate || selectedEndDate ? 'crosscircle' : 'calendar_icon'} />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //         <View>
  //           <View
  //             style={{
  //               width: '100%',
  //               borderWidth: 1,
  //               borderColor: '#CBD2D9',
  //               marginTop: 10,
  //               borderRadius: 10,
  //               paddingHorizontal: 10,
  //               flexDirection: 'row',
  //               justifyContent: 'space-between',
  //               alignItems: 'center',
  //               height: normaliseDesigns(40),
  //             }}>
  //             <Text
  //               style={{color: selectedEndDate ? colors.blackColor : '#ABB4BD'}}
  //               size="body1">
  //               {selectedEndDate
  //                 ? moment(selectedEndDate).format('DD-MM-YYYY').toString()
  //                 : 'Select end date'}
  //             </Text>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 selectedEndDate ? clearDate() : setIsCalenderOpen(true);
  //               }}
  //               style={{}}>
  //               <Icon name={selectedEndDate ? 'crosscircle' : 'calendar_icon'} />
  //             </TouchableOpacity>
  //           </View>
  //         </View>
  //       </TouchableOpacity>

  //       <View style={{marginVertical: 20}}>
  //         <Text fontVariant="bold" size="body1">
  //           Date Type
  //         </Text>
  //         <View style={styles.dateTypeOptions}>
  //           <TouchableOpacity onPress={() => handleDateTypeChange('Week')}>
  //             <Text style={[styles.dateTypeOption, dateType === 'Week' && styles.selectedDateTypeOption]}>
  //               Last week
  //             </Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity onPress={() => handleDateTypeChange('Month')}>
  //             <Text style={[styles.dateTypeOption, dateType === 'Month' && styles.selectedDateTypeOption]}>
  //               This month
  //             </Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity onPress={() => handleDateTypeChange('past_3_months')}>
  //             <Text style={[styles.dateTypeOption, dateType === 'past_3_months' && styles.selectedDateTypeOption]}>
  //               Past 3 months
  //             </Text>
  //           </TouchableOpacity>
  //           <TouchableOpacity onPress={() => handleDateTypeChange('Past_1_Year')}>
  //             <Text style={[styles.dateTypeOption, dateType === 'Past_1_Year' && styles.selectedDateTypeOption]}>
  //               Past 1 year
  //             </Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //         <View style={{marginBottom: 0, marginTop: 50}}>
  //           <Button
  //             text="Apply"
  //             active={isApplyButtonActive}
  //             onPress={handlePressChartOne}
  //           />
  //         </View>
  //       </View>
  //     );
  //   };

  type RenderFilterModalContentTypesone = {
    onPressAssign: () => void;
  };

  const RenderAssignFormModalContentone: FC<
    RenderFilterModalContentTypesone
  > = ({onPressAssign}) => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState<string>('');
    const [groupSearch, setGroupSearch] = useState<string>('');
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
      useState<boolean>(false);
    const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
      undefined,
    );

    const {formAssignedUserAndUserGroups} = useAppSelector(
      state => state.forms,
    );
    const [selectedUserGroup, setSelectedUserGroup] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserStatus, setSelectedUserStatus] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserState, setSelectedUserState] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserDistrict, setSelectedUserDistrict] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserArea, setSelectedUserArea] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [dateType, setDateType] = useState<string>('');

    console.log('kkkkkk');
    const stateOptions = statesList?.map(state => ({
      value: state.stateId,
      label: state.stateName,
    }));

    const districtOptions = selectedUserState
      ? districtList
          .filter(item => item.stateId === selectedUserState.value)
          .map(district => ({
            value: district.districtId,
            label: district.districtName,
          }))
      : [];

    const areaOptions = selectedUserDistrict
      ? areatList
          .filter(item => item.districtId === selectedUserDistrict.value)
          .map(area => ({
            value: area.area,
            label: area.area,
          }))
      : [];

    let userGroupsList: ItemType[] = [
      {value: 'allUsers', label: 'All Users'},
      {value: 'activeUsers', label: 'Active Users'},
      {value: 'inactiveUsers', label: 'Inactive Users'},
    ];

    let userStatusList: ItemType[] = [
      {value: 'allUsers', label: 'All Users'},
      {value: 'activeUsers', label: 'Active Users'},
      {value: 'inactiveUsers', label: 'Inactive Users'},
    ];

    const handlePressChartOne = () => {
      const filters = {
        userGroup: selectedUserGroup?.value || null,
        userStatus: selectedUserStatus?.value || null,
        stateId: selectedUserState?.value || null,
        districtId: selectedUserDistrict?.value || null,
        area: selectedUserArea?.value || null,
        startDate: selectedStartDate || null,
        endDate: selectedEndDate || null,
        dateType: dateType || null,
      };
      onPressAssign();
      dispatch(getUserAndRoleCountAnalytics(filters));
      setFilterOneOpen(false);
    };

    const handleConfirm = (date: Date) => {
      if (pickerMode === 'start') {
        setSelectedStartDate(moment(date).format('YYYY-MM-DD'));
      } else {
        setSelectedEndDate(moment(date).format('YYYY-MM-DD'));
      }
      setIsDateTimePickerVisible(false);
      setDateType('selected_date');
    };

    const handleDateTypeChange = (type: string) => {
      setDateType(type);
      setSelectedStartDate('');
      setSelectedEndDate('');
    };

    const clearDate = () => {
      setSelectedStartDate('');
      setSelectedEndDate('');
      setDateType('');
    };

    const isApplyButtonActive =
      selectedUserGroup ||
      selectedUserStatus ||
      selectedUserState ||
      selectedUserDistrict ||
      selectedUserArea ||
      (selectedStartDate &&
      selectedEndDate) ||
      dateType;

    return (
      <View style={{paddingHorizontal: 10}}>
        {/* <DateTimePickerComponent
        isVisible={isDateTimePickerVisible}
        mode="date"
        date={selectedDate || new Date()}
        onConfirm={handleConfirm}
        onCancel={() => setIsDateTimePickerVisible(false)}
      /> */}
        <DateTimePickerComponent
          selectedDate={selectedDate || new Date()}
          onDateChange={handleConfirm}
          showPicker={isDateTimePickerVisible}
        />

        <LabeledDropdown
          label="Role Status"
          placeHolder="Select"
          options={userGroupsList}
          setSelectedItem={setSelectedUserGroup}
          defaultValue={selectedUserGroup?.value || ''}
        />
        <LabeledDropdown
          label="User Status"
          placeHolder="Select"
          options={userStatusList}
          setSelectedItem={setSelectedUserStatus}
          defaultValue={selectedUserStatus?.value || ''}
        />

        <LabeledDropdown
          label="State"
          placeHolder="Select"
          options={stateOptions}
          setSelectedItem={setSelectedUserState}
          defaultValue={selectedUserState?.value || ''}
        />

        <LabeledDropdown
          label="District"
          placeHolder="Select"
          options={districtOptions}
          setSelectedItem={setSelectedUserDistrict}
          defaultValue={selectedUserDistrict?.value || ''}
        />

        <LabeledDropdown
          label="Area"
          placeHolder="Select"
          options={areaOptions}
          setSelectedItem={setSelectedUserArea}
          defaultValue={selectedUserArea?.value || ''}
        />

        <TouchableOpacity
          onPress={() => {
            setPickerMode('start');
            setIsDateTimePickerVisible(true);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1">
            Select Date
          </Text>
          <View>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#CBD2D9',
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: normaliseDesigns(40),
              }}>
              <Text
                style={{
                  color: selectedStartDate ? colors.blackColor : '#ABB4BD',
                }}
                size="body1">
                {selectedStartDate
                  ? moment(selectedStartDate).format('DD-MM-YYYY').toString()
                  : 'Select start date'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  selectedStartDate || selectedEndDate
                    ? clearDate()
                    : setPickerMode('start');
                }}
                style={{}}>
                <Icon
                  name={
                    selectedStartDate || selectedEndDate
                      ? 'crosscircle'
                      : 'calendar_icon'
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setPickerMode('end');
            setIsDateTimePickerVisible(true);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1"></Text>
          <View>
            <View
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#CBD2D9',
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: normaliseDesigns(40),
              }}>
              <Text
                style={{color: selectedEndDate ? colors.blackColor : '#ABB4BD'}}
                size="body1">
                {selectedEndDate
                  ? moment(selectedEndDate).format('DD-MM-YYYY').toString()
                  : 'Select end date'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  selectedEndDate ? clearDate() : setPickerMode('end');
                }}
                style={{}}>
                <Icon
                  name={selectedEndDate ? 'crosscircle' : 'calendar_icon'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{marginVertical: 20}}>
          <Text fontVariant="bold" size="body1">
            Date Type
          </Text>
          <View style={styles.dateTypeOptions}>
            <TouchableOpacity onPress={() => handleDateTypeChange('Week')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'Week' && styles.selectedDateTypeOption,
                ]}>
                Last week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDateTypeChange('Month')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'Month' && styles.selectedDateTypeOption,
                ]}>
                This month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDateTypeChange('past_3_months')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'past_3_months' && styles.selectedDateTypeOption,
                ]}>
                Past 3 months
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDateTypeChange('Past_1_Year')}>
              <Text
                style={[
                  styles.dateTypeOption,
                  dateType === 'Past_1_Year' && styles.selectedDateTypeOption,
                ]}>
                Past 1 year
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginBottom: 0, marginTop: 50}}>
          <Button
            text="Apply"
            active={isApplyButtonActive}
            onPress={handlePressChartOne}
          />
        </View>
      </View>
    );
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <DrawerContent closeDrawer={() => setIsDrawerOpen(false)} />
      )}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        onPressBellIcon={() => navigation.navigate('Notifications')}
        onPressMenuIcon={() => setIsDrawerOpen(true)}
        focusedStack="AnalyticsStack"
        avoidBackButton
        dashboard>
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOneOpen(false);
          }}
          isVisible={filterOneOpen}
          title="Chart 1 filter"
          closeButton
          contentStyle={{width: '100%', height: '90%'}}
          content={<RenderAssignFormModalContentone onPressAssign={() => {}} />}
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOpenTwo(false);
          }}
          isVisible={filterOpenTwo}
          title="Chart 2 filter"
          closeButton
          contentStyle={{width: '100%'}}
          content={<RenderAssignFormModalContenttwo onPressAssign={() => {}} />}
        />
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          User and Role Analytics
        </Text>
        <View style={styles.tileContainer}>
          <AnalyticsCountTile
            text={'Total Roles'}
            color={'green'}
            count={userCountAnalytics?.dataList?.totalRoleCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text="Total Users"
            color="orange"
            count={userCountAnalytics?.dataList?.totalUserCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text="Total Groups"
            color="red"
            count={userCountAnalytics?.dataList?.totalUserGroupCount[0] || 0}
            onPress={() => {}}
          />
        </View>

        <View style={styles.chartContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={handleSortIconClickOne}
              style={styles.iconButton}>
              <Icon name="sorting_icon" color={colors.blackColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisibleOne(true);
              }}
              style={styles.iconButton}>
              <Icon name="three_dots" />
            </TouchableOpacity>
          </View>
          <ViewShot ref={viewShotRefs} options={{format: 'jpg', quality: 0.9}}>
            <LineChart
              value1={countOfUsers}
              value2={countOfRoles}
              value3={countOfUserGroups}
              labels={months || ['']}
              indicators={['Count of users', 'Count of roles', 'User groups']}
            />
          </ViewShot>
        </View>
        {isModalVisibleOne && (
          <View style={styles.modalContainer}>
            <ModalContentOne onClose={() => setIsModalVisibleOne(false)} />
          </View>
        )}

        <View style={styles.chartContainer}>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={handleSortIconClickTwo}
              style={styles.iconButton}>
              <Icon name="sorting_icon" color={colors.blackColor} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsModalVisibleTwo(true);
              }}
              style={styles.iconButton}>
              <Icon name="three_dots" />
            </TouchableOpacity>
          </View>
          <ViewShot ref={viewShotRefs} options={{format: 'jpg', quality: 0.9}}>
            {/* <LineChart value1={userCountAnalyticsUserAndRole?.dataList?.userCount[0]|| ['']} labels={months || ['']} /> */}
          </ViewShot>
        </View>

        {isModalVisibleTwo && (
          <View style={styles.modalContainerone}>
            <ModalContentTwo onClose={() => setIsModalVisibleTwo(false)} />
          </View>
        )}
      </Layout>
      {isZoomedOne && (
        <ZoomedChartViewOne onClose={() => setIsZoomedOne(false)} />
      )}

      {isZoomedTwo && (
        <ZoomedChartViewTwo onClose={() => setIsZoomedTwo(false)} />
      )}
    </Drawer>
  );
};

const styles = StyleSheet.create({
  tileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  chartContainer: {
    marginVertical: 10,
  },
  iconContainer: {
    position: 'absolute',
    top: 27,
    right: 5,
    flexDirection: 'row',
    zIndex: 1,
  },
  iconButton: {
    padding: 5,
    marginLeft: 10,
  },
  modalContainer: {
    position: 'absolute',
    top: 242,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainerone: {
    position: 'absolute',
    top: 590,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    width: '100%',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 1,
  },
  modalOptionText: {
    marginLeft: 10,
    fontSize: 14,
  },
  zoomedChartContainerone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  zoomedChartContainertwo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    backgroundColor: colors.borderColor,
    padding: 10,
    borderRadius: 5,
    zIndex: 11,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  dateTypeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  dateTypeOption: {
    borderWidth: 1,
    borderColor: '#E4E7EB',
    paddingHorizontal: 20,
    paddingVertical: 7,
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedDateTypeOption: {
    borderColor: 'red',
    backgroundColor: 'red',
  },
  dateTypeInput: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: normaliseDesigns(40),
    marginTop: 10,
  },
});

export default UserAndRoleAnalyticsMainPage;
