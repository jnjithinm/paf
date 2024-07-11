import {combineReducers} from 'redux';

import authSlice from './features/authSlice';
import observationSlice from './features/observationSlice';
import usersSlice from './features/usersSlice';
import masterSlice from './features/masterSlice';
import rubricSlice from './features/rubricSlice';
import flowsSlice from './features/flowsSlice';
import formsSlice from './features/formsSlice';
import analyticsSlice from './features/analyticsSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  analytics:analyticsSlice,
  flows: flowsSlice,
  forms: formsSlice,
  master: masterSlice,
  observation: observationSlice,
  rubric: rubricSlice,
  users: usersSlice,
});

export default rootReducer;
