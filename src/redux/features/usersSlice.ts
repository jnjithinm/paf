import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';

interface UserData {
  userId: number;
  userName: string;
  name: string;
  contactNumber: string;
  email: string;
  dateOfBirth: string;
  role: string;
  state: string;
  district: string;
  area: string;
  school: string;
  citizenship: string;
  userType: string;
  status: boolean;
  roleId: number;
  stateId: number;
  districtId: number;
  areaId: number;
  schoolId: number;
  createdDate: string;
}

export interface PaginationRequest {
  page: number;
  size: number;
  type: string;
}

interface GetAllUsersResponse {
  payload: {
    message: string;
    dataList: UserData[];
    totalCount: number;
  };
  status: number;
}
type GetAllUsersResponsePayload = GetAllUsersResponse['payload'];

interface UserGroup {
  userGroupId: number;
  groupName: string;
  createdBy: string;
  creationDate: string;
  groupUsers: number;
  status?: boolean;
}

interface GetAllUserGroupsResponse {
  payload: {
    message: string;
    dataList: UserGroup[];
    totalCount: number;
  };
  status: number;
}
type GetAllUserGroupsResponsePayload = GetAllUserGroupsResponse['payload'];

interface User {
    userId: number;
    userName: string;
    name: string;
    contactNumber: string;
    email: string;
    dateOfBirth: string;
    role: string;
    state: string;
    district: string;
    area: string;
    school: string;
    citizenship: string;
    userType: string;
    status: boolean;
    roleId: number;
    stateId: number;
    districtId: number;
    areaId: number;
    schoolId: number;
    createdDate: string;
  }
  
  interface GetUserGroupResponse {
    payload: {
      message: string;
      dataList: User[];
      totalCount: number;
    };
    status: number;
  }
  type GetUserGroupsResponsePayload = GetUserGroupResponse['payload'];  

export const getAllUsers = createAsyncThunk<
  GetAllUsersResponse,
  PaginationRequest
>('users/getAllUsers', async (payload, {dispatch, rejectWithValue}) => {
  try {
    const response = await api.post(endPoints.GET_ALL_USERS, payload);
    console.log("sdfsd",response.data)
    return response.data as GetAllUsersResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getUser = createAsyncThunk<GetAllUsersResponse, number>(
  'users/getUser',
  async (userId, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post(endPoints.GET_ALL_USERS + userId);
      return response.data as GetAllUsersResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getAllUserGroups = createAsyncThunk<
  GetAllUserGroupsResponse,
  PaginationRequest
>('users/getAllUserGroups', async (payload, {dispatch, rejectWithValue}) => {
  try {
    const response = await api.post(endPoints.GET_ALL_USER_GROUPS, payload);
    return response.data as GetAllUserGroupsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getUserGroups = createAsyncThunk<
GetUserGroupResponse,
  [number, PaginationRequest]
>(
  'users/getUserGroups',
  async ([userGroupId, payload], {dispatch, rejectWithValue}) => {
    try {
      const response = await api.post(
        endPoints.GET_USER_GROUPS + userGroupId,
        payload,
      );
      return response.data as GetUserGroupResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

// export const loginUser = createAsyncThunk<LoginResponse, AuthenticateRequest>(
//   'auth/login',
//   async (payload, {rejectWithValue}) => {

//     try {
//       const response = await api.post(endPoints.LOGIN_USER, {
//         username: payload.username,
//         password: payload.password,
//       });
//       console.log("dsf",response.data)
//       return response.data as LoginResponse;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     }
//   },
// );
interface InitialState {
  GetAllUserGroupsData: GetAllUserGroupsResponsePayload | null;
  GetAllUserData: GetAllUsersResponsePayload | null;
  GetUserGroupData:GetUserGroupsResponsePayload|null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  GetAllUserGroupsData: null,
  GetAllUserData: null,
    GetUserGroupData:null,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllUsers.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.GetAllUserData = {
          ...state.GetAllUserData,
          ...action.payload.payload,
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getAllUserGroups.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllUserGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.GetAllUserGroupsData = {
          ...state.GetAllUserGroupsData,
          ...action.payload.payload,
        };
      })
      .addCase(getAllUserGroups.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getUserGroups.pending, state => {
        state.isLoading = true;
      })
      .addCase(getUserGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.GetUserGroupData = {
          ...state.GetAllUserGroupsData,
          ...action.payload.payload,
        };
      })
      .addCase(getUserGroups.rejected, (state, action) => {
        state.isLoading = false;
      })
  },
});

export default usersSlice.reducer;
