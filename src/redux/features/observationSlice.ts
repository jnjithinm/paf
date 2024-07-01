import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject, FileObject, ItemType} from '../../config/types';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {DateFilterOption} from '../../components/Calendar';
import RNFetchBlob from 'rn-fetch-blob';
import { getToken } from '../../utils/functions/localStorageOperations';

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
    domainId: number;
    indicatorId: number;
    indicatorName: string;
    averageRating: number;
    attachmentResponse: AttachmentResponse[];
    fileCount: FileCount;
    message: string;
  };

  status: number;
}

type SaveEvidenceCardResponsePayload = SaveEvidenceCardResponse['payload'];

export type AttachmentResponse = {
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

export type ObservationStatus= 'Completed' | 'Pending';

type GetObservationByIdResponse = {
  payload: {
    observationId: number;
    observationDate: string;
    userId: number;
    userGroupId: number;
    userName: string;
    userGroup: string;
    feedbackDescription: string;
    observationStatus:ObservationStatus;
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
  observationStatus: 'Pending'|'Completed';
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
type SaveObservationResponsePayload = SaveObservationResponse['payload'];

export const setObservationShowMessage = createAction<ErrorStatusObject | null>(
  'SET_OBSERVATION_SHOW_MESSAGE',
);

export const resetSaveEvidenceCardResponse = createAction<void>(
  'RESET_SAVE_EVIDENCE_CARD_RESPONSE',
);

export const saveNewObservation = createAction<NewObservation | null>(
  'SAVE_NEW_OBSERVATION',
);

export const resetSaveObservationResponse = createAction<void>(
  'RESET_SAVE_OBSERVATION_RESPONSE',
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
      const token = await getToken();
      dispatch(setLoading(true));
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

      const parsedResponse = JSON.parse(response.data);
      console.log("res", parsedResponse);
      
      return parsedResponse as SaveEvidenceCardResponse;
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
      console.log(":ressss",response.data)
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
  saveObservationResponse: SaveObservationResponsePayload | null;
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
  saveObservationResponse: null,
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
      .addCase(resetSaveObservationResponse, (state, action) => {
        state.saveObservationResponse = null;
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
            status: 'Error',
            message: action?.payload?.error?.errorMessage,
          };
        },
      )
      .addCase(saveEvidenceCard.pending, state => {
        // state.isLoading = true;
      })
      .addCase(saveEvidenceCard.fulfilled, (state, action) => {
        state.observationShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message,
        };
        state.saveEvidenceCardResponse = action.payload.payload;
        console.log("save evid res",action.payload.payload)
      })
      .addCase(saveEvidenceCard.rejected, (state, action) => {
          state.saveEvidenceCardResponse=null;
        state.observationShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(getObservationById.pending, state => {
        state.saveEvidenceCardResponse=null;
      })
      .addCase(getObservationById.fulfilled, (state, action) => {
      
        state.observationById = action.payload.payload;
      })
      .addCase(getObservationById.rejected, (state, action) => {
        state.observationShowMessage = {
          status: 'Error',
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
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(saveObservation.pending, state => {})
      .addCase(saveObservation.fulfilled, (state, action) => {
        state.saveObservationResponse = action.payload.payload;
        state.observationShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message,
        };
      })
      .addCase(saveObservation.rejected, (state, action) => {
        console.log("error",action.payload?.error)
        state.observationShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default observationSlice.reducer;
