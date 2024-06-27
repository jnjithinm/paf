import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import Splash from '../screens/auth/Splash';
import Login from '../screens/auth/Login';

import {useAppSelector} from '../redux/store';
import {NavigatorScreenParams} from '@react-navigation/native';
import ResetPassword from '../screens/auth/ResetPassword';
import CreateNewPassword from '../screens/auth/CreateNewPassword';
import SignUp from '../screens/auth/SignUp';
import Notifications from '../screens/dashboard/Notifications';
import ReportsStack, {ReportsTabBarStackParamList} from './ReportsTabStack';
import RubricStack, {RubricTabBarStackParamList} from './RubricTabStack';
import AdminTabStack, {
  AdminTabStackTabBarStackParamList,
} from './AdminTabStack';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import AdminDashboard from '../screens/dashboard/AdminDashboard';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  ResetPassword: undefined;
  CreateNewPassword: undefined;
  SignUp: undefined;
  // DashboardTabStack:  NavigatorScreenParams<DashboardTabBarStackParamList>;
  Notifications: undefined;
  TeacherDashboard: undefined;
  AdminDashboard: undefined;
  ReportsStack: NavigatorScreenParams<ReportsTabBarStackParamList>;
  RubricStack: NavigatorScreenParams<RubricTabBarStackParamList>;
  AdminStack: NavigatorScreenParams<AdminTabStackTabBarStackParamList>;
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
  const {isLoggedIn, isAdmin} = useAppSelector(state => state.auth);
  if (isLoggedIn) {
    return (
      <MainStack.Navigator
        screenOptions={({route}) => {
          return {
            headerShown: false,
            keyboardHidesTabBar: true,
          };
        }}>
        {isAdmin ? (
          <MainStack.Screen name="AdminDashboard" component={AdminDashboard} />
        ) : (
          <MainStack.Screen
            name="TeacherDashboard"
            component={TeacherDashboard}
          />
        )}
        <MainStack.Screen name="ReportsStack" component={ReportsStack} />
        <MainStack.Screen name="RubricStack" component={RubricStack} />
        <MainStack.Screen name="AdminStack" component={AdminTabStack} />
        <MainStack.Screen name="Notifications" component={Notifications} />
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
        <MainStack.Screen
          name="CreateNewPassword"
          component={CreateNewPassword}
        />
        <MainStack.Screen name="SignUp" component={SignUp} />
      </MainStack.Navigator>
    );
  }
};

export default MainStackNavigator;
