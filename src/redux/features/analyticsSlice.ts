import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';
import {boolean, string} from 'yup';
import {DateFilterOption} from '../../components/Calendar';
import {filterPayload} from '../../utils/functions/apiUtils';
interface GetUserCountAnalyticsRequest {
  userStatusType: string;
  dateType: string;
  startDate: string;
  endDate: string;
}

interface GetUserCountAnalyticsUserAndRoleResponse {
  payload: {
    message: string;
    dataList: {
      userCount: Array<[string, string | number]>;
    };
  };
  status: number;
}

export const resetObservationById = createAction<void>(
  'RESET_OBSERVATION_BY_ID',
);
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
      totalObservationAverage: number[];
      totalIndicatorCount: number[];
      totalObservationCount: number[];
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

interface GetStatesDistrictSchoolResponse {
  payload: {
    dataList: {
      totalSchoolCount: number[]; // Array of numbers for total school count
      locationAnalytics: (string | number)[][]; // Array of arrays containing either string or number
      totalAreaCount: number[]; // Array of numbers for total area count
      totalDistrictCount: number[]; // Array of numbers for total district count
    };
  };
  status: number;
}

type GetStatesDistrictSchoolResponsePayload = GetStatesDistrictSchoolResponse['payload'];

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

export const getObservationById = createAsyncThunk<
  GetObservationByIdResponse,
  number,
  {rejectValue: ErrorResponse}
>('observation/getObservationById', async (id, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.ANALYTICS_OBSERVATION_BY_ID + id);
    console.log(
      '[API] Success:--------',
      endPoints.OBSERVATION_ANALYTICS_BY_USER_ID + id,
    );
    console.log('response===', response?.data);
    return response.data as GetObservationByIdResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

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
interface UserList {
  userId: number;
  userName: string;
  name: string;
  contactNumber: string;
  email: string;
  dateOfBirth: string;
  grade: string;
  role: string;
  state: string;
  district: string;
  area: string;
  school: string;
  citizenship: string;
  userType: string;
  status: true;
  roleId: number;
  stateId: number;
  districtId: number;
  areaId: number;
  schoolId: number;
  createdDate: string;
}

interface GetUserSearchAnalyticsResponse {
  payload: {
    message: string;
    dataList: UserList[];
  };
  status: number;
}

type GetUserSearchAnalyticsResponsePayload =
  GetUserSearchAnalyticsResponse['payload'];

export const getUserSearchAnalytics = createAsyncThunk<
  GetUserSearchAnalyticsResponse,
  void,
  {rejectValue: ErrorResponse}
>('analytics/search', async (_, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.USER_SEARCH_LIST);
    return response.data as GetUserSearchAnalyticsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const getUserSearchAnalyticsById = createAsyncThunk<
  GetUserSearchAnalyticsResponse,
  void,
  {rejectValue: ErrorResponse}
>('analytics/search', async (_, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.USER_SEARCH_LIST);
    return response.data as GetUserSearchAnalyticsResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

interface Tags {
  tagId: number;
  tagName: string;
}

interface Indicatorsanalytics {
  domainId: number;
  domainName: string;
  indicatorId: number;
  indicatorName: string;
  indicatorDescription: string;
  tags: Tags[];
  status: boolean;
}

interface GetIndicatorsResponse {
  payload: {
    message: string;
    dataList: Indicatorsanalytics[];
  };
  status: number;
}
type GetAllObservationsResponsePayload = GetAllObservationsResponse['payload'];

type GetIndicatorsResponsePayload = GetIndicatorsResponse['payload'];

export const getIndicators = createAsyncThunk<
  GetIndicatorsResponse,
  string,
  {rejectValue: ErrorResponse}
>(
  'analytics/indicatorsByNameSearch?searchCriteria',
  async (indicatorName, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(endPoints.GET_INDICATORS + indicatorName);
      console.log(
        'endPoints.GET_INDICATORS + indicatorName================',
        endPoints.GET_INDICATORS + indicatorName,
      );

      return response.data as GetIndicatorsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

interface userList {
  userId: 1;
  userName: string;
  name:string;
  contactNumber: string;
  email: string;
  dateOfBirth: string;
  grade: string;
  role: string;
  state: string;
  district: string;
  area: string;
  school: string;
  citizenship: string;
  userType: string;
  status: boolean;
  roleId: number;
  stateId: number;
  districtId: number;
  areaId: number;
  schoolId: number;
  createdDate: string;
}

interface GetSearchResponse {
  payload: {
    message: string;
    dataList: userList[];
  };
  status: number;
}

type GetSearchResponsePayload = GetSearchResponse['payload'];

export const getSearch = createAsyncThunk<
  GetSearchResponse,
  string,
  {rejectValue: ErrorResponse}
>(
  'analytics/metadata/search?searchCriteria',
  async (userName, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(endPoints.ANALYTICS_SEARCH + userName);
      // console.log(
      //   'endPoints.GET_INDICATORS + indicatorName================1111111',
      //   endPoints.GET_INDICATORS + userName,
      // );
//console.log("res=======",response.data.dataList);

      return response.data as GetSearchResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);
// export const getIndicatorsByDomainId = createAsyncThunk<
//   GetIndicatorsResponse,
//   number
// >(
//   'master/getIndicatorsByDomainId',
//   async (userId, {dispatch, rejectWithValue}) => {
//     try {
//       dispatch(setLoading(true));
//       const response = await api.get(
//         endPoints.GET_INDICATORS_BY_DOMAIN_ID + userId,
//       );
//       return response.data as GetIndicatorsResponse;
//     } catch (error: any) {
//       return rejectWithValue(error.response.data);
//     } finally {
//       dispatch(setLoading(false));
//     }
//   },
// );

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
      console.log('jjjjj====', endPoints.GET_FORM_COUNT_AND_RESPONSE, payload);
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
      console.log('llllll-----', endPoints.RUBRIC_WIESE_OBSERVATION, payload);
      return response.data as GetRubricWiseObservationAnalyticsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getStatesDistrictSchool = createAsyncThunk<GetStatesDistrictSchoolResponse, PaginationRequest>(
  'analytics/getStatesSchoolsDistrict',
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
      response = await api.post(endPoints.COUNT_OF_STATE_DISTRICT_SCHOOL, payload);
      // }
      //console.log('--------', response?.data);
      return response.data as GetStatesDistrictSchoolResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      // dispatch(setLoading(false));
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

export type ObservationStatus = 'Completed' | 'Pending';
export type FilterType = 'All' | 'byMe' | 'forMe';

export const getAllObservations = createAsyncThunk<
  GetAllObservationsResponse,
  [number, ObservationRequest],
  {rejectValue: ErrorResponse}
>(
  'analytics/getAllObservations',
  async ([id, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));

      const filteredPayload = filterPayload(payload);
      console.log('filteredPayload:', filteredPayload);

      console.log('payload.paginationRequest:', payload.paginationRequest);
      console.log('payload.filterType:', payload.filterType);

      const response = await api.post(
        endPoints.ANALYTICS_DASHBOARD_FILTER + id,
        {
          ...filteredPayload,
          paginationRequest: payload.paginationRequest,
          filterType: payload.filterType,
        },
      );
      //console.log('API response:------11111@@@@@@@@@@', response?.data?.payload?.dataList?.observations?.[0]);
      console.log(
        'API response:------11111',
        endPoints.ANALYTICS_DASHBOARD_FILTER + id,
        {
          ...filteredPayload,
          paginationRequest: payload.paginationRequest,
          filterType: payload.filterType,
        },
      );

      // console.log('[API] Success:', response.data?.dataList[0]);
      return response.data as GetAllObservationsResponse;
    } catch (error: any) {
      //console.log('errrrrr---', error);
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
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
    response = await api.post(endPoints.GET_AREAS_SCHOOL, payload);
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
  teacherObservationAnalytics: GetTeacherObservationAnalyticsResponsePayload | null;
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
  userCountAnalyticsUserAndRole: GetUserCountAnalyticsUserAndRoleResponsePayload | null;
  indicatorList: GetIndicatorsResponsePayload | null;
  userSearchAnalytics: GetUserSearchAnalyticsResponsePayload | null;
  allObservations: GetAllObservationsResponsePayload | null;
  observationShowMessage: ErrorStatusObject | null;
  observationById: GetObservationByIdResponsePayload | null;
  search:GetSearchResponsePayload |null;
  observationId: number | null;
  statesDistrictSchool:GetStatesDistrictSchoolResponsePayload | null;
}

const initialState: InitialState = {
  userCountAnalytics: null,
  observationId: null,
  teacherObservationAnalytics: null,
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
  userCountAnalyticsUserAndRole: null,
  indicatorList: null,
  userSearchAnalytics: null,
  allObservations: null,
  observationShowMessage: null,
  observationById: null,
  search:null,
  statesDistrictSchool:null
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
      .addCase(getUserSearchAnalytics.pending, state => {
        state.userSearchAnalytics = null;
      })
      .addCase(getUserSearchAnalytics.fulfilled, (state, action) => {
        state.userSearchAnalytics = action.payload.payload;
      })
      .addCase(getUserSearchAnalytics.rejected, state => {
        state.userSearchAnalytics = null;
      })
      .addCase(getIndicators.pending, state => {
        state.indicatorList = null;
      })
      .addCase(getIndicators.fulfilled, (state, action) => {
        state.indicatorList = action.payload.payload;
      })
      .addCase(getIndicators.rejected, state => {
        state.indicatorList = null;
      })
      .addCase(getSearch.pending, state => {
        state.search = null;
      })
      .addCase(getSearch.fulfilled, (state, action) => {
        state.search = action.payload.payload;
      })
      .addCase(getSearch.rejected, state => {
        state.search = null;
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
      .addCase(getStatesDistrictSchool.rejected, (state, action) => {
        state.statesDistrictSchool = null;
      })
      .addCase(getStatesDistrictSchool.pending, state => {
        // state.states = null;
      })
      .addCase(getStatesDistrictSchool.fulfilled, (state, action) => {
        state.statesDistrictSchool = action.payload.payload;
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
      .addCase(resetObservationById, (state, action) => {
        state.observationById = null;
        state.observationId = null;
      })
      .addCase(getSchools.rejected, (state, action) => {
        state.schools = null;
      })
      .addCase(getSchools.pending, state => {
        // state.states = null;
      })
      .addCase(getSchools.fulfilled, (state, action) => {
        state.schools = action.payload.payload;
      })

      .addCase(getAllObservations.pending, state => {
        // state.isLoading = true;
        state.allObservations = null;
      })
      .addCase(getAllObservations.fulfilled, (state, action) => {
        state.allObservations = action.payload.payload;
      })
      .addCase(getAllObservations.rejected, (state, action) => {
        state.observationShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default analyticsSlice.reducer;
