import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';

interface GetUserCountAnalyticsRequest {
  userStatusType: string;
  dateType: string;
  startDate: string;
  endDate: string;
}

interface GetUserCountAnalyticsUserAndRoleResponse{
  payload: {
      message: string;
      dataList: {
        userCount: Array<[string, string | number]>;
      }
  },
  status: number
}

type GetUserCountAnalyticsUserAndRoleResponsePayload =
GetUserCountAnalyticsUserAndRoleResponse['payload'];
  
interface GetUserCountAnalyticsResponse {
  payload: {
    message: string;
    dataList: {
      totalUserCount: number[];
      userCount: Array<[string, string | number]>;
      totalUserGroupCount: number[];
      totalRoleCount: number[];
    };
  };
  status: number;
}

type GetUserCountAnalyticsResponsePayload =
  GetUserCountAnalyticsResponse['payload'];

interface GetFormCountAnalyticsRequest {
  dateType: 'selected_date';
  startDate: string;
  endDate: string;
}

interface GetFormCountAnalyticsResponse {
  payload: {
    dataList: {
      totalResponseAverageTime: number[];
      formAnalytics: Array<[string, string, string, string]>;
      totalFormCount: number[];
      totalResponseCount: number[];
    };
  };
  status: number;
}

type GetFormCountAnalyticsResponsePayload =
  GetFormCountAnalyticsResponse['payload'];

interface GetUserAndRoleCountAnalyticsRequest {
  userStatusType: string | null;
  roleStatusType: string | null;
  userGroupStatusType: string | null;
  stateId: number | null;
  districtId: number | null;
  area: string | null;
  dateType: string;
  startDate: string;
  endDate: string;
}

interface GetUserAndRoleCountAnalyticsResponse {
  payload: {
    message: string;
    dataList: {
      UserAndRole: [
        string, // Month Name
        number, // Count of Users
        number, // Count of Roles
        number, // Count of UserGroups
      ][];
    };
  };
  status: number;
}

type GetUserAndRoleCountAnalyticsResponsePayload =
  GetUserAndRoleCountAnalyticsResponse['payload'];

interface AnalyticsData {
  [index: number]: string | number;
}

interface ResponseValue {
  analyticsData: AnalyticsData[];
}

interface GetFormAnalyticsResponse {
  payload: {
    optionId: number;
    questionId: number;
    questionText: string;
    questionOptionId: number;
    responseValue: ResponseValue;
    responseCount: number;
  }[];
  status: number;
}

type GetFormAnalyticsResponsePayload = GetFormAnalyticsResponse['payload'];

interface GetObservationCountAnalyticsRequest {
  userId: number;
  dateType: 'selected_date';
  startDate: string;
  endDate: string;
}

interface ObservationAndAverageCountData {
  [index: number]: string | number;
}

interface GetObservationCountAnalyticsResponse {
  payload: {
    message: string;
    dataList: {
      observationAndAverageCount: ObservationAndAverageCountData[];
    };
  };
  status: number;
}

type GetObservationCountAnalyticsResponsePayload =
  GetObservationCountAnalyticsResponse['payload'];

interface GetTeacherObservationAnalyticsResponse {
  payload: {
    message: string;
    dataList: {
      totalObservationAverage:number[];
      totalIndicatorCount:number[];
      totalObservationCount:number[];
    };
  };
  status: number;
}

type GetTeacherObservationAnalyticsResponsePayload =
GetTeacherObservationAnalyticsResponse['payload'];

interface GetObservationAnalyticsRequest {
  userId: number;
  stateId: null;
  districtId: null;
  schoolId: null;
  dateType: 'selected_date';
  startDate: '2024-01-01';
  endDate: '2024-12-31';
}

interface GetObservationAnalyticsResponse {
  payload: {
    message: string;
    dataList: {observationAndIndicatorCount: (string | number)[][]};
    status: number;
  };
}

type GetObservationAnalyticsResponsePayload =
  GetObservationAnalyticsResponse['payload'];

interface IndAverageRatingData {
  [index: number]: string | number;
}

interface GetRubricWiseObservationAnalyticsRequest {
  indicatorId: number;
  dateType: 'Week';
  startDate: null;
  endDate: null;
}

interface GetRubricWiseObservationAnalyticsResponse {
  payload: {
    message: string;
    dataList: {
      indAverageRating: IndAverageRatingData[];
    };
  };
  status: number;
}

type GetRubricWiseObservationAnalyticsResponsePayload =
  GetRubricWiseObservationAnalyticsResponse['payload'];

interface ObservationAndAverageCountEntry {
  month: string;
  observations: number;
  averageRating: number;
}

export interface State {
  stateId: number;
  stateName: string;
  stateCode: string;
  countryId: number;
  status: boolean;
}

interface GetStatesResponse {
  payload: {
    message: string;
    dataList: State[];
    totalCount: number;
  };
  status: number;
}

type GetStatesResponsePayload = GetStatesResponse['payload'];

export interface District {
  stateId: number;
  stateCode: string;
  stateName: string;
  districtId: number;
  districtCode: string;
  districtName: string;
  status: boolean;
  users: number;
  areas: number;
  schools: number;
  createdBy: string;
  creationDate: string;
}

interface GetDistrictResponse {
  payload: {
    message: string;
    dataList: District[];
    totalCount: number;
  };
  status: number;
}

type GetAllDistrictResponsePayload = GetDistrictResponse['payload'];

export interface Area {
  pinId: number;
  area: string;
  pinCode: string;
  districtId: number;
  districtCode: string;
  districtName: string;
  stateId: number;
  stateCode: string;
  stateName: string;
  status: boolean;
  schools: number;
  users: number;
  createdBy: string;
  creationDate: string;
}
interface GetAreaResponse {
  payload: {
    message: string;
    dataList: Area[];
    totalCount: number;
  };
  status: number;
}

type GetAreaResponsePayload = GetAreaResponse['payload'];

export interface SchoolType {
  schoolId: number;
  schoolName: string;
  pinId: number;
  area: string;
  pinCode: string;
  districtId: number;
  districtCode: string;
  districtName: string;
  stateId: number;
  stateCode: string;
  stateName: string;
  status: boolean;
  users: number;
  classrooms: number;
  createdBy: string;
  creationDate: string;
}

interface GetSchoolResponse {
  payload: {
    message: string;
    dataList: SchoolType[];
    totalCount: number;
  };
  status: number;
}

type GetAllSchoolResponsePayload = GetSchoolResponse['payload'];

export const getUserCountAnalytics = createAsyncThunk<
  GetUserCountAnalyticsResponse,
  void,
  {rejectValue: ErrorResponse}
>('analytics/getUserCountAnalytics', async (_, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.USER_COUNT_ANAYTICS);
    return response.data as GetUserCountAnalyticsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getUserCountAnalyticsUserAndRole = createAsyncThunk<
GetUserCountAnalyticsUserAndRoleResponse,
GetUserCountAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/userCountAnalyticsUserAndRole',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.USER_COUNT_ANAYTICS_USER_AND_ROLE,
        payload,
      );
      return response.data as GetUserCountAnalyticsUserAndRoleResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getUserAndRoleCountAnalytics = createAsyncThunk<
  GetUserAndRoleCountAnalyticsResponse,
  GetUserAndRoleCountAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getUserAndRoleCountAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.USER_AND_ROLE_COUNT_ANALYTICS,
        payload,
      );
      return response.data as GetUserAndRoleCountAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getFormCountAnalytics = createAsyncThunk<
  GetFormCountAnalyticsResponse,
  GetFormCountAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getFormCountAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.GET_FORM_COUNT_AND_RESPONSE,
        payload,
      );
      console.log('jjjjj', endPoints.GET_FORM_COUNT_AND_RESPONSE, payload);
      return response.data as GetFormCountAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getFormAnalytics = createAsyncThunk<
  GetFormAnalyticsResponse,
  [number, number],
  {rejectValue: ErrorResponse}
>(
  'analytics/getFormAnalytics',
  async ([formId, flowId], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(
        endPoints.GET_FORM_ANALYTICS + formId + `?flowId=${flowId}`,
      );
      return response.data as GetFormAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getObservationCountAnalytics = createAsyncThunk<
  GetObservationCountAnalyticsResponse,
  GetObservationCountAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getObservationCountAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.OBSERVATION_ANALYTICS_BY_USER_ID,
        payload,
      );
      console.log('iuserid---------', response.data);
      return response.data as GetObservationCountAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getObservationAnalytics = createAsyncThunk<
  GetObservationAnalyticsResponse,
  GetObservationAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getObservationAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.OBSERVATION_COUNT_ANALYTICS,
        payload,
      );
      return response.data as GetObservationAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getTeacherObservationAnalytics = createAsyncThunk<
GetTeacherObservationAnalyticsResponse,
  void,
  {rejectValue: ErrorResponse}
>('analytics/teacherObservation', async (_, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.GET_TEACHER_OBSERVATION_COUNTS);
    return response.data as GetTeacherObservationAnalyticsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getRubricWiseObservationAnalytics = createAsyncThunk<
  GetRubricWiseObservationAnalyticsResponse,
  GetRubricWiseObservationAnalyticsRequest,
  {rejectValue: ErrorResponse}
>(
  'analytics/getRubricWiseObservationAnalytics',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(
        endPoints.RUBRIC_WIESE_OBSERVATION,
        payload,
      );
      return response.data as GetRubricWiseObservationAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getStates = createAsyncThunk<GetStatesResponse, PaginationRequest>(
  'analytics/getStates',
  async (payload, {dispatch, rejectWithValue}) => {
    console.log('sttttttttt');
    try {
      // dispatch(setLoading(true));
      let response;
      // if(searchCriteria){
      //   response = await api.post(
      //     endPoints.GET_STATES_BY_SEARCH + `searchCriteria=${searchCriteria}`,
      //     payload,
      //   );
      // }else{
      response = await api.post(endPoints.GET_STATES_ANALYTICS, payload);
      // }
      console.log('--------', endPoints.GET_STATES_ANALYTICS, payload);
      return response.data as GetStatesResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      // dispatch(setLoading(false));
    }
  },
);

export const getDistricts = createAsyncThunk<
  GetDistrictResponse,
  [PaginationRequest]
>('analytics/getDistricts', async (payload, {dispatch, rejectWithValue}) => {
  try {
    // dispatch(setLoading(true));
    let response;
    // if (searchCriteria) {
    //   response = await api.post(
    //     endPoints.GET_DISTRICTS_BY_SEARCH +
    //       `searchCriteria=${searchCriteria}`,
    //     payload,
    //   );
    // } else {

    response = await api.post(endPoints.GET_DISTRICS_ANALYTICS, payload);
    console.log(
      'endPoints.GET_DISTRICS_ANALYTICS, payload---------',
      endPoints.GET_DISTRICS_ANALYTICS,
      payload,
    );
    // }
    return response.data as GetDistrictResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    // dispatch(setLoading(false));
  }
});

export const getAreas = createAsyncThunk<
  GetAreaResponse,
  [PaginationRequest, string?]
>('analytics/getAreas', async (payload, {dispatch, rejectWithValue}) => {
  try {
    // dispatch(setLoading(true));
    let response;
    // if (searchCriteria) {
    //   response = await api.post(
    //     endPoints.GET_AREAS_BY_SEARCH + `searchCriteria=${searchCriteria}`,
    //     payload,
    //   );
    // } else {
    response = await api.post(endPoints.GET_AREAS_ANALYTICS, payload);
    console.log('hhhh', api.post(endPoints.GET_AREAS_ANALYTICS, payload));
    // }
    return response.data as GetAreaResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    // dispatch(setLoading(false));
  }
});

export const getSchools = createAsyncThunk<
  GetSchoolResponse,
  [PaginationRequest, string?]
>('analytics/getSchools', async (payload, {dispatch, rejectWithValue}) => {
  try {
    // dispatch(setLoading(true));
    let response;
    // if(searchCriteria){
    //   response = await api.post(
    //     endPoints.GET_SCHOOLS_BY_SEARCH + `searchCriteria=${searchCriteria}`,
    //     payload,
    //   );
    // }else{
    response = await api.post(endPoints.GET_SCHOOLS, payload);
    //}
    return response.data as GetSchoolResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    // dispatch(setLoading(false));
  }
});

interface InitialState {
  userCountAnalytics: GetUserCountAnalyticsResponsePayload | null;
  teacherObservationAnalytics: GetTeacherObservationAnalyticsResponsePayload|null;
  userAndRoleCountAnalytics: GetUserAndRoleCountAnalyticsResponsePayload | null;
  formCountAnalytics: GetFormCountAnalyticsResponsePayload | null;
  formAnalytics: GetFormAnalyticsResponsePayload | null;
  observationCountAnalytics: GetObservationCountAnalyticsResponsePayload | null;
  observationAnalytics: GetObservationAnalyticsResponsePayload | null;
  rubricWiseObservationAnalytics: GetRubricWiseObservationAnalyticsResponsePayload | null;
  analyticsShowMessage: ErrorStatusObject | null;
  errorMessage: string;
  states: GetStatesResponsePayload | null;
  districts: GetAllDistrictResponsePayload | null;
  areas: GetAreaResponsePayload | null;
  activeAreas: GetAreaResponsePayload | null;
  inactiveAreas: GetAreaResponsePayload | null;
  activeDistricts: GetAllDistrictResponsePayload | null;
  inactiveDistricts: GetAllDistrictResponsePayload | null;
  schools: GetAllSchoolResponsePayload | null;
  userCountAnalyticsUserAndRole:GetUserCountAnalyticsUserAndRoleResponsePayload|null;
}

const initialState: InitialState = {
  userCountAnalytics: null,
  teacherObservationAnalytics:null,
  userAndRoleCountAnalytics: null,
  formCountAnalytics: null,
  formAnalytics: null,
  observationCountAnalytics: null,
  observationAnalytics: null,
  rubricWiseObservationAnalytics: null,
  analyticsShowMessage: null,
  errorMessage: '',
  states: null,
  districts: null,
  areas: null,
  activeAreas: null,
  inactiveAreas: null,
  activeDistricts: null,
  inactiveDistricts: null,
  schools: null,
  userCountAnalyticsUserAndRole:null
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getUserCountAnalyticsUserAndRole.pending, state => {
        state.userCountAnalyticsUserAndRole = null;
      })
      .addCase(getUserCountAnalyticsUserAndRole.fulfilled, (state, action) => {
        state.userCountAnalyticsUserAndRole = action.payload.payload;
      })
      .addCase(getUserCountAnalyticsUserAndRole.rejected, state => {
        state.userCountAnalyticsUserAndRole = null;
      })
      .addCase(getUserCountAnalytics.pending, state => {
        state.userCountAnalytics = null;
      })
      .addCase(getUserCountAnalytics.fulfilled, (state, action) => {
        state.userCountAnalytics = action.payload.payload;
      })
      .addCase(getUserCountAnalytics.rejected, state => {
        state.userCountAnalytics = null;
      })
      .addCase(getTeacherObservationAnalytics.pending, state => {
        state.teacherObservationAnalytics = null;
      })
      .addCase(getTeacherObservationAnalytics.fulfilled, (state, action) => {
        state.teacherObservationAnalytics = action.payload.payload;
      })
      .addCase(getTeacherObservationAnalytics.rejected, state => {
        state.teacherObservationAnalytics = null;
      })
      .addCase(getUserAndRoleCountAnalytics.pending, state => {
        state.userAndRoleCountAnalytics = null;
      })
      .addCase(getUserAndRoleCountAnalytics.fulfilled, (state, action) => {
        state.userAndRoleCountAnalytics = action.payload.payload;
      })
      .addCase(getUserAndRoleCountAnalytics.rejected, state => {
        state.userAndRoleCountAnalytics = null;
      })
      .addCase(getFormCountAnalytics.pending, state => {
        state.formCountAnalytics = null;
      })
      .addCase(getFormCountAnalytics.fulfilled, (state, action) => {
        state.formCountAnalytics = action.payload.payload;
      })
      .addCase(getFormCountAnalytics.rejected, state => {
        state.formCountAnalytics = null;
      })
      .addCase(getFormAnalytics.pending, state => {
        state.formAnalytics = null;
      })
      .addCase(getFormAnalytics.fulfilled, (state, action) => {
        state.formAnalytics = action.payload.payload;
      })
      .addCase(getFormAnalytics.rejected, state => {
        state.formAnalytics = null;
      })
      .addCase(getObservationCountAnalytics.pending, state => {
        state.observationAnalytics = null;
      })
      .addCase(getObservationCountAnalytics.fulfilled, (state, action) => {
        console.log('action---', action);
        state.observationCountAnalytics = action.payload.payload;
      })
      .addCase(getObservationCountAnalytics.rejected, state => {
        state.observationAnalytics = null;
      })
      .addCase(getObservationAnalytics.pending, state => {
        state.observationAnalytics = null;
      })
      .addCase(getObservationAnalytics.fulfilled, (state, action) => {
        state.observationAnalytics = action.payload.payload;
      })
      .addCase(getObservationAnalytics.rejected, state => {
        state.observationAnalytics = null;
      })
      .addCase(getRubricWiseObservationAnalytics.pending, state => {
        state.rubricWiseObservationAnalytics = null;
      })
      .addCase(getRubricWiseObservationAnalytics.fulfilled, (state, action) => {
        state.rubricWiseObservationAnalytics = action.payload.payload;
      })
      .addCase(getRubricWiseObservationAnalytics.rejected, state => {
        state.rubricWiseObservationAnalytics = null;
      })
      .addCase(getStates.rejected, (state, action) => {
        state.states = null;
      })
      .addCase(getStates.pending, state => {
        // state.states = null;
      })
      .addCase(getStates.fulfilled, (state, action) => {
        state.states = action.payload.payload;
      })
      .addCase(getDistricts.rejected, (state, action) => {
        state.districts = null;
      })
      .addCase(getDistricts.pending, state => {
        // state.states = null;
      })
      .addCase(getDistricts.fulfilled, (state, action) => {
        console.log('hhhh');
        state.districts = action.payload.payload;
      })
      .addCase(getAreas.rejected, (state, action) => {
        state.areas = null;
      })
      .addCase(getAreas.pending, state => {
        // state.states = null;
      })
      .addCase(getAreas.fulfilled, (state, action) => {
        state.areas = action.payload.payload;
      })
      .addCase(getSchools.rejected, (state, action) => {
        state.schools = null;
      })
      .addCase(getSchools.pending, state => {
        // state.states = null;
      })
      .addCase(getSchools.fulfilled, (state, action) => {
        state.schools = action.payload.payload;
      });
  },
});

export default analyticsSlice.reducer;
