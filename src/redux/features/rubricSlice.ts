import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {setLoading, setShowMessage} from './authSlice';
import { ErrorStatusObject } from '../../config/types';

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

export const getAllRubrics = createAsyncThunk<
  GetAllRubricsResponse,
  PaginationRequest
>('rubric/getAllRubrics', async (payload, {dispatch,rejectWithValue}) => {
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
  DeleteRubricRequest
>('rubric/deleteRubric', async (payload, {dispatch,rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.delete(endPoints.DELETE_RUBRIC, {data: payload});
    console.log("re",response.data)
    return response.data as RubricsDeleteResponse;
  } catch (error: any) {
    console.log("ressss",error,"sdssd",error.response?.data?.message)
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getRubric = createAsyncThunk<GetRubricResponse, number>(
  'rubric/getRubric',
  async (rubricId, {dispatch,rejectWithValue}) => {
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



interface InitialState {
  allRubrics: GetAllRubricsResponsePayload | null;
  rubricData: GetRubricResponsePayload | null;
  deleteSuccess: boolean;
  showMessage: ErrorStatusObject | null;
  errorMessage: string;

}

const initialState: InitialState = {
  allRubrics: null,
  rubricData: null,
  deleteSuccess: false,
  showMessage: null,
  errorMessage: ''

};

const rubricSlice = createSlice({
  name: 'rubric',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllRubrics.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getAllRubrics.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.allRubrics = {
          ...state.allRubrics,
          ...action.payload.payload,
        };
      })
      .addCase(getAllRubrics.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getRubric.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getRubric.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.rubricData =action.payload.payload;
        
      })
      .addCase(getRubric.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(deleteRubric.pending, (state,action) => {
        // state.isLoading = true;
        state.deleteSuccess = false;

      })
      .addCase(deleteRubric.fulfilled, (state, action) => {
        // state.isLoading = false;
        // state.error = {
        //   status: 'Success',
        //   message: action.payload.payload.message?.toString(),
        // };
        setShowMessage({status:'Success',message:action.payload.payload.message?.toString()})
        console.log("dssss",action.payload);
        state.deleteSuccess = true;
      })
      .addCase(deleteRubric.rejected, (state, action) => {
        // state.isLoading = false;
      // };
      setShowMessage({status:'Failed',message:'sdds'})
      });
  },
});

export default rubricSlice.reducer;
