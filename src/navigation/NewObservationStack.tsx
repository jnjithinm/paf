import React, {useMemo} from 'react';
import {
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';

import AddNewObservation from '../screens/newObservation/AddNewObservation';
import AddNewObservation2 from '../screens/newObservation/AddNewObservation2';


export type NewObservationStackParamList = {
  AddNewObservation:undefined;
  AddNewObservation2:undefined;
};

const NewObservationStack = createStackNavigator<NewObservationStackParamList>();
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
const NewObservationStackNavigator = () => {
  // const {isLoggedIn} = useAuthentication();
  // const memoizedIsLoggedIn = useMemo(() => isLoggedIn, [isLoggedIn]);
 
    return (
      <NewObservationStack.Navigator
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



      {/* <NewObservationStack.Screen
        name="AddNewObservation"
        component={AddNewObservation}
      /> */}
          <NewObservationStack.Screen
        name="AddNewObservation2"
        component={AddNewObservation2}
      />
     
      </NewObservationStack.Navigator>
    );
  
};

export default NewObservationStackNavigator;
