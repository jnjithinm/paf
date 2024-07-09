import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigatorScreenParams} from '@react-navigation/native';

import Splash from '../screens/auth/Splash';
import Login from '../screens/auth/Login';
import {useAppSelector} from '../redux/store';
import ResetPassword from '../screens/auth/ResetPassword';
import CreateNewPassword from '../screens/auth/CreateNewPassword';
import SignUp from '../screens/auth/SignUp';
import Notifications from '../screens/dashboard/Notifications';
import ObservationStack, {ObservationStackParamList} from './ObservationStack';
import RubricStack, {RubricStackParamList} from './RubricStack';
import {FlowsAndFormsStackParamList} from './FlowsAndFormsStack';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';
import AdminDashboard from '../screens/dashboard/AdminDashboard';
import UserManagementStack, {
  UserManagementStackParamList,
} from './UserManagementStack';
import FlowsAndFormsStack from './FlowsAndFormsStack';
import LocationManagementStack, {
  LocationManagementStackParamList,
} from './LocationManagementStack';
import MyAccount from '../screens/dashboard/MyAccount';
import FAQ from '../screens/dashboard/FAQ';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  ResetPassword: undefined;
  CreateNewPassword: undefined;
  SignUp: undefined;
  Notifications: undefined;
  TeacherDashboard: undefined;
  AdminDashboard: undefined;
  MyAccount: undefined;
  FAQ:undefined;
  ObservationStack: NavigatorScreenParams<ObservationStackParamList>;
  RubricStack: NavigatorScreenParams<RubricStackParamList>;
  FlowsAndFormsStack: NavigatorScreenParams<FlowsAndFormsStackParamList>;
  UserManagementStack: NavigatorScreenParams<UserManagementStackParamList>;
  LocationManagementStack: NavigatorScreenParams<LocationManagementStackParamList>;
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
        <MainStack.Screen name="MyAccount" component={MyAccount} />
        <MainStack.Screen name="Notifications" component={Notifications} />
        <MainStack.Screen name="FAQ" component={FAQ} />
        <MainStack.Screen
          name="ObservationStack"
          component={ObservationStack}
        />
        <MainStack.Screen name="RubricStack" component={RubricStack} />
        <MainStack.Screen
          name="FlowsAndFormsStack"
          component={FlowsAndFormsStack}
        />
        <MainStack.Screen
          name="UserManagementStack"
          component={UserManagementStack}
        />
        <MainStack.Screen
          name="LocationManagementStack"
          component={LocationManagementStack}
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
