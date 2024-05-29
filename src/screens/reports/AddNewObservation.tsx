import React, {FC, useEffect, useState} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import FooterWithButtons from '../../components/FooterWithButtons';
import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import Icon from '../../components/Icon';
import useActive from '../../utils/helpers/useActive';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  getAllUserGroups,
  getAllUsers,
  getUserGroups,
} from '../../redux/features/usersSlice';
import LabeledDropdown, {
  DropdownObject,
} from '../../components/LabeledDropdown';
import { ReportsTabBarStackParamList } from '../../navigation/ReportsTabStack';

type AddNewObservationNavigationProp = StackNavigationProp<
ReportsTabBarStackParamList,
  'AddNewObservation'
>;
type AddNewObservationRouteProp = RouteProp<
ReportsTabBarStackParamList,
  'AddNewObservation'
>;

interface AddNewObservationScreenProps {
  navigation: AddNewObservationNavigationProp;
  route: AddNewObservationRouteProp;
}

export const tabs: string[] = ['All', 'Active', 'Non-Active'];
export const dropdownData = [
  {label: `What's your pet's name ?`, value: `What's your pet's name ?`},
  {label: `What's your name ?`, value: `What's your name ?`},
  {label: `What's your pet's ?`, value: `What's your pet's ?`},
];



const AddNewObservation: FC<AddNewObservationScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedUserGroup, setSelectedUserGroup] = useState<
    DropdownObject | undefined
  >(undefined);
  const [selectedUser, setSelectedUser] = useState<DropdownObject | undefined>(
    undefined,
  );
  const [selectedDate, setSelectedDate] = useState<any>('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackNoteEnable, setFeedbackNoteEnable] = useState<boolean>(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {GetAllUserGroupsData, GetUserGroupData} = useAppSelector(
    state => state.users,
  );
  const activeArray = [selectedDate, selectedUserGroup, selectedUser];

  let isActive: boolean = useActive(activeArray);

  const handleDateSelection = (date: Date) => {
    setIsCalendarOpen(!isCalendarOpen);
    console.log('dsetee', date);
    setSelectedDate(date);
  };

  useEffect(() => {
    // dispatch(
    //   getAllUsers({
    //     page: 0,
    //     size: 15,
    //     type: 'all',
    //   }),
    // );
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (selectedUserGroup?.value) {
      dispatch(
        getUserGroups([
          Number(selectedUserGroup?.value),
          {
            page: 0,
            size: 15,
            type: 'all',
          },
        ]),
      );
    }
  }, [selectedUserGroup?.value]);

  // console.log('date', isActive);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}} // Ensure the component takes up the whole screen
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingVertical: 0}}
        icon="reports_icon"
        title="New Observation">
        <DateTimePickerComponent
          selectedDate={selectedDate}
          onDateChange={handleDateSelection}
          showPicker={isCalendarOpen}
        />

        <View style={{marginVertical: 20, paddingHorizontal: 15}}>
          <TouchableOpacity
            onPress={() => {
              setIsCalendarOpen(!isCalendarOpen);
            }}
            style={{}}>
            <Text fontVariant="bold" size="small3">
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
                }}
                // editable={false}
                // placeholder="Select date"
              >
                <Text
                  style={{color: selectedDate ? colors.blackColor : '#ABB4BD'}}
                  size="body2">
                  {selectedDate
                    ? moment(selectedDate).format('DD-MM-YYYY').toString()
                    : 'Select date'}
                  {/* {selectedDate || 'Select date'} */}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setIsCalendarOpen(!isCalendarOpen);
                  }}
                  style={{}}>
                  <Icon name="calendar_icon" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>

          <LabeledDropdown
            label="Select user group"
            placeHolder="Select user group"
            options={
              GetAllUserGroupsData?.dataList.map(item => ({
                value: item.userGroupId?.toString(),
                label: item.groupName,
              })) || []
            }
            setSelectedItem={setSelectedUserGroup}
            defaultValue={selectedUserGroup?.value || ''}
          />
          <LabeledDropdown
            label="Select user"
            placeHolder="Select user"
            defaultValue={selectedUser?.value || ''}
            options={
              GetUserGroupData?.dataList.map(item => ({
                value: item.userId?.toString(),
                label: item.name,
              })) || []
            }
            setSelectedItem={setSelectedUser}
          />
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#E4E7EB',
              marginVertical: 20,
            }}
          />

          <TouchableOpacity
            onPress={() => {
              setFeedbackNoteEnable(true);
            }}
            disabled={!isActive}
            style={{
              alignSelf: 'flex-start',
              borderBottomColor: isActive ? colors.blackColor : '#CBD2D9',
              borderBottomWidth: 1,
            }}>
            <Text style={{color: isActive ? colors.blackColor : '#CBD2D9'}}>
              + Add feedback note
            </Text>
          </TouchableOpacity>

          {feedbackNoteEnable && (
            <View style={{marginTop: 15}}>
              <TextInput
                label=""
                value={feedbackNote}
                setValue={setFeedbackNote}
                multiline
                maxLength={200}
              />
              <Text
                style={{
                  alignSelf: 'flex-end',
                  fontFamily: FONT_VARIANT.regular,
                  fontSize: FONT_SIZES.small2,
                }}>{`${feedbackNote.length}/200`}</Text>
            </View>
          )}
        </View>
      </Layout>
      <FooterWithButtons
        onPressProceedButton={() => {
          // navigate('NewObservationStack', {screen: 'AddNewEvidenceCard'});
          selectedUserGroup?.value &&
            selectedUser?.value &&
            navigation.navigate('AddNewEvidenceCard', {
              selectedUserGroup: selectedUserGroup,
              selectedUser: selectedUser,
              selectedDate,
            });
        }}
        proceedButtonText={'Create evidence card'}
        isActiveProceedButton={Boolean(
          selectedDate && selectedUserGroup?.value && selectedUser?.value,
        )}
        cancelButtonText={'Cancel'}
        onPressCancelButton={() => {}}
        style={{}}
      />
    </KeyboardAvoidingView>
  );
};
export default AddNewObservation;
