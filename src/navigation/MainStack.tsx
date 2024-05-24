import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import Splash from '../screens/auth/Splash';
import Login from '../screens/auth/Login';
import SecurityQuestion from '../screens/SecurityQuestion';
import DashboardTabNavigator from './DashboardTabStack';
import RubricBMCTeacherEvaluation from '../screens/rubric/RubricBMCTeacherEvaluationIndicatorList';
import NewObservationStack from './NewObservationStack';
import {useAppSelector} from '../redux/store';

export type MainStackParamList = {
  Splash: undefined;
  Login: undefined;
  DashboardTabStack: undefined;
  NewObservationStack: undefined;
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
        <MainStack.Screen
          name="DashboardTabStack"
          component={DashboardTabNavigator}
        />
        <MainStack.Screen
          name="NewObservationStack"
          component={NewObservationStack}
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
