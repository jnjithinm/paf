import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import Splash from '../screens/auth/Splash';
import Login from '../screens/auth/Login';
import DashboardTabNavigator, { DashboardTabBarStackParamList } from './DashboardTabStack';
import {useAppSelector} from '../redux/store';
import { NavigatorScreenParams } from '@react-navigation/native';
import ResetPassword from '../screens/auth/ResetPassword';
import CreateNewPassword from '../screens/auth/CreateNewPassword';
import SignUp from '../screens/auth/SignUp';
import Notifications from '../screens/dashboard/Notifications';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  ResetPassword:undefined;
  CreateNewPassword:undefined;
  SignUp:undefined;
  DashboardTabStack:  NavigatorScreenParams<DashboardTabBarStackParamList>;
  Notifications:undefined;

};

const MainStack = createStackNavigator<MainStackParamList>();
const customTransition = ({current, layouts}: StackCardInterpolationProps) => {
  return {
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [500, 0],
          }),
        },
      ],
    },
  };
};
const MainStackNavigator = () => {
  const {isLoggedIn} = useAppSelector(state => state.auth);

  if (isLoggedIn) {
    return (
      <MainStack.Navigator
        screenOptions={({route}) => {
          return {
            headerShown: false,
            keyboardHidesTabBar: true,
          };
        }}>
        <MainStack.Screen
          name="DashboardTabStack"
          component={DashboardTabNavigator}
        />
         <MainStack.Screen
          name='Notifications'
          component={Notifications}
        />
      </MainStack.Navigator>
    );
  } else {
    return (
      <MainStack.Navigator
        screenOptions={({route}) => {
          if (route.name !== 'Login') {
            return {
              headerShown: false,
              keyboardHidesTabBar: true,
              cardStyleInterpolator: customTransition,
            };
          } else {
            return {
              headerShown: false,
              keyboardHidesTabBar: true,
            };
          }
        }}>
        <MainStack.Screen name="Splash" component={Splash} />
        <MainStack.Screen name="Login" component={Login} />
        <MainStack.Screen name="ResetPassword" component={ResetPassword} />
        <MainStack.Screen name='CreateNewPassword' component={CreateNewPassword}/>
        <MainStack.Screen name='SignUp' component={SignUp}/>
      </MainStack.Navigator>
    );
  }
};

export default MainStackNavigator;
