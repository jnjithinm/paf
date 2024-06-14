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
    roleType: string;
    isAdmin: boolean;
    userImage: string;
    status: boolean;
    pageData: {
      ObservationReports: [];
      Courses: [];
    };
  };
}

export const logoutAndclearToken = createAction<void>('LOGOUT_AND_CLEAR_TOKEN');

export const changeBottomTabBarVisibility = createAction<boolean>(
  'CHANGE_BOTTOM_TAB_BAR_VISIBILITY',
);

export const setLoading = createAction<boolean>('SET_LOADING');

export const authenticateUser = createAsyncThunk<
  AuthenticateResponse,
  AuthenticateRequest
>('auth/authenticate', async (payload, {dispatch, rejectWithValue}) => {
  try {
    removeToken();
    const response = await api.post(endPoints.AUTHENTICATE_USER, {
      username: payload.username,
      password: payload.password,
    });
    storeToken(response.data.payload.token)
    return response.data as AuthenticateResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
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
    // finally{
    //   setLoading(false);
    // }
  },
);

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  userData: {
    id: 0,
    userName: '',
    name: '',
    role: '',
    roleId: 0,
    roleType: '',
    isAdmin: false,
    userImage: '',
  },
  isError: false,
  isBottomTabBarVisible: false,
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
      .addCase(authenticateUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        storeToken(action.payload?.payload?.token);
        state.isLoading = true;
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.isError = true;
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.userData = {...state.userData, ...action.payload.payload};
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.isError = true;
      });
  },
});


export default authSlice.reducer;
