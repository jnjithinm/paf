import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../navigation/MainStack';
import StatusBar from '../components/StatusBar';
import colors from '../config/colors';
import Icon from '../components/Icon';
import Text from '../components/Text';
import TextInput from '../components/TextInput';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import CheckBox from '../components/CheckBox';
import Button from '../components/Button';

type LoginNavigationProp = StackNavigationProp<MainStackParamList, 'Login'>;
type LoginRouteProp = RouteProp<MainStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginNavigationProp;
  route: LoginRouteProp;
}

const Login: FC<LoginScreenProps> = ({navigation, route}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isRememberMe, setIsRememberMe] = useState<boolean>(false);
  //   useEffect(() => {
  //     setTimeout(async () => {
  //       try {
  //       navigation.navigate('Login')
  //       } catch (error) {
  //         console.log('Error checking user data: ', error);
  //       }
  //     }, 2000);
  //   }, []);

  return (
    <View
      style={{
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: colors.backgroundColor,
        padding: 20,
      }}>
      <StatusBar backgroundColor={colors.backgroundColor} />

      <Icon name="app_logo" style={{marginTop: '20%'}} />
      <Text size={'body6'} fontVariant="bold" style={{marginVertical: 10}}>
        Welcome!
      </Text>
      <Text opacity={'0.75'} size="body1" fontVariant="semiBold">
        Please login to your account.
      </Text>
      <View style={{marginTop: '5%', width: '100%'}}>
        <TextInput
          label="Email"
          value={email}
          setValue={setEmail}
          placeholder="Enter your email address"
        />
        <TextInput
          label="Password"
          value={password}
          setValue={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={{marginTop: 10}}
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
            <Text style={{textDecorationLine: 'underline',}}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{width:'100%',marginTop:'10%',alignItems:'center'}}>
        <Button style={{width:'100%'}} text='Log In' active onPress={()=>{}}/>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:15,marginTop:30}}>
            <Text opacity='0.50'>Don't have an account ? </Text>
            <TouchableOpacity>
                <Text style={{textDecorationLine: 'underline',fontWeight:'600'}}>Sign up</Text>
            </TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text opacity='0.50'>Can't access your account ? </Text>
            <TouchableOpacity>
                <Text style={{textDecorationLine: 'underline',fontWeight:'600'}}>Click her for help</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default Login;
