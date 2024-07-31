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
  Area,
  District,
  getAreas,
  getDistricts,
  getObservationAnalytics,
  getRubricWiseObservationAnalytics,
  getStates,
  getUserCountAnalytics,
  getTeacherObservationAnalytics,
  State,
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
import {getAllObservations} from '../../redux/features/observationSlice';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import RNFetchBlob from 'rn-fetch-blob';
import {showMessage} from 'react-native-flash-message';
import ViewShot from 'react-native-view-shot';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import LabeledDropdown from '../../components/LabeledDropdown';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import {ItemType} from '../../config/types';
import {items} from 'fusioncharts';

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
    teacherObservationAnalytics,
  } = useAppSelector(state => state.analytics);

  const {allObservations} = useAppSelector(state => state.observation);
  const {userData} = useAppSelector(state => state.auth);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalVisibleone, setIsModalVisibleone] = useState<boolean>(false);

  const [isZoomedone, setIsZoomedone] = useState<boolean>(false);
  const [activeChart, setActiveChart] = useState<string>('');
  const viewShotRefs = useRef<{[key: string]: ViewShot | null}>({});
  const [filterOneOpen, setFilterOneOpen] = useState(false);
  const [filterTwoOpen, setFilterTwoOpen] = useState(false);
  const [isModalVisibleTwo, setIsModalVisibleTwo] = useState<boolean>(false);
  const [isModalVisibleOne, setIsModalVisibleOne] = useState<boolean>(false);
  const [isZoomedOne, setIsZoomedOne] = useState<boolean>(false);
  const [isZoomedTwo, setIsZoomedTwo] = useState<boolean>(false);
  const [isZoomButtonClickedOne, setIsZoomButtonClickedOne] = useState(false);
  const [isDownloadButtonClickedOne, setIsDownloadButtonClickedOne] =
    useState(false);
  const [isShareButtonClickedOne, setIsShareButtonClickedOne] = useState(false);
  const [isSortIconClickOne, setIsSortIconClickOne] = useState(false);
  const [isSortIconClickTwo, setIsSortIconClickTwo] = useState(false);
  const [filterOpenTwo, setFilterOpenTwo] = useState(false);
  const [isZoomButtonClickedTwo, setIsZoomButtonClickedTwo] = useState(false);
  const [isDownloadButtonClickedTwo, setIsDownloadButtonClickedTwo] =
    useState(false);
  const [isShareButtonClickedTwo, setIsShareButtonClickedTwo] = useState(false);
  const [statesList, setStatesList] = useState<State[]>();
  const [districtList, setDistrictList] = useState<District[]>();
  const [areatList, setAreaList] = useState<Area[]>();
  const [filtersChartTwo, setFiltersChartTwo] = useState(false);


  useEffect(() => {
    dispatch(
      getAllObservations([
        userData.id,
        {
          filterType: 'All',
          paginationRequest: {
            page: 0,
            size: 4,
            type: 'all',
          },
        },
      ]),
    );
    dispatch(getUserCountAnalytics());
    dispatch(getTeacherObservationAnalytics());
    dispatch(
      getObservationAnalytics({
        userId: userData.id,
        stateId: null,
        districtId: null,
        schoolId: null,
        dateType: 'selected_date',
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      }),
    );

    console.log("getObservationAnalytics==",teacherObservationAnalytics)
    dispatch(
      getRubricWiseObservationAnalytics({
        dateType: null,
        // ||
        // 'Week' ||
        // 'Month' ||
        // 'past_3_months' ||
        // 'Past_1_Year',
        startDate: null,
        endDate: null,
      }),
    );
  }, []);

  console.log(
    'rubricWiseObservationAnalytics==',
    rubricWiseObservationAnalytics?.dataList?.indAverageRating
      .slice(1)
      .map(item => item[1]),
  );

  const formattedUserAndRoleCountAnalytics =
    observationCountAnalytics?.dataList?.observationAndAverageCount
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

  // const indicatorAverageRating: number[] =
  // rubricWiseObservationAnalytics?.dataList.indAverageRating.map((item)=>item)
  //  || [];
  //rubricWiseObservationAnalytics
  const indicatorAverageRating: number[] =
    rubricWiseObservationAnalytics?.dataList?.indAverageRating
      ?.slice(1)
      .map(item => item[1] as number) || [];

  const rubricMonths =
    rubricWiseObservationAnalytics?.dataList?.indAverageRating
      .slice(1)
      .map(item => item[0] as string) || [];
  const months =
    formattedUserAndRoleCountAnalytics?.map(item =>
      moment().month(item.month).format('MMM'),
    ) || getMonthsArray();

  console.log('indicators', indicators);

  //For Charat one
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
        value1={observations}
        value2={indicators}
        value3={averageScore}
        title="User Analytics"
        labels={monthObservations || ['']}
        indicators={['Observation', 'Indicators', 'Average Score']}
      />
    </View>
  );

  const handleSortIconClickOne = () => {
    setIsSortIconClickOne(true);
    setFilterOneOpen(true);
    setIsModalVisibleOne(false);
  };


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
    const [selectedUserDate, setSelectedUserDate] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    // const handlePressChartOne = () => {
    //   const filters = {
    //     ...filtersChartOne,
    //     userGroup: selectedUserGroup?.value || null,
    //     userStatus: selectedUserStatus?.value || null,
    //     stateId: selectedUserState?.value || null,
    //     districtId: selectedUserDistrict?.value || null,
    //     area: selectedUserArea?.value || null,
    //     date: selectedDate || null,
    //   };
    //   setFiltersChartOne(filters);
    //   dispatch(getUserAndRoleCountAnalytics(filters));
    //   setFilterOneOpen(false);
    // };

    const handlePressChartOne = () => {
      const filters = {
        // userGroup: selectedUserGroup?.value || null,
        // userStatus: selectedUserStatus?.value || null,
        // stateId: selectedUserState?.value || null,
        // districtId: selectedUserDistrict?.value || null,
        // area: selectedUserArea?.value || null,
        // date: selectedDate || null,
      };
      onPressAssign();
      //dispatch(getUserAndRoleCountAnalytics(filters));
      setFilterOneOpen(false);
    };
    //const handlePressChartTwo = () => {
    //   const filters = {
    //     ...filtersChartTwo,
    //     userGroup: selectedUserGroup?.value || null,
    //     userStatus: selectedUserStatus?.value || null,
    //     stateId: selectedUserState?.value || null,
    //     districtId: selectedUserDistrict?.value || null,
    //     area: selectedUserArea?.value || null,
    //     date: selectedDate || null,
    //   };
    //   setFiltersChartTwo(filters);
    //   dispatch(getUserAndRoleCountAnalytics(filters));
    //   setFilterOpenTwo(false);
    // };

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

    const handleDateSelection = (date: string) => {
      setIsCalendarOpen(!isCalendarOpen);
      setSelectedDate(date);
    };

    const clearDate = () => {
      setSelectedDate('');
    };

    const isApplyButtonActive =
      selectedUserGroup ||
      selectedUserStatus ||
      selectedUserState ||
      selectedUserDistrict ||
      selectedUserArea ||
      selectedDate;

    return (
      <View style={{paddingHorizontal: 10}}>
        <DateTimePickerComponent
          selectedDate={selectedDate}
          onDateChange={handleDateSelection}
          showPicker={isCalendarOpen}
        />
        <LabeledDropdown
          label="Select user"
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
            setIsCalendarOpen(!isCalendarOpen);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1">
            Select date
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
                style={{color: selectedDate ? colors.blackColor : '#ABB4BD'}}
                size="body1">
                {selectedDate
                  ? moment(selectedDate).format('DD-MM-YYYY').toString()
                  : 'Select date'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  selectedDate
                    ? clearDate()
                    : setIsCalendarOpen(!isCalendarOpen);
                }}
                style={{}}>
                <Icon name={selectedDate ? 'crosscircle' : 'calendar_icon'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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

  //for Chart two

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
      <LineChart
        value1={indicatorAverageRating}
        title="Rubric Analytics"
        labels={rubricMonths || ['']}
      />
    </View>
  );

  const handleSortIconClickTwo = () => {
    setIsSortIconClickTwo(true);
    setFilterOpenTwo(true);
    setIsModalVisibleTwo(false);
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
    const [selectedUserDate, setSelectedUserDate] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

    //const handlePressChartOne = () => {
    // const filters = {
    //  ...filtersChartOne,
    // userGroup: selectedUserGroup?.value || null,
    // userStatus: selectedUserStatus?.value || null,
    // stateId: selectedUserState?.value || null,
    //districtId: selectedUserDistrict?.value || null,
    // area: selectedUserArea?.value || null,
    //  date: selectedDate || null,
    // };
    // setFiltersChartOne(filters);
    // dispatch(getUserAndRoleCountAnalytics(filters));
    //  setFilterOneOpen(false);
    //};

    // const handlePressChartTwo = () => {
    //   const filters = {
    //     ...filtersChartTwo,
    //     userGroup: selectedUserGroup?.value || null,
    //     userStatus: selectedUserStatus?.value || null,
    //     stateId: selectedUserState?.value || null,
    //     districtId: selectedUserDistrict?.value || null,
    //     area: selectedUserArea?.value || null,
    //     date: selectedDate || null,
    //   };
    //   setFiltersChartTwo(filters);
    //   dispatch(getUserAndRoleCountAnalytics(filters));
    //   setFilterOpenTwo(false);
    // };

    const handlePressChartTwo = () => {
      const filters = {
        // userGroup: selectedUserGroup?.value || null,
        // userStatus: selectedUserStatus?.value || null,
        // stateId: selectedUserState?.value || null,
        // districtId: selectedUserDistrict?.value || null,
        // area: selectedUserArea?.value || null,
        // date: selectedDate || null,

        dateType: null,
        // ||
        // 'Week' ||
        // 'Month' ||
        // 'past_3_months' ||
        // 'Past_1_Year',
        startDate: null,
        endDate: null,
      };
      setFiltersChartTwo(filters);
      dispatch(getRubricWiseObservationAnalytics(filters));
      setFilterOpenTwo(false);
    };

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

    const handleDateSelection = (date: string) => {
      setIsCalendarOpen(!isCalendarOpen);
      setSelectedDate(date);
    };
    const clearDate = () => {
      setSelectedDate('');
    };
    const isApplyButtonActive = selectedUserStatus || selectedDate;

    return (
      <View style={{paddingHorizontal: 10}}>
        <DateTimePickerComponent
          selectedDate={selectedDate}
          onDateChange={handleDateSelection}
          showPicker={isCalendarOpen}
        />

        <LabeledDropdown
          label="User Status"
          placeHolder="Select"
          options={userStatusList}
          setSelectedItem={setSelectedUserStatus}
          defaultValue={selectedUserStatus?.value || ''}
        />

<TouchableOpacity
          onPress={() => {
            setIsCalendarOpen(!isCalendarOpen);
          }}
          style={{}}>
          <Text fontVariant="bold" size="body1">
            Select date
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
                style={{color: selectedDate ? colors.blackColor : '#ABB4BD'}}
                size="body1">
                {selectedDate
                  ? moment(selectedDate).format('DD-MM-YYYY').toString()
                  : 'Select date'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  selectedDate
                    ? clearDate()
                    : setIsCalendarOpen(!isCalendarOpen);
                }}
                style={{}}>
                <Icon name={selectedDate ? 'crosscircle' : 'calendar_icon'} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
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
            count={teacherObservationAnalytics?.dataList?.totalObservationCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Indicators'}
            color={'orange'}
            count={teacherObservationAnalytics?.dataList?.totalIndicatorCount[0] || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Average Score'}
            color={'red'}
            count={teacherObservationAnalytics?.dataList?.totalObservationAverage[0] || 0}
            onPress={() => {}}
          />
        </View>

        {observationAnalytics &&
          observationAnalytics?.dataList?.observationAndIndicatorCount?.length >
            0 && (
            <>
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
                <ViewShot
                  ref={viewShotRefs}
                  options={{format: 'jpg', quality: 0.9}}>
                  <LineChart
                    value1={observations}
                    value2={indicators}
                    value3={averageScore}
                    title="User Analytics"
                    labels={monthObservations || ['']}
                    indicators={['Observation', 'Indicators', 'Average Score']}
                  />
                </ViewShot>
              </View>
              {isModalVisibleOne && (
                <View style={styles.modalContainer}>
                  <ModalContentOne
                    onClose={() => setIsModalVisibleOne(false)}
                  />
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
                <ViewShot
                  ref={viewShotRefs}
                  options={{format: 'jpg', quality: 0.9}}>
                  <LineChart
                    value1={indicatorAverageRating}
                    title="Rubric Analytics"
                    labels={rubricMonths || ['']}
                  />
                </ViewShot>
              </View>
              {isModalVisibleTwo && (
                <View style={styles.modalContainerone}>
                  <ModalContentTwo
                    onClose={() => setIsModalVisibleTwo(false)}
                  />
                </View>
              )}
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
          <View style={{marginTop: 5, marginBottom: 15}}>
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
                      //disabled
                      onPress={() => {
                        navigation.navigate('ObservationAnalytics', {
                          observationId: item?.observationId,
                        });
                      }}
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

        {isZoomedOne && (
          <ZoomedChartViewOne onClose={() => setIsZoomedOne(false)} />
        )}

        {isZoomedTwo && (
          <ZoomedChartViewTwo onClose={() => setIsZoomedTwo(false)} />
        )}
      </Layout>
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
    top: 240,
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
  zoomedChartContainer: {
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
});
export default TeacherObservationAnalytics;
