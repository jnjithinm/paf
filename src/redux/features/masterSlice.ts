import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
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

export const getAllDomains = createAsyncThunk<GetDomainsResponse, void>(
  'master/getAllDomains',
  async (_, { rejectWithValue}) => {
    try {
      const response = await api.get(endPoints.GET_ALL_DOMAINS);
      console.log("reee",response.data)
      return response.data as GetDomainsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getIndicatorsByDomainId = createAsyncThunk<
  GetIndicatorsResponse,
  number
>('master/getIndicatorsByDomainId', async (userId, {rejectWithValue}) => {
  try {
    const response = await api.get(
      endPoints.GET_INDICATORS_BY_DOMAIN_ID + userId,
    );
    return response.data as GetIndicatorsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});


interface InitialState {
  allDomains: GetDomainsResponse | null;
  indicatorsByDomain: GetIndicatorsResponsePayload | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
    allDomains: null,
    indicatorsByDomain: null,
  isLoading: false,
  error: null,
};

const masterSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getAllDomains.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllDomains.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allDomains = {
          ...state.allDomains,
          ...action.payload,
        };
      })
      .addCase(getAllDomains.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getIndicatorsByDomainId.pending, state => {
        state.isLoading = true;
      })
      .addCase(getIndicatorsByDomainId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.indicatorsByDomain = {
          ...state.indicatorsByDomain,
          ...action.payload.payload,
        };
      })
      .addCase(getIndicatorsByDomainId.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export default masterSlice.reducer;
