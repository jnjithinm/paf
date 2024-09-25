import React, {FC, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import TextInput from '../../components/TextInput';
import useValidation from '../../utils/hooks/useValidation';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Image from '../../components/Image';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  forgotPassword,
  resetPasswordResponse,
} from '../../redux/features/authSlice';
import {openEmailApp} from '../../utils/functions/linkingUtils';

type ResetPasswordNavigationProp = StackNavigationProp<
  MainStackParamList,
  'ResetPassword'
>;
type ResetPasswordRouteProp = RouteProp<MainStackParamList, 'ResetPassword'>;

interface ResetPasswordScreenProps {
  navigation: ResetPasswordNavigationProp;
  route: ResetPasswordRouteProp;
}

type RenderConfirmEmailModalTypes = {
  onPressOpen: () => void;
  onPressCancel: () => void;
};
const RenderConfirmEmailModal: FC<RenderConfirmEmailModalTypes> = ({
  onPressOpen,
  onPressCancel,
}) => (
  <View
    style={{justifyContent: 'center', alignItems: 'center', marginTop: -15}}>
    <Image name="email_icon" />
    <Text fontVariant="bold" style={{marginVertical: 10}}>
      Check your Email
    </Text>
    <Text style={{textAlign: 'center'}} size="small3">
      We have sent a password recover instructions to your email.
    </Text>
    <View
      style={{
        flexDirection: 'row',
        marginTop: 15,
        marginBottom: 10,
        justifyContent: 'space-evenly',
        width: '100%',
      }}>
      <Button
        text="Cancel"
        active
        onPress={onPressCancel}
        textStyle={{color: '#EA7804'}}
        style={{
          width: '45%',
          height: normaliseDesigns(30),
          backgroundColor: colors.backgroundColor,
          borderWidth: 1,
          borderColor: '#EA7804',
        }}
      />
        <Button
        text="Open"
        active
        onPress={onPressOpen}
        style={{width: '45%', height: normaliseDesigns(30)}}
      />
    </View>
  </View>
);

const ResetPassword: FC<ResetPasswordScreenProps> = ({navigation, route}) => {
  const [username, setUsername] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const {forgotPasswordResponse} = useAppSelector(state => state.auth);

  const {validateField} = useValidation();

  const usernameErrorMessage = validateField({
    fieldName: 'Username',
    value: username,
  });

  const onPressSendButton = () => {
    dispatch(forgotPassword(username));
  };

  useEffect(() => {
    if (forgotPasswordResponse) {
      setIsShowModal(true);
      dispatch(resetPasswordResponse());
    }
  }, [forgotPasswordResponse]);

  const onPressOpenEmail = () => {
    openEmailApp();
    setIsShowModal(false);
    navigation.navigate('Login');
  };

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      icon="reset_password_icon"
      titleTransition>
      <Modal
        onProceed={() => {}}
        onClose={() => {
          setIsShowModal(false);
        }}
        closeButton
        content={
          <RenderConfirmEmailModal
            onPressOpen={onPressOpenEmail}
            onPressCancel={() => {
              setIsShowModal(false);
            }}
          />
        }
        isVisible={isShowModal}
        containerStyle={{justifyContent: 'center'}}
        contentStyle={{width: '70%'}}
      />
      <Text
        size="body4"
        fontVariant="bold"
        style={{marginBottom: 10, marginTop: 50}}>
        Reset Password
      </Text>
      <Text style={{color: '#4E565F'}} size="body1">
        Enter the username and we will send an email to the associated with your
        account with instructions to reset your password.
      </Text>
      <TextInput
        label="Username"
        value={username}
        setValue={setUsername}
        errorMessage={usernameErrorMessage}
        
        
        placeholder="Enter your username"
        autoCapitalize="none"
        style={{marginVertical: '10%',alignSelf:"center",justifyContent:"center"}}
      />
      <Button
        style={{width: '100%'}}
        text="Send"
        active={!usernameErrorMessage}
        onPress={onPressSendButton}
      />
    </Layout>
  );
};
export default ResetPassword;
