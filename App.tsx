import React, {

  
} from 'react';
import 'react-native-gesture-handler';
import {Provider, } from 'react-redux';
import {AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';

import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';

function App() {

  return (
    <AutocompleteDropdownContextProvider>
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    </AutocompleteDropdownContextProvider>
  );
}
export default App;
