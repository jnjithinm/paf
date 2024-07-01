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
import CheckBox from '../../components/CheckBox';
import Button from '../../components/Button';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  authenticateUser,
  logoutAndclearToken,
  resetUsernamePasswordErrorMessages,

} from '../../redux/features/authSlice';
import Layout from '../../components/Layout';
import {
  getUserCredentials,
  storeUserCredentials,
} from '../../utils/functions/localStorageOperations';
import useValidation from '../../utils/hooks/useValidation';

type LoginNavigationProp = StackNavigationProp<MainStackParamList, 'Login'>;
type LoginRouteProp = RouteProp<MainStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginNavigationProp;
  route: LoginRouteProp;
}

const Login: FC<LoginScreenProps> = ({navigation, route}) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  const [isShowError,setIsShowError]=useState<boolean>(false);

  const dispatch = useAppDispatch();
  const {usernameErrorMessage,passwordErrorMessage} = useAppSelector(state => state.auth);
  const {validateField} = useValidation();

  const usernameValidationErrorMessage = validateField({
    fieldName: 'Username',
    value: username,
  });

  const passwordValidationErrorMessage = validateField({
    fieldName: 'Password',
    value: password,
  });

  const onPressLogin = async () => {
    if (!usernameErrorMessage && !passwordErrorMessage) {
      setIsShowError(true);
      if (isRememberMe && isChanged) {
        setIsChanged(false);
        await storeUserCredentials(username, password);
        await dispatch(authenticateUser({username, password}));
      } else {
        await dispatch(authenticateUser({username, password}));
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
      dispatch(logoutAndclearToken());
      const getUserDetails = async () => {
        try {
          const data = await getUserCredentials();
          if (data?.username && data?.password) {
            setUsername(data?.username);
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
      <Icon name="app_logo" width={65} height={65} style={{marginTop: '20%'}} />
      <Text size={'body6'} fontVariant="bold" style={{marginVertical: 10}}>
        Welcome!
      </Text>
      <Text opacity={'0.75'} size="body1" fontVariant="semiBold">
        Please login to your account.
      </Text>
      <Text color="darkGrey"></Text>
      <View style={{marginTop: '5%', width: '100%'}}>
        <TextInput
          label="Username"
          value={username}
          setValue={setUsername}
          onChange={() => {
            setIsChanged(true);
            dispatch(resetUsernamePasswordErrorMessages());
          }}
          errorMessage={usernameValidationErrorMessage || usernameErrorMessage}
          placeholder="Enter your username"
          autoCapitalize="none"
        />
        <TextInput
          label="Password"
          value={password}
          setValue={setPassword}
          onChange={() => {
            setIsChanged(true);
            dispatch(resetUsernamePasswordErrorMessages());
          }}
          errorMessage={passwordValidationErrorMessage || passwordErrorMessage}
          placeholder="Enter your password"
          passwordVisibility
          style={{marginTop: 10}}
          autoCapitalize="none"
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
            />

            <Text size="small2" style={{left: 3}}>
              Remember me
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ResetPassword');
            }}>
            <Text size="small2" style={{textDecorationLine: 'underline'}}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{width: '100%', marginTop: '15%', alignItems: 'center'}}>
        <Button
          style={{width: '100%'}}
          text="Log In"
          active={Boolean(!usernameValidationErrorMessage && !passwordValidationErrorMessage)}
          onPress={onPressLogin}
        />
        {/* <View style={{marginVertical: 10}}>
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
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop:'15%'
          }}>
          <Text style={{color: '#ABB4BD'}} size="body1">
            Don't have an account ?
          </Text>
          <TouchableOpacity
          disabled
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            <Text
              style={{
                textDecorationLine: 'underline',
                fontWeight: '600',
                color: '#1F2933',
                left: 5,
              }}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <Text style={{color: '#ABB4BD', marginVertical: 20}} size="body1">
            Can't access your account ?
          </Text>
          <TouchableOpacity disabled>
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
export default Login;
