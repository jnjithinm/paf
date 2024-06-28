import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject} from '../../config/types';
import { ErrorResponse } from './authSlice';

export interface User {
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
    dataList: User[];
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


interface GetUserGroupResponse {
  payload: {
    message: string;
    dataList: User[];
    totalCount: number;
  };
  status: number;
}
type GetUserGroupsResponsePayload = GetUserGroupResponse['payload'];

interface PendingUser {
  userId: number;
  userName: string;
  name: string;
}

interface PendingUserGroups {
  userGroupId: number;
  groupName: string;
}
interface GetPendingUsersListForSendReminderResponse {
  payload: {
    message: string;
    dataList: {
      Users: PendingUser[];
      UserGroups: PendingUserGroups[];
    };
  };
  status: number;
}

type GetPendingUsersListForSendReminderResponsePayload =
  GetPendingUsersListForSendReminderResponse['payload'];

export const setUsersShowMessage = createAction<ErrorStatusObject | null>(
  'SET_USERS_SHOW_MESSAGE',
);

export const getAllUsers = createAsyncThunk<
  GetAllUsersResponse,
  PaginationRequest,
  {rejectValue: ErrorResponse}
>('users/getAllUsers', async (payload, {dispatch, rejectWithValue}) => {
  try {
    const response = await api.post(endPoints.GET_ALL_USERS, payload);

    return response.data as GetAllUsersResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getUser = createAsyncThunk<GetAllUsersResponse, number,  {rejectValue: ErrorResponse}>(
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
  PaginationRequest,
  {rejectValue: ErrorResponse}
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
  [number, PaginationRequest],
  {rejectValue: ErrorResponse}
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

export const getPendingUsersListForSendReminder = createAsyncThunk<
  GetPendingUsersListForSendReminderResponse,
  number,
  {rejectValue: ErrorResponse}
>(
  'users/getPendingUsersListForSendReminder',
  async (formId, {dispatch, rejectWithValue}) => {
    try {
      const response = await api.get(
        endPoints.GET_PENDING_USERS_LIST_FOR_SEND_REMINDER + 77,
      );
      return response.data as GetPendingUsersListForSendReminderResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

interface InitialState {
  GetAllUserGroupsData: GetAllUserGroupsResponsePayload | null;
  GetAllUserData: GetAllUsersResponsePayload | null;
  GetUserGroupData: GetUserGroupsResponsePayload | null;
  pendingUsersListForSendReminder: GetPendingUsersListForSendReminderResponsePayload | null;
  usersShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  GetAllUserGroupsData: null,
  GetAllUserData: null,
  GetUserGroupData: null,
  pendingUsersListForSendReminder: null,
  usersShowMessage: null,
  errorMessage: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setUsersShowMessage, (state, action) => {
        state.usersShowMessage = action.payload;
      })
      .addCase(getAllUsers.pending, state => {

      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.GetAllUserData = {
          ...state.GetAllUserData,
          ...action.payload.payload,
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getAllUserGroups.pending, state => {

      })
      .addCase(getAllUserGroups.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.GetAllUserGroupsData = {
          ...state.GetAllUserGroupsData,
          ...action.payload.payload,
        };
      })
      .addCase(getAllUserGroups.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getUserGroups.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getUserGroups.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.GetUserGroupData = {
          ...state.GetAllUserGroupsData,
          ...action.payload.payload,
        };
      })
      .addCase(getUserGroups.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getPendingUsersListForSendReminder.pending, state => {
        state.pendingUsersListForSendReminder = null;
      })
      .addCase(
        getPendingUsersListForSendReminder.fulfilled,
        (state, action) => {
          state.pendingUsersListForSendReminder = action.payload.payload;
        },
      )
      .addCase(getPendingUsersListForSendReminder.rejected, (state, action) => {
        state.pendingUsersListForSendReminder = null;
      });
  },
});

export default usersSlice.reducer;
