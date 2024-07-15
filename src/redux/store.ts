import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from './reducers';
import {logoutAndclearToken, setAuthShowMessage} from './features/authSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
const tokenMiddleware = (store: any) => (next: any) => (action: any) => {
  // if (action?.type?.endsWith('/rejected')) {
  //   const error = action.payload;
  //   console.log("ERR",error)
  //   if (error?.message === 'Network Error') {
  //     store.dispatch(
  //       setAuthShowMessage({
  //         status: 'Error',
  //         message: 'Network error: Internet might not be available.',
  //       }),
  //     );
  //   } else if (error?.error?.includes('JWT')) {
  //     store.dispatch(
  //       setAuthShowMessage({
  //         status: 'Error',
  //         message: 'Unauthorized access. Logging out user...',
  //       }),
  //     );
  //     store.dispatch(logoutAndclearToken());
  //   } else if (error?.status === 401) {
  //     store.dispatch(
  //       setAuthShowMessage({
  //         status: 'Error',
  //         message: 'Unauthorized access. Logging out user...',
  //       }),
  //     );
  //     store.dispatch(logoutAndclearToken());
  //   } else {
  //     return next(action);
  //   }
  // }

  return next(action);
};

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(tokenMiddleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
