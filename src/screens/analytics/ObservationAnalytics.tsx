import React, {FC, useEffect, useRef, useState} from 'react';
import {KeyboardAvoidingView, Platform, Share, StyleSheet, TouchableOpacity, View} from 'react-native';
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
  getObservationById,
  resetSaveEvidenceCardResponse,
  resetSaveObservationResponse,
  saveEvidenceCardDetails,
  saveObservation,
} from '../../redux/features/observationSlice';
import {getObservationCountAnalytics} from '../../redux/features/analyticsSlice'
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
import { showMessage } from 'react-native-flash-message';
import RNFetchBlob from 'rn-fetch-blob';
import Button from '../../components/Button';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';
import LabeledDropdown from '../../components/LabeledDropdown';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import { ItemType } from '../../config/types';
import Modal from '../../components/Modal';

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
  const { observationId } = route.params;
  const dispatch = useAppDispatch();
  const { observationById } = useAppSelector(state => state.observation);
  const { observationCountAnalytics } = useAppSelector(state => state.analytics);
  const [filterOneOpen, setFilterOneOpen] = useState(false);
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
    }, [dispatch, observationId])
  );

  useEffect(() => {
    if (observationById?.userId) {
      dispatch(
        getObservationCountAnalytics({
          userId: Number(observationById.userId),
          dateType: null,
          startDate: null,
          endDate: null,
        })
      );
    }
  }, [dispatch, observationById?.userId]);

  const formattedObservationsAnalytics =
    observationCountAnalytics?.dataList?.observationAndAverageCount
      ?.slice(1)
      .map((row: any[]) => ({
        month: row[0],
        observations: row[1],
        averagerating: row[2],
      })) || [];

  const monthObservations = formattedObservationsAnalytics.map(item => item.month);
  const observations = formattedObservationsAnalytics.map(item => item.observations);
  const averagerating = formattedObservationsAnalytics.map(item => item.averagerating);

  console.log("monthObservations:", monthObservations);
  console.log("observations:", observations);
  console.log("averagerating:", averagerating);

  // Ensure that all arrays are of the same length and contain data
  const isValidData =
    monthObservations.length === observations.length &&
    observations.length === averagerating.length &&
    monthObservations.length > 0;


    const captureAndDownload = async (viewShotRef: React.RefObject<ViewShot>) => {
      console.log("Starting captureAndDownload function");
      try {
        if (viewShotRef.current) {
          console.log("ViewShot ref is available, capturing the view");
          const uri = await viewShotRef.current.capture();
          console.log("Capture URI:", uri);
  
          const downloadDir = Platform.OS === 'android'
            ? RNFetchBlob.fs.dirs.DownloadDir
            : RNFetchBlob.fs.dirs.DocumentDir;
          const fileName = 'chart_screenshot.jpg';
          const filePath = `${downloadDir}/${fileName}`;
          console.log("File will be saved to:", filePath);
  
          const data = await RNFetchBlob.fs.readFile(uri, 'base64');
          console.log("File data read successfully");
  
          await RNFetchBlob.fs.writeFile(filePath, data, 'base64');
          console.log("File written successfully");
  
          showMessage({
            message: "Success",
            description: "File Downloaded successfully",
            type: "success",
          });
          console.log("Downloaded successfully:", filePath);
        } else {
          console.error("ViewShot ref is not available");
        }
      } catch (error) {
        console.error("Failed to capture or download:", error);
      }
    };
  
    const shareImage = async (viewShotRef: React.RefObject<ViewShot>) => {
      console.log("Starting shareImage function");
      try {
        if (viewShotRef.current) {
          const uri = await viewShotRef.current.capture();
          console.log("Capture URI:", uri);
  
          const shareOptions = {
            title: 'Share Chart Image',
            url: uri,
            failOnCancel: false,
          };
  
          Share.share(shareOptions)
            .then(res => console.log(res))
            .catch(err => console.log('Error =>', err));
        } else {
          console.error("ViewShot ref is not available");
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
            value1={observations}
            value2={averagerating}
            labels={monthObservations}
            indicators={['Observations', 'Average Rating']}
            style={{ paddingTop: 40, width: '100%', height: '100%' }}
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

          userId: Number(observationById.userId),
          dateType:  selectedDate || null,
          startDate: null,
          endDate: null,
        };
        setFiltersChartTwo(filters);
        dispatch(getObservationCountAnalytics(filters));
        setFilterOpen(false);
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{ paddingHorizontal: 15, paddingVertical: 0 }}
        icon="reports_icon"
        title="Observation Report">
          <Modal
          onProceed={() => {}}
          onClose={() => {
            setFilterOneOpen(false);
          }}
          isVisible={filterOneOpen}
          title="Chart 2 filter"
          closeButton
          contentStyle={{width: '100%'}}
          content={<RenderAssignFormModalContenttwo onPressAssign={() => {}} />}
        />
        <View style={{ marginVertical: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RenderProfileIcon
              image={observationById?.userImage}
              name={observationById?.userName?.toString() || ''}
              size={50}
            />
            <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '70%' }}>
                <Text fontVariant="bold" size="body2">
                  {`${observationById?.userName || ''} (${observationById?.userGroup || ''})`}
                </Text>
                <RenderCompleteStatus
                  style={{ marginLeft: 5 }}
                  status={observationById?.observationStatus}
                />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RatingStars rating={Number(observationById?.observationAvgRatings?.toFixed(1))} />
                <View
                  style={{ height: 10, backgroundColor: '#E4E7EB', width: 1, marginHorizontal: 5 }}
                />
                <Text style={{ color: '#4E565F' }} size="small3">
                  {Number(observationById?.observationAvgRatings?.toFixed(1) || '')}/5
                </Text>
              </View>
            </View>
          </View>
        </View>
        {isValidData ? (

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
      setIsModalVisible(true);
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
          <>
             </>
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
    top: 40,
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
});
export default ObservationAnalytics;



