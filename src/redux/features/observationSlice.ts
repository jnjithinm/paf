import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import RNFetchBlob from 'rn-fetch-blob';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject, FileObject, ItemType} from '../../config/types';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {DateFilterOption} from '../../components/Calendar';
import {getToken} from '../../utils/functions/localStorageOperations';
import {filterPayload, logRequest} from '../../utils/functions/apiUtils';

interface Observation {
  userAssessed: string;
  userImage: string | null;
  reportedBy: string;
  reportedByImage: string | null;
  ratings: number;
  observationId: number;
  createdDate: string;
  observationStatus: ObservationStatus;
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

interface SaveEvidenceCardResponse {
  payload: EvidenceResponse & {message: string};
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

export type ObservationStatus = 'Completed' | 'Pending';

type GetObservationByIdResponse = {
  payload: {
    observationId: number;
    observationDate: string;
    userId: number;
    userGroupId: number;
    userName: string;
    userGroup: string;
    feedbackDescription: string;
    observationStatus: ObservationStatus;
    observationAvgRatings: number;
    userImage: string | null;
    evidenceResponseList: EvidenceResponse[];
  };
  status: number;
};
type GetObservationByIdResponsePayload = GetObservationByIdResponse['payload'];

type GetAllObservationsResponse = {
  payload: {
    message: string;
    dataList: {
      averageRating: number | null;
      byMe: number;
      forMe: number;
      observations: Observation[];
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
  feedbackNote: string;
};

export interface SaveObservationRequest {
  observationDate: string;
  userGroupId: number;
  userId: number;
  observationStatus: 'Pending' | 'Completed';
  feedbackDescription: string;
  loggedInUserName: string;
  evidenceRequestList: EvidenceRequest[];
}

export interface EvidenceRequest {
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

interface DeleteAttachmentsRequest {
  ids: number[];
  loggedInUserName: string;
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

export const saveNewEvidenceCardList = createAction<EvidenceResponse[] | null>(
  'SAVE_NEW_EVIDENCE_CARD_LIST',
);

export const saveObservationId = createAction<number | null>(
  'SAVE_OBSERVATION_ID',
);

export const resetSaveObservationResponse = createAction<void>(
  'RESET_SAVE_OBSERVATION_RESPONSE',
);

export const resetObservationById = createAction<void>(
  'RESET_OBSERVATION_BY_ID',
);

export const resetDeleteAttachmentResponse = createAction<void>(
  'DELETE_ATTACHMENT_RESPONSE',
);

export const saveEvidenceCardDetails = createAction<EvidenceResponse | null>(
  'SAVE_EVIDENCE_CARD_DETAILS',
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

export const deleteAttachments = createAsyncThunk<
  GetObservationByIdResponse,
  DeleteAttachmentsRequest,
  {rejectValue: ErrorResponse}
>(
  'observation/getEvidenceById',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.delete(endPoints.DELETE_ATTACHMENTS, {
        data: payload,
      });
      return response.data as GetObservationByIdResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getAllObservations = createAsyncThunk<
  GetAllObservationsResponse,
  [number, ObservationRequest],
  {rejectValue: ErrorResponse}
>(
  'observation/getAllObservations',
  async ([id, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const filteredPayload = filterPayload(payload);
      const response = await api.post(endPoints.DASHBOARD_FILTER + id, {
        ...filteredPayload,
        paginationRequest: payload.paginationRequest,
        filterType: payload.filterType,
      });
      console.log('[API] Success:', JSON.stringify(response.data));
      return response.data as GetAllObservationsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const saveEvidenceCard = createAsyncThunk<
  SaveEvidenceCardResponse,
  [SaveEvidenceCardEvidenceInfoRequest, FileObject, number?],
  {rejectValue: ErrorResponse}
>(
  'observation/saveEvidenceCard',
  async ([evidenceInfo, file, evidenceId], {dispatch, rejectWithValue}) => {
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
      const updateUrl =
        'http://65.1.32.205:8080/' + endPoints.UPDATE_EVIDENCE_CARD;
      let response, parsedResponse;
      if (evidenceId) {
        const requestUrl = updateUrl + evidenceId;
        response = await RNFetchBlob.fetch(
          'PUT',
          updateUrl + evidenceId,
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          formData,
        );
        logRequest('PUT', requestUrl, JSON.stringify(formData));
      } else {
        response = await RNFetchBlob.fetch(
          'POST',
          url,
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          formData,
        );
        logRequest('POST', url, JSON.stringify(formData));
      }

      parsedResponse = JSON.parse(response.data);

      return parsedResponse as SaveEvidenceCardResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const saveObservation = createAsyncThunk<
  SaveObservationResponse,
  [SaveObservationRequest, number?],
  {rejectValue: ErrorResponse}
>(
  'observation/saveObservation',
  async ([payload, observationId], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      let response;
      if (observationId) {
        response = await api.put(
          endPoints.UPDATE_OBSERVATION + observationId,
          payload,
        );
      } else {
        response = await api.post(endPoints.SAVE_OBSERVATION, payload);
      }
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
  saveEvidenceCardResponse: EvidenceResponse | null;
  observationById: GetObservationByIdResponsePayload | null;
  allObservations: GetAllObservationsResponsePayload | null;
  newObservation: NewObservation | null;
  newEvidenceCardsList: EvidenceResponse[] | null;
  evidenceCardDetails: EvidenceResponse | null;
  observationId: number | null;
  deleteAttachmentResponse: GetObservationByIdResponse | null;
  saveObservationResponse: SaveObservationResponsePayload | null;
  observationShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  saveEvidenceCardResponse: null,
  dashboardDetails: null,
  observationById: null,
  allObservations: null,
  newObservation: null,
  newEvidenceCardsList: null,
  evidenceCardDetails: null,
  observationId: null,
  deleteAttachmentResponse: null,
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
      .addCase(saveNewEvidenceCardList, (state, action) => {
        state.newEvidenceCardsList = action.payload;
      })
      .addCase(saveObservationId, (state, action) => {
        state.observationId = action.payload;
      })
      .addCase(saveEvidenceCardDetails, (state, action) => {
        state.evidenceCardDetails = action.payload;
      })
      .addCase(resetSaveEvidenceCardResponse, (state, action) => {
        state.saveEvidenceCardResponse = null;
      })
      .addCase(resetSaveObservationResponse, (state, action) => {
        state.saveObservationResponse = null;
      })
      .addCase(resetObservationById, (state, action) => {
        state.observationById = null;
        state.observationId = null;
      })
      .addCase(resetDeleteAttachmentResponse, (state, action) => {
        state.deleteAttachmentResponse = null;
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
        let evidenceRes = action.payload.payload;
        if (!state.newEvidenceCardsList) {
          state.newEvidenceCardsList = [];
        }
        state.newEvidenceCardsList = [
          ...state.newEvidenceCardsList,
          {
            evidenceId: evidenceRes.evidenceId,
            attachmentResponse: evidenceRes.attachmentResponse,
            averageRating: evidenceRes.averageRating,
            domainId: evidenceRes.domainId,
            domainName: evidenceRes.domainName,
            fileCount: evidenceRes.fileCount,
            indicatorId: evidenceRes.indicatorId,
            indicatorName: evidenceRes.indicatorName,
          },
        ];
      })
      .addCase(saveEvidenceCard.rejected, (state, action) => {
        state.saveEvidenceCardResponse = null;
        state.observationShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      })
      .addCase(getObservationById.pending, state => {
        state.observationById = null;
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
      .addCase(saveObservation.pending, state => {
        state.saveObservationResponse = null;
      })
      .addCase(saveObservation.fulfilled, (state, action) => {
        state.saveObservationResponse = action.payload.payload;
        state.observationShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message,
        };
      })
      .addCase(saveObservation.rejected, (state, action) => {
        state.observationShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default observationSlice.reducer;
