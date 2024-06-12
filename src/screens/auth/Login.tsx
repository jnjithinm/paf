import React, {FC, useEffect, useState} from 'react';
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
import {useAppDispatch} from '../../redux/store';
import {authenticateUser} from '../../redux/features/authSlice';
import Layout from '../../components/Layout';
import { getUserCredentials, storeUserCredentials } from '../../utils/functions/localStorageOperations';
import useValidation from '../../utils/hooks/useValidation';

type LoginNavigationProp = StackNavigationProp<MainStackParamList, 'Login'>;
type LoginRouteProp = RouteProp<MainStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginNavigationProp;
  route: LoginRouteProp;
}

const Login: FC<LoginScreenProps> = ({navigation, route}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isChanged,setIsChanged]=useState<boolean>(false);
  const [isShowError,setIsShowError]=useState<boolean>(false);
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const {validateField} = useValidation();

  const emailIdErrorMessage = validateField({
    fieldName: 'Email ID',
    value: email,
  });

  const passwordErrorMessage = validateField({
    fieldName: 'Password',
    value: password,
  });


  const onPressLogin = async() => {

      setIsShowError(true);
      if (!emailIdErrorMessage && !passwordErrorMessage) {
        if (isRememberMe && isChanged) {
          await storeUserCredentials(email, password);
          dispatch(
            // authenticateUser({username: 'teacher.2.373', password: 'Ch1$!r+$1k'}),
            authenticateUser({username: email, password: password}),
          );
        } else {
          dispatch(
            authenticateUser({username: email, password: password}),
          );
        }
      
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      const getUserDetails = async () => {
        try {
          const data = await getUserCredentials();
          console.log("daata",data)
          if (data?.emailId && data?.password) {
            setEmail(data.emailId);
            setPassword(data?.password);
            setIsRememberMe(true);
          }
        } catch (err) {
          console.log('err', err);
        }
      };
      getUserDetails();
    }, []),
  );


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
      <Icon name="app_logo" style={{marginTop: '20%'}} />
      <Text size={'body6'} fontVariant="bold" style={{marginVertical: 10}}>
        Welcome!
      </Text>
      <Text opacity={'0.75'} size="body1" fontVariant="semiBold">
        Please login to your account.
      </Text>
      <Text color="darkGrey"></Text>
      <View style={{marginTop: '5%', width: '100%'}}>
        <TextInput
          label="Email"
          value={email}
          setValue={setEmail}
          onChange={() => {
            setIsShowError(false);
            setIsChanged(true);
          }}
          errorMessage={emailIdErrorMessage}
          isShowError={isShowError}
          placeholder="Enter your email address"
          autoCapitalize='none'
        />
        <TextInput
          label="Password"
          value={password}
          setValue={setPassword}
          onChange={() => {
            setIsShowError(false);
            setIsChanged(true);
          }}
          errorMessage={passwordErrorMessage}
          isShowError={isShowError}
          placeholder="Enter your password"
          secureTextEntry
          style={{marginTop: 10}}
          autoCapitalize='none'
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <CheckBox
              isActive={isRememberMe}
              onPress={() => {
                isRememberMe ? setIsRememberMe(false) : setIsRememberMe(true);
              }}
              size={10}
              style={{
                //   right: 10,
                height: normaliseDesigns(16),
                width: normaliseDesigns(16),
              }}
            />

            <Text size="small2" style={{letterSpacing: 1.2, left: 3}}>
              Remember me
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={{textDecorationLine: 'underline'}}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{width: '100%', marginTop: '10%', alignItems: 'center'}}>
        <Button
          style={{width: '100%'}}
          text="Log In"
          active
          onPress={onPressLogin}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 30,
          }}>
          <Text opacity="0.50">Don't have an account ? </Text>
          <TouchableOpacity>
            <Text style={{textDecorationLine: 'underline', fontWeight: '600'}}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text opacity="0.50">Can't access your account ? </Text>
          <TouchableOpacity>
            <Text style={{textDecorationLine: 'underline', fontWeight: '600'}}>
              Click her for help
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};
export default Login;
