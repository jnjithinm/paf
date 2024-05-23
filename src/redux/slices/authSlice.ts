import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import api from '../../config/axios';

interface LoginRequestPayload {
  employeeId: string;
  password: string;
}

interface LoginResponsePayload {
  afxToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const loginUser = createAsyncThunk<
  LoginResponsePayload,
  LoginRequestPayload
>('PAF/login', async (payload, {rejectWithValue}) => {
  try {
    const response = await api.post('authdemograph/auth/login', {
      employeeId: payload.employeeId,
      password: payload.password,
    });
    console.log('res', response.data);
    return response.data as LoginResponsePayload;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  afxToken: '',
  authData: {
    jwtToken: '',
    role: '',
    email: '',
    mobileNo: '',
    fullName: '',
    userId: 0,
  },
  isError: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.authData = {...state.authData, ...action.payload.user};
        state.afxToken = action.payload.afxToken;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.isError = true;
      });
      
  },
});

export default authSlice.reducer;
