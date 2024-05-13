import React, {useEffect, useState} from 'react';
// import RootNavigator from './src/navigation/RootStack';
// import {QueryClientProvider} from 'react-query';
// import {queryClient} from './src/api/reactquery';
// import CombinedProvider from './src/context/index';
import 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootStack';

function App() {
  return <RootNavigator />;
}
export default App;
