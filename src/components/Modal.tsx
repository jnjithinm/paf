import React, {FC, ReactNode, useState} from 'react';
import {
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import Text from './Text';
import Icon from './Icon';
import colors from '../config/colors';
import moment from 'moment';
import {Dropdown} from 'react-native-element-dropdown';
import { RatingInput } from '../screens/reports/AddNewEvidenceCard';




interface ModalPropsTypes {
  onProceed: () => void;
  onClose: () => void;
  isVisible: boolean;
  title?: string;
  content?: ReactNode;
  Close?: string;
  isOKCancelButtonsNeeded?: boolean;
  closeButton?: boolean;
  renderButton?: ReactNode;
}

const Modal: FC<ModalPropsTypes> = ({
  onProceed,
  onClose,
  isVisible,
  title,
  content,
  isOKCancelButtonsNeeded,
  closeButton,
  renderButton,
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState<
    number | undefined
  >();
  const [selectedStartMonth, setSelectedStartMonth] = useState<
    number | undefined
  >(undefined);
  const [selectedStartYear, setSelectedStartYear] = useState<
    number | undefined
  >(undefined);
  const [selectedEndDate, setSelectedEndDate] = useState<number | undefined>();
  const [selectedEndMonth, setSelectedEndMonth] = useState<number | undefined>(
    undefined,
  );
  const [selectedEndYear, setSelectedEndYear] = useState<number | undefined>(
    undefined,
  );
  const [selectedFilterByDate, setSelectedFilterByDate] = useState<
    string | undefined
  >(undefined);
  const weekdays = moment.weekdays();
  // Map through weekdays to get the first 2 letters of each day
  const shortWeekdays = weekdays.map(day => day.slice(0, 2));

  //   const handleOnChange=(item:any)=>{
  // se
  //   }
  // console.log("see",selectedMonth,selectedYear)
  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {title && (
            <View style={styles.header}>
              <Text
                color="blackColor"
                style={{justifyContent: 'flex-start'}}
                fontVariant='bold'
                size="body2">
                {title}
              </Text>
              {closeButton && (
                <TouchableOpacity onPress={() => onClose()}>
                  <Icon name='cross_icon_thin' width={10} height={10} />
                </TouchableOpacity>
              )}
            </View>
          )}
          <ScrollView contentContainerStyle={styles.contentContainer}>

            {content}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 150,

  },
  modalContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    // width: '80%',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    width:'100%'
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  buttonsContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: 20,
    right: 20,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekday: {
    width: '14.28%',
    textAlign: 'center',
    color: '#ABB4BD',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  day: {
    width: '14.28%',
    textAlign: 'center',
    paddingVertical: 10,
    alignItems: 'center',
  },
});
