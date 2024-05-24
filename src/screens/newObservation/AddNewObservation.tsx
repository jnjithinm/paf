import React, {FC, useState} from 'react';
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
import LabelDropdown from '../../components/LabelDropdown';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import Icon from '../../components/Icon';
import {navigate} from '../../utils/helpers/navigationHelpers';
import {NewObservationStackParamList} from '../../navigation/NewObservationStack';
import useActive from '../../utils/helpers/useActive';

type AddNewObservationNavigationProp = StackNavigationProp<
  NewObservationStackParamList,
  'AddNewObservation'
>;
type AddNewObservationRouteProp = RouteProp<
  NewObservationStackParamList,
  'AddNewObservation'
>;

interface AddNewObservationScreenProps {
  navigation: AddNewObservationNavigationProp;
  route: AddNewObservationRouteProp;
}

type FooterWithButtonsTypes = {
  onPressProceedButton: () => void;
  onPressCancelButton: () => void;
  proceedButtonText?: string;
  cancelButtonText?: string;
  isActiveProceedButton?: boolean;
  style?: ViewStyle;
};

// export const FooterWithButtons: FC<FooterWithButtonsTypes> = ({
//   onPressProceedButton,
//   onPressCancelButton,
//   isActiveProceedButton = false,
//   proceedButtonText = 'Create evidence card',
//   cancelButtonText = 'Cancel',
//   style,
// }) => (
//   <View
//     style={{
//       width: '110%',
//       flexDirection: 'row',
//       alignItems: 'center',
//       alignSelf: 'center',
//       justifyContent: 'space-between',
//       // height:normaliseDesigns(50),
//       // position: 'absolute',
//       // bottom: 0,
//       backgroundColor: colors.backgroundColor,
//       padding: 15,
//       ...Platform.select({
//         ios: {
//           shadowColor: 'black',
//           shadowOffset: {width: 0, height: 5},
//           shadowOpacity: 0.3,
//           shadowRadius: 4,
//         },
//         android: {
//           elevation: 25,
//         },
//       }),
//       ...style,
//     }}>
//     <Button
//       onPress={onPressProceedButton}
//       text={proceedButtonText}
//       active={isActiveProceedButton}
//       textStyle={{color: '#FFFFFF'}}
//       style={{backgroundColor: '#EA7804', height: normaliseDesigns(35)}}
//       halfSize
//     />
//     <Button
//       onPress={onPressCancelButton}
//       style={{
//         borderWidth: 2,
//         borderColor: '#EA7804',
//         backgroundColor: colors.backgroundColor,
//         height: normaliseDesigns(35),
//       }}
//       active
//       text={cancelButtonText}
//       textStyle={{color: '#EA7804'}}
//       halfSize
//     />
//   </View>
// );

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
  const [userGroup, setUserGroup] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<any>('');
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackNoteEnable, setFeedbackNoteEnable] = useState<boolean>(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const activeArray = [selectedDate, userGroup, user];

  let isActive: boolean = useActive(activeArray);

  const handleDateSelection = (date: Date) => {
    setIsCalendarOpen(!isCalendarOpen);
    console.log('dsetee', date);
    setSelectedDate(date);
  };

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

          <LabelDropdown
            label="Select user group"
            placeHolder="Select user group"
            options={dropdownData}
            setSelectedOption={setUserGroup}
            defaultValue={userGroup}
            bottom
          />
          <LabelDropdown
            label="Select user"
            placeHolder="Select user"
            defaultValue={user}
            options={dropdownData}
            setSelectedOption={setUser}
            bottom
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
          navigate('NewObservationStack', {screen: 'AddNewEvidenceCard'});
        }}
        proceedButtonText={'Create evidence card'}
        image="edit_icon"
        isActiveProceedButton={isActive}
        cancelButtonText={'Cancel'}
        onPressCancelButton={() => {}}
        style={{}}
      />
    </KeyboardAvoidingView>
  );
};
export default AddNewObservation;
