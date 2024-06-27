import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject, FileObject, ItemType} from '../../config/types';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {DateFilterOption} from '../../components/Calendar';
import RNFetchBlob from 'rn-fetch-blob';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Observation {
  userAssessed: string;
  userImage: string | null;
  reportedBy: string;
  reportedByImage: string | null;
  ratings: number;
}

interface ObservationsResponse {
  total: number;
  byMe: number;
  forMe: number;
  schoolName: string;
  averageRating: number;
  observations: Observation[];
}

interface GetDashboardDetailsAndObservationListResponse {
  payload: ObservationsResponse;
}

interface SaveEvidenceCardEvidenceInfoRequest {
  domainId: number;
  indicatorId: number;
  averageRating: number;
  loggedInUserName: string;
}

interface SaveEvidenceCardResponse {
  payload: {
    evidenceId: number;
    domainName: string;
    indicatorName: string;
    averageRating: number;
    attachmentResponse: any[];
    message: string;
  };
  status: number;
}

type SaveEvidenceCardResponsePayload = SaveEvidenceCardResponse['payload'];

type AttachmentResponse = {
  attachmentId: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  evidenceId: number;
};

type FileCount = {
  Video: number;
  Audio: number;
  Image: number;
  Document: number;
};

export type EvidenceResponse = {
  evidenceId: number;
  domainName: string;
  domainId: number;
  indicatorId: number;
  indicatorName: string;
  averageRating: number;
  attachmentResponse: AttachmentResponse[];
  fileCount: FileCount;
};

type GetObservationByIdResponse = {
  payload: {
    observationId: number;
    observationDate: string;
    userId: number;
    userGroupId: number;
    userName: string;
    userGroup: string;
    feedbackDescription: string;
    observationStatus: 'Completed' | 'Pending';
    observationAvgRatings: number;
    userImage: string | null;
    evidenceResponseList: EvidenceResponse[];
  };
  status: number;
};
type GetObservationByIdResponsePayload = GetObservationByIdResponse['payload'];

export type ObservationData = {
  audioCount: number;
  createdDate: string;
  documentCount: number;
  imageCount: number;
  observationId: number;
  observationStatus: 'Completed' | 'Pending' | 'In Progress' | 'Cancelled';
  ratings: number;
  reportedBy: string;
  reportedByImage: string;
  userAssessed: string;
  userImage: string;
  videoCount: number;
};

interface ObservationFilter {
  userAssessed: string;
  userImage: string | null;
  reportedBy: string;
  reportedByImage: string | null;
  ratings: number;
  observationId: number;
}

type GetAllObservationsResponse = {
  payload: {
    message: string;
    dataList: {
      averageRating: number | null;
      byMe: number;
      forMe: number;
      observations: ObservationFilter[];
      pointStatus: any | null;
      progressPoint: any | null;
      schoolName: string | null;
      total: number;
    };

    totalCount: number;
  };
  status: number;
};

type GetAllObservationsResponsePayload = GetAllObservationsResponse['payload'];

type FilterTypes = 'All' | 'byMe' | 'forMe';

type FilterObservationRequest = {filterType: FilterTypes; userId: number};

// type AttachmentResponse = {
//   attachmentId: number;
//   fileName: string;
//   fileType: string;
//   fileUrl: string;
//   evidenceId: number;
// };

// type EvidencePayload = {
//   evidenceId: number;
//   domainName: string;
//   domainId: number;
//   indicatorId: number;
//   indicatorName: string;
//   averageRating: number;
//   attachmentResponse: AttachmentResponse[];
//   message: string;
// };

// type EvidenceResponse = {
//   payload: EvidencePayload;
//   status: number;
// };

export type FilterType = 'All' | 'byMe' | 'forMe';

type ObservationRequest = {
  userId?: string;
  userGroupId?: string;
  ratings?: number;
  filterType: FilterType;
  dateType?: DateFilterOption;
  startDate?: string;
  endDate?: string;
  paginationRequest: PaginationRequest;
};

export type NewObservation = {
  selectedDate: string;
  selectedUser: ItemType;
  selectedUserGroup: ItemType;
};

interface SaveObservationRequest {
  observationDate: string;
  userGroupId: number;
  userId: number;
  observationStatus: string;
  feedbackDescription: string;
  loggedInUserName: string;
  evidenceRequestList: EvidenceRequest[];
}

interface EvidenceRequest {
  domainId: number;
  indicatorId: number;
  averageRating: number;
  loggedInUserName: string;
  evidenceId: number;
}

interface SaveObservationResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

export const setObservationShowMessage = createAction<ErrorStatusObject | null>(
  'SET_OBSERVATION_SHOW_MESSAGE',
);

export const resetSaveEvidenceCardResponse = createAction<void>(
  'RESET_SAVE_EVIDENCE_CARD_RESPONSE',
);

export const saveNewObservation = createAction<NewObservation | null>(
  'SAVE_NEW_OBSERVATION',
);

export const getDashboardDetailsAndObservationList = createAsyncThunk<
  GetDashboardDetailsAndObservationListResponse,
  number,
  {rejectValue: ErrorResponse}
>('observation/dashboard', async (id, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(
      endPoints.GET_DASHBOARD_DETAILS_OBSERVATION + id,
    );
    // console.log('[API] Success:', JSON.stringify(response.data));
    return response.data as GetDashboardDetailsAndObservationListResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getObservationById = createAsyncThunk<
  GetObservationByIdResponse,
  number,
  {rejectValue: ErrorResponse}
>('observation/getObservationById', async (id, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.GET_OBSERVATION_BY_ID + id);
    // console.log('[API] Success:', JSON.stringify(response.data));
    return response.data as GetObservationByIdResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getEvidenceById = createAsyncThunk<
  GetObservationByIdResponse,
  number,
  {rejectValue: ErrorResponse}
>('observation/getEvidenceById', async (id, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.GET_EVIDENCE_BY_ID + id);
    return response.data as GetObservationByIdResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getAllObservations = createAsyncThunk<
  GetAllObservationsResponse,
  [number, ObservationRequest],
  {rejectValue: ErrorResponse}
>(
  'observation/getAllObservations',
  async ([id, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const filteredPayload: Partial<ObservationRequest> = {};

      if (payload.userId !== undefined) {
        filteredPayload.userId = payload.userId;
      }
      if (payload.userGroupId !== undefined) {
        filteredPayload.userGroupId = payload.userGroupId;
      }
      if (payload.ratings !== undefined) {
        filteredPayload.ratings = payload.ratings;
      }
      if (payload.dateType !== undefined) {
        filteredPayload.dateType = payload.dateType;
      }
      if (payload.startDate !== undefined) {
        filteredPayload.startDate = payload.startDate;
      }
      if (payload.endDate !== undefined) {
        filteredPayload.endDate = payload.endDate;
      }

      const response = await api.post(endPoints.DASHBOARD_FILTER + id, {
        ...filteredPayload,
        paginationRequest: payload.paginationRequest,
        filterType: payload.filterType,
      });
      console.log('[API] Success:', JSON.stringify(response.data));
      return response.data as GetAllObservationsResponse;
    } catch (error: any) {
      console.log('er', error);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const saveEvidenceCard = createAsyncThunk<
  SaveEvidenceCardResponse,
  [SaveEvidenceCardEvidenceInfoRequest, FileObject],
  {rejectValue: ErrorResponse}
>(
  'observation/saveEvidenceCard',
  async ([evidenceInfo, file], {dispatch, rejectWithValue}) => {
    try {
      const token = await AsyncStorage.getItem('token');
      dispatch(setLoading(true));
      // const formData = new FormData();
      // formData.append('evidenceInfo',JSON.stringify(evidenceInfo));

      // if(file){
      //   formData.append('file',file);
      // }
      const formData = [];
      formData.push({
        name: 'evidenceInfo',
        data: JSON.stringify(evidenceInfo),
        type: 'application/json',
      });

      formData.push({
        name: 'file',
        filename: file.name,
        type: file.type,
        data: RNFetchBlob.wrap(file.uri),
      });
      const url = 'http://65.1.32.205:8080/' + endPoints.SAVE_EVIDENCE_CARD;

      const response = await RNFetchBlob.fetch(
        'POST',
        url,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        formData,
      );

      return response.data as SaveEvidenceCardResponse;
    } catch (error: any) {
      console.log('evidence card', error);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const saveObservation = createAsyncThunk<
  SaveObservationResponse,
  SaveObservationRequest,
  {rejectValue: ErrorResponse}
>(
  'observation/saveObservation',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endPoints.SAVE_OBSERVATION, payload);
      return response.data as SaveObservationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

interface InitialState {
  dashboardDetails: ObservationsResponse | null;
  saveEvidenceCardResponse: SaveEvidenceCardResponsePayload | null;
  observationById: GetObservationByIdResponsePayload | null;
  allObservations: GetAllObservationsResponsePayload | null;
  newObservation: NewObservation | null;
  observationShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  // isLoading: false,
  saveEvidenceCardResponse: null,
  dashboardDetails: null,
  observationById: null,
  allObservations: null,
  newObservation: null,
  observationShowMessage: null,
  errorMessage: '',
};

const observationSlice = createSlice({
  name: 'observation',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: builder => {
    builder
      .addCase(setObservationShowMessage, (state, action) => {
        state.observationShowMessage = action.payload;
      })
      .addCase(saveNewObservation, (state, action) => {
        state.newObservation = action.payload;
      })
      .addCase(resetSaveEvidenceCardResponse, (state, action) => {
        state.saveEvidenceCardResponse = null;
      })

      .addCase(getDashboardDetailsAndObservationList.pending, state => {
        // state.isLoading = true;
      })
      .addCase(
        getDashboardDetailsAndObservationList.fulfilled,
        (state, action) => {
          state.dashboardDetails = {
            ...state.dashboardDetails,
            ...action.payload.payload,
          };
        },
      )
      .addCase(
        getDashboardDetailsAndObservationList.rejected,
        (state, action) => {
          state.observationShowMessage = {
            status: 'Failed',
            message: action?.payload?.error?.errorMessage,
          };
        },
      )
      .addCase(saveEvidenceCard.pending, state => {
        // state.isLoading = true;
      })
      .addCase(saveEvidenceCard.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.saveEvidenceCardResponse = {
          ...state.saveEvidenceCardResponse,
          ...action.payload.payload,
        };
      })
      .addCase(saveEvidenceCard.rejected, (state, action) => {
        state.observationShowMessage = {
          status: 'Failed',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(getObservationById.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getObservationById.fulfilled, (state, action) => {
        state.observationById = action.payload.payload;
      })
      .addCase(getObservationById.rejected, (state, action) => {
        state.observationShowMessage = {
          status: 'Failed',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(getAllObservations.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getAllObservations.fulfilled, (state, action) => {
        state.allObservations = {
          ...state.allObservations,
          ...action.payload.payload,
        };
      })
      .addCase(getAllObservations.rejected, (state, action) => {
        state.observationShowMessage = {
          status: 'Failed',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default observationSlice.reducer;
