import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';

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

export type RubricIndicatorItem={
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
}
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

export const getAllRubrics = createAsyncThunk<
  GetAllRubricsResponse,
  PaginationRequest
>('rubric/getAllRubrics', async (payload, {rejectWithValue}) => {
  try {
    const response = await api.post(endPoints.GET_ALL_RUBRICS, payload);
    return response.data as GetAllRubricsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const deleteRubric = createAsyncThunk<
  RubricsDeleteResponse,
  DeleteRubricRequest
>('rubric/deleteRubric', async (payload, {rejectWithValue}) => {
  try {
    const response = await api.delete(endPoints.DELETE_RUBRIC, {data: payload});
    console.log("res",response.data)
    return response.data as RubricsDeleteResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getRubric = createAsyncThunk<
GetRubricResponse,
  number
>('rubric/getRubric', async (rubricId, {rejectWithValue}) => {
  try {
    const response = await api.get(endPoints.GET_RUBRIC+rubricId);
    return response.data as GetRubricResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

interface InitialState {
  allRubrics: GetAllRubricsResponsePayload | null;
  rubricDeletedMessage: string | null;
  rubricData:GetRubricResponsePayload|null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  allRubrics: null,
  rubricDeletedMessage: null,
  rubricData:null,
  isLoading: false,
  error: null,
};

const rubricSlice = createSlice({
  name: 'rubric',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllRubrics.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllRubrics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allRubrics = {
          ...state.allRubrics,
          ...action.payload.payload,
        };
      })
      .addCase(getAllRubrics.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getRubric.pending, state => {
        state.isLoading = true;
      })
      .addCase(getRubric.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rubricData = {
            ...state.rubricData,
            ...action.payload.payload,
          };
      })
      .addCase(getRubric.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteRubric.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteRubric.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rubricDeletedMessage = action.payload.payload.message?.toString();
      })
      .addCase(deleteRubric.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default rubricSlice.reducer;
