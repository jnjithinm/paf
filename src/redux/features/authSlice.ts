import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

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

export const authenticateUser = createAsyncThunk<
  AuthenticateResponse,
  AuthenticateRequest
>('auth/authenticate', async (payload, {dispatch, rejectWithValue}) => {
  try {
    // await removeToken();
    const response = await api.post(endPoints.AUTHENTICATE_USER, {
      username: payload.username,
      password: payload.password,
    });
    dispatch(
      loginUser({username: payload.username, password: payload.password}),
    );

    return response.data as AuthenticateResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const loginUser = createAsyncThunk<LoginResponse, AuthenticateRequest>(
  'auth/login',
  async (payload, {rejectWithValue}) => {
    try {
      const response = await api.post(endPoints.LOGIN_USER, {
        username: payload.username,
        password: payload.password,
      });
      console.log('dsf', response.data);
      return response.data as LoginResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
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
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(authenticateUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.isLoading = true;
        storeToken(action.payload?.payload?.token);
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.isError = true;
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
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

export const {setIsLoading} = authSlice.actions;

export default authSlice.reducer;
