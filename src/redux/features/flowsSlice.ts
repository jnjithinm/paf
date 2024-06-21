import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import { setLoading } from './authSlice';
import { ErrorStatusObject } from '../../config/types';

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
  async ([loggedInUserName, payload], {dispatch,rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endPoints.GET_ALL_FLOWS+loggedInUserName, payload);
      return response.data as GetAllFlowsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally{
      dispatch(setLoading(false));
    }
  },
);

export const getFlowById = createAsyncThunk<
  GetFlowByIdResponse,
  [number, PaginationRequest]
>('flows/getFlowById', async ([flowId, payload], {dispatch,rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post(endPoints.GET_FLOW_BY_ID + flowId, payload);
    return response.data as GetFlowByIdResponse;
  } catch (error: any) {
    console.log("error.response?.data?.message",error.response?.data?.message)
    return rejectWithValue(error.response.data);
  } finally{
    dispatch(setLoading(false));
  }
});

interface InitialState {
  allFlows: GetAllFlowsResponsePayload | null;
  flowById: GetFlowByIdResponsePayload | null;
  showMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allFlows: null,
  flowById: null,
  // isLoading: false,
  showMessage: null,
  errorMessage:''
};

const flowsSlice = createSlice({
  name: 'flows',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
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
      });
  },
});

export default flowsSlice.reducer;
