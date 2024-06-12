import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';

import {FileObject} from '../../config/types';
import {PaginationRequest} from './usersSlice';

interface Observation {
  userAssessed: string;
  reportedBy: string;
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
    evidenceResponseList: EvidenceResponse[];
  };
  status: number;
};
type GetObservationByIdResponsePayload = GetObservationByIdResponse['payload'];

export type ObservationData = {
  observationId: number;
  userAssessed: string;
  reportedBy: string;
  ratings: number;
  observationStatus: 'Completed' | 'Pending';
  videoCount: number;
  audioCount: number;
  documentCount: number;
  imageCount: number;
  createdDate: string;
};

type GetAllObservationsResponse = {
  payload: {
    message: string;
    dataList: ObservationData[];
    totalCount: number;
  };
  status: number;
};

type GetAllObservationsResponsePayload = GetAllObservationsResponse['payload'];

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

export const getDashboardDetailsAndObservationList = createAsyncThunk<
  GetDashboardDetailsAndObservationListResponse,
  number
>('observation/dashboard', async (id, {rejectWithValue}) => {
  try {
    const response = await api.get(
      endPoints.GET_DASHBOARD_DETAILS_OBSERVATION + id,
    );
    console.log('[API] Success:', JSON.stringify(response.data));
    return response.data as GetDashboardDetailsAndObservationListResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getObservationById = createAsyncThunk<
  GetObservationByIdResponse,
  number
>('observation/getObservationById', async (id, {rejectWithValue}) => {
  try {
    const response = await api.get(endPoints.GET_OBSERVATION_BY_ID + id);
    console.log('obserfations', response.data);
    return response.data as GetObservationByIdResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getEvidenceById = createAsyncThunk<
  GetObservationByIdResponse,
  number
>('observation/getEvidenceById', async (id, {rejectWithValue}) => {
  try {
    const response = await api.get(endPoints.GET_EVIDENCE_BY_ID + id);
    return response.data as GetObservationByIdResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  }
});

export const getAllObservations = createAsyncThunk<
  GetAllObservationsResponse,
  [number, PaginationRequest]
>(
  'observation/getAllObservations',
  async ([id, payload], {rejectWithValue}) => {
    try {
      const response = await api.post(
        endPoints.GET_ALL_OBSERVATIONS + id,
        payload,
      );
      return response.data as GetAllObservationsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const saveEvidenceCard = createAsyncThunk<
  SaveEvidenceCardResponse,
  [SaveEvidenceCardEvidenceInfoRequest, FileObject[]?]
>(
  'observation/saveEvidenceCard',
  async ([evidenceInfo, file], {rejectWithValue}) => {
    try {
      const formData = new FormData();
      formData.append('evidenceInfo', evidenceInfo);
      if (file && file?.length > 0) {
        // file.forEach((f, index) => {
        //   formData.append(`file_${index}`, f);
        // });
        formData.append('file', file[0]);
      }
      const response = await api.post(endPoints.SAVE_EVIDENCE_CARD, formData);
      return response.data as SaveEvidenceCardResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

interface InitialState {
  dashboardDetails: ObservationsResponse | null;
  saveEvidenceCardResponse: SaveEvidenceCardResponsePayload | null;
  observationById: GetObservationByIdResponsePayload | null;
  allObservations: GetAllObservationsResponsePayload | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
  isLoading: false,
  saveEvidenceCardResponse: null,
  dashboardDetails: null,
  observationById: null,
  allObservations: null,
  error: null,
};

const observationSlice = createSlice({
  name: 'observation',
  initialState,
  reducers: {
    // fill in primary logic here
  },
  extraReducers: builder => {
    builder

      .addCase(getDashboardDetailsAndObservationList.pending, state => {

        state.isLoading = true;
      })
      .addCase(
        getDashboardDetailsAndObservationList.fulfilled,
        (state, action) => {
          state.isLoading = false;

          state.dashboardDetails = {
            ...state.dashboardDetails,
            ...action.payload.payload,
          };
        },
      )
      .addCase(
        getDashboardDetailsAndObservationList.rejected,
        (state, action) => {
          state.isLoading = false;
              
        },
      )
      .addCase(saveEvidenceCard.pending, state => {

        state.isLoading = true;
      })
      .addCase(saveEvidenceCard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.saveEvidenceCardResponse = {
          ...state.saveEvidenceCardResponse,
          ...action.payload.payload,
        };
      })
      .addCase(saveEvidenceCard.rejected, (state, action) => {
        state.isLoading = false;

      })
      .addCase(getObservationById.pending, state => {

        state.isLoading = true;
      })
      .addCase(getObservationById.fulfilled, (state, action) => {
        state.isLoading = false;

        state.observationById = {
          ...state.observationById,
          ...action.payload.payload,
        };
      })
      .addCase(getObservationById.rejected, (state, action) => {
        state.isLoading = false;

      })
      .addCase(getAllObservations.pending, state => {
        state.isLoading = true;
      })
      .addCase(getAllObservations.fulfilled, (state, action) => {
        state.isLoading = false;


        state.allObservations = {
          ...state.allObservations,
          ...action.payload.payload,
        };
      })
      .addCase(getAllObservations.rejected, (state, action) => {
        state.isLoading = false;

      });
  },
});

export default observationSlice.reducer;
