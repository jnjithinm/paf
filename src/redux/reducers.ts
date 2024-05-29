import {combineReducers} from 'redux';
import authSlice from './features/authSlice';
import observationSlice from './features/observationSlice';
import usersSlice from './features/usersSlice';
import masterSlice from './features/masterSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  observation: observationSlice,
  users: usersSlice,
  master:masterSlice
});

export default rootReducer;
