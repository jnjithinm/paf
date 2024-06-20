import React, {FC, useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import TextInput from '../../components/TextInput';
import useValidation from '../../utils/hooks/useValidation';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import {View} from 'react-native';
import Image from '../../components/Image';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';

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
      Check your email
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
        text="Open"
        active
        onPress={onPressOpen}
        style={{width: '45%', height: normaliseDesigns(30)}}
      />
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
    </View>
  </View>
);


const ResetPassword: FC<ResetPasswordScreenProps> = ({navigation, route}) => {
  const [email, setEmail] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const {validateField} = useValidation();

  const emailIdErrorMessage = validateField({
    fieldName: 'Email ID',
    value: email,
  });

  const onPressSendButton = () => {
    setIsShowModal(true);
  };

  const onPressOpenEmail=()=>{
    navigation.navigate('CreateNewPassword')
  }

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
            onPressOpen={() => {}}
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
        Enter the email associated with your account and we will send an email
        with instructions to reset your password.
      </Text>
      <TextInput
        label="Email"
        value={email}
        setValue={setEmail}
        errorMessage={emailIdErrorMessage}
        placeholder="Enter email address"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{marginVertical: '10%'}}
      />
      <Button
        style={{width: '100%'}}
        text="Send"
        active={!emailIdErrorMessage}
        onPress={onPressSendButton}
      />
    </Layout>
  );
};
export default ResetPassword;
