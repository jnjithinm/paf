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
import {ParentRoles, UserTypes} from '../../config/constants';
import {getRoleLevel} from '../../components/DrawerContent';

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
    userImage:string;
    userImageUrl: string;
    status: boolean;
    pageData: {
      ObservationReports: [];
      Courses: [];
    };
  };
}

interface ForgotPasswordResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type ForgotPasswordResponsePayload = ForgotPasswordResponse['payload'];

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

export const resetUsernamePasswordErrorMessages = createAction<void>(
  'RESET_USERNAME_PASSWORD_ERROR_MESSAGES',
);

export const resetPasswordResponse = createAction<void>(
  'RESET_PASSWORD_RESPONSE',
);

export const authenticateUser = createAsyncThunk<
  AuthenticateResponse,
  AuthenticateRequest,
  {rejectValue: ErrorResponse}
>('auth/authenticate', async (payload, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    await removeToken();
    const response = await api.post(endPoints.AUTHENTICATE_USER, payload);
    await storeToken(response.data.payload.token);
    return response.data as AuthenticateResponse;
  } catch (error: any) {
    console.log('errr', error);
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(true));
    await dispatch(loginUser(payload));
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  AuthenticateRequest,
  {rejectValue: ErrorResponse}
>('auth/login', async (payload, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post(endPoints.LOGIN_USER, payload);
    return response.data as LoginResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  string,
  {rejectValue: ErrorResponse}
>(
  'auth/forgotPassword',
  async (loggedInUserName, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(
        endPoints.FORGOT_PASSWORD + loggedInUserName,
      );
      return response.data as ForgotPasswordResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
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
    userImage:string;
    userImageUrl: string;
  };
  isAdmin: boolean;
  forgotPasswordResponse: ForgotPasswordResponsePayload | null;
  authShowMessage: ErrorStatusObject | null;
  passwordErrorMessage: string;
  usernameErrorMessage: string;
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
    userImage:'',
    userImageUrl: '',
  },
  isAdmin: false,
  forgotPasswordResponse: null,
  authShowMessage: null,
  passwordErrorMessage: '',
  usernameErrorMessage: '',
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
      .addCase(resetPasswordResponse, state => {
        state.forgotPasswordResponse = null;
      })

      .addCase(setAuthShowMessage, (state, action) => {
        state.authShowMessage = action.payload;
      })
      .addCase(resetUsernamePasswordErrorMessages, (state, action) => {
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(authenticateUser.pending, state => {
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        storeToken(action.payload?.payload?.token);
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        action?.payload?.error?.errorMessage
          ? (state.usernameErrorMessage = 'Invalid username entered')
          : (state.passwordErrorMessage = 'Invalid password entered');
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.isLoading = false;
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userData = action.payload.payload;
        state.isAdmin = Boolean(
          getRoleLevel(action.payload.payload.roleType) === UserTypes.PAF_USER,
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(forgotPassword.pending, state => {
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
        state.forgotPasswordResponse = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordResponse = action.payload.payload;
        state.authShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message?.toString(),
        };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordResponse = null;
        state.authShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      });
  },
});

export default authSlice.reducer;
