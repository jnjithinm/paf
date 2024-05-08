import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
// import FlashMessage from 'react-native-flash-message';

import {navigationRef} from '../utils/helpers/navigationHelpers';
import MainStack from './MainStack';
import DrawerTabStack from './DrawerTabStack';
// import FlashMessage from 'react-native-flash-message';

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
      {/* <FlashMessage position="top" /> */}
    </NavigationContainer>
  );
};

export default RootNavigator;
