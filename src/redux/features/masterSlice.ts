import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';
import {PaginationRequest} from './usersSlice';
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

export interface Role {
  roleId: number;
  roleName: string;
  roleLevel: string;
  parentRole: string;
  createdBy: string;
  createdDt: string;
  users: number;
  status: boolean;
}

interface GetRolesResponse {
  payload: {
    message: string;
    dataList: Role[];
    totalCount: number;
  };
  status: number;
}
type GetRolesResponsePayload = GetRolesResponse['payload'];

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

interface AllUserNotificationRequest {
  page: number;
  size: string;
  type: string;
}

interface YesterDayNotification {
  userNotificationId: number;
  templateId: number;
  content: string;
  isRead: boolean;
  createdDate: string;
}

interface WeekNotification {
  userNotificationId: number;
  templateId: number;
  content: string;
  isRead: boolean;
  createdDate: string;
}
interface MonthNotification {
  userNotificationId: number;
  templateId: number;
  content: string;
  isRead: boolean;
  createdDate: string;
}
interface TodayNotification {
  userNotificationId: number;
  templateId: number;
  content: string;
  isRead: boolean;
  createdDate: string;
}

interface AllUserNotificationResponse {
  payload: {
    message: string;
    dataList: {
      yesterday: YesterDayNotification[];
      week: WeekNotification[];
      month: MonthNotification[];
      today: TodayNotification[];
      todayCount: number;
      yesterdayCount: number;
      isNewNotification: boolean;
      weekCount: number;
      monthCount: number;
    };
  };
  status: number;
}

type AllUserNotificationResponsePayload =
  AllUserNotificationResponse['payload'];

interface CreateNotificationRequest {
  userId: number;
  startDateTime: string;
  endDateTime: string;
  emailList: [];
  title: string;
}

export interface CreateNotificationResponse {
  payload: any;
  message: string;
}

type CreateNotificationResponsePayload = CreateNotificationResponse[];

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

export const getRoles = createAsyncThunk<
  GetRolesResponse,
  [PaginationRequest, string?]
>(
  'master/getRoles',
  async ([payload, searchCriteria], {dispatch, rejectWithValue}) => {
    try {
      // dispatch(setLoading(true));
      let response;
      if (searchCriteria) {
        response = await api.post(
          endPoints.GET_ROLES_BY_SEARCH + `searchCriteria=${searchCriteria}`,
          payload,
        );
      } else {
        response = await api.post(endPoints.GET_ROLES, payload);
      }
      return response.data as GetRolesResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      // dispatch(setLoading(false));
    }
  },
);

export const getStates = createAsyncThunk<GetStatesResponse, PaginationRequest>(
  'master/getStates',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      // dispatch(setLoading(true));
      let response;
      // if(searchCriteria){
      //   response = await api.post(
      //     endPoints.GET_STATES_BY_SEARCH + `searchCriteria=${searchCriteria}`,
      //     payload,
      //   );
      // }else{
      response = await api.post(endPoints.GET_STATES, payload);
      // }
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
  [PaginationRequest, string?]
>(
  'master/getDistricts',
  async ([payload, searchCriteria], {dispatch, rejectWithValue}) => {
    try {
      // dispatch(setLoading(true));
      let response;
      if (searchCriteria) {
        response = await api.post(
          endPoints.GET_DISTRICTS_BY_SEARCH +
            `searchCriteria=${searchCriteria}`,
          payload,
        );
      } else {
        response = await api.post(endPoints.GET_DISTRICTS, payload);
      }
      return response.data as GetDistrictResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      // dispatch(setLoading(false));
    }
  },
);

export const getAreas = createAsyncThunk<
  GetAreaResponse,
  [PaginationRequest, string?]
>(
  'master/getAreas',
  async ([payload, searchCriteria], {dispatch, rejectWithValue}) => {
    try {
      // dispatch(setLoading(true));
      let response;
      if (searchCriteria) {
        response = await api.post(
          endPoints.GET_AREAS_BY_SEARCH + `searchCriteria=${searchCriteria}`,
          payload,
        );
      } else {
        response = await api.post(endPoints.GET_AREAS, payload);
        //console.log('hhhh', api.post(endPoints.GET_AREAS, payload));
      }
      return response.data as GetAreaResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      // dispatch(setLoading(false));
    }
  },
);

export const getSchools = createAsyncThunk<
  GetSchoolResponse,
  [PaginationRequest, string?]
>(
  'master/getSchools',
  async ([payload, searchCriteria], {dispatch, rejectWithValue}) => {
    try {
      // dispatch(setLoading(true));
      let response;
      if (searchCriteria) {
        response = await api.post(
          endPoints.GET_SCHOOLS_BY_SEARCH + `searchCriteria=${searchCriteria}`,
          payload,
        );
      } else {
        response = await api.post(endPoints.GET_SCHOOLS, payload);
      }
      return response.data as GetSchoolResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      // dispatch(setLoading(false));
    }
  },
);

export const allUserNotification = createAsyncThunk<
  AllUserNotificationResponse,
  [AllUserNotificationRequest, any?]
>(
  'notification/allUserNotification',
  async ([userId, payload], {dispatch, rejectWithValue}) => {
    try {
      //dispatch(setLoading(true));
      const response = await api.post(
        endPoints.ALL_USER_NOTIFICATION + userId + `?isVisible=mobile`,
        payload,
      );
    dispatch(updateFirebaseFlag())
      //console.log(response,'<====')

      return response.data as AllUserNotificationResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const createNotification = createAsyncThunk<
  CreateNotificationResponse,
  [CreateNotificationRequest, string?]
>(
  'notification/createNotification',
  async ([payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post(endPoints.CREATE_NOTIFICATION, payload);

      return response.data as CreateNotificationResponse;
    } catch (error: any) {
      console.log(error, '----error');

      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const readNotification = createAsyncThunk(
  'notification/readNotification',
  async (userNotificationId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `notification/read?userNotificationId=${userNotificationId}`
      );
      //console.log("ll;;;=====",response.data);
      
      return response.data; // Ensure the correct data is returned if needed
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateFirebaseFlag = createAsyncThunk(
  'notification/updateFirebaseFlag',
  async (_, {dispatch, rejectWithValue,getState}) => {
    try {
      let userId = getState().auth?.userData?.id;
      const  response = await api.put(`notification/updateUser?userId=${userId}`);
 

      return response.data?.payload;
    } catch (error) {
      return rejectWithValue(error.response.data?.error);
    }
  }
);


interface InitialState {
  allDomains: GetDomainsResponse | null;
  indicatorsByDomain: GetIndicatorsResponsePayload | null;
  allRoles: GetRolesResponsePayload | null;
  activeRoles: GetRolesResponsePayload | null;
  inactiveRoles: GetRolesResponsePayload | null;
  states: GetStatesResponsePayload | null;
  allDistricts: GetAllDistrictResponsePayload | null;
  activeDistricts: GetAllDistrictResponsePayload | null;
  inactiveDistricts: GetAllDistrictResponsePayload | null;
  allAreas: GetAreaResponsePayload | null;
  activeAreas: GetAreaResponsePayload | null;
  inactiveAreas: GetAreaResponsePayload | null;
  allSchools: GetAllSchoolResponsePayload | null;
  activeSchools: GetAllSchoolResponsePayload | null;
  inactiveSchools: GetAllSchoolResponsePayload | null;
  masterShowMessage: ErrorStatusObject | null;
  notificationResponse: AllUserNotificationResponsePayload | null;
  createNotificationRes: CreateNotificationResponsePayload | null;
  errorMessage: string;
}

const initialState: InitialState = {
  allDomains: null,
  indicatorsByDomain: null,
  allRoles: null,
  activeRoles: null,
  inactiveRoles: null,
  states: null,
  allDistricts: null,
  activeDistricts: null,
  inactiveDistricts: null,
  allAreas: null,
  activeAreas: null,
  inactiveAreas: null,
  allSchools: null,
  activeSchools: null,
  inactiveSchools: null,
  masterShowMessage: null,
  notificationResponse: null,
  errorMessage: '',
  createNotificationRes: null,
};

const masterSlice = createSlice({
  name: 'master',
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
      .addCase(getRoles.rejected, (state, action) => {
        state.allRoles = null;
      })
      .addCase(getRoles.pending, state => {
        // state.allRoles = null;
      })
      .addCase(getRoles.fulfilled, (state, action) => {
        if (action.meta.arg[0].type === 'all') {
          state.allRoles = action.payload.payload;
        } else if (action.meta.arg[0].type === true) {
          state.activeRoles = action.payload.payload;
        } else {
          state.inactiveRoles = action.payload.payload;
        }
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
      .addCase(allUserNotification.rejected, (state, action) => {
        state.notificationResponse = null;
      })
      .addCase(allUserNotification.pending, state => {
        // state.states = null;
      })
      .addCase(allUserNotification.fulfilled, (state, action) => {
        state.notificationResponse = action.payload.payload;
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.createNotificationRes = null;
      })
      .addCase(createNotification.pending, state => {
        // state.states = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.createNotificationRes = action.payload.payload;
      })
      .addCase(getDistricts.rejected, (state, action) => {
        state.allDistricts = null;
        state.activeDistricts = null;
        state.inactiveDistricts = null;
      })
      .addCase(getDistricts.pending, state => {})
      .addCase(getDistricts.fulfilled, (state, action) => {
        if (action.meta.arg[0].type === 'all') {
          state.allDistricts = action.payload.payload;
        } else if (action.meta.arg[0].type === true) {
          state.activeDistricts = action.payload.payload;
        } else {
          state.inactiveDistricts = action.payload.payload;
        }
      })
      .addCase(getAreas.rejected, (state, action) => {
        state.allAreas = null;
      })
      .addCase(getAreas.pending, state => {
        state.allAreas = null;
      })
      .addCase(getAreas.fulfilled, (state, action) => {
        if (action.meta.arg[0].type === 'all') {
          state.allAreas = action.payload.payload;
        } else if (action.meta.arg[0].type === true) {
          state.activeAreas = action.payload.payload;
        } else {
          state.inactiveAreas = action.payload.payload;
        }
      })
      .addCase(getSchools.rejected, (state, action) => {
        state.allSchools = null;
        state.activeSchools = null;
        state.inactiveSchools = null;
      })
      .addCase(getSchools.pending, state => {
        state.activeRoles = null;
      })
      .addCase(getSchools.fulfilled, (state, action) => {
        if (action.meta.arg[0].type === 'all') {
          state.allSchools = action.payload.payload;
        } else if (action.meta.arg[0].type === true) {
          state.activeSchools = action.payload.payload;
        } else {
          state.inactiveSchools = action.payload.payload;
        }
      })
      .addCase(getAllDomains.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getIndicatorsByDomainId.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getIndicatorsByDomainId.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.indicatorsByDomain = action.payload.payload;
      })
      .addCase(getIndicatorsByDomainId.rejected, (state, action) => {
        // state.isLoading = false;
      });
  },
});

export default masterSlice.reducer;
