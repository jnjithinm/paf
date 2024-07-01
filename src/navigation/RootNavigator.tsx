import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import {navigationRef} from '../utils/helpers/navigationHelpers';
import MainStack from './MainStack';

const RootNavigator = () => {
  const routeNameRef = React.useRef<string | undefined>();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current =
          navigationRef?.current?.getCurrentRoute()?.name || 'DefaultRouteName';
      }}
      >
      <MainStack />
    </NavigationContainer>
  );
};

export default RootNavigator;
