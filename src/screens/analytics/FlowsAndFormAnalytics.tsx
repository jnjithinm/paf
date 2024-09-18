import React, { FC, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Platform,
  
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Drawer } from 'react-native-drawer-layout';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import DrawerContent from '../../components/DrawerContent';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsStack';
import {
  getFormCountAnalytics,
  getUserCountAnalytics,
} from '../../redux/features/analyticsSlice';
import Share from 'react-native-share';
import { AnalyticsCountTile } from './UserAndRoleAnalyticsMainPage';
import CurvedLineChart from '../../components/CurvedLineChart';
import { RenderTitleWithLink } from '../dashboard/TeacherDashboard';
import { RenderEmptyPlaceholder } from '../observation/ObservationReportsMainPage';
import { FlowsItem } from '../flowsAndForms/FlowsMainPage';
import moment from 'moment';
import { getAllFlows } from '../../redux/features/flowsSlice';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot from 'react-native-view-shot';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { FONT_VARIANT } from '../../config/themes';
import Modal from '../../components/Modal';
import Calendar from "../analytics/FlowsandFormFilterList";
import { FilterObject } from '../analytics/FlowsandFormFilterList';
import Button from '../../components/Button';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import LabeledDropdown from '../../components/LabeledDropdown';
import { ItemType } from '../../config/types';

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
  const [isclicked, setIsClicked] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [isSortIconClick, setIsSortIconClick] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<{ startDate: string; endDate: string } | undefined>(undefined);
  const [dateFilterOption, setDateFilterOption] = useState<DateFilterOption | undefined>(undefined);

  const viewShotRef = useRef(null); // Create a ref for ViewShot

  const [isZoomButtonClicked, setIsZoomButtonClicked] = useState(false);
  const [isDownloadButtonClicked, setIsDownloadButtonClicked] = useState(false);
  const [isShareButtonClicked, setIsShareButtonClicked] = useState(false);

  const dispatch = useAppDispatch();
  const { formCountAnalytics } = useAppSelector(state => state.analytics);
  const { userData } = useAppSelector(state => state.auth);
  const { allFlows } = useAppSelector(state => state.flows);

  console.log("allFlows==", allFlows?.dataList);

  useEffect(() => {
    let dateType = 'selected_date';
    let startDate = dateFilter?.startDate || '2024-04-19';
    let endDate = dateFilter?.endDate || '2024-06-19';

    if (dateFilterOption) {
      switch (dateFilterOption) {
        case 'Last week':
          dateType = 'Week';
          break;
        case 'This month':
          dateType = 'Month';
          break;
        case 'Past 3 months':
          dateType = 'past_3_months';
          break;
        case 'Past 1 year':
          dateType = 'Past_1_Year';
          break;
      }
    }

    dispatch(
      getFormCountAnalytics({
        dateType,
        startDate,
        endDate,
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
  }, [dateFilter, dateFilterOption]);

  const captureAndDownload = async (
    viewShotRef: React.RefObject<ViewShot>,
  ) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        const {config, fs} = RNFetchBlob;
        const downloadDir =
          // Platform.OS === 'android'
          //   ? RNFetchBlob.fs.dirs.PictureDir
          //   :
          RNFetchBlob.fs.dirs.DCIMDir;
        console.log('downffffloadDir', uri);
        const timestamp = new Date().getTime();
        const uniqueFileName = `${'chart_screenshot'}_${timestamp}.jpg`;

        //const fileName = 'chart_screenshot.jpg';
        const filePath = `${downloadDir}/${uniqueFileName}`;
        console.log('filePathvvvvv', filePath);

        const data = await RNFetchBlob.fs.readFile(uri, 'base64');
        // console.log('hggggggg', data);

        await RNFetchBlob.fs
          .writeFile(filePath, data, 'base64')
          .then(result => {
            console.log('File has been saved to:' + result);
            Alert.alert('File Downloaded successfully');
            setIsModalVisible(false)

            showMessage({
              message: 'Success',
              description: 'File Downloaded successfully',
              type: 'success',
            });
          })
          .catch(error => console.log(error));
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

  const shareImage = async (viewShotRef: React.RefObject<ViewShot>) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
      console.log('Captured URI:', uri);

      // The `uri` is already a Base64-encoded image string
      const shareOptions = {
        title: 'Share Chart Image',
        message: 'Chart Image One',
        url: uri, // The Base64 string will be shared directly
        failOnCancel: false,
      };

      // Share the image
      Share.open(shareOptions)
        .then(res => console.log("Share response:", res))
        .catch(err => console.log('Error sharing:', err));

        setIsModalVisible(false);
      } else {
        console.error('ViewShot ref is not available');
      }
    } catch (error) {
      console.error('Failed to capture or share:', error);
    }
  };

  const ModalContent: FC<{ onClose: () => void }> = ({ onClose }) => {
    const handleZoomClick = () => {
      setIsZoomButtonClicked(true);
      setIsDownloadButtonClicked(false);
      setIsShareButtonClicked(false);
      setIsZoomed(true);
      onClose();
    };

    const handleDownloadClick = () => {
      setIsZoomButtonClicked(false);
      setIsDownloadButtonClicked(true);
      setIsShareButtonClicked(false);
      captureAndDownload(viewShotRef);
    };

    const handleShareClick = () => {
      setIsZoomButtonClicked(false);
      setIsDownloadButtonClicked(false);
      setIsShareButtonClicked(true);
      shareImage(viewShotRef);
    };

    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isZoomButtonClicked && { backgroundColor: '#FDF0E3' },
          ]}
          onPress={handleZoomClick}
        >
          <Icon name='zoomout_icon' color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isDownloadButtonClicked && { backgroundColor: '#FDF0E3' },
          ]}
          onPress={handleDownloadClick}
        >
          <Icon name='downloads_icon' color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isShareButtonClicked && { backgroundColor: '#FDF0E3' },
          ]}
          onPress={handleShareClick}
        >
          <Icon name='share_icon' color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ZoomedChartView = ({ onClose }) => (
    <View style={styles.zoomedChartContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name='cross_icon' />
      </TouchableOpacity>
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
        style={{ paddingTop: 40, width: '100%', height: '100%' }}
      />
    </View>
  );

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
    const [selectedDateType, setSelectedDateType] = useState<string>('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState<string>('');

  const filteredFlows = allFlows?.dataList?.filter(item =>
    item?.flowName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleSortIconClick = () => {
    setIsSortIconClick(true);
    setFilterOpen(true);
  };
  const handleProceed = (filterObject: FilterObject) => {
    setDateFilter(filterObject.date);
    setDateFilterOption(filterObject.dateFilterOption);
  };


  type RenderFilterModalContentTypesone = {
    onPressAssign: () => void;
  };

  // const RenderAssignFormModalContentone: FC<
  //   RenderFilterModalContentTypesone
  // > = ({onPressAssign}) => {
  //   const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  //   const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  //   const [userSearch, setUserSearch] = useState<string>('');
  //   const [groupSearch, setGroupSearch] = useState<string[]>([]);
  //   const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
  //     useState<boolean>(false);
  //   const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
  //   const [selectedDate, setSelectedDate] = useState<Date | undefined>(
  //     undefined,
  //   );

  //   const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  //   const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  //   const [dateType, setDateType] = useState<string>('');
  //   const [selectedDateType, setSelectedDateType] = useState<string>('');
  //   const [id, setId] = useState<number | undefined>(undefined);
  //   const dateFilterOptions = [
  //     'Last week',
  //     'This month',
  //     'Past 3 months',
  //     'Past 1 year',
  //   ] as const;

  //   // const indicatorsList =
  //   //   indicatorList?.dataList?.map(item => ({
  //   //     value: item.indicatorId,
  //   //     label: item.indicatorName,
  //   //   })) || [];

  //   const handlePressChartOne = () => {
  //     const filters = {
  //      // userStatusType: selectedUserStatus?.value || 'all',
  //       dateType: dateType || 'selected_date"',
  //       startDate: '12-3-24' || null,
  //       endDate: '12-3-24'  || null,
  //     };
  //     onPressAssign();
  //     dispatch(getFormCountAnalytics(filters));
  //     setFilterOpen(false);
  //   };

  //   console.log("start,end",selectedStartDate,selectedEndDate);
    
  //   const handleDateChange = (startDate: string, endDate: string) => {
  //     console.log('startDate', startDate, endDate);
  //     setSelectedStartDate(startDate);
  //     setSelectedEndDate(endDate);
  //     setSelectedDateRange(`${startDate} - ${endDate}`);
  //   };
  //   const handleConfirm = (date: Date) => {
  //     if (pickerMode === 'start') {
  //       setSelectedStartDate(moment(date).format('YYYY-MM-DD'));
  //     } else {
  //       setSelectedEndDate(moment(date).format('YYYY-MM-DD'));
  //     }
  //     setIsDateTimePickerVisible(false);
  //     setDateType('selected_date');
  //   };

  //   const handleDateTypeChange = (type: string) => {
  //     setSelectedStartDate('');
  //     setSelectedEndDate('');
  //     setSelectedDateType(type);
  //     switch (type) {
  //       case 'Last week':
  //         setDateType('Week');
  //         break;
  //       case 'This month':
  //         setDateType('Month');
  //         break;
  //       case 'Past 3 months':
  //         setDateType('past_3_months');
  //         break;
  //       case 'Past 1 year':
  //         setDateType('Past_1_Year');
  //         break;
  //       default:
  //         setDateType('');
  //     }
  //   };

  //   const clearDate = () => {
  //     setSelectedStartDate('');
  //     setSelectedEndDate('');
  //     setDateType('');
  //     setSelectedDateType('');
  //   };

  //   const isApplyButtonActive =
  //   (selectedStartDate && selectedEndDate) || dateType;

  //   return (
  //     <View style={{paddingHorizontal: 10}}>
  //       {/* <DateTimePickerComponent
  //         selectedDate={selectedDate || new Date()}
  //         onDateChange={handleConfirm}
  //         showPicker={isDateTimePickerVisible}
  //       /> */}
  //       {/* <LabeledDropdown
  //         label="Indicator"
  //         placeHolder="Select"
  //         options={indicatorsList}
  //         setSelectedItem={item => {
  //           setSelectedIndicator(item);
  //           setId(item.value); // Set the ID here
  //         }}
  //         defaultValue={selectedIndicator?.value || ''}
  //       /> */}
  //       <View style={{marginVertical: 10}}>
  //         <Text size="body1" fontVariant="bold" style={{marginBottom: 10}}>
  //           By date
  //         </Text>
  //         <View
  //           style={{
  //             flexDirection: 'row',
  //             flexWrap: 'wrap',
  //             justifyContent: 'space-evenly',
  //             width: '85%',
  //             alignContent: 'flex-start',
  //           }}>
  //           {dateFilterOptions.map((item, index) => (
  //             <TouchableOpacity
  //               key={index}
  //               style={{
  //                 borderColor:
  //                   selectedDateType === item ? '#F4C24A' : '#E4E7EB',
  //                 borderWidth: 1,
  //                 backgroundColor:
  //                   selectedDateType === item ? '#FCEBC5' : undefined,
  //                 paddingHorizontal: 20,
  //                 paddingVertical: 7,
  //                 borderRadius: 8,
  //                 marginBottom: 10,
  //                 alignContent: 'flex-start',
  //               }}
  //               onPress={() => {
  //                 handleDateTypeChange(item);
  //               }}>
  //               <Text size="small3">{item}</Text>
  //             </TouchableOpacity>
  //           ))}
  //         </View>
  //       </View>

  //       <TouchableOpacity
  //         onPress={() => {
  //           setIsCalendarVisible(true);
  //         }}
  //         style={{}}>
  //         <Text fontVariant="bold" size="body1">
  //           Date
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
  //             <Text onPress={() => setIsCalendarVisible(true)}>
  //               {selectedDateRange || 'Select'}
  //             </Text>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 setSelectedDateRange('');
  //                 setSelectedStartDate('');
  //                 setSelectedEndDate('');
  //                 setIsCalendarVisible(false);
  //               }}
  //               style={{}}>
  //               <Icon
  //                 name={selectedDateRange ? 'crosscircle' : 'calendar_icon'}
  //               />
  //             </TouchableOpacity>
  //           </View>
  //           {isCalendarVisible && (
  //             <View style={styles.calendarContainer}>
  //               <Calendar onDateChange={handleDateChange} />
  //             </View>
  //           )}
  //         </View>
  //       </TouchableOpacity>

  //       <View style={{marginBottom: 0, marginTop: 50}}>
  //         <Button
  //           text="Apply"
  //           active={isApplyButtonActive}
  //           onPress={handlePressChartOne}
  //         />
  //       </View>
  //     </View>
  //   );
  // };
  const RenderAssignFormModalContentone: FC<
  RenderFilterModalContentTypesone
> = ({onPressAssign}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');
  const [groupSearch, setGroupSearch] = useState<string[]>([]);
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
  const [selectedDateType, setSelectedDateType] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const dateFilterOptions = [
    'Last week',
    'This month',
    'Past 3 months',
    'Past 1 year',
  ] as const;

  // const stateOptions = statesList?.map(state => ({
  //   value: state.stateId,
  //   label: state.stateName,
  // }));

  // const districtOptions = selectedUserState
  //   ? districtList
  //       .filter(item => item.stateId === selectedUserState.value)
  //       .map(district => ({
  //         value: district.districtId,
  //         label: district.districtName,
  //       }))
  //   : [];

  // const areaOptions = selectedUserDistrict
  //   ? areatList
  //       .filter(item => item.districtId === selectedUserDistrict.value)
  //       .map(area => ({
  //         value: area.area,
  //         label: area.area,
  //       }))
  //   : [];

  let userGroupsList: ItemType[] = [
    {value: 'allUsers', label: 'All Users'},
    {value: 'activeUsers', label: 'Active Users'},
    {value: 'inactiveUsers', label: 'Inactive Users'},
  ];

  let userStatusList: ItemType[] = [
    {value: 'all', label: 'All Users'},
    {value: 'true', label: 'Active Users'},
    {value: 'false', label: 'Inactive Users'},
  ];

  const handlePressChartOne = () => {
    const filters = {
      
      dateType: dateType || null,
      startDate: selectedStartDate || null,
      endDate: selectedEndDate || null,
    };
    onPressAssign();
    dispatch(getFormCountAnalytics(filters));
    setFilterOpen(false);
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
    setSelectedStartDate('');
    setSelectedEndDate('');
    setSelectedDateType(type);
    switch (type) {
      case 'Last week':
        setDateType('Week');
        break;
      case 'This month':
        setDateType('Month');
        break;
      case 'Past 3 months':
        setDateType('past_3_months');
        break;
      case 'Past 1 year':
        setDateType('Past_1_Year');
        break;
      default:
        setDateType('');
    }
  };

  const clearDate = () => {
    setSelectedStartDate('');
    setSelectedEndDate('');
    setDateType('');
    setSelectedDateType('');
  };

  const isApplyButtonActive =
    selectedUserStatus || (selectedStartDate && selectedEndDate) || dateType;

  // const handleDateChange = (startDate: string, endDate: string) => {
  //   setSelectedDateRange(`${startDate} - ${endDate}`);
  // };

  const handleDateChange = (startDate: string, endDate: string) => {
    console.log('startDate', startDate, endDate);
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
    setSelectedDateRange(`${startDate} - ${endDate}`);
    setDateType('selected_date');
  };
  return (
    <View style={{paddingHorizontal: 10}}>
      {/* <DateTimePickerComponent
        selectedDate={selectedDate || new Date()}
        onDateChange={handleConfirm}
        showPicker={isDateTimePickerVisible}
      /> */}
      {/* <LabeledDropdown
        label="User Status"
        placeHolder="Select"
        options={userStatusList}
        setSelectedItem={setSelectedUserStatus}
        defaultValue={selectedUserStatus?.value || ''}
        searchable
      /> */}
      <View style={{marginVertical: 10}}>
        <Text size="body1" fontVariant="bold" style={{marginBottom: 10}}>
          By date
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
            width: '85%',
            alignContent: 'flex-start',
          }}>
          {dateFilterOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                borderColor:
                  selectedDateType === item ? '#F4C24A' : '#E4E7EB',
                borderWidth: 1,
                backgroundColor:
                  selectedDateType === item ? '#FCEBC5' : undefined,
                paddingHorizontal: 20,
                paddingVertical: 7,
                borderRadius: 8,
                marginBottom: 10,
                alignContent: 'flex-start',
              }}
              onPress={() => {
                handleDateTypeChange(item);
              }}>
              <Text size="small3">{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {/* 
      <TouchableOpacity
        onPress={() => {
          setPickerMode('start');
          setIsDateTimePickerVisible(true);
        }}
        style={{}}>
        <Text fontVariant="bold" size="body1">
          Select Start Date
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
      </TouchableOpacity> */}

<TouchableOpacity
        onPress={() => {
          setIsCalendarVisible(true);
        }}
        style={{}}>
        <Text fontVariant="bold" size="body1">
          Date
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
            <Text onPress={() => setIsCalendarVisible(true)}>
              {selectedDateRange || 'Select'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedDateRange('');
                setSelectedStartDate('');
                setSelectedEndDate('');
                setIsCalendarVisible(false);
              }}
              style={{}}>
              <Icon
                name={selectedDateRange ? 'crosscircle' : 'calendar_icon'}
              />
            </TouchableOpacity>
          </View>
          {isCalendarVisible && (
            <View style={styles.calendarContainer}>
              <Calendar onDateChange={handleDateChange} />
            </View>
          )}
        </View>
      </TouchableOpacity>

      <View style={{marginBottom: 0, marginTop: 50}}>
        <Button
          text="Apply"
          active={isApplyButtonActive}
          //{isApplyButtonActive}
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
        {/* <Calendar
          onProceed={handleProceed}
          onClose={() => setFilterOpen(false)}
          isVisible={filterOpen}
        /> */}
         <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOpen(false);
          }}
          isVisible={filterOpen}
          title="Chart 1 filter"
          closeButton
          contentStyle={{width: '100%', height: '90%'}}
          content={<RenderAssignFormModalContentone onPressAssign={() => {}} />}
        />
        <Text
          size="body4"
          fontVariant="bold"
          style={{ marginBottom: 10, marginTop: 30 }}
        >
          Flows and Form Analytics
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}
        >
          <AnalyticsCountTile
            text={'Total Forms Created'}
            color={'green'}
            count={formCountAnalytics?.dataList?.totalFormCount[0] || 0}
            onPress={() => { }}
          />
          <AnalyticsCountTile
            text={'Responses Collected'}
            color={'orange'}
            count={formCountAnalytics?.dataList?.totalResponseCount[0] || 0}
            onPress={() => { }}
          />
          <AnalyticsCountTile
            text={'Avg Response Time'}
            color={'red'}
            count={
              Number(
                formCountAnalytics?.dataList?.totalResponseAverageTime[0]?.toFixed(
                  1,
                ),
              ) || 0
            }
            onPress={() => { }}
          />
        </View>

        {formCountAnalytics &&
          formCountAnalytics?.dataList?.formAnalytics?.length !== 0 && (
            <View style={{ position: 'relative' }}>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={handleSortIconClick}
                  style={styles.iconButton}
                >
                  <Icon name='sorting_icon' color={colors.blackColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalVisible(!isModalVisible);
                    //setIsDotsClick(true);
                  }}
                  style={styles.iconButton}
                >
                  <Icon name='three_dots' />
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10 }}>
                <ViewShot
                  ref={viewShotRef}
                  options={{ format: 'jpg', quality: 0.9 }}
                >
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
                    style={{ paddingTop: 40 }}
                  />
                </ViewShot>
                {isModalVisible && (
                  <View style={styles.modalContainer}>
                    <ModalContent onClose={() => setIsModalVisible(false)} />
                  </View>
                )}
              </View>
            </View>
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
                    navigation.navigate('FormsListAnalytics', { flowItem: ele });
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
      {isZoomed && <ZoomedChartView onClose={() => setIsZoomed(false)} />}
    </Drawer>
  );
};

const styles = StyleSheet.create({
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
    top: 50,
    right: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContent: {
    width: "100%",
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
    top: 50,
    left: 0,
    right: 0,
    bottom: 50,
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
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 10,
    paddingVertical: 5,
    top: 5,
  },
});

export default FlowsAndFormAnalytics;
