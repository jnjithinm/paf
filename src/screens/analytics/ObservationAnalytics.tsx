import React, {FC, useEffect, useRef, useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Image from '../../components/Image';
import EvidenceCard from '../../components/EvidenceCard';
import {ObservationStackParamList} from '../../navigation/ObservationStack';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  EvidenceResponse,
  resetSaveEvidenceCardResponse,
  resetSaveObservationResponse,
  saveEvidenceCardDetails,
  saveObservation,
} from '../../redux/features/observationSlice';
import Share from 'react-native-share';
import {getObservationById} from '../../redux/features/analyticsSlice';
import {
  getObservationCountAnalytics,
  getUserSearchAnalytics,
} from '../../redux/features/analyticsSlice';
import {RatingStars, RenderProfileIcon} from '../dashboard/TeacherDashboard';

import FooterWithButtons from '../../components/FooterWithButtons';

import moment from 'moment';
import {getUser} from '../../redux/features/usersSlice';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {RenderCompleteStatus} from '../observation/ObservationReportsMainPage';
import CurvedLineChart from '../../components/CurvedLineChart';
import ViewShot from 'react-native-view-shot';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import {showMessage} from 'react-native-flash-message';
import RNFetchBlob from 'rn-fetch-blob';
import Button from '../../components/Button';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
//import LabeledDropdown from '../../components/LabeledDropdown';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import {ItemType} from '../../config/types';
import Modal from '../../components/Modal';
import Calendar from './FlowsandFormFilterList';
import LabeledDropdown from '../../components/LabeledDropdownAnalytics';
import endPoints from '../../config/endPoints';
import api from '../../config/axios';

type ObservationAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'ObservationAnalytics'
>;
type ObservationAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'ObservationAnalytics'
>;

interface ObservationAnalyticsScreenProps {
  navigation: ObservationAnalyticsNavigationProp;
  route: ObservationAnalyticsRouteProp;
}

const ObservationAnalytics: FC<ObservationAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  const {observationId} = route.params;
  const dispatch = useAppDispatch();
  const {observationById} = useAppSelector(state => state.observation);
  const {observationCountAnalytics, userSearchAnalytics, search} =
    useAppSelector(state => state.analytics);
  //const [filterOneOpen, setFilterOneOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isSortIconClick, setIsSortIconClick] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [isZoomButtonClicked, setIsZoomButtonClicked] = useState(false);
  const [isDownloadButtonClicked, setIsDownloadButtonClicked] = useState(false);
  const [isShareButtonClicked, setIsShareButtonClicked] = useState(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [filtersChartTwo, setFiltersChartTwo] = useState(false);
  const viewShotRef = useRef(null);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(getObservationById(observationId));
    }, [dispatch, observationId]),
  );

  useEffect(() => {
    if (observationById?.userId) {
      dispatch(
        getObservationCountAnalytics({
          userId: observationById?.userId,
          dateType: null,
          startDate: null,
          endDate: null,
        }),
      );
    }
  }, [dispatch, observationById?.userId]);

  console.log('observationById.userId------', observationId);

  useEffect(() => {
    dispatch(getUserSearchAnalytics());
  }, []);

  const formattedObservationsAnalytics =
    observationCountAnalytics?.dataList?.observationAndAverageCount
      ?.slice(1)
      .map((row: any[]) => ({
        month: row[0],
        observations: row[1],
        averagerating: row[2],
      })) || [];

  const monthObservations = formattedObservationsAnalytics.map(
    item => item.month,
  );
  const observations = formattedObservationsAnalytics.map(
    item => item.observations,
  );
  const averagerating = formattedObservationsAnalytics.map(
    item => item.averagerating,
  );

  console.log('monthObservations:', monthObservations);
  console.log('observations:', observations);
  console.log('averagerating:', averagerating);

  // Ensure that all arrays are of the same length and contain data
  const isValidData =
    monthObservations.length === observations.length &&
    observations.length === averagerating.length &&
    monthObservations.length > 0;

  const captureAndDownload = async (viewShotRef: React.RefObject<ViewShot>) => {
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
            setIsModalVisible(false);
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
          .then(res => console.log('Share response:', res))
          .catch(err => console.log('Error sharing:', err));

        setIsModalVisible(false);
      } else {
        console.error('ViewShot ref is not available');
      }
    } catch (error) {
      console.error('Failed to capture or share:', error);
    }
  };

  const ModalContent: FC<{onClose: () => void}> = ({onClose}) => {
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
            isZoomButtonClicked && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleZoomClick}>
          <Icon name="zoomout_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Zoom In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isDownloadButtonClicked && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleDownloadClick}>
          <Icon name="downloads_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.modalOption,
            isShareButtonClicked && {backgroundColor: '#FDF0E3'},
          ]}
          onPress={handleShareClick}>
          <Icon name="share_icon" color={colors.darkGrey} />
          <Text style={styles.modalOptionText}>Share</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const ZoomedChartView = ({onClose}) => (
    <View style={styles.zoomedChartContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon name="cross_icon" />
      </TouchableOpacity>
      <CurvedLineChart
        value1={observations}
        value2={averagerating}
        labels={monthObservations}
        indicators={['Observations', 'Average Rating']}
        style={{paddingTop: 40, width: '100%', height: '100%'}}
      />
    </View>
  );

  const handleSortIconClick = () => {
    setIsSortIconClick(true);
    setFilterOpen(true);
  };

  type RenderFilterModalContentTypestwo = {
    onPressAssign: () => void;
  };

  const RenderAssignFormModalContenttwo: FC<
    RenderFilterModalContentTypestwo
  > = ({onPressAssign}) => {
    const [selectedUsers, setSelectedUsers] = useState<ItemType | undefined>(
      undefined,
    );
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
    const [selectedIndicator, setSelectedIndicator] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedSchool, setSelectedSchool] = useState<ItemType | undefined>(
      undefined,
    );
    const [selectedUserState, setSelectedUserState] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserDistrict, setSelectedUserDistrict] = useState<
      ItemType | undefined
    >(undefined);
    const [selectedUserArea, setSelectedUserArea] = useState<
      ItemType | undefined
    >(undefined);

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
    const [id, setId] = useState<number | undefined>(undefined);
    const [selectedDateRange, setSelectedDateRange] = useState<string>('');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [userList, setUserList] = useState(initialUserList);
    const [searchText, setSearchText] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dateFilterOptions = [
      'Last week',
      'This month',
      'Past 3 months',
      'Past 1 year',
    ] as const;

    const handleDateChange = (startDate: string, endDate: string) => {
      console.log('startDate', startDate, endDate);
      setSelectedStartDate(startDate);
      setSelectedEndDate(endDate);
      setSelectedDateRange(`${startDate} - ${endDate}`);
      setDateType('selected_date');
    };
    const handlePressChartTwo = () => {
      const filters = {
        userId: selectedUsers?.value,
        dateType: dateType || null,
        startDate: selectedStartDate || null,
        endDate: selectedEndDate || null,
      };
      onPressAssign();
      dispatch(getObservationCountAnalytics(filters));
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

    const handleSearchTextChange = async text => {
      // Fetch data from API based on the search text
      const fetchedData = await fetchDataFromAPI(text);

      // Update the options for the dropdown
      setUserList(
        fetchedData.map(user => ({
          value: user.userId,
          label: user.name,
          id: user.userId,
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
        // setIsDropdownOpen(true); // Keep the dropdown open
      }
    }, [search?.dataList, searchText]);

    const handleItemSelected = item => {
      console.log('itsm--', item);

      setSelectedUsers(item); // Update the selected item
      // setIsDropdownOpen(false); // Optionally close the dropdown after selection
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

    const isApplyButtonActive =
      selectedUserState ||
      selectedUserDistrict ||
      selectedSchool ||
      (selectedStartDate && selectedEndDate) ||
      dateType;

    return (
      <View style={{paddingHorizontal: 10}}>
        {/* <DateTimePickerComponent
            selectedDate={selectedDate || new Date()}
            onDateChange={handleConfirm}
            showPicker={isDateTimePickerVisible}
          /> */}
        {/* <LabeledDropdown
            label="Users"
            placeHolder="Select"
            options={userList}
            setSelectedItem={setSelectedUsers}
            defaultValue={selectedUsers?.value || ''}
            searchable
            onSearchTextChange={(text) => console.log('Search text:', text)}
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
  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15, paddingVertical: 0}}
        icon="reports_icon"
        title="Observations">
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOpen(false);
          }}
          isVisible={filterOpen}
          title="Chart 1 filter"
          closeButton
          contentStyle={{width: '100%'}}
          content={<RenderAssignFormModalContenttwo onPressAssign={() => {}} />}
        />
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <RenderProfileIcon
              image={observationById?.userImage}
              name={observationById?.userName?.toString() || ''}
              size={50}
            />
            <View style={{flex: 1, justifyContent: 'center', marginLeft: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '70%',
                }}>
                <Text fontVariant="bold" size="body2">
                  {`${observationById?.userName || ''} (${
                    observationById?.userGroup || ''
                  })`}
                </Text>
                <RenderCompleteStatus
                  style={{marginLeft: 5}}
                  status={observationById?.observationStatus}
                />
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <RatingStars
                  rating={Number(
                    observationById?.observationAvgRatings?.toFixed(1),
                  )}
                />
                <View
                  style={{
                    height: 10,
                    backgroundColor: '#E4E7EB',
                    width: 1,
                    marginHorizontal: 5,
                  }}
                />
                <Text style={{color: '#4E565F'}} size="small3">
                  {Number(
                    observationById?.observationAvgRatings?.toFixed(1) || '',
                  )}
                  /5
                </Text>
              </View>
            </View>
          </View>
        </View>
        {isValidData ? (
          <View style={{position: 'relative'}}>
            <View style={styles.iconContainer}>
              <TouchableOpacity
                onPress={handleSortIconClick}
                style={styles.iconButton}>
                 {filterOpen?<Icon name='dots_colred_icon'/>:<Icon name="sorting_icon" color={colors.blackColor} />}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                  //setIsDotsClick(true);
                }}
                style={styles.iconButton}>
                {isModalVisible?<Icon name='filter_colored_icon'/>: <Icon name="three_dots" />}
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 10}}>
              <ViewShot
                ref={viewShotRef}
                options={{format: 'jpg', quality: 0.9}}>
                <CurvedLineChart
                  value1={observations}
                  value2={averagerating}
                  labels={monthObservations}
                  indicators={['Observations', 'Average Rating']}
                />
              </ViewShot>
              {isModalVisible && (
                <View style={styles.modalContainer}>
                  <ModalContent onClose={() => setIsModalVisible(false)} />
                </View>
              )}
            </View>
          </View>
        ) : (
          <></>
        )}
      </Layout>
      {isZoomed && <ZoomedChartView onClose={() => setIsZoomed(false)} />}
    </KeyboardAvoidingView>
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
    top:normaliseDesigns(33),
    right: 2,
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
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 10,
    paddingVertical: 5,
    top: 5,
  },
});
export default ObservationAnalytics;
