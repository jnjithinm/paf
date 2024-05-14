import React, {FC, useState} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import LabelDropdown from '../../components/LabelDropdown';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import Text from '../../components/Text';
import Button from '../../components/Button';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import Icon from '../../components/Icon';

type ObservationReportNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'AddNewObservation'
>;
type ObservationReportRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'AddNewObservation'
>;

interface ObservationReportScreenProps {
  navigation: ObservationReportNavigationProp;
  route: ObservationReportRouteProp;
}

type FooterWithButtonsTypes = {
  onPressProceedButton: () => void;
  onPressCancelButton: () => void;
  proceedButtonText?: string;
  cancelButtonText?: string;
  isActiveProceedButton?: boolean;
  style?: ViewStyle;
};

const FooterWithButtons: FC<FooterWithButtonsTypes> = ({
  onPressProceedButton,
  onPressCancelButton,
  isActiveProceedButton = false,
  proceedButtonText = 'Create evidence card',
  cancelButtonText = 'Cancel',
  style,
}) => (
  <View
    style={{
      width: '110%',
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'space-between',
      // height:normaliseDesigns(50),
      // position: 'absolute',
      // bottom: 0,
      backgroundColor: colors.backgroundColor,
      padding: 15,
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 5},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 25,
        },
      }),
      ...style,
    }}>
    <Button
      onPress={onPressProceedButton}
      text={proceedButtonText}
      active={isActiveProceedButton}
      textStyle={{color: '#FFFFFF'}}
      style={{backgroundColor: '#EA7804', height: normaliseDesigns(35)}}
      halfSize
    />
    <Button
      onPress={onPressCancelButton}
      style={{
        borderWidth: 2,
        borderColor: '#EA7804',
        backgroundColor: colors.backgroundColor,
        height: normaliseDesigns(35),
      }}
      active
      text={cancelButtonText}
      textStyle={{color: '#EA7804'}}
      halfSize
    />
  </View>
);

export const tabs: string[] = ['All', 'Active', 'Non-Active'];
export const dropdownData = [
  {label: `What's your pet's name ?`, value: ''},
  {label: `What's your name ?`, value: ''},
  {label: `What's your pet's ?`, value: ''},
];
const AddNewObservation: FC<ObservationReportScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setrubricListData] = useState<any[]>([]);
  const [userGroup, setUserGroup] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [data, setDate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const deleteItem = () => {
    console.log('delete press');
  };

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15, paddingVertical: 0}}
      icon="reports_icon"
      title="New Observation">
      <DateTimePickerComponent
        selectedDate={selectedDate}
        onDateChange={(date: any) => {
          setSelectedDate(date);
          setIsCalendarOpen(false)
        }}
        showPicker={isCalendarOpen}
      />
      <View style={{marginVertical: 20}}>
        <View style={{}}>
          <Text fontVariant="bold" size="small3">
            Select date
          </Text>
          <View>
            <TextInput
              style={{
                width: '100%',
                borderWidth: 1,
                borderColor: '#CBD2D9',
                marginTop: 10,
                borderRadius: 10,
                paddingHorizontal: 10,
              }}
              editable={false}
              placeholder="Select date"
            />
            {/* <Text>Select date</Text> */}
            <TouchableOpacity
              onPress={() => {
                setIsCalendarOpen(!isCalendarOpen);
              }}
              style={{position: 'absolute', top: 27, right: 15}}>
              <Icon name="calendar_icon" />
            </TouchableOpacity>
          </View>
        </View>

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
          style={{
            alignSelf: 'flex-start',
            borderBottomColor: '#CBD2D9',
            borderBottomWidth: 1,
          }}>
          <Text style={{color: '#CBD2D9'}}>+ Add feedback note</Text>
        </TouchableOpacity>

        <FooterWithButtons
          onPressProceedButton={() => {}}
          onPressCancelButton={() => {}}
          style={{marginTop: '95%'}}
        />
      </View>
    </Layout>
  );
};
export default AddNewObservation;

const styles = StyleSheet.create({});
