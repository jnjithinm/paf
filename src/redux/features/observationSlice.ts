import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';

import {ErrorStatusObject, FileObject} from '../../config/types';
import {PaginationRequest} from './usersSlice';
import {setLoading} from './authSlice';
import { DateFilterOption } from '../../components/Calendar';

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

type GetAllObservationsResponse = {
  payload: {
    message: string;
    dataList: ObservationData[];
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


type ObservationRequest={
  userId?: string,
  userGroupId?:string,
  ratings?:number,
  dateType?: DateFilterOption,
  startDate?: string,
  endDate?: string,
  paginationRequest: PaginationRequest
};

export const getDashboardDetailsAndObservationList = createAsyncThunk<
  GetDashboardDetailsAndObservationListResponse,
  number
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
  number
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
  number
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
  [number, ObservationRequest]
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

      const response = await api.post(
        endPoints.GET_ALL_OBSERVATIONS + id,
        { ...filteredPayload, paginationRequest: payload.paginationRequest },
      );


      return response.data as GetAllObservationsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const filterObservations = createAsyncThunk<
  GetAllObservationsResponse,
  [number, FilterObservationRequest]
>(
  'observation/filterObservations',
  async ([id, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endPoints.DASHBOARD_FILTER + id, payload);
      // console.log('[API] Success:', JSON.stringify(response.data));
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
  [SaveEvidenceCardEvidenceInfoRequest, FileObject[]?]
>(
  'observation/saveEvidenceCard',
  async ([evidenceInfo, file], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append('evidenceInfo', evidenceInfo);
      if (file && file?.length > 0) {
        // file.forEach((f, index) => {
        //   formData.append(`file_${index}`, f);
        // });
        console.log('file', file[0].uri);
        formData.append('file', file[0]);
      }
      const response = await api.post(endPoints.SAVE_EVIDENCE_CARD, formData);
      return response.data as SaveEvidenceCardResponse;
    } catch (error: any) {
      console.log('evidence card', error);
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
  showMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  // isLoading: false,
  saveEvidenceCardResponse: null,
  dashboardDetails: null,
  observationById: null,
  allObservations: null,
  showMessage: null,
  errorMessage: ''
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
        // state.isLoading = true;
      })
      .addCase(
        getDashboardDetailsAndObservationList.fulfilled,
        (state, action) => {
          // state.isLoading = false;

          state.dashboardDetails = {
            ...state.dashboardDetails,
            ...action.payload.payload,
          };
        },
      )
      .addCase(
        getDashboardDetailsAndObservationList.rejected,
        (state, action) => {
          // state.isLoading = false;
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
        // state.isLoading = false;
      })
      .addCase(getObservationById.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getObservationById.fulfilled, (state, action) => {
        // state.isLoading = false;

        state.observationById = action.payload.payload;
      })
      .addCase(getObservationById.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getAllObservations.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getAllObservations.fulfilled, (state, action) => {
        // state.isLoading = false;

        state.allObservations = {
          ...state.allObservations,
          ...action.payload.payload,
        };
      })
      .addCase(getAllObservations.rejected, (state, action) => {
        // state.isLoading = false;
      });
  },
});

export default observationSlice.reducer;
