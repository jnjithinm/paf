import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import Splash from '../screens/auth/Splash';
import Login from '../screens/auth/Login';
import DashboardTabNavigator from './DashboardTabStack';
import {useAppSelector} from '../redux/store';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  DashboardTabStack: undefined;
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
  const {isLoggedIn} = useAppSelector(state => state.auth);

  if (isLoggedIn) {
    return (
      <MainStack.Navigator
        screenOptions={({route}) => {
          return {
            headerShown: false,
            keyboardHidesTabBar: true,
            tabBarVisible:false,
          };
        }}>
        <MainStack.Screen
          name="DashboardTabStack"
          component={DashboardTabNavigator}
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
      </MainStack.Navigator>
    );
  }
};

export default MainStackNavigator;
