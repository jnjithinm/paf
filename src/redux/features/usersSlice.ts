import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject} from '../../config/types';
import {ErrorResponse} from './authSlice';

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
  userImageUrl: string;
  areaId: number;
  schoolId: number;
  createdDate: string;
}

export type RequestActiveTypes='all'|boolean;

export interface PaginationRequest {
  page: number;
  size: number;
  type: RequestActiveTypes;
  search?: string;
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

interface GetUserResponse {
  payload: User;
  status: number;
}

type GetUserResponsePayload = GetUserResponse['payload'];

export interface UserGroup {
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

export const getAllUsers  = createAsyncThunk<
GetAllUsersResponse,
[PaginationRequest, string?],
{rejectValue: ErrorResponse}
>(
'users/getAllUsers',
async ([payload, searchCriteria], {dispatch, rejectWithValue}) => {
  try {
    let response;
    if(searchCriteria){
      response = await api.post(
        endPoints.GET_USERS_BY_SEARCH + `searchCriteria=${searchCriteria}`,
        payload,
      );
    }else{
      response = await api.post(
        endPoints.GET_ALL_USERS ,
        payload,
      );
    }
    //console.log("response======",response)
    return response.data as GetAllUsersResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
},
);

export const getUser = createAsyncThunk<
  GetUserResponse,
  number,
  {rejectValue: ErrorResponse}
>('users/getUser', async (userId, {dispatch, rejectWithValue}) => {
  try {
    const response = await api.get(endPoints.GET_USER + userId);
    return response.data as GetUserResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});


export const getAllUserGroups = createAsyncThunk<
  GetAllUserGroupsResponse,
[PaginationRequest,string?],
  {rejectValue: ErrorResponse}
>('users/getAllUserGroups', async ([payload,searchCriteria], {dispatch, rejectWithValue}) => {
  try {
    let response;
    if(searchCriteria){
      response = await api.post(
        endPoints.GET_USER_GROUPS_BY_SEARCH + `searchCriteria=${searchCriteria}`,
        payload,
      );
    }else{
      response = await api.post(
        endPoints.GET_ALL_USER_GROUPS ,
        payload,
      );
    }
    return response.data as GetAllUserGroupsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getUserGroup = createAsyncThunk<
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
  [number, number],
  {rejectValue: ErrorResponse}
>(
  'users/getPendingUsersListForSendReminder',
  async ([formId, flowId], {dispatch, rejectWithValue}) => {
    try {
      const response = await api.get(
        endPoints.GET_PENDING_USERS_LIST_FOR_SEND_REMINDER +
          formId +
          `?flowId=${flowId}`,
      );
      return response.data as GetPendingUsersListForSendReminderResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

interface InitialState {
  allUsers: GetAllUsersResponsePayload | null;
  activeUsers: GetAllUsersResponsePayload | null;
  inactiveUsers: GetAllUsersResponsePayload | null;
  user: GetUserResponsePayload | null;
  // searchedUsers: GetAllUsersResponsePayload | null;
  userGroup: GetUserGroupsResponsePayload | null;
  allUserGroups: GetAllUserGroupsResponsePayload | null;
  activeUserGroups: GetAllUserGroupsResponsePayload | null;
  inactiveUserGroups: GetAllUserGroupsResponsePayload | null;
  pendingUsersListForSendReminder: GetPendingUsersListForSendReminderResponsePayload | null;
  usersShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allUsers: null,
  activeUsers: null,
  inactiveUsers: null,
  user: null,
  // searchedUsers: null,
  userGroup: null,
  allUserGroups: null,
  activeUserGroups: null,
  inactiveUserGroups: null,
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
      .addCase(getAllUsers.pending, state => {})
      .addCase(getAllUsers.fulfilled, (state, action) => {
        if (action.meta.arg[0].type === 'all') {
          state.allUsers = action.payload.payload;
        } else if (action.meta.arg[0].type === true) {
          state.activeUsers = action.payload.payload;
        } else {
          state.inactiveUsers = action.payload.payload;
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
        state.user = null;
      })
      .addCase(getUser.pending, state => {
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.usersShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })

      .addCase(getAllUserGroups.pending, state => {
        // state.allUserGroups=null;
        // state.activeUserGroups=null;
        // state.inactiveUserGroups=null;
      })
      .addCase(getAllUserGroups.fulfilled, (state, action) => {
        if (action.meta.arg[0].type === 'all') {
          state.allUserGroups = action.payload.payload;
        } else if (action.meta.arg[0].type === true) {
          state.activeUserGroups = action.payload.payload;
        } else {
          state.inactiveUserGroups = action.payload.payload;
        }
      })
      .addCase(getAllUserGroups.rejected, (state, action) => {
        state.allUserGroups = null;
        state.activeUserGroups = null;
        state.inactiveUserGroups = null;
        state.usersShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(getUserGroup.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getUserGroup.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.userGroup = action.payload.payload;
      })
      .addCase(getUserGroup.rejected, (state, action) => {
        state.usersShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
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
        state.usersShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default usersSlice.reducer;
