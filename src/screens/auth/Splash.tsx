import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {MainStackParamList} from '../../navigation/MainStack';
import StatusBar from '../../components/StatusBar';
import colors from '../../config/colors';
import Icon from '../../components/Icon';

type SplashNavigationProp = StackNavigationProp<MainStackParamList, 'Splash'>;
type SplashRouteProp = RouteProp<MainStackParamList, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashNavigationProp;
  route: SplashRouteProp;
}

const Splash: FC<SplashScreenProps> = ({navigation, route}) => {
  useEffect(() => {
    setTimeout(async () => {
      try {
        navigation.navigate('Login');
      } catch (error) {
        console.log('Error checking user data: ', error);
      }
    }, 2000);
  }, []);

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: colors.backgroundColor,
        padding: 20,
      }}>
      <StatusBar backgroundColor={colors.backgroundColor} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
          backgroundColor: '#FEF8EC',
          borderRadius: 20,
        }}>
        <Icon name="app_logo" />
      </View>
    </View>
  );
};
export default Splash;
