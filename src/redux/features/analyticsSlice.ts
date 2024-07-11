import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';

//   interface UserAnalyticsCount
interface GetUserCountAnalyticsRequest {
  userStatusType: string;
  dateType: string;
  startDate: string;
  endDate: string;
}

interface GetUserCountAnalyticsResponse {
  payload: {
    message: string;
    dataList: {
      totalUserCount: number[];
      userCount: Array<[string, string | number]>;
      totalUserGroupCount: number[];
      totalRoleCount: number[];
    };
  };
  status: number;
}

type GetUserCountAnalyticsResponsePayload =
  GetUserCountAnalyticsResponse['payload'];

interface GetFormCountAnalyticsRequest {
  dateType: 'selected_date';
  startDate: string;
  endDate: string;
}

interface GetFormCountAnalyticsResponse {
  payload: {
    dataList: {
      totalResponseAverageTime: number[];
      formAnalytics: Array<[string, string, string, string]>;
      totalFormCount: number[];
      totalResponseCount: number[];
    };
  };
  status: number;
}

type GetFormCountAnalyticsResponsePayload =
GetFormCountAnalyticsResponse['payload'];

export const getUserCountAnalytics = createAsyncThunk<
  GetUserCountAnalyticsResponse,
  GetUserCountAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getUserCountAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endPoints.USER_COUNT_ANAYTICS, payload);
      return response.data as GetUserCountAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getFormCountAnalytics = createAsyncThunk<
  GetFormCountAnalyticsResponse,
  GetFormCountAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getFormCountAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endPoints.GET_FORM_COUNT_ANALYTICS, payload);
      return response.data as GetFormCountAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

interface InitialState {
  userCountAnalytics: GetUserCountAnalyticsResponsePayload | null;
  formCountAnalytics:GetFormCountAnalyticsResponsePayload|null;
  analyticsShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  userCountAnalytics: null,
  formCountAnalytics:null,
  analyticsShowMessage: null,
  errorMessage: '',
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserCountAnalytics.pending, state => {
        state.userCountAnalytics = null;
      })
      .addCase(getUserCountAnalytics.fulfilled, (state, action) => {
        state.userCountAnalytics = action.payload.payload;
      })
      .addCase(getUserCountAnalytics.rejected, state => {
        state.userCountAnalytics = null;
      })
      .addCase(getFormCountAnalytics.pending, state => {
        state.formCountAnalytics = null;
      })
      .addCase(getFormCountAnalytics.fulfilled, (state, action) => {
        state.formCountAnalytics = action.payload.payload;
      })
      .addCase(getFormCountAnalytics.rejected, state => {
        state.formCountAnalytics = null;
      });
  },
});

export default analyticsSlice.reducer;
