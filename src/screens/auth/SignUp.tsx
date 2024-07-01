import React, {FC, useState} from 'react';
import {BackHandler, TouchableOpacity, View} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {MainStackParamList} from '../../navigation/MainStack';
import StatusBar from '../../components/StatusBar';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import TextInput from '../../components/TextInput';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import CheckBox from '../../components/CheckBox';
import Button from '../../components/Button';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {authenticateUser, setErrorMessage} from '../../redux/features/authSlice';
import Layout from '../../components/Layout';
import useValidation from '../../utils/hooks/useValidation';

type SignUpNavigationProp = StackNavigationProp<MainStackParamList, 'SignUp'>;
type SignUpRouteProp = RouteProp<MainStackParamList, 'SignUp'>;

interface SignUpScreenProps {
  navigation: SignUpNavigationProp;
  route: SignUpRouteProp;
}

const SignUp: FC<SignUpScreenProps> = ({navigation, route}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [reEnterPassword,setReEnterPassword]=useState<string>('');
  const [schoolWardName,setSchoolWardName]=useState<string>('');

  const [isRememberMe,setIsRememberMe]=useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {errorMessage}=useAppSelector(state=>state.auth)
  const {validateField} = useValidation();

  const emailErrorMessage = validateField({
    fieldName: 'Email ID',
    value: email,
  });

  const passwordErrorMessage = validateField({
    fieldName: 'Password',
    value: password,
  });

  const onPressSignUp = async () => {
    if (!passwordErrorMessage) {
      // if (isRememberMe && isChanged) {
      //   setIsChanged(false);
      //   await storeUserCredentials(username, password);
      //   await dispatch(authenticateUser({username, password}));
      // } else {
      //   await dispatch(authenticateUser({username, password}));
      // }
    }
  };


  return (
    <Layout
      style={{
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: colors.backgroundColor,
        padding: 20,
      }}
      hideHeader>
      <StatusBar backgroundColor={colors.backgroundColor} />
      <Icon name="app_logo" width={50} height={50} style={{marginTop:5}} />
      <Text size={'body5'} fontVariant="bold" style={{marginVertical:5}}>
        Welcome!
      </Text>
      <Text opacity={'0.75'} size='small3' fontVariant="semiBold">
        Please SignUp to your account.
      </Text>
      <Text color="darkGrey"></Text>
      <View style={{marginTop:5, width: '100%'}}>
        <TextInput
          label="Email"
          value={email}
          setValue={setEmail}
          onChange={() => {
            setErrorMessage('')
          }}
          errorMessage={emailErrorMessage}
          placeholder="Enter your email address"
          keyboardType='email-address'
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          setValue={setPassword}
          onChange={() => {
            setErrorMessage('')
          }}
          errorMessage={passwordErrorMessage ||  errorMessage }
          placeholder="Enter new password"
          passwordVisibility
          style={{marginTop: 10}}
          autoCapitalize="none"
        />
                <TextInput
          label="Re-enter password"
          value={reEnterPassword}
          setValue={setReEnterPassword}
          onChange={() => {
            setErrorMessage('')
          }}
          errorMessage={passwordErrorMessage ||  errorMessage }
          placeholder="Re-enter new password"
          passwordVisibility
          style={{marginTop: 10}}
          autoCapitalize="none"
        />
            <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop:2
            }}>
            <CheckBox
              isActive={isRememberMe}
              onPress={() => {
                isRememberMe ? setIsRememberMe(false) : setIsRememberMe(true);
              }}
              size={10}
              style={{
                height: normaliseDesigns(16),
                width: normaliseDesigns(16),
              }}
            />

            <Text size="small2" style={{left: 3}}>
              Remember me
            </Text>
          </View>
          <TextInput
          label="School ward name"
          value={reEnterPassword}
          setValue={setReEnterPassword}
          onChange={() => {
            setErrorMessage('')
          }}
          errorMessage={passwordErrorMessage ||  errorMessage }
          placeholder="Enter your school ward name"
          style={{marginTop: 10}}
          autoCapitalize="none"
        />

      </View>
      <View style={{width: '100%', marginTop: 20, alignItems: 'center'}}>
        <Button
          style={{width: '100%'}}
          text="Sign Up"
          active={Boolean(!emailErrorMessage && !passwordErrorMessage)}
          onPress={onPressSignUp}
        />
        <View style={{marginVertical: 10}}>
          <Text style={{color: '#ABB4BD', marginVertical: 10}} size="body1">
            Or sign in with social account
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginBottom: 10,
            }}>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#E4E7EB',
              }}>
              <Icon name="google_icon" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 5,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderRadius: 8,
                borderColor: '#E4E7EB',
              }}>
              <Icon name="facebook_icon" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={{color: '#ABB4BD'}} size="body1">
            Already have an account ?
          </Text>
          <TouchableOpacity onPress={()=>{navigation.navigate('Login')}}>
            <Text
              style={{
                textDecorationLine: 'underline',
                fontWeight: '600',
                color: '#1F2933',
                left: 5,
              }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <Text style={{color: '#ABB4BD', marginVertical: 10}} size="body1">
            Can't access your account ?
          </Text>
          <TouchableOpacity>
            <Text
              style={{
                textDecorationLine: 'underline',
                fontWeight: '600',
                color: '#1F2933',
                left: 5,
              }}
              size="body1">
              Click here for help
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};
export default SignUp;
