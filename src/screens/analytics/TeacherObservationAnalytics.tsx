// import React, {FC, useEffect, useRef, useState} from 'react';
// import {
//   Alert,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {RouteProp} from '@react-navigation/native';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {Drawer} from 'react-native-drawer-layout';

// import Layout from '../../components/Layout';
// import Text from '../../components/Text';
// import DrawerContent from '../../components/DrawerContent';
// import {useAppDispatch, useAppSelector} from '../../redux/store';
// import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
// import Share from 'react-native-share';
// import {
//   Area,
//   District,
//   getAreas,
//   getDistricts,
//   getObservationAnalytics,
//   getRubricWiseObservationAnalytics,
//   getStates,
//   getUserCountAnalytics,
//   getTeacherObservationAnalytics,
//   State,
//   getIndicators,
//   getSchools,
//   SchoolType,
//   getUserSearchAnalytics,
//   getAllObservations,
// } from '../../redux/features/analyticsSlice';
// import {
//   AnalyticsCountTile,
//   getMonthsArray,
// } from './UserAndRoleAnalyticsMainPage';
// import LineChart from '../../components/CurvedLineChart';
// import moment from 'moment';
// import {
//   ObservationsTile,
//   RenderTitleWithLink,
// } from '../dashboard/TeacherDashboard';
// import LabeledDropdown from '../../components/LabeledDropdownAnalytics';
// import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
// //import {getAllObservations} from '../../redux/features/observationSlice';
// import Icon from '../../components/Icon';
// import colors from '../../config/colors';
// import RNFetchBlob from 'rn-fetch-blob';
// import {showMessage} from 'react-native-flash-message';
// import ViewShot from 'react-native-view-shot';
// import Modal from '../../components/Modal';
// import Button from '../../components/Button';
// import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
// //import LabeledDropdown from '../../components/LabeledDropdown';
// import DateTimePickerComponent from '../../components/DateTimePickerComponent';
// import {ItemType} from '../../config/types';
// import {items} from 'fusioncharts';
// import {number} from 'yup';
// import Calendar from './FlowsandFormFilterList';

// type TeacherObservationAnalyticsNavigationProp = StackNavigationProp<
//   AnalyticsStackParamList,
//   'TeacherObservationAnalytics'
// >;
// type TeacherObservationAnalyticsRouteProp = RouteProp<
//   AnalyticsStackParamList,
//   'TeacherObservationAnalytics'
// >;

// interface TeacherObservationAnalyticsScreenProps {
//   navigation: TeacherObservationAnalyticsNavigationProp;
//   route: TeacherObservationAnalyticsRouteProp;
// }

// export type TeacherObservatioAnalyticsCountLabelTypes =
//   | 'Total Observations'
//   | 'Total Indicators'
//   | 'Average Score';

// const TeacherObservationAnalytics: FC<
//   TeacherObservationAnalyticsScreenProps
// > = ({navigation, route}) => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
//   const closeDrawer = () => {
//     setIsDrawerOpen(false);
//   };

//   const dispatch = useAppDispatch();
//   const {
//     observationAnalytics,
//     observationCountAnalytics,
//     rubricWiseObservationAnalytics,
//     teacherObservationAnalytics,
//     indicatorList,
//     states,
//     districts,
//     areas,
//     schools,
//     userSearchAnalytics,
//     allObservations,
//   } = useAppSelector(state => state.analytics);

//   //const {allObservations} = useAppSelector(state => state.observation);
//   const {userData} = useAppSelector(state => state.auth);

//   const [isZoomedone, setIsZoomedone] = useState<boolean>(false);
//   const [activeChart, setActiveChart] = useState<string>('');
//   const viewShotRefs = useRef<{[key: string]: ViewShot | null}>({});
//   const [filterOneOpen, setFilterOneOpen] = useState(false);
//   const [filterTwoOpen, setFilterTwoOpen] = useState(false);
//   const [isZoomedOne, setIsZoomedOne] = useState<boolean>(false);
//   const [isZoomedTwo, setIsZoomedTwo] = useState<boolean>(false);
//   const [isZoomButtonClickedOne, setIsZoomButtonClickedOne] = useState(false);
//   const [isDownloadButtonClickedOne, setIsDownloadButtonClickedOne] =
//     useState(false);
//   const [isShareButtonClickedOne, setIsShareButtonClickedOne] = useState(false);
//   const [isSortIconClickOne, setIsSortIconClickOne] = useState(false);
//   const [isSortIconClickTwo, setIsSortIconClickTwo] = useState(false);
//   const [filterOpenTwo, setFilterOpenTwo] = useState(false);
//   const [isZoomButtonClickedTwo, setIsZoomButtonClickedTwo] = useState(false);
//   const [isDownloadButtonClickedTwo, setIsDownloadButtonClickedTwo] =
//     useState(false);
//   const [isShareButtonClickedTwo, setIsShareButtonClickedTwo] = useState(false);

//   const [filtersChartTwo, setFiltersChartTwo] = useState(false);
//   const [indicatorId, setIndicatorId] = useState<string>('');
//   const [statesList, setStatesList] = useState<State[]>();
//   const [districtList, setDistrictList] = useState<District[]>();
//   const [areatList, setAreaList] = useState<Area[]>();
//   const [schoolList, setSchoolList] = useState<SchoolType[]>();
//   //const [userAnalyticsList, setUserAnalyticsList] = useState<UserList[]>();
//   const [isModalVisibleTwo, setIsModalVisibleTwo] = useState<boolean>(false);
//   const [isModalVisibleOne, setIsModalVisibleOne] = useState<boolean>(false);

//   useEffect(() => {
//     dispatch(getIndicators(indicatorId));
//   }, []);
//   useEffect(() => {
//     dispatch(
//       getAllObservations([
//         userData.id,
//         {
//           filterType: 'All',
//           paginationRequest: {
//             page: 0,
//             size: 0,
//             type: 'all',
//           },
//         },
//       ]),
//     );

//     dispatch(getUserCountAnalytics());
//     dispatch(getUserSearchAnalytics());

//     dispatch(getTeacherObservationAnalytics());
//     dispatch(
//       getObservationAnalytics({
//         userId: null,
//         stateId: null,
//         districtId: null,
//         schoolId: null,
//         dateType: null,
//         startDate: null,
//         endDate: null,
//       }),
//     );

//     dispatch(
//       getRubricWiseObservationAnalytics({
//         indicatorId: null,
//         dateType: 'Week',
//         startDate: null,
//         endDate: null,
//       }),
//     );
//   }, []);

//   useEffect(() => {
//     if (states) {
//       setStatesList(states?.dataList);
//     }
//   }, [states]);

//   useEffect(() => {
//     dispatch(
//       getStates({
//         page: 0,
//         size: 0,
//         type: 'true',
//       }),
//     );
//   }, []);

//   useEffect(() => {
//     if (districts) {
//       setDistrictList(districts.dataList);
//     }
//   }, [districts]);

//   useEffect(() => {
//     dispatch(
//       getDistricts({
//         page: 0,
//         size: 0,
//         type: 'true',
//       }),
//     );
//   }, []);

//   console.log('indicatorList---------', indicatorList);
//   useEffect(() => {
//     if (areas) {
//       setAreaList(areas.dataList);
//     }
//   }, [areas]);

//   useEffect(() => {
//     dispatch(
//       getAreas({
//         page: 0,
//         size: 0,
//         type: 'true',
//       }),
//     );
//   }, []);

//   useEffect(() => {
//     if (schools) {
//       setSchoolList(schools.dataList);
//     }
//   }, [schools]);

//   useEffect(() => {
//     dispatch(
//       getSchools({
//         page: 0,
//         size: 0,
//         type: true,
//         search: '',
//       }),
//     );
//   }, []);

//   console.log(
//     'observationAnalytics===111*****',
//     observationAnalytics?.dataList,
//   );
//   const formattedUserAndRoleCountAnalytics =
//     observationCountAnalytics?.dataList?.observationAndAverageCount
//       .slice(1)
//       .map(row => ({
//         month: row[0],
//         indicatorAverageRating: row[1],
//       }));

//   const formattedObservationsAnalytics =
//     observationAnalytics?.dataList?.observationAndIndicatorCount
//       ?.slice(1)
//       .map((row: any[]) => ({
//         month: row[0],
//         observations: row[1],
//         indicators: row[2],
//         averageScore: row[3],
//       }));

//   const monthObservations: string[] =
//     formattedObservationsAnalytics?.map((item: {month: any}) => item.month) ||
//     [];
//   const observations: number[] =
//     formattedObservationsAnalytics?.map(
//       (item: {observations: any}) => item.observations,
//     ) || [];

//   const indicators: number[] =
//     formattedObservationsAnalytics?.map(
//       (item: {indicators: any}) => item.indicators,
//     ) || [];
//   const averageScore: number[] =
//     formattedObservationsAnalytics?.map(
//       (item: {averageScore: any}) => item.averageScore,
//     ) || [];

//   const indicatorAverageRating: number[] =
//     rubricWiseObservationAnalytics?.dataList?.indAverageRating
//       ?.slice(1)
//       .map(item => item[1] as number) || [];

//   const rubricMonths =
//     rubricWiseObservationAnalytics?.dataList?.indAverageRating
//       .slice(1)
//       .map(item => item[0] as string) || [];
//   const months =
//     formattedUserAndRoleCountAnalytics?.map(item =>
//       moment().month(item.month).format('MMM'),
//     ) || getMonthsArray();

//   //For Charat one
//   const captureAndDownloadOne = async (
//     viewShotRef: React.RefObject<ViewShot>,
//   ) => {
//     try {
//       if (viewShotRef.current) {
//         const uri = await viewShotRef.current.capture();
//         const {config, fs} = RNFetchBlob;
//         const downloadDir =
//           // Platform.OS === 'android'
//           //   ? RNFetchBlob.fs.dirs.PictureDir
//           //   :
//           RNFetchBlob.fs.dirs.DCIMDir;
//         console.log('downffffloadDir', uri);
//         const timestamp = new Date().getTime();
//         const uniqueFileName = `${'chart_screenshot'}_${timestamp}.jpg`;

//         //const fileName = 'chart_screenshot.jpg';
//         const filePath = `${downloadDir}/${uniqueFileName}`;
//         console.log('filePathvvvvv', filePath);

//         const data = await RNFetchBlob.fs.readFile(uri, 'base64');
//         // console.log('hggggggg', data);

//         await RNFetchBlob.fs
//           .writeFile(filePath, data, 'base64')
//           .then(result => {
//             console.log('File has been saved to:' + result);
//             Alert.alert('File Downloaded successfully');

//             showMessage({
//               message: 'Success',
//               description: 'File Downloaded successfully',
//               type: 'success',
//             });
//           })
//           .catch(error => console.log(error));
//       } else {
//         console.error('ViewShot ref is not available');
//       }
//     } catch (error) {
//       console.error('Failed to capture or download:', error);
//       showMessage({
//         message: 'failure',
//         description: 'Failed to Download image',
//         type: 'warning',
//       });
//     }
//   };

//   const shareImageOne = async (viewShotRef: React.RefObject<ViewShot>) => {
//     try {
//       if (viewShotRef.current) {
//         const uri = await viewShotRef.current.capture();
//         console.log('Captured URI:', uri);

//         // The `uri` is already a Base64-encoded image string
//         const shareOptions = {
//           title: 'Share Chart Image',
//           message: 'Chart Image One',
//           url: uri, // The Base64 string will be shared directly
//           failOnCancel: false,
//         };

//         // Share the image
//         Share.open(shareOptions)
//           .then(res => console.log('Share response:', res))
//           .catch(err => console.log('Error sharing:', err));

//         setIsModalVisibleTwo(false);
//       } else {
//         console.error('ViewShot ref is not available');
//       }
//     } catch (error) {
//       console.error('Failed to capture or share:', error);
//     }
//   };

//   const ModalContentOne: FC<{onClose: () => void}> = ({onClose}) => {
//     const handleZoomClickOne = () => {
//       setIsZoomButtonClickedOne(true);
//       setIsDownloadButtonClickedOne(false);
//       setIsShareButtonClickedOne(false);
//       setIsZoomedOne(true);
//       onClose();
//     };

//     const handleDownloadClickOne = () => {
//       setIsZoomButtonClickedOne(false);
//       setIsDownloadButtonClickedOne(true);
//       setIsShareButtonClickedOne(false);
//       captureAndDownloadOne(viewShotRefs);
//     };

//     const handleShareClickOne = () => {
//       setIsZoomButtonClickedOne(false);
//       setIsDownloadButtonClickedOne(false);
//       setIsShareButtonClickedOne(true);
//       shareImageOne(viewShotRefs);
//     };

//     return (
//       <View style={styles.modalContent}>
//         <TouchableOpacity
//           style={[
//             styles.modalOption,
//             isZoomButtonClickedOne && {backgroundColor: '#FDF0E3'},
//           ]}
//           onPress={handleZoomClickOne}>
//           <Icon name="zoomout_icon" color={colors.darkGrey} />
//           <Text style={styles.modalOptionText}>Zoom In</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.modalOption,
//             isDownloadButtonClickedOne && {backgroundColor: '#FDF0E3'},
//           ]}
//           onPress={handleDownloadClickOne}>
//           <Icon name="downloads_icon" color={colors.darkGrey} />
//           <Text style={styles.modalOptionText}>Download</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.modalOption,
//             isShareButtonClickedOne && {backgroundColor: '#FDF0E3'},
//           ]}
//           onPress={handleShareClickOne}>
//           <Icon name="share_icon" color={colors.darkGrey} />
//           <Text style={styles.modalOptionText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const ZoomedChartViewOne = ({onClose}) => (
//     <View style={styles.zoomedChartContainerone}>
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <Icon name="cross_icon" />
//       </TouchableOpacity>
//       <LineChart
//         value1={indicatorAverageRating}
//         title="Rubric Analytics"
//         labels={rubricMonths || ['']}
//       />
//     </View>
//   );

//   const handleSortIconClickOne = () => {
//     setIsSortIconClickOne(true);
//     setFilterOneOpen(true);
//     setIsModalVisibleOne(false);
//   };

//   type RenderFilterModalContentTypesone = {
//     onPressAssign: () => void;
//   };

//   const RenderAssignFormModalContentone: FC<
//     RenderFilterModalContentTypesone
//   > = ({onPressAssign}) => {
//     const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
//     const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
//     const [userSearch, setUserSearch] = useState<string>('');
//     const [groupSearch, setGroupSearch] = useState<string[]>([]);
//     const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
//       useState<boolean>(false);
//     const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
//     const [selectedDate, setSelectedDate] = useState<Date | undefined>(
//       undefined,
//     );

//     const {formAssignedUserAndUserGroups} = useAppSelector(
//       state => state.forms,
//     );
//     const [selectedIndicator, setSelectedIndicator] = useState<
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
//     const [selectedStartDate, setSelectedStartDate] = useState<string>('');
//     const [selectedEndDate, setSelectedEndDate] = useState<string>('');
//     const [dateType, setDateType] = useState<string>('');
//     const [selectedDateType, setSelectedDateType] = useState<string>('');
//     const [id, setId] = useState<number | undefined>(undefined);
//     const [isCalendarVisible, setIsCalendarVisible] = useState(false);
//     const [selectedDateRange, setSelectedDateRange] = useState<string>('');
//     const dateFilterOptions = [
//       'Last week',
//       'This month',
//       'Past 3 months',
//       'Past 1 year',
//     ] as const;

//     const indicatorsList =
//       indicatorList?.dataList?.map(item => ({
//         value: item.indicatorId,
//         label: item.indicatorName,
//       })) || [];

//     const handlePressChartOne = () => {
//       const filters = {
//         // userStatusType: selectedUserStatus?.value || 'all',
//         dateType: dateType || 'null',
//         startDate: selectedStartDate || null,
//         endDate: selectedEndDate || null,
//         indicatorId: id || 0,
//       };
//       onPressAssign();
//       dispatch(getRubricWiseObservationAnalytics(filters));
//       setFilterOneOpen(false);
//     };

//     const handleDateChange = (startDate: string, endDate: string) => {
//       console.log('startDate', startDate, endDate);
//       setSelectedStartDate(startDate);
//       setSelectedEndDate(endDate);
//       setSelectedDateRange(`${startDate} - ${endDate}`);
//     };
//     const handleConfirm = (date: Date) => {
//       if (pickerMode === 'start') {
//         setSelectedStartDate(moment(date).format('YYYY-MM-DD'));
//       } else {
//         setSelectedEndDate(moment(date).format('YYYY-MM-DD'));
//       }
//       setIsDateTimePickerVisible(false);
//       setDateType('selected_date');
//     };

//     const handleDateTypeChange = (type: string) => {
//       setSelectedStartDate('');
//       setSelectedEndDate('');
//       setSelectedDateType(type);
//       switch (type) {
//         case 'Last week':
//           setDateType('Week');
//           break;
//         case 'This month':
//           setDateType('Month');
//           break;
//         case 'Past 3 months':
//           setDateType('past_3_months');
//           break;
//         case 'Past 1 year':
//           setDateType('Past_1_Year');
//           break;
//         default:
//           setDateType('');
//       }
//     };

//     const clearDate = () => {
//       setSelectedStartDate('');
//       setSelectedEndDate('');
//       setDateType('');
//       setSelectedDateType('');
//     };

//     const isApplyButtonActive =
//       (selectedIndicator && selectedStartDate && selectedEndDate) || dateType;

//     return (
//       <View style={{paddingHorizontal: 10}}>
//         {/* <DateTimePickerComponent
//           selectedDate={selectedDate || new Date()}
//           onDateChange={handleConfirm}
//           showPicker={isDateTimePickerVisible}
//         /> */}
//         <LabeledDropdown
//           label="Indicator"
//           placeHolder="Select"
//           options={indicatorsList}
//           setSelectedItem={item => {
//             setSelectedIndicator(item);
//             setId(item.value); // Set the ID here
//           }}
//           searchable
//           defaultValue={selectedIndicator?.value || ''}
//         />
//         <View style={{marginVertical: 10}}>
//           <Text size="body1" fontVariant="bold" style={{marginBottom: 10}}>
//             By date
//           </Text>
//           <View
//             style={{
//               flexDirection: 'row',
//               flexWrap: 'wrap',
//               justifyContent: 'space-evenly',
//               width: '85%',
//               alignContent: 'flex-start',
//             }}>
//             {dateFilterOptions.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={{
//                   borderColor:
//                     selectedDateType === item ? '#F4C24A' : '#E4E7EB',
//                   borderWidth: 1,
//                   backgroundColor:
//                     selectedDateType === item ? '#FCEBC5' : undefined,
//                   paddingHorizontal: 20,
//                   paddingVertical: 7,
//                   borderRadius: 8,
//                   marginBottom: 10,
//                   alignContent: 'flex-start',
//                 }}
//                 onPress={() => {
//                   handleDateTypeChange(item);
//                 }}>
//                 <Text size="small3">{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* <TouchableOpacity
//           onPress={() => {
//             setPickerMode('start');
//             setIsDateTimePickerVisible(true);
//           }}
//           style={{}}>
//           <Text fontVariant="bold" size="body1">
//             Start Date
//           </Text>
//           <View>
//             <View
//               style={{
//                 width: '100%',
//                 borderWidth: 1,
//                 borderColor: '#CBD2D9',
//                 marginTop: 10,
//                 borderRadius: 10,
//                 paddingHorizontal: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 height: normaliseDesigns(40),
//               }}>
//               <Text
//                 style={{
//                   color: selectedStartDate ? colors.blackColor : '#ABB4BD',
//                 }}
//                 size="body1">
//                 {selectedStartDate
//                   ? moment(selectedStartDate).format('DD-MM-YYYY').toString()
//                   : 'Select start date'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   selectedStartDate || selectedEndDate
//                     ? clearDate()
//                     : setPickerMode('start');
//                 }}
//                 style={{}}>
//                 <Icon
//                   name={
//                     selectedStartDate || selectedEndDate
//                       ? 'crosscircle'
//                       : 'calendar_icon'
//                   }
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity> */}

//         <TouchableOpacity
//           onPress={() => {
//             setIsCalendarVisible(true);
//           }}
//           style={{}}>
//           <Text fontVariant="bold" size="body1">
//             Date
//           </Text>
//           <View>
//             <View
//               style={{
//                 width: '100%',
//                 borderWidth: 1,
//                 borderColor: '#CBD2D9',
//                 marginTop: 10,
//                 borderRadius: 10,
//                 paddingHorizontal: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 height: normaliseDesigns(40),
//               }}>
//               <Text onPress={() => setIsCalendarVisible(true)}>
//                 {selectedDateRange || 'Select'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedDateRange('');
//                   setSelectedStartDate('');
//                   setSelectedEndDate('');
//                   setIsCalendarVisible(false);
//                 }}
//                 style={{}}>
//                 <Icon
//                   name={selectedDateRange ? 'crosscircle' : 'calendar_icon'}
//                 />
//               </TouchableOpacity>
//             </View>
//             {isCalendarVisible && (
//               <View style={styles.calendarContainer}>
//                 <Calendar onDateChange={handleDateChange} />
//               </View>
//             )}
//           </View>
//         </TouchableOpacity>

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

//   //for Chart two

//   const captureAndDownloadTwo = async (
//     viewShotRef: React.RefObject<ViewShot>,
//   ) => {
//     try {
//       if (viewShotRef.current) {
//         const uri = await viewShotRef.current.capture();
//         const {config, fs} = RNFetchBlob;
//         const downloadDir =
//           // Platform.OS === 'android'
//           //   ? RNFetchBlob.fs.dirs.PictureDir
//           //   :
//           RNFetchBlob.fs.dirs.DCIMDir;
//         console.log('downffffloadDir', uri);
//         const timestamp = new Date().getTime();
//         const uniqueFileName = `${'chart_screenshot'}_${timestamp}.jpg`;

//         //const fileName = 'chart_screenshot.jpg';
//         const filePath = `${downloadDir}/${uniqueFileName}`;
//         console.log('filePathvvvvv', filePath);

//         const data = await RNFetchBlob.fs.readFile(uri, 'base64');
//         // console.log('hggggggg', data);

//         await RNFetchBlob.fs
//           .writeFile(filePath, data, 'base64')
//           .then(result => {
//             console.log('File has been saved to:' + result);
//             Alert.alert('File Downloaded successfully');

//             showMessage({
//               message: 'Success',
//               description: 'File Downloaded successfully',
//               type: 'success',
//             });
//           })
//           .catch(error => console.log(error));
//       } else {
//         console.error('ViewShot ref is not available');
//       }
//     } catch (error) {
//       console.error('Failed to capture or download:', error);
//       showMessage({
//         message: 'failure',
//         description: 'Failed to Download image',
//         type: 'warning',
//       });
//     }
//   };

//   const shareImageTwo = async (viewShotRef: React.RefObject<ViewShot>) => {
//     try {
//       if (viewShotRef.current) {
//         const uri = await viewShotRef.current.capture();
//         console.log('Captured URI:', uri);

//         // The `uri` is already a Base64-encoded image string
//         const shareOptions = {
//           title: 'Share Chart Image',
//           message: 'Chart Image Two',
//           url: uri, // The Base64 string will be shared directly
//           failOnCancel: false,
//         };

//         // Share the image
//         Share.open(shareOptions)
//           .then(res => console.log('Share response:', res))
//           .catch(err => console.log('Error sharing:', err));

//         setIsModalVisibleTwo(false);
//       } else {
//         console.error('ViewShot ref is not available');
//       }
//     } catch (error) {
//       console.error('Failed to capture or share:', error);
//     }
//   };

//   const ModalContentTwo: FC<{onClose: () => void}> = ({onClose}) => {
//     const handleZoomClickTwo = () => {
//       setIsZoomButtonClickedTwo(true);
//       setIsDownloadButtonClickedTwo(false);
//       setIsShareButtonClickedTwo(false);
//       setIsZoomedTwo(true);
//       onClose();
//     };

//     const handleDownloadClickTwo = () => {
//       setIsZoomButtonClickedTwo(false);
//       setIsDownloadButtonClickedTwo(true);
//       setIsShareButtonClickedTwo(false);
//       captureAndDownloadTwo(viewShotRefs);
//     };

//     const handleShareClickTwo = () => {
//       setIsZoomButtonClickedTwo(false);
//       setIsDownloadButtonClickedTwo(false);
//       setIsShareButtonClickedTwo(true);
//       shareImageTwo(viewShotRefs);
//     };

//     return (
//       <View style={styles.modalContent}>
//         <TouchableOpacity
//           style={[
//             styles.modalOption,
//             isZoomButtonClickedTwo && {backgroundColor: '#FDF0E3'},
//           ]}
//           onPress={handleZoomClickTwo}>
//           <Icon name="zoomout_icon" color={colors.darkGrey} />
//           <Text style={styles.modalOptionText}>Zoom In</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.modalOption,
//             isDownloadButtonClickedTwo && {backgroundColor: '#FDF0E3'},
//           ]}
//           onPress={handleDownloadClickTwo}>
//           <Icon name="downloads_icon" color={colors.darkGrey} />
//           <Text style={styles.modalOptionText}>Download</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.modalOption,
//             isShareButtonClickedTwo && {backgroundColor: '#FDF0E3'},
//           ]}
//           onPress={handleShareClickTwo}>
//           <Icon name="share_icon" color={colors.darkGrey} />
//           <Text style={styles.modalOptionText}>Share</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   const ZoomedChartViewTwo = ({onClose}) => (
//     <View style={styles.zoomedChartContainertwo}>
//       <TouchableOpacity style={styles.closeButton} onPress={onClose}>
//         <Icon name="cross_icon" />
//       </TouchableOpacity>
//       <LineChart
//         value1={observations}
//         value2={indicators}
//         value3={averageScore}
//         title="User Analytics"
//         labels={monthObservations || ['']}
//         indicators={['Observation', 'Indicators', 'Average Score']}
//       />
//     </View>
//   );

//   const handleSortIconClickTwo = () => {
//     setIsSortIconClickTwo(true);
//     setFilterOpenTwo(true);
//     setIsModalVisibleTwo(false);
//   };

//   type RenderFilterModalContentTypestwo = {
//     onPressAssign: () => void;
//   };

//   const RenderAssignFormModalContenttwo: FC<
//     RenderFilterModalContentTypestwo
//   > = ({onPressAssign}) => {
//     const [selectedUsers, setSelectedUsers] = useState<ItemType | undefined>(
//       undefined,
//     );
//     const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
//     const [userSearch, setUserSearch] = useState<string>('');
//     const [groupSearch, setGroupSearch] = useState<string[]>([]);
//     const [isDateTimePickerVisible, setIsDateTimePickerVisible] =
//       useState<boolean>(false);
//     const [pickerMode, setPickerMode] = useState<'start' | 'end'>('start');
//     const [selectedDate, setSelectedDate] = useState<Date | undefined>(
//       undefined,
//     );

//     const {formAssignedUserAndUserGroups} = useAppSelector(
//       state => state.forms,
//     );
//     const [selectedIndicator, setSelectedIndicator] = useState<
//       ItemType | undefined
//     >(undefined);
//     const [selectedSchool, setSelectedSchool] = useState<ItemType | undefined>(
//       undefined,
//     );
//     const [selectedUserState, setSelectedUserState] = useState<
//       ItemType | undefined
//     >(undefined);
//     const [selectedUserDistrict, setSelectedUserDistrict] = useState<
//       ItemType | undefined
//     >(undefined);
//     const [selectedUserArea, setSelectedUserArea] = useState<
//       ItemType | undefined
//     >(undefined);
//     const [selectedStartDate, setSelectedStartDate] = useState<string>('');
//     const [selectedEndDate, setSelectedEndDate] = useState<string>('');
//     const [dateType, setDateType] = useState<string>('');
//     const [selectedDateType, setSelectedDateType] = useState<string>('');
//     const [id, setId] = useState<number | undefined>(undefined);

//     const [isCalendarVisible, setIsCalendarVisible] = useState(false);
//     const [selectedDateRange, setSelectedDateRange] = useState<string>('');
//     const dateFilterOptions = [
//       'Last week',
//       'This month',
//       'Past 3 months',
//       'Past 1 year',
//     ] as const;

//     const userList = userSearchAnalytics?.dataList?.map(userName => ({
//       value: userName.userId,
//       label: userName.name,
//       id: userName.userId,
//     }));
//     const districtOptions = districtList?.map(district => ({
//       value: district.districtId,
//       label: district.districtName,
//     }));

//     const schoolsOptions = selectedUserDistrict
//       ? schoolList
//           ?.filter(item => item?.districtId === selectedUserDistrict?.value)
//           .map(schools => ({
//             value: schools.schoolId,
//             label: schools.schoolName,
//           }))
//       : [];

//     const handleDateChange = (startDate: string, endDate: string) => {
//       console.log('startDate', startDate, endDate);
//       setSelectedStartDate(startDate);
//       setSelectedEndDate(endDate);
//       setSelectedDateRange(`${startDate} - ${endDate}`);
//     };
//     const handlePressChartTwo = () => {
//       const filters = {
//         userId: selectedUsers?.value,
//         stateId: null,
//         districtId: selectedUserDistrict?.value || null,
//         schoolId: selectedSchool?.value || null,
//         dateType: dateType || null,
//         startDate: selectedStartDate || null,
//         endDate: selectedEndDate || null,
//       };
//       onPressAssign();
//       dispatch(getObservationAnalytics(filters));
//       setFilterOpenTwo(false);
//     };

//     const handleConfirm = (date: Date) => {
//       if (pickerMode === 'start') {
//         setSelectedStartDate(moment(date).format('YYYY-MM-DD'));
//       } else {
//         setSelectedEndDate(moment(date).format('YYYY-MM-DD'));
//       }
//       setIsDateTimePickerVisible(false);
//       setDateType('selected_date');
//     };

//     const handleDateTypeChange = (type: string) => {
//       setSelectedStartDate('');
//       setSelectedEndDate('');
//       setSelectedDateType(type);
//       switch (type) {
//         case 'Last week':
//           setDateType('Week');
//           break;
//         case 'This month':
//           setDateType('Month');
//           break;
//         case 'Past 3 months':
//           setDateType('past_3_months');
//           break;
//         case 'Past 1 year':
//           setDateType('Past_1_Year');
//           break;
//         default:
//           setDateType('');
//       }
//     };

//     const clearDate = () => {
//       setSelectedStartDate('');
//       setSelectedEndDate('');
//       setDateType('');
//       setSelectedDateType('');
//     };

//     const isApplyButtonActive =
//       selectedUsers ||
//       selectedUserDistrict ||
//       selectedSchool ||
//       (selectedStartDate && selectedEndDate) ||
//       dateType;

//     return (
//       <View style={{paddingHorizontal: 10}}>
//         {/* <DateTimePickerComponent
//           selectedDate={selectedDate || new Date()}
//           onDateChange={handleConfirm}
//           showPicker={isDateTimePickerVisible}
//         /> */}
//         <LabeledDropdown
//           label="Users"
//           placeHolder="Select"
//           options={userList}
//           setSelectedItem={setSelectedUsers}
//           defaultValue={selectedUsers?.value || ''}
//           searchable
//         />
//         <LabeledDropdown
//           label="District"
//           placeHolder="Select"
//           options={districtOptions}
//           setSelectedItem={setSelectedUserDistrict}
//           defaultValue={selectedUserDistrict?.value || ''}
//           searchable
//         />
//         <LabeledDropdown
//           label="Schools"
//           placeHolder="Select"
//           options={schoolsOptions}
//           setSelectedItem={setSelectedSchool}
//           defaultValue={selectedSchool?.value || ''}
//           searchable
//         />
//         <View style={{marginVertical: 10}}>
//           <Text size="body1" fontVariant="bold" style={{marginBottom: 10}}>
//             By date
//           </Text>
//           <View
//             style={{
//               flexDirection: 'row',
//               flexWrap: 'wrap',
//               justifyContent: 'space-evenly',
//               width: '85%',
//               alignContent: 'flex-start',
//             }}>
//             {dateFilterOptions.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={{
//                   borderColor:
//                     selectedDateType === item ? '#F4C24A' : '#E4E7EB',
//                   borderWidth: 1,
//                   backgroundColor:
//                     selectedDateType === item ? '#FCEBC5' : undefined,
//                   paddingHorizontal: 20,
//                   paddingVertical: 7,
//                   borderRadius: 8,
//                   marginBottom: 10,
//                   alignContent: 'flex-start',
//                 }}
//                 onPress={() => {
//                   handleDateTypeChange(item);
//                 }}>
//                 <Text size="small3">{item}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* <TouchableOpacity
//           onPress={() => {
//             setPickerMode('start');
//             setIsDateTimePickerVisible(true);
//           }}
//           style={{}}>
//           <Text fontVariant="bold" size="body1">
//             Start Date
//           </Text>
//           <View>
//             <View
//               style={{
//                 width: '100%',
//                 borderWidth: 1,
//                 borderColor: '#CBD2D9',
//                 marginTop: 10,
//                 borderRadius: 10,
//                 paddingHorizontal: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 height: normaliseDesigns(40),
//               }}>
//               <Text
//                 style={{
//                   color: selectedStartDate ? colors.blackColor : '#ABB4BD',
//                 }}
//                 size="body1">
//                 {selectedStartDate
//                   ? moment(selectedStartDate).format('DD-MM-YYYY').toString()
//                   : 'Select start date'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   selectedStartDate || selectedEndDate
//                     ? clearDate()
//                     : setPickerMode('start');
//                 }}
//                 style={{}}>
//                 <Icon
//                   name={
//                     selectedStartDate || selectedEndDate
//                       ? 'crosscircle'
//                       : 'calendar_icon'
//                   }
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity> */}
//         <TouchableOpacity
//           onPress={() => {
//             setIsCalendarVisible(true);
//           }}
//           style={{}}>
//           <Text fontVariant="bold" size="body1">
//             Date
//           </Text>
//           <View>
//             <View
//               style={{
//                 width: '100%',
//                 borderWidth: 1,
//                 borderColor: '#CBD2D9',
//                 marginTop: 10,
//                 borderRadius: 10,
//                 paddingHorizontal: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 height: normaliseDesigns(40),
//               }}>
//               <Text onPress={() => setIsCalendarVisible(true)}>
//                 {selectedDateRange || 'Select'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setSelectedDateRange('');
//                   setSelectedStartDate('');
//                   setSelectedEndDate('');
//                   setIsCalendarVisible(false);
//                 }}
//                 style={{}}>
//                 <Icon
//                   name={selectedDateRange ? 'crosscircle' : 'calendar_icon'}
//                 />
//               </TouchableOpacity>
//             </View>
//             {isCalendarVisible && (
//               <View style={styles.calendarContainer}>
//                 <Calendar onDateChange={handleDateChange} />
//               </View>
//             )}
//           </View>
//         </TouchableOpacity>

//         {/* <TouchableOpacity
//           onPress={() => {
//             setPickerMode('end');
//             setIsDateTimePickerVisible(true);
//           }}
//           style={{}}>
//           <Text fontVariant="bold" size="body1">
//             Select End Date
//           </Text>
//           <View>
//             <View
//               style={{
//                 width: '100%',
//                 borderWidth: 1,
//                 borderColor: '#CBD2D9',
//                 marginTop: 10,
//                 borderRadius: 10,
//                 paddingHorizontal: 10,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 height: normaliseDesigns(40),
//               }}>
//               <Text
//                 style={{color: selectedEndDate ? colors.blackColor : '#ABB4BD'}}
//                 size="body1">
//                 {selectedEndDate
//                   ? moment(selectedEndDate).format('DD-MM-YYYY').toString()
//                   : 'Select end date'}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   selectedEndDate ? clearDate() : setPickerMode('end');
//                 }}
//                 style={{}}>
//                 <Icon
//                   name={selectedEndDate ? 'crosscircle' : 'calendar_icon'}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity> */}

//         <View style={{marginBottom: 0, marginTop: 50}}>
//           <Button
//             text="Apply"
//             active={isApplyButtonActive}
//             onPress={handlePressChartTwo}
//           />
//         </View>
//       </View>
//     );
//   };

//   return (
//     <Drawer
//       open={isDrawerOpen}
//       onOpen={() => setIsDrawerOpen(true)}
//       onClose={() => setIsDrawerOpen(false)}
//       renderDrawerContent={() => (
//         <DrawerContent closeDrawer={() => setIsDrawerOpen(false)} />
//       )}>
//       <Layout
//         overridePaddingHorizontal
//         overridePaddingVertical
//         style={{paddingHorizontal: 15}}
//         onPressBellIcon={() => navigation.navigate('Notifications')}
//         onPressMenuIcon={() => setIsDrawerOpen(true)}
//         focusedStack="AnalyticsStack"
//         avoidBackButton
//         dashboard>
//         <Modal
//           onProceed={() => {}}
//           onClose={() => {
//             setFilterOneOpen(false);
//           }}
//           isVisible={filterOneOpen}
//           title="Chart 1 filter"
//           closeButton
//           contentStyle={{width: '100%', height: '90%'}}
//           content={<RenderAssignFormModalContentone onPressAssign={() => {}} />}
//         />
//         <Modal
//           onProceed={() => {}}
//           onClose={() => {
//             setFilterOpenTwo(false);
//           }}
//           isVisible={filterOpenTwo}
//           title="Chart 2 filter"
//           closeButton
//           contentStyle={{width: '100%', top: 0}}
//           content={<RenderAssignFormModalContenttwo onPressAssign={() => {}} />}
//         />
//         <Text
//           size="body4"
//           fontVariant="bold"
//           style={{marginBottom: 10, marginTop: 30}}>
//           Teacher Observation Analytics
//         </Text>
//         <View
//           style={{
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             marginVertical: 10,
//           }}>
//           <AnalyticsCountTile
//             text={'Total Observations'}
//             color={'green'}
//             count={
//               teacherObservationAnalytics?.dataList?.totalObservationCount[0] ||
//               0
//             }
//             onPress={() => {}}
//           />
//           <AnalyticsCountTile
//             text={'Total Indicators'}
//             color={'orange'}
//             count={
//               teacherObservationAnalytics?.dataList?.totalIndicatorCount[0] || 0
//             }
//             onPress={() => {}}
//           />
//           <AnalyticsCountTile
//             text={'Average Score'}
//             color={'red'}
//             count={
//               teacherObservationAnalytics?.dataList
//                 ?.totalObservationAverage[0] || 0
//             }
//             onPress={() => {}}
//           />
//         </View>

//         {observationAnalytics &&
//           observationAnalytics?.dataList?.observationAndIndicatorCount?.length >
//             0 && (
//             <>
//               <View style={styles.chartContainer}>
//                 <View style={styles.iconContainer}>
//                   <TouchableOpacity
//                     onPress={handleSortIconClickOne}
//                     style={styles.iconButton}>
//                     <Icon name="sorting_icon" color={colors.blackColor} />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setIsModalVisibleOne(!isModalVisibleOne);

//                     }}
//                     style={styles.iconButton}>
//                     <Icon name="three_dots" />
//                   </TouchableOpacity>
//                 </View>
//                 {/* <ViewShot
//                   ref={viewShotRefs}
//                   options={{format: 'jpg', quality: 0.9}}>
//                   <LineChart
//                     value1={indicatorAverageRating}
//                     title="Rubric Analytics"
//                     labels={rubricMonths || ['']}
//                   />
//                 </ViewShot> */}
//                 <ViewShot
//                   ref={viewShotRefs}
//                   options={{format: 'jpg', quality: 0.9}}>
//                   <LineChart
//                     value1={indicatorAverageRating}
//                     title="Rubric Analytics"
//                     labels={rubricMonths || ['']}
//                   />
//                 </ViewShot>
//                 {isModalVisibleOne && (
//                   <View style={styles.modalContainer}>
//                     <ModalContentOne
//                       onClose={() => setIsModalVisibleOne(false)}
//                     />
//                   </View>
//                 )}
//               </View>
//               <View style={styles.chartContainer}>
//                 <View style={styles.iconContainer}>
//                   <TouchableOpacity
//                     onPress={handleSortIconClickTwo}
//                     style={styles.iconButton}>
//                     <Icon name="sorting_icon" color={colors.blackColor} />
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setIsModalVisibleTwo(!isModalVisibleTwo);
//                       console.log('hhhhh');
//                     }}
//                     style={styles.iconButton}>
//                     <Icon name="three_dots" />
//                   </TouchableOpacity>
//                 </View>
//                 {/* <ViewShot
//                   ref={viewShotRefs}
//                   options={{format: 'jpg', quality: 0.9}}>
//                   <LineChart
//                     value1={observations}
//                     value2={indicators}
//                     value3={averageScore}
//                     title="User Analytics"
//                     labels={monthObservations || ['']}
//                     indicators={['Observation', 'Indicators', 'Average Score']}
//                   />
//                 </ViewShot> */}
//                 <ViewShot
//                   ref={viewShotRefs}
//                   options={{format: 'jpg', quality: 0.9}}>
//                   <LineChart
//                     value1={observations}
//                     value2={indicators}
//                     value3={averageScore}
//                     title="User Analytics"
//                     labels={monthObservations || ['']}
//                     indicators={['Observation', 'Indicators', 'Average Score']}
//                   />
//                 </ViewShot>
//               </View>

//               {isModalVisibleTwo && (
//                 <View style={styles.modalContainerone}>
//                   <ModalContentTwo
//                     onClose={() => setIsModalVisibleTwo(false)}
//                   />
//                 </View>
//               )}
//             </>
//           )}
//         <View style={{marginVertical: 10}}>
//           <RenderTitleWithLink
//             icon="observation_icon"
//             titleText="List of Observations"
//             linkText="View All"
//             onPress={() => {
//               navigation.navigate('ObservationsListAnalytics');
//             }}
//           />
//           <View style={{marginTop: 5, marginBottom: 15}}>
//             {allObservations ? (
//               allObservations?.dataList?.observations?.length > 0 ? (
//                 allObservations?.dataList?.observations
//                   ?.slice(0, 4)
//                   ?.map((item, index) => (
//                     <ObservationsTile
//                       key={index}
//                       rating={item.ratings?.toString()}
//                       userAssisted={item.userAssessed}
//                       image={item.userImage}
//                       reportedBy={item.reportedBy}
//                       creationDate={moment(item.createdDate).format(
//                         'DD/MM/YYYY',
//                       )}
//                       creationTime={moment(item.createdDate).format('h:mmA')}
//                       status="Completed"
//                       //disabled
//                       onPress={() => {
//                         navigation.navigate('ObservationAnalytics', {
//                           observationId: item?.observationId,
//                         });
//                       }}
//                     />
//                   ))
//               ) : (
//                 <RenderEmptyPlaceholder style={{marginVertical: '20%'}} />
//               )
//             ) : (
//               <></>
//             )}
//           </View>
//         </View>

//         {isZoomedOne && (
//           <ZoomedChartViewOne onClose={() => setIsZoomedOne(false)} />
//         )}

//         {isZoomedTwo && (
//           <ZoomedChartViewTwo onClose={() => setIsZoomedTwo(false)} />
//         )}
//       </Layout>
//     </Drawer>
//   );
// };

// export default TeacherObservationAnalytics;
import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Platform,
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
import Share from 'react-native-share';
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
  getIndicators,
  getSchools,
  SchoolType,
  getUserSearchAnalytics,
  getAllObservations,
  getSearch,
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
import LabeledDropdown from '../../components/LabeledDropdownAnalytics';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import RNFetchBlob from 'rn-fetch-blob';
import {showMessage} from 'react-native-flash-message';
import ViewShot from 'react-native-view-shot';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import {ItemType} from '../../config/types';
import Calendar from './FlowsandFormFilterList';
import {Item} from 'react-native-paper/lib/typescript/components/Drawer/Drawer';
import api from '../../config/axios';
import endPoints from '../../config/endPoints';

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

export type TeacherObservationAnalyticsCountLabelTypes =
  | 'Total Observations'
  | 'Total Indicators'
  | 'Average Score';

const TeacherObservationAnalytics: FC<
  TeacherObservationAnalyticsScreenProps
> = ({navigation, route}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {
    observationAnalytics,
    observationCountAnalytics,
    rubricWiseObservationAnalytics,
    teacherObservationAnalytics,
    indicatorList,
    states,
    districts,
    areas,
    schools,
    userSearchAnalytics,
    allObservations,
    search,
  } = useAppSelector(state => state.analytics);

  const {userData} = useAppSelector(state => state.auth);

  const [isZoomedOne, setIsZoomedOne] = useState<boolean>(false);
  const [isZoomedTwo, setIsZoomedTwo] = useState<boolean>(false);
  const [isZoomButtonClickedOne, setIsZoomButtonClickedOne] = useState(false);
  const [isDownloadButtonClickedOne, setIsDownloadButtonClickedOne] =
    useState(false);
  const [isShareButtonClickedOne, setIsShareButtonClickedOne] = useState(false);
  const [isSortIconClickOne, setIsSortIconClickOne] = useState(false);
  const [isSortIconClickTwo, setIsSortIconClickTwo] = useState(false);
  const [filterOpenOne, setFilterOpenOne] = useState(false);
  const [filterOpenTwo, setFilterOpenTwo] = useState(false);
  const [isZoomButtonClickedTwo, setIsZoomButtonClickedTwo] = useState(false);
  const [isDownloadButtonClickedTwo, setIsDownloadButtonClickedTwo] =
    useState(false);
  const [isShareButtonClickedTwo, setIsShareButtonClickedTwo] = useState(false);

  const [indicatorId, setIndicatorId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [statesList, setStatesList] = useState<State[]>();
  const [districtList, setDistrictList] = useState<District[]>();
  const [areaList, setAreaList] = useState<Area[]>();
  const [schoolList, setSchoolList] = useState<SchoolType[]>();
  const [isModalVisibleTwo, setIsModalVisibleTwo] = useState<boolean>(false);
  const [isModalVisibleOne, setIsModalVisibleOne] = useState<boolean>(false);

  const viewShotRefOne = useRef<ViewShot | null>(null);
  const viewShotRefTwo = useRef<ViewShot | null>(null);

  //console.log("search==",search?.dataList);

  useEffect(() => {
    dispatch(getIndicators(indicatorId));
  }, [indicatorId]);

  // useEffect(()=>{
  //   dispatch(getSearch(userId));
  // },[userId])


  useEffect(() => {
    dispatch(
      getAllObservations([
        userData.id,
        {
          filterType: 'All',
          paginationRequest: {
            page: 0,
            size: 0,
            type: 'all',
          },
        },
      ]),
    );

    dispatch(getUserCountAnalytics());
    dispatch(getUserSearchAnalytics());

    dispatch(getTeacherObservationAnalytics());
    dispatch(
      getObservationAnalytics({
        userId: null,
        stateId: null,
        districtId: null,
        schoolId: null,
        dateType: null,
        startDate: null,
        endDate: null,
      }),
    );

    dispatch(
      getRubricWiseObservationAnalytics({
        indicatorId: null,
        dateType: 'Week',
        startDate: null,
        endDate: null,
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
        type: 'all',
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
        type: 'all',
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

  useEffect(() => {
    if (schools) {
      setSchoolList(schools.dataList);
    }
  }, [schools]);

  useEffect(() => {
    dispatch(
      getSchools({
        page: 0,
        size: 0,
        type: true,
        search: '',
      }),
    );
  }, []);

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

  //console.log("indicatorList--",indicators);

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

  // For Chart One
  const captureAndDownloadOne = async (
    viewShotRef: React.RefObject<ViewShot>,
  ) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        const {config, fs} = RNFetchBlob;
        const downloadDir = RNFetchBlob.fs.dirs.DCIMDir;
        const timestamp = new Date().getTime();
        const uniqueFileName = `${'chart_screenshot'}_${timestamp}.jpg`;
        const filePath = `${downloadDir}/${uniqueFileName}`;

        const data = await RNFetchBlob.fs.readFile(uri, 'base64');

        await RNFetchBlob.fs
          .writeFile(filePath, data, 'base64')
          .then(result => {
            Alert.alert('File Downloaded successfully');
            setIsModalVisibleOne(false);
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
        message: 'Failure',
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
          message: 'Chart Image One',
          url: uri,
          failOnCancel: false,
        };

        Share.open(shareOptions)
          .then(res => console.log('Share response:', res))
          .catch(err => console.log('Error sharing:', err));

        setIsModalVisibleOne(false);
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
      captureAndDownloadOne(viewShotRefOne);
    };

    const handleShareClickOne = () => {
      setIsZoomButtonClickedOne(false);
      setIsDownloadButtonClickedOne(false);
      setIsShareButtonClickedOne(true);
      shareImageOne(viewShotRefOne);
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
    <View style={styles.zoomedChartContainer}>
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

  const handleSortIconClickOne = () => {
    setIsSortIconClickOne(true);
    setFilterOpenOne(true);
    setIsModalVisibleOne(false);
  };

  type RenderFilterModalContentTypesOne = {
    onPressAssign: () => void;
  };

  const RenderAssignFormModalContentOne: FC<
    RenderFilterModalContentTypesOne
  > = ({onPressAssign}) => {
    const [selectedIndicator, setSelectedIndicator] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [dateType, setDateType] = useState<string>('');
    const [selectedDateType, setSelectedDateType] = useState<string>('');
    const [id, setId] = useState<number | undefined>(undefined);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState<string>('');
    const dateFilterOptions = [
      'Last week',
      'This month',
      'Past 3 months',
      'Past 1 year',
    ] as const;

    const indicatorsList =
      indicatorList?.dataList?.map(item => ({
        value: item.indicatorId,
        label: item.indicatorName,
      })) || [];

    const handlePressChartOne = () => {
      const filters = {
        dateType: dateType || null,
        startDate: selectedStartDate || null,
        endDate: selectedEndDate || null,
        indicatorId: id || 0,
      };
      onPressAssign();
      dispatch(getRubricWiseObservationAnalytics(filters));
      setFilterOpenOne(false);
    };

    const handleDateChange = (startDate: string, endDate: string) => {
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
      setSelectedDateRange(`${startDate} - ${endDate}`);
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
      (selectedIndicator && selectedStartDate && selectedEndDate) || dateType;

    return (
      <View style={{paddingHorizontal: 10}}>
        <LabeledDropdown
          label="Indicator"
          placeHolder="Select"
          options={indicatorsList}
          setSelectedItem={item => {
            setSelectedIndicator(item);
            setId(item.value);
          }}
          searchable
          defaultValue={selectedIndicator?.value || ''}
          onSearchTextChange={text => console.log('Search text:', text)}
        />
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
            onPress={handlePressChartOne}
          />
        </View>
      </View>
    );
  };

  // For Chart Two
  const captureAndDownloadTwo = async (
    viewShotRef: React.RefObject<ViewShot>,
  ) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRefTwo.current.capture();
        const {config, fs} = RNFetchBlob;
        const downloadDir = RNFetchBlob.fs.dirs.DCIMDir;
        const timestamp = new Date().getTime();
        const uniqueFileName = `${'chart_screenshot'}_${timestamp}.jpg`;
        const filePath = `${downloadDir}/${uniqueFileName}`;

        const data = await RNFetchBlob.fs.readFile(uri, 'base64');

        await RNFetchBlob.fs
          .writeFile(filePath, data, 'base64')
          .then(result => {
            Alert.alert('File Downloaded successfully');
            setIsModalVisibleTwo(false);
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
        message: 'Failure',
        description: 'Failed to Download image',
        type: 'warning',
      });
    }
  };

  const shareImageTwo = async (viewShotRef: React.RefObject<ViewShot>) => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRefTwo.current.capture();

        const shareOptions = {
          title: 'Share Chart Image',
          message: 'Chart Image Two',
          url: uri,
          failOnCancel: false,
        };

        Share.open(shareOptions)
          .then(res => console.log('Share response:', res))
          .catch(err => console.log('Error sharing:', err));

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
      captureAndDownloadTwo(viewShotRefTwo);
    };

    const handleShareClickTwo = () => {
      setIsZoomButtonClickedTwo(false);
      setIsDownloadButtonClickedTwo(false);
      setIsShareButtonClickedTwo(true);
      shareImageTwo(viewShotRefTwo);
    };

    return (
      <View style={styles.modalContent}>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isZoomButtonClickedTwo && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleZoomClickTwo}>
          <Icon name="zoomout_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isDownloadButtonClickedTwo && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleDownloadClickTwo}>
          <Icon name="downloads_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isShareButtonClickedTwo && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleShareClickTwo}>
          <Icon name="share_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ZoomedChartViewTwo = ({onClose}) => (
    <View style={styles.zoomedChartContainer}>
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

  const handleSortIconClickTwo = () => {
    setIsSortIconClickTwo(true);
    setFilterOpenTwo(true);
    setIsModalVisibleTwo(false);
  };

  type RenderFilterModalContentTypesTwo = {
    onPressAssign: () => void;
  };

  const RenderAssignFormModalContentTwo: FC<
    RenderFilterModalContentTypesTwo
  > = ({onPressAssign}) => {
    const [selectedUsers, setSelectedUsers] = useState<ItemType | undefined>(
      undefined,
    );
    const [selectedUserDistrict, setSelectedUserDistrict] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedSchool, setSelectedSchool] = useState<ItemType | undefined>(
      undefined,
    );

    const initialUserList =
      userSearchAnalytics?.dataList?.map(userName => ({
        value: userName.userId,
        label: userName.name,
        id: userName.userId,
      })) || [];

    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [dateType, setDateType] = useState<string>('');
    const [selectedDateType, setSelectedDateType] = useState<string>('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [selectedDateRange, setSelectedDateRange] = useState<string>('');
    const [userList, setUserList] = useState(initialUserList);
    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dateFilterOptions = [
      'Last week',
      'This month',
      'Past 3 months',
      'Past 1 year',
    ] as const;

    const districtOptions = districtList?.map(district => ({
      value: district.districtId,
      label: district.districtName,
    }));

    const schoolsOptions = selectedUserDistrict
      ? schoolList
          ?.filter(item => item?.districtId === selectedUserDistrict?.value)
          .map(school => ({
            value: school.schoolId,
            label: school.schoolName,
          }))
      : [];

    const handleDateChange = (startDate: string, endDate: string) => {
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
      setSelectedDateRange(`${startDate} - ${endDate}`);
      setDateType('selected_date');
    };

    const handlePressChartTwo = () => {
      const filters = {
        userId: selectedUsers?.value || null,
        stateId: null,
        districtId: selectedUserDistrict?.value || null,
        schoolId: selectedSchool?.value || null,
        dateType: dateType || null,
        startDate: selectedStartDate || null,
        endDate: selectedEndDate || null,
      };
      onPressAssign();
      dispatch(getObservationAnalytics(filters));
      setFilterOpenTwo(false);
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
      selectedUsers ||
      selectedUserDistrict ||
      selectedSchool ||
      (selectedStartDate && selectedEndDate) ||
      dateType;

      const handleSearchTextChange = async text => {
        setSearchText(text); // Update the searchText state
      
        // Fetch data from API based on the search text
        const fetchedData = await fetchDataFromAPI(text);
      
        // Update the options for the dropdown
        setUserList(
          fetchedData.map(user => ({
            value: user.userId, // or use user.userId if that's the unique identifier
            label: user.name,   // name or display name
            id: user.userId,    // keep the id as a unique identifier
          })),
        );
      
        // Maintain the dropdown open after the state update
        setIsDropdownOpen(true);
      };

    useEffect(() => {
      if (search?.dataList) {
        const updatedUserList = search.dataList
          .filter(user =>
            user.userName.toLowerCase().includes(searchText.toLowerCase()),
          )
          .map(user => ({
            value: user.userId,
            label: user.name,
            id: user.userId,
          }));
        setUserList(updatedUserList); // Set the filtered user list
        setIsDropdownOpen(true); // Keep the dropdown open
      }
    }, [search?.dataList,searchText ]);

    const handleItemSelected = item => {
      console.log('item--', item);
      setSelectedUsers(item); // Update the selected item
      console.log('Selected User:', item);
    };
   
    

    const closeDropdown = () => {
      // setIsDropdownOpen(false);
    };
    const fetchDataFromAPI = async text => {
      try {
        // console.log(object)
        const response = await api.get(`${endPoints.ANALYTICS_SEARCH}${text}`);
        const data = await response.data?.payload?.dataList;

        return data;
        // Assuming the response has an `items` array
      } catch (error) {
        console.error('Error fetching data from API:', error);
        return []; // Return an empty array if there's an error
      }
    };

    return (
      <View style={{paddingHorizontal: 10}}>
        {/* <LabeledDropdown
          label="Users"
          placeHolder="Select"
          options={ []} // Ensure options is always an array
          // options={userList || []} // Ensure options is always an array
          
          setSelectedItem={handleItemSelected} // Handle item selection
          defaultValue={selectedUsers?.value || ''} // Show the selected value
          searchable
          onSearchTextChange={handleSearchTextChange} // Handle search text change
          isOpen={isDropdownOpen} // Control the dropdown visibility
          onDropdownClose={closeDropdown} // Optionally handle dropdown close
        /> */}
        <LabeledDropdown
          label="Users"
          placeHolder="Select"
          options={userList || []} // Pass the fetched options
          setSelectedItem={handleItemSelected} // Handle item selection
          defaultValue={selectedUsers?.value || ''} // Show the selected value
          searchable
          onSearchTextChange={handleSearchTextChange} // Handle search text change
          isOpen={isDropdownOpen} // Control the dropdown visibility
          onDropdownClose={() => setIsDropdownOpen(false)} // Optionally handle dropdown close
        />
        <LabeledDropdown
          label="District"
          placeHolder="Select"
          options={districtOptions}
          setSelectedItem={setSelectedUserDistrict}
          defaultValue={selectedUserDistrict?.value || ''}
          searchable
          onSearchTextChange={text => console.log('Search text:', text)}
        />
        <LabeledDropdown
          label="Schools"
          placeHolder="Select"
          options={schoolsOptions}
          setSelectedItem={setSelectedSchool}
          defaultValue={selectedSchool?.value || ''}
          searchable
          onSearchTextChange={text => console.log('Search text:', text)}
        />
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
            onPress={handlePressChartTwo}
          />
        </View>
      </View>
    );
  };
  //   const RenderAssignFormModalContentTwo: FC<RenderFilterModalContentTypesTwo> = ({
  //     onPressAssign,
  //   }) => {
  //     const [selectedUsers, setSelectedUsers] = useState<ItemType | undefined>(
  //       undefined,
  //     );
  //     const [selectedUserDistrict, setSelectedUserDistrict] = useState<
  //       ItemType | undefined
  //     >(undefined);
  //     const [selectedSchool, setSelectedSchool] = useState<ItemType | undefined>(
  //       undefined,
  //     );
  //     const [selectedStartDate, setSelectedStartDate] = useState<string>('');
  //     const [selectedEndDate, setSelectedEndDate] = useState<string>('');
  //     const [dateType, setDateType] = useState<string>('');
  //     const [selectedDateType, setSelectedDateType] = useState<string>('');
  //     const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  //     const [selectedDateRange, setSelectedDateRange] = useState<string>('');
  //     const [searchText, setSearchText] = useState<string>('');

  //     const dateFilterOptions = [
  //       'Last week',
  //       'This month',
  //       'Past 3 months',
  //       'Past 1 year',
  //     ] as const;

  //     const userList = userSearchAnalytics?.dataList?.map((userName) => ({
  //       value: userName.userId,
  //       label: userName.name,
  //       id: userName.userId,
  //     }));

  //     //console.log("districtList====",districtList);

  //     const districtOptions = districtList?.map((district) => ({
  //       value: district.districtId,
  //       label: district.districtName,
  //     }));

  //     const schoolsOptions = selectedUserDistrict
  //       ? schoolList
  //           ?.filter((item) => item?.districtId === selectedUserDistrict?.value)
  //           .map((school) => ({
  //             value: school.schoolId,
  //             label: school.schoolName,
  //           }))
  //       : [];

  //       console.log('text---',searchText);
  //     // Effect to handle search input changes and trigger the search API call
  //     // useEffect(() => {
  //     //   if (searchText) {
  //     //     dispatch(getSearch(searchText)); // Pass the search text as userId to the getSearch API call
  //     //   }
  //     // }, [searchText]);

  //     const handleDateChange = (startDate: string, endDate: string) => {
  //       setSelectedStartDate(startDate);
  //       setSelectedEndDate(endDate);
  //       setSelectedDateRange(`${startDate} - ${endDate}`);
  //       setDateType('selected_date');
  //     };

  //     const handlePressChartTwo = () => {
  //       const filters = {
  //         userId: selectedUsers?.value,
  //         stateId: null,
  //         districtId: selectedUserDistrict?.value || null,
  //         schoolId: selectedSchool?.value || null,
  //         dateType: dateType || null,
  //         startDate: selectedStartDate || null,
  //         endDate: selectedEndDate || null,
  //       };
  //       onPressAssign();
  //       dispatch(getObservationAnalytics(filters));
  //       setFilterOpenTwo(false);
  //     };

  //     const handleDateTypeChange = (type: string) => {
  //       setSelectedStartDate('');
  //       setSelectedEndDate('');
  //       setSelectedDateType(type);
  //       switch (type) {
  //         case 'Last week':
  //           setDateType('Week');
  //           break;
  //         case 'This month':
  //           setDateType('Month');
  //           break;
  //         case 'Past 3 months':
  //           setDateType('past_3_months');
  //           break;
  //         case 'Past 1 year':
  //           setDateType('Past_1_Year');
  //           break;
  //         default:
  //           setDateType('');
  //       }
  //     };

  //     const clearDate = () => {
  //       setSelectedStartDate('');
  //       setSelectedEndDate('');
  //       setDateType('');
  //       setSelectedDateType('');
  //     };

  //     const isApplyButtonActive =
  //       selectedUsers ||
  //       selectedUserDistrict ||
  //       selectedSchool ||
  //       (selectedStartDate && selectedEndDate) ||
  //       dateType;

  //     return (
  //       <View style={{ paddingHorizontal: 10 }}>
  //      <LabeledDropdown
  //   label="Users"
  //   placeHolder="Select"
  //   options={userList} // Array of users to be displayed
  //   setSelectedItem={setSelectedUsers} // Function to set the selected user
  //   defaultValue={selectedUsers?.value || searchText} // Default value displayed in the dropdown
  //   onSearchTextChange={(text) => {
  //     console.log('Search text:', text);
  //     setSearchText(text); // Update the state with the new search text
  //     dispatch(getSearch(text)); // Trigger the API call with the entered text
  //   }}
  //   searchable // Enable search functionality
  // />
  //         <LabeledDropdown
  //           label="District"
  //           placeHolder="Select"
  //           options={districtOptions}
  //           setSelectedItem={setSelectedUserDistrict}
  //           defaultValue={selectedUserDistrict?.value || ''}
  //           searchable
  //         />
  //         <LabeledDropdown
  //           label="Schools"
  //           placeHolder="Select"
  //           options={schoolsOptions}
  //           setSelectedItem={setSelectedSchool}
  //           defaultValue={selectedSchool?.value || ''}
  //           searchable
  //         />
  //         <View style={{ marginVertical: 10 }}>
  //           <Text size="body1" fontVariant="bold" style={{ marginBottom: 10 }}>
  //             By date
  //           </Text>
  //           <View
  //             style={{
  //               flexDirection: 'row',
  //               flexWrap: 'wrap',
  //               justifyContent: 'space-evenly',
  //               width: '85%',
  //               alignContent: 'flex-start',
  //             }}>
  //             {dateFilterOptions.map((item, index) => (
  //               <TouchableOpacity
  //                 key={index}
  //                 style={{
  //                   borderColor:
  //                     selectedDateType === item ? '#F4C24A' : '#E4E7EB',
  //                   borderWidth: 1,
  //                   backgroundColor:
  //                     selectedDateType === item ? '#FCEBC5' : undefined,
  //                   paddingHorizontal: 20,
  //                   paddingVertical: 7,
  //                   borderRadius: 8,
  //                   marginBottom: 10,
  //                   alignContent: 'flex-start',
  //                 }}
  //                 onPress={() => {
  //                   handleDateTypeChange(item);
  //                 }}>
  //                 <Text size="small3">{item}</Text>
  //               </TouchableOpacity>
  //             ))}
  //           </View>
  //         </View>

  //         <TouchableOpacity
  //           onPress={() => {
  //             setIsCalendarVisible(true);
  //           }}
  //           style={{}}>
  //           <Text fontVariant="bold" size="body1">
  //             Date
  //           </Text>
  //           <View>
  //             <View
  //               style={{
  //                 width: '100%',
  //                 borderWidth: 1,
  //                 borderColor: '#CBD2D9',
  //                 marginTop: 10,
  //                 borderRadius: 10,
  //                 paddingHorizontal: 10,
  //                 flexDirection: 'row',
  //                 justifyContent: 'space-between',
  //                 alignItems: 'center',
  //                 height: normaliseDesigns(40),
  //               }}>
  //               <Text onPress={() => setIsCalendarVisible(true)}>
  //                 {selectedDateRange || 'Select'}
  //               </Text>
  //               <TouchableOpacity
  //                 onPress={() => {
  //                   setSelectedDateRange('');
  //                   setSelectedStartDate('');
  //                   setSelectedEndDate('');
  //                   setIsCalendarVisible(false);
  //                 }}
  //                 style={{}}>
  //                 <Icon
  //                   name={selectedDateRange ? 'crosscircle' : 'calendar_icon'}
  //                 />
  //               </TouchableOpacity>
  //             </View>
  //             {isCalendarVisible && (
  //               <View style={styles.calendarContainer}>
  //                 <Calendar onDateChange={handleDateChange} />
  //               </View>
  //             )}
  //           </View>
  //         </TouchableOpacity>

  //         <View style={{ marginBottom: 0, marginTop: 50 }}>
  //           <Button
  //             text="Apply"
  //             active={isApplyButtonActive}
  //             onPress={handlePressChartTwo}
  //           />
  //         </View>
  //       </View>
  //     );
  //   };

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
        dashboard
        >
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOpenOne(false);
          }}
          isVisible={filterOpenOne}
          title="Chart 1 filter"
          closeButton
          contentStyle={{width: '100%', height: '90%'}}
          content={<RenderAssignFormModalContentOne onPressAssign={() => {}} />}
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOpenTwo(false);
          }}
          isVisible={filterOpenTwo}
          title="Chart 2 filter"
          closeButton
          contentStyle={{width: '100%', top: 0}}
          content={<RenderAssignFormModalContentTwo onPressAssign={() => {}} />}
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
            count={
              teacherObservationAnalytics?.dataList?.totalObservationCount[0] ||
              0
            }
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Indicators'}
            color={'orange'}
            count={
              teacherObservationAnalytics?.dataList?.totalIndicatorCount[0] || 0
            }
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Average Score'}
            color={'red'}
            count={
              teacherObservationAnalytics?.dataList
                ?.totalObservationAverage[0] || 0
            }
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
                    {filterOpenOne?<Icon name='dots_colred_icon'/>:<Icon name="sorting_icon" color={colors.blackColor} />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisibleOne(!isModalVisibleOne);
                    }}
                    style={styles.iconButton}>
                    {isModalVisibleOne?<Icon name='filter_colored_icon'/>: <Icon name="three_dots" />}
                  </TouchableOpacity>
                </View>
                <ViewShot
                  ref={viewShotRefOne}
                  options={{format: 'jpg', quality: 0.9}}>
                  <LineChart
                    value1={indicatorAverageRating}
                    title="Rubric Analytics"
                    labels={rubricMonths || ['']}
                  />
                </ViewShot>
                {isModalVisibleOne && (
                  <View style={styles.modalContainer}>
                    <ModalContentOne
                      onClose={() => setIsModalVisibleOne(false)}
                    />
                  </View>
                )}
              </View>
              <View style={styles.chartContainer}>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={handleSortIconClickTwo}
                    style={styles.iconButton}>
                   {filterOpenTwo?<Icon name='dots_colred_icon'/>:<Icon name="sorting_icon" color={colors.blackColor} />}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setIsModalVisibleTwo(!isModalVisibleTwo);
                    }}
                    style={styles.iconButton}>
                    {isModalVisibleTwo?<Icon name='filter_colored_icon'/>: <Icon name="three_dots" />}
                  </TouchableOpacity>
                </View>
                <ViewShot
                  ref={viewShotRefTwo}
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

              {isModalVisibleTwo && (
                <View style={styles.modalContainerone}>
                  <ModalContentTwo
                    onClose={() => setIsModalVisibleTwo(false)}
                  />
                </View>
              )}
            </>
          )}
        <View style={{marginVertical: 15}}>
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
    //marginVertical: 10,
    top:15,
    
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
    top: normaliseDesigns(40),
    right: 1,
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
    top: normaliseDesigns(462),
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
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 10,
    paddingVertical: 5,
    top: 5,
  },
});
export default TeacherObservationAnalytics;
