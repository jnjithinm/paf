import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';

export type RubricItem = {
  rubricId: number;
  rubricName: string;
  rubricDescription: string;
  status: boolean;
  createdBy: string;
  createdDate: string;
  groupUsers: number;
};

type GetAllRubricsResponse = {
  payload: {
    message: string;
    dataList: RubricItem[];
    totalCount: number;
  };
  status: number;
};

type GetAllRubricsResponsePayload = GetAllRubricsResponse['payload'];

type DeleteRubricRequest = {
  ids: [number];
  loggedInUserName: string;
};

type RubricsDeleteResponse = {
  payload: {
    message: string;
  };
  status: number;
};

type DeleteSuccessResponsePayload = RubricsDeleteResponse['payload'];

export type RubricIndicatorItem = {
  domainId: number;
  domainName: string;
  indicatorId: number;
  indicatorName: string;
  indicatorDescription: string;
  tags: {
    tagId: number;
    tagName: string;
  }[];
  status: boolean;
  createdBy: string;
  createdDate: string;
};

type GetRubricResponse = {
  payload: {
    message: string;
    dataList: {
      rubricId: number;
      rubricName: string;
      status: boolean;
      createdBy: string;
      createdDate: string;
      indicators: RubricIndicatorItem[];
      userGroups: any[];
    };
  };
  status: number;
};

type GetRubricResponsePayload = GetRubricResponse['payload'];

interface IndicatorRequest {
  indicatorId?: number;
  domainId: number;
  tagIds: number[];
  indicatorName: string;
  indicatorDescription: string;
  loggedInUserName: string;
}

interface UpdateRubricRequest {
  rubricName: string;
  indicatorRequestList: IndicatorRequest[];
  loggedInUserName: string;
}

interface UpdateRubricResponse{

}

export const setRubricShowMessage = createAction<ErrorStatusObject | null>(
  'SET_RUBRIC_SHOW_MESSAGE',
);

export const getAllRubrics = createAsyncThunk<
  GetAllRubricsResponse,
  PaginationRequest
>('rubric/getAllRubrics', async (payload, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post(endPoints.GET_ALL_RUBRICS, payload);
    return response.data as GetAllRubricsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const deleteRubric = createAsyncThunk<
  RubricsDeleteResponse,
  DeleteRubricRequest,
  {rejectValue: ErrorResponse}
>('rubric/deleteRubric', async (payload, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.delete(endPoints.DELETE_RUBRIC, {data: payload});
    return response.data as RubricsDeleteResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getRubric = createAsyncThunk<GetRubricResponse, number>(
  'rubric/getRubric',
  async (rubricId, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(endPoints.GET_RUBRIC + rubricId);
      return response.data as GetRubricResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const updateRubric = createAsyncThunk<
UpdateRubricResponse,
  [number,UpdateRubricRequest],
  {rejectValue: ErrorResponse}
>('rubric/updateRubric', async ([rubricId, payload], {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.put(endPoints.UPDATE_RUBRIC + rubricId, payload);
    return response.data as UpdateRubricResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

interface InitialState {
  allRubrics: GetAllRubricsResponsePayload | null;
  rubric: GetRubricResponsePayload | null;
  rubricDeleteSuccessResponse: DeleteSuccessResponsePayload|null;
  updateRubricResponse:boolean;
  rubricShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allRubrics: null,
  rubric: null,
  rubricDeleteSuccessResponse: null,
  updateRubricResponse:false,
  rubricShowMessage: null,
  errorMessage: '',
};

const rubricSlice = createSlice({
  name: 'rubric',
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
        state.rubric = action.payload.payload;
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

export default rubricSlice.reducer;
