import React, {FC, useEffect, useState} from 'react';
import {
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  View,
  TextInput as RNTextInput,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import FooterWithButtons from '../../components/FooterWithButtons';
import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import Icon from '../../components/Icon';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getAllUserGroups, getUserGroups} from '../../redux/features/usersSlice';
import LabeledDropdown from '../../components/LabeledDropdown';
import {ItemType} from '../../config/types';
import {saveNewObservation} from '../../redux/features/observationSlice';
import { ObservationStackParamList } from '../../navigation/ObservationStack';

type AddNewObservationNavigationProp = StackNavigationProp<
  ObservationStackParamList,
  'AddNewObservation'
>;
type AddNewObservationRouteProp = RouteProp<
ObservationStackParamList,
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
    ItemType | undefined
  >(undefined);
  const [selectedUser, setSelectedUser] = useState<ItemType | undefined>(
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

  const handleDateSelection = (date: string) => {
    setIsCalendarOpen(!isCalendarOpen);

    setSelectedDate(date);
  };

  useEffect(() => {
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

  const onPressSaveAsDraft = () => {};

  let isActive = Boolean(selectedDate && selectedUserGroup && selectedUser);

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
                }}
                // editable={false}
                // placeholder="Select date"
              >
                <Text
                  style={{color: selectedDate ? colors.blackColor : '#ABB4BD'}}
                  size="body1">
                  {selectedDate
                    ? moment(selectedDate).format('DD-MM-YYYY').toString()
                    : 'Select date'}
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
            disabled={Boolean()}
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
              <RNTextInput
                value={feedbackNote}
                onChangeText={text => {
                  setFeedbackNote(text);
                }}
                style={{
                  height: normaliseDesigns(40),
                  borderWidth: 1,
                  borderColor: '#CBD2D9',
                  borderRadius:10,
                  color:colors.blackColor,
                  paddingHorizontal:5
                }}
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
          if (selectedDate && selectedUser && selectedUserGroup) {
            dispatch(
              saveNewObservation({
                selectedDate,
                selectedUser,
                selectedUserGroup,
              }),
            );
            navigation.navigate('CreateViewEvidenceCard', {
              observationStatus: 'New',
            });
          }
        }}
        proceedButtonText={'Create evidence card'}
        isActiveProceedButton={isActive}
        isActiveCancelButton={false}
        cancelButtonText={'Save as draft'}
        onPressCancelButton={() => {}}
        style={{}}
      />
    </KeyboardAvoidingView>
  );
};
export default AddNewObservation;
