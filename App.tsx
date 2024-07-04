import React from 'react';
import 'react-native-gesture-handler';
import {Provider} from 'react-redux';

import RootNavigator from './src/navigation/RootNavigator';
import store from './src/redux/store';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';


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
