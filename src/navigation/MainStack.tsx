import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Login from '../screens/Login';
import SecurityQuestion from '../screens/SecurityQuestion';
import DashboardTabNavigator from './DashboardTabStack';
import DrawerTabStack from './DrawerTabStack';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  DashboardTabStack: undefined;
  DrawerTabStack:undefined;
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
  // const {isLoggedIn} = useAuthentication();
  // const memoizedIsLoggedIn = useMemo(() => isLoggedIn, [isLoggedIn]);

  if (true) {
    return (
      <MainStack.Navigator
        screenOptions={({route}) => {
          //   if (route.name !== 'DashboardTabStack') {
          //     return {
          //       headerShown: false,
          //       keyboardHidesTabBar: true,
          //       cardStyleInterpolator: customTransition,
          //     };
          //   } else {
          return {
            headerShown: false,
            keyboardHidesTabBar: true,
          };
          //   }
        }}>
        {/* <MainStack.Screen
          name="Splash"
          component={Splash}
        />
         <MainStack.Screen
          name="Login"
          component={Login}
        /> */}

        <MainStack.Screen
          name="DashboardTabStack"
          component={DashboardTabNavigator}
        />
     
      </MainStack.Navigator>
    );
  }
  //  else {
  //   return (
  //     <MainStack.Navigator
  //       screenOptions={({route}) => {
  //         if (route.name !== 'Login') {
  //           return {
  //             headerShown: false,
  //             keyboardHidesTabBar: true,
  //             cardStyleInterpolator: customTransition,
  //           };
  //         } else {
  //           return {
  //             headerShown: false,
  //             keyboardHidesTabBar: true,
  //           };
  //         }
  //       }}>
  //       <MainStack.Screen name="Splash" component={Splash} />
  //       <MainStack.Screen name="Login" component={Login} />
  //       <MainStack.Screen
  //         name="ChangeYourPassword"
  //         component={ChangeYourPassword}
  //       />
  //       <MainStack.Screen name="ForgotPassword" component={ForgotPassword} />
  //       <MainStack.Screen name="PasswordReset" component={PasswordReset} />
  //     </MainStack.Navigator>
  //   );
  // }
};

export default MainStackNavigator;
