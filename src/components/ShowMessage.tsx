import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {ErrorStatusObject} from '../config/types';
import {FC, useEffect} from 'react';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import Icon from './Icon';
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

const ShowMessage: FC<ShowMessageTypes> = ({style}) => {
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

  return (
    <View
      style={[
        styles.showMessage,
        {
          backgroundColor:
            showMessage.status === 'Failed' ? '#FFEDED' : '#EBF9D9',
          borderColor: showMessage.status === 'Failed' ? '#D62828' : '#749E35',
          borderWidth:1.5,
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
            backgroundColor:
              showMessage.status === 'Failed' ? '#D62828' : '#749E35',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 7,
          }}>
          <Icon
            name={showMessage.status === 'Failed' ? 'cross_icon_white' : 'checkbox'}
            stroke={'white'}
            width={10}
            height={10}
          />
        </View>
        <Text
          style={{
            width: '90%',
            color: showMessage.status === 'Failed' ? '#D62828' : '#749E35',
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

export default ShowMessage;
