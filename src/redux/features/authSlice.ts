import {
  PayloadAction,
  createAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import api from '../../config/axios';
import {
  removeToken,
  storeToken,
} from '../../utils/functions/localStorageOperations';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject} from '../../config/types';
import { ParentRoles, RoleLevelTypes } from '../../config/constants';

interface AuthenticateRequest {
  username: string;
  password: string;
}

interface AuthenticateResponse {
  payload: {
    token: string;
  };
}

interface LoginResponse {
  payload: {
    id: number;
    message: string;
    userName: string;
    name: string;
    role: string;
    roleId: number;
    roleType: ParentRoles;
    isAdmin: boolean;
    userImage: string;
    status: boolean;
    pageData: {
      ObservationReports: [];
      Courses: [];
    };
  };
}

export interface ErrorResponseObject {
  errorCode: string;
  errorMessage: string;
  id: string;
  time: number;
}

export interface ErrorResponse {
  error: ErrorResponseObject;
  status: number;
}


export const logoutAndclearToken = createAction<void>('LOGOUT_AND_CLEAR_TOKEN');

export const changeBottomTabBarVisibility = createAction<boolean>(
  'CHANGE_BOTTOM_TAB_BAR_VISIBILITY',
);

export const setLoading = createAction<boolean>('SET_LOADING');

export const setAuthShowMessage = createAction<ErrorStatusObject | null>(
  'SET_AUTH_SHOW_MESSAGE',
);

export const setErrorMessage = createAction<string>('SET_ERROR_MESSAGE');

export const authenticateUser = createAsyncThunk<
  AuthenticateResponse,
  AuthenticateRequest
>('auth/authenticate', async (payload, {dispatch, rejectWithValue}) => {
  try {
    setLoading(true);
    await removeToken();
    const response = await api.post(endPoints.AUTHENTICATE_USER, {
      username: payload.username,
      password: payload.password,
    });
    await storeToken(response.data.payload.token);
    return response.data as AuthenticateResponse;
  } catch (error: any) {
    console.log('errr', error);
    return rejectWithValue(error.response.data);
  } finally {
    setLoading(true);
    await dispatch(
      loginUser({username: payload.username, password: payload.password}),
    );
  }
});

export const loginUser = createAsyncThunk<LoginResponse, AuthenticateRequest>(
  'auth/login',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post(endPoints.LOGIN_USER, {
        username: payload.username,
        password: payload.password,
      });
      return response.data as LoginResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

interface initialState {
  isLoading: boolean;
  isLoggedIn: boolean;
  userData: {
    id: number;
    userName: string;
    name: string;
    role: string;
    roleId: number;
    roleType: ParentRoles | null;
    isAdmin: boolean;
    userImage: string;
  };
  authShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: initialState = {
  isLoading: false,
  isLoggedIn: false,
  userData: {
    id: 0,
    userName: '',
    name: '',
    role: '',
    roleId: 0,
    roleType: null,
    isAdmin: false,
    userImage: '',
  },
  authShowMessage: null,
  errorMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initateLogout(state) {
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logoutAndclearToken, () => {
        removeToken();
        return initialState;
      })
      .addCase(setLoading, (state, action) => {
        state.isLoading = action.payload;
      })
      .addCase(setAuthShowMessage, (state, action) => {
        state.authShowMessage = action.payload;
      })
      .addCase(setErrorMessage, (state, action) => {
        state.errorMessage = action.payload;
      })
      .addCase(authenticateUser.pending, state => {
        state.isLoading = true;
        state.errorMessage = '';
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        storeToken(action.payload?.payload?.token);
        state.isLoading = true;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.errorMessage = 'Username or password is incorrect';
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.isLoading = false;
        state.errorMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userData =action.payload.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.errorMessage = '';
      });
  },
});

export default authSlice.reducer;
