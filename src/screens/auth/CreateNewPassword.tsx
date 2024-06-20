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

type CreateNewPasswordNavigationProp = StackNavigationProp<
  MainStackParamList,
  'CreateNewPassword'
>;
type CreateNewPasswordRouteProp = RouteProp<
  MainStackParamList,
  'CreateNewPassword'
>;

interface CreateNewPasswordScreenProps {
  navigation: CreateNewPasswordNavigationProp;
  route: CreateNewPasswordRouteProp;
}

const CreateNewPassword: FC<CreateNewPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const [password, setPassword] = useState<string>('');
  const [reEnterPassword, setReEnterPassword] = useState<string>('');

  const {validateField} = useValidation();

  const passwordErrorMessage = validateField({
    fieldName: 'Password',
    value: password,
  });

  const onPressResetButton = () => {};

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      icon="reset_password_icon"
      titleTransition>
      <Text
        size="body4"
        fontVariant="bold"
        style={{marginBottom: 10, marginTop: 50}}>
        Create New Password
      </Text>
      <Text style={{color: '#4E565F'}} size="body1">
        Your new password must be different from previous used passwords.
      </Text>
      <TextInput
        label="Password"
        value={password}
        setValue={setPassword}
        errorMessage={passwordErrorMessage}
        placeholder="Enter new password"
        autoCapitalize="none"
        style={{marginVertical: '5%', marginTop: '10%'}}
      />
      <TextInput
        label="Re-enter password"
        value={reEnterPassword}
        setValue={setReEnterPassword}
        errorMessage={
          reEnterPassword === ''
            ? 'Re-enter password is required'
            : password !== reEnterPassword
            ? 'Both passwords must match'
            : ''
        }
        placeholder="Re-enter new password"
        autoCapitalize="none"
        style={{marginBottom: '15%'}}
      />
      <Button
        style={{width: '100%'}}
        text="Reset Password"
        active={Boolean(!passwordErrorMessage && password === reEnterPassword)}
        onPress={onPressResetButton}
      />
    </Layout>
  );
};
export default CreateNewPassword;
