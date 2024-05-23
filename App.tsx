import React from 'react';
// import RootNavigator from './src/navigation/RootStack';
// import {QueryClientProvider} from 'react-query';
// import {queryClient} from './src/api/reactquery';
// import CombinedProvider from './src/context/index';
import 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootTabStack';
import {Provider} from 'react-redux';
import store from './src/redux/store';


function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
export default App;
