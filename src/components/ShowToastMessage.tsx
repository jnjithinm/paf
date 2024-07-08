import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ErrorStatus, ErrorStatusObject} from '../config/types';
import {FC, useEffect} from 'react';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import Icon, {IconTypes} from './Icon';
import Text from './Text';
import {setUsersShowMessage} from '../redux/features/usersSlice';
import {setRubricShowMessage} from '../redux/features/rubricSlice';
import {setObservationShowMessage} from '../redux/features/observationSlice';
import {setMasterShowMessage} from '../redux/features/masterSlice';
import {setFormsShowMessage} from '../redux/features/formsSlice';
import {setAuthShowMessage} from '../redux/features/authSlice';
import {setFlowsShowMessage} from '../redux/features/flowsSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {commonErrorMessage} from '../config/constants';

export interface ShowMessageTypes {
  style?: ViewStyle;
}

const ShowToastMessage: FC<ShowMessageTypes> = ({style}) => {
  const dispatch = useAppDispatch();

  const {authShowMessage} = useAppSelector(state => state.auth);
  const {flowsShowMessage} = useAppSelector(state => state.flows);
  const {formsShowMessage} = useAppSelector(state => state.forms);
  const {masterShowMessage} = useAppSelector(state => state.master);
  const {observationShowMessage} = useAppSelector(state => state.observation);
  const {rubricShowMessage} = useAppSelector(state => state.rubric);
  const {usersShowMessage} = useAppSelector(state => state.users);

  const showMessage =
    authShowMessage ||
    flowsShowMessage ||
    formsShowMessage ||
    masterShowMessage ||
    observationShowMessage ||
    rubricShowMessage ||
    usersShowMessage ||
    null;

  const resetShowMessage = (showMessage: ErrorStatusObject) => {
    switch (showMessage) {
      case authShowMessage:
        dispatch(setAuthShowMessage(null));
        break;
      case flowsShowMessage:
        dispatch(setFlowsShowMessage(null));
        break;
      case formsShowMessage:
        dispatch(setFormsShowMessage(null));
        break;
      case masterShowMessage:
        dispatch(setMasterShowMessage(null));
        break;
      case observationShowMessage:
        dispatch(setObservationShowMessage(null));
        break;
      case rubricShowMessage:
        dispatch(setRubricShowMessage(null));
        break;
      case usersShowMessage:
        dispatch(setUsersShowMessage(null));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        resetShowMessage(showMessage);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  if (!showMessage) {
    return null;
  }

  const onCloseShowMessage = () => {
    resetShowMessage(showMessage);
  };

  const selectColor = (
    status: ErrorStatus,
  ): {textColor: string; backgroundColor: string; icon: IconTypes} => {
    let textColor, backgroundColor, icon: IconTypes;
    switch (status) {
      case 'Success':
        textColor = '#749E35';
        backgroundColor = '#EBF9D9';
        icon = 'checkbox';
        break;
      case 'Informative':
        textColor = '#2F68C4';
        backgroundColor = '#EAF1FE';
        icon = 'informative_message_icon';
        break;
      case 'Warning':
        textColor = '#EA7804';
        backgroundColor = '#FDF0E3';
        icon = 'toast_message_warning_icon';
        break;
      case 'Error':
        textColor = '#D62828';
        backgroundColor = '#FFEDED';
        icon = 'cross_icon_white';
        break;
      default:
        textColor = '#D62828';
        backgroundColor = '#FFEDED';
        icon = 'cross_icon_white';
        break;
    }
    return {textColor, backgroundColor, icon};
  };

  const {textColor, backgroundColor, icon} = selectColor(showMessage.status);

  return (
    <View
      style={[
        styles.showMessage,
        {
          backgroundColor,
          borderColor: textColor,
          borderWidth: 1.5,
          paddingVertical: 4,
          ...style,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '95%',
        }}>
        <View
          style={{
            padding: 9,
            backgroundColor:textColor,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 7,
          }}>
          <Icon name={icon} stroke={'white'} width={ 10} height={10} />
        </View>
        <Text
          style={{
            width: '90%',
            color: textColor,
          }}
          size="small3">
          {showMessage.message || commonErrorMessage}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          width: '15%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
        onPress={onCloseShowMessage}>
        <Icon name={'cross_icon_thin'} width={10} height={10} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  showMessage: {
    position: 'absolute',
    marginHorizontal: '3%',
    flexDirection: 'row',
    borderWidth: 1.5,
    zIndex: 10,
    width: '95%',
    minHeight: normaliseDesigns(40),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 10,
    top: 7,
  },
});

export default ShowToastMessage;
