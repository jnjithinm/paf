import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {setLoading} from './authSlice';
import { ErrorStatusObject } from '../../config/types';
interface Domain {
  domainId: number;
  domainName: string;
  status: boolean;
  isDeleted: boolean;
  createdDate: string;
}

interface GetDomainsResponse {
  payload: Domain[];
  status: number;
}

// type GetDomainsResponsePayload = GetDomainsResponse['payload'];

interface Indicator {
  domainId: number;
  domainName: string;
  indicatorId: number;
  indicatorName: string;
}

interface GetIndicatorsResponse {
  payload: {
    message: string;
    dataList: Indicator[];
  };
  status: number;
}

type GetIndicatorsResponsePayload = GetIndicatorsResponse['payload'];

export const setMasterShowMessage = createAction<ErrorStatusObject | null>(
  'SET_MASTER_SHOW_MESSAGE',
);


export const getAllDomains = createAsyncThunk<GetDomainsResponse, void>(
  'master/getAllDomains',
  async (_, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(endPoints.GET_ALL_DOMAINS);
      return response.data as GetDomainsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getIndicatorsByDomainId = createAsyncThunk<
  GetIndicatorsResponse,
  number
>(
  'master/getIndicatorsByDomainId',
  async (userId, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(
        endPoints.GET_INDICATORS_BY_DOMAIN_ID + userId,
      );
      return response.data as GetIndicatorsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

interface InitialState {
  allDomains: GetDomainsResponse | null;
  indicatorsByDomain: GetIndicatorsResponsePayload | null;
  masterShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allDomains: null,
  indicatorsByDomain: null,
  masterShowMessage: null,
  errorMessage:''
};

const masterSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(setMasterShowMessage, (state, action) => {
      state.masterShowMessage = action.payload;
    })
      .addCase(getAllDomains.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getAllDomains.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.allDomains = {
          ...state.allDomains,
          ...action.payload,
        };
      })
      .addCase(getAllDomains.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getIndicatorsByDomainId.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getIndicatorsByDomainId.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.indicatorsByDomain = {
          ...state.indicatorsByDomain,
          ...action.payload.payload,
        };
      })
      .addCase(getIndicatorsByDomainId.rejected, (state, action) => {
        // state.isLoading = false;
      });
  },
});

export default masterSlice.reducer;
