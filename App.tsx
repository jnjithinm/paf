import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';


function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
export default App;
