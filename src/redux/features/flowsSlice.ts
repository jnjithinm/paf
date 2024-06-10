import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';

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

export const getAllFlows = createAsyncThunk<
  GetAllFlowsResponse,
  [string, PaginationRequest]
>(
  'flows/getAllFlows',
  async ([loggedInUserName, payload], {rejectWithValue}) => {
    try {
      const response = await api.post(endPoints.GET_ALL_FLOWS, payload);
      return response.data as GetAllFlowsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getFlowById = createAsyncThunk<
  GetFlowByIdResponse,
  [number, PaginationRequest]
>('flows/getFlowById', async ([flowId, payload], {rejectWithValue}) => {
  try {
    const response = await api.post(endPoints.GET_FLOW_BY_ID + flowId, payload);
    console.log('reee', response.data);
    return response.data as GetFlowByIdResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

interface InitialState {
  allFlows: GetAllFlowsResponsePayload | null;
  flowById: GetFlowByIdResponsePayload | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  allFlows: null,
  flowById: null,
  isLoading: false,
  error: null,
};

const flowsSlice = createSlice({
  name: 'flows',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllFlows.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllFlows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allFlows = {
          ...state.allFlows,
          ...action.payload.payload,
        };
      })
      .addCase(getAllFlows.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getFlowById.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFlowById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.flowById = {
          ...state.flowById,
          ...action.payload.payload,
        };
      })
      .addCase(getFlowById.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default flowsSlice.reducer;
