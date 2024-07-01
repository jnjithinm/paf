import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';

export interface FlowItem {
  flowId: number;
  flowName: string;
  createdBy: string;
  createdDate: string;
  roleId: number;
  roleName: string;
  roleGroupId: number;
  responses: number;
  status: boolean;
}

interface GetAllFlowsResponse {
  payload: {
    message: string;
    dataList: FlowItem[];
    totalCount: number;
  };
  status: number;
}

type GetAllFlowsResponsePayload = GetAllFlowsResponse['payload'];

export interface FlowDetailItem {
  flowId: number;
  formId: number;
  flowName: string;
  formName: string;
  responses: number;
}

interface GetFlowByIdResponse {
  payload: {
    message: string;
    dataList: FlowDetailItem[];
    totalCount: number;
  };
  status: number;
}

type GetFlowByIdResponsePayload = GetFlowByIdResponse['payload'];

export type SendReminderMethods =
  | 'To All Pending Users'
  | 'By Date'
  | 'By User Groups';

interface sendReminderForm {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type SendReminderToAllPendingUsersResponsePayload =
  sendReminderForm['payload'];

interface AssignFlowRequest {
  userIds: number[];
  userGroupIds: number[];
  id: number;
  loggedInUserName: string;
}

interface AssignFlowResponse {
  payload: {
    message: string;
  };
  status: number;
}

type AssignFlowResponsePayload = AssignFlowResponse['payload'];

export const setFlowsShowMessage = createAction<ErrorStatusObject | null>(
  'SET_FLOWS_SHOW_MESSAGE',
);

export const resetSendReminderToAllPendingUsers = createAction<void>(
  'RESET_SEND_REMINDER_TO_ALL_PENDING_USERS',
);

export const resetAssignFlowResponse = createAction<void>(
  'RESET_ASSIGN_FLOW_RESPONSE',
);

export const getAllFlows = createAsyncThunk<
  GetAllFlowsResponse,
  [string, PaginationRequest],
  {rejectValue: ErrorResponse}
>(
  'flows/getAllFlows',
  async ([loggedInUserName, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.GET_ALL_FLOWS + loggedInUserName,
        payload,
      );
      return response.data as GetAllFlowsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getFlowById = createAsyncThunk<
  GetFlowByIdResponse,
  [number, PaginationRequest],
  {rejectValue: ErrorResponse}
>(
  'flows/getFlowById',
  async ([flowId, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.GET_FLOW_BY_ID + flowId,
        payload,
      );

      return response.data as GetFlowByIdResponse;
    } catch (error: any) {
      console.log(
        'error.response?.data?.message',
        error.response?.data?.message,
      );
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const sendReminderForm = createAsyncThunk<
  sendReminderForm,
  [SendReminderMethods, number, string, string[]?, string?],
  {rejectValue: ErrorResponse}
>(
  'forms/sendReminderForm',
  async (
    [sendReminderMethod, formId, loggedInUserName, userGroupIds, selectedDate],
    {dispatch, rejectWithValue},
  ) => {
    try {
      dispatch(setLoading(true));
      let response;
      const userGroupIdsParam = userGroupIds ? userGroupIds.join(',') : '';
      if (sendReminderMethod === 'To All Pending Users') {
        response = await api.get(
          endPoints.SEND_REMINDER_TO_ALL_PENDING_USERS +
            formId +
            `?loggedInUserName=${loggedInUserName}`,
        );
      } else if (sendReminderMethod === 'By Date') {
        response = await api.put(
          endPoints.SCHEDULE_REMINDER_DATE +
            `formId=${formId}&scheduleDate=${selectedDate}&loggedInUserName=${loggedInUserName}`,
        );
      } else {
        response = await api.get(
          endPoints.SEND_REMINDER_TO_USER_GROUPS +
            formId +
            `?userGroupIds=${userGroupIdsParam}&loggedInUserName=${loggedInUserName}`,
        );
      }
      return response.data as sendReminderForm;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const assignFlowToUsersAndGroups = createAsyncThunk<
  AssignFlowResponse,
  AssignFlowRequest,
  {rejectValue: ErrorResponse}
>(
  'forms/assignFlowToUsersAndGroups',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.put(
        endPoints.ASSIGN_FLOW_TO_USERS_AND_USER_GROUPS,
        payload,
      );
      console.log('re', response.data);
      return response.data as AssignFlowResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

interface InitialState {
  allFlows: GetAllFlowsResponsePayload | null;
  flowById: GetFlowByIdResponsePayload | null;
  sendReminderFormResponse: SendReminderToAllPendingUsersResponsePayload | null;
  assignFlowResponse: AssignFlowResponsePayload | null;
  flowsShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allFlows: null,
  flowById: null,
  sendReminderFormResponse: null,
  assignFlowResponse: null,
  flowsShowMessage: null,
  errorMessage: '',
};

const flowsSlice = createSlice({
  name: 'flows',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setFlowsShowMessage, (state, action) => {
        state.flowsShowMessage = action.payload;
      })
      .addCase(resetAssignFlowResponse, state => {
        state.assignFlowResponse = null;
      })
      .addCase(resetSendReminderToAllPendingUsers, state => {
        state.sendReminderFormResponse = null;
        
      })
      .addCase(getAllFlows.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getAllFlows.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.allFlows = {
          ...state.allFlows,
          ...action.payload.payload,
        };
      })
      .addCase(getAllFlows.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getFlowById.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getFlowById.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.flowById = {
          ...state.flowById,
          ...action.payload.payload,
        };
      })
      .addCase(getFlowById.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(sendReminderForm.pending, state => {
        state.sendReminderFormResponse = null;
      })
      .addCase(sendReminderForm.fulfilled, (state, action) => {
        state.sendReminderFormResponse = action.payload.payload;
      })
      .addCase(sendReminderForm.rejected, (state, action) => {
        state.sendReminderFormResponse = null;
        state.flowsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(assignFlowToUsersAndGroups.pending, state => {
        state.assignFlowResponse = null;
      })
      .addCase(assignFlowToUsersAndGroups.fulfilled, (state, action) => {
        state.assignFlowResponse = action.payload.payload;
      })
      .addCase(assignFlowToUsersAndGroups.rejected, (state, action) => {
        state.flowsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default flowsSlice.reducer;
