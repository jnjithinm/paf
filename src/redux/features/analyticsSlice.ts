import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';



  
  
//   interface UserAnalyticsCount 

  interface UserCountAnalyticsResponse {
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




export const userCountAnalytics = createAsyncThunk<
UserCountAnalyticsResponse,
  [number,UpdateRubricRequest],
  {rejectValue: ErrorResponse}
>('analytics/updateRubric', async ([rubricId, payload], {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.put(endPoints.USER_COUNT_ANAYTICS + rubricId, payload);
    return response.data as UserCountAnalyticsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

interface InitialState {
  allRubrics: GetAllRubricsResponsePayload | null;
  analytics: GetRubricResponsePayload | null;
  rubricDeleteSuccessResponse: DeleteSuccessResponsePayload|null;
  updateRubricResponse:boolean;
  rubricShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allRubrics: null,
  analytics: null,
  rubricDeleteSuccessResponse: null,
  updateRubricResponse:false,
  rubricShowMessage: null,
  errorMessage: '',
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setRubricShowMessage, (state, action) => {
        state.rubricShowMessage = action.payload;
      })
      .addCase(getAllRubrics.pending, state => {
      })
      .addCase(getAllRubrics.fulfilled, (state, action) => {
        state.allRubrics = {
          ...state.allRubrics,
          ...action.payload.payload,
        };
      })
      .addCase(getAllRubrics.rejected, (state, action) => {

      })
      .addCase(getRubric.pending, state => {

      })
      .addCase(getRubric.fulfilled, (state, action) => {
        state.analytics = action.payload.payload;
      })
      .addCase(getRubric.rejected, (state, action) => {
      })
      .addCase(deleteRubric.pending, (state, action) => {
        state.rubricDeleteSuccessResponse = null;
      })
      .addCase(deleteRubric.fulfilled, (state, action) => {
        state.rubricShowMessage = {
          status: 'Success',
          message: action.payload.payload.message?.toString(),
        };
        state.rubricDeleteSuccessResponse = action.payload.payload;
      })
      .addCase(deleteRubric.rejected, (state, action) => {
        state.rubricShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(updateRubric.pending, state => {
        state.updateRubricResponse = false;
      })
      .addCase(updateRubric.fulfilled, (state, action) => {
        state.updateRubricResponse = true;
        state.rubricShowMessage = {
          status: 'Success',
          message: 'Indicator deleted',
        };

      })
      .addCase(updateRubric.rejected, (state, action) => {
        state.updateRubricResponse = false;
        state.rubricShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage ,
        };
      })
  },
});

export default analyticsSlice.reducer;
