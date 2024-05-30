import {combineReducers} from 'redux';
import authSlice from './features/authSlice';
import observationSlice from './features/observationSlice';
import usersSlice from './features/usersSlice';
import masterSlice from './features/masterSlice';
import rubricSlice from './features/rubricSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  observation: observationSlice,
  users: usersSlice,
  master:masterSlice,
  rubric:rubricSlice
});

export default rootReducer;
