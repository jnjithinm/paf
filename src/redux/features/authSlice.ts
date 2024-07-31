import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import Config from 'react-native-config';

import api from '../../config/axios';
import {
  getToken,
  removeToken,
  storeToken,
} from '../../utils/functions/localStorageOperations';
import endPoints from '../../config/endPoints';
import {ErrorStatusObject, FileObject} from '../../config/types';
import {ParentRoles, UserTypes} from '../../config/constants';
import {getRoleLevel} from '../../components/DrawerContent';
import RNFetchBlob from 'rn-fetch-blob';
import {logRequest} from '../../utils/functions/apiUtils';

interface AuthenticateRequest {
  username: string;
  password: string;
}

interface AuthenticateResponse {
  payload: {
    token: string;
  };
}

type PageItem = {
  pageId: number;
  module: {
    moduleId: number;
    moduleName: string;
    description: string;
    status: boolean;
    isDeleted: boolean;
    hasChildren: boolean;
  };
  pageName: string;
  status: boolean;
  category: string;
};

type PageData = {
  [moduleName: string]: PageItem[] | [];
};

interface LoginResponse {
  payload: {
    id: number;
    message: string;
    userName: string;
    name: string;
    role: string;
    roleId: number;
    roleType: ParentRoles;
    isAdmin: boolean;
    userImage: string;
    userImageUrl: string;
    status: boolean;
    pageData: PageData;
  };
  status: number;
}

interface ForgotPasswordResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type ForgotPasswordResponsePayload = ForgotPasswordResponse['payload'];

interface UpdateUserDetailsRequest {
  name: string;
  contactNumber: string;
  email: string;
  dateOfBirth: string;
  grade?: string;
  area: number;
  userType: string;
  citizenship: string;
  status: boolean;
  roleId: number;
  stateId: number;
  districtId: number;
  moduleId?: number;
  schoolId: number;
  isAdmin?: boolean;
  loggedInUserName: string;
}

interface UpdateUserDetailsResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type UpdateUserDetailsResponsePayload = UpdateUserDetailsResponse['payload'];

interface UpdateUserPhotoResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type UpdateUserPhotoResponsePayload = UpdateUserPhotoResponse['payload'];

interface DeleteUserPhotoResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type DeleteUserPhotoResponsePayload = DeleteUserPhotoResponse['payload'];

export interface ErrorResponseObject {
  errorCode: string;
  errorMessage: string;
  id: string;
  time: number;
}

export interface ErrorResponse {
  error: ErrorResponseObject;
  status: number;
}

export const logoutAndclearToken = createAction<void>('LOGOUT_AND_CLEAR_TOKEN');

export const changeBottomTabBarVisibility = createAction<boolean>(
  'CHANGE_BOTTOM_TAB_BAR_VISIBILITY',
);

export const setLoading = createAction<boolean>('SET_LOADING');

export const setAuthShowMessage = createAction<ErrorStatusObject | null>(
  'SET_AUTH_SHOW_MESSAGE',
);

export const resetUsernamePasswordErrorMessages = createAction<void>(
  'RESET_USERNAME_PASSWORD_ERROR_MESSAGES',
);

export const resetPasswordResponse = createAction<void>(
  'RESET_PASSWORD_RESPONSE',
);

export const resetUpdateUserResponse = createAction<void>(
  'RESET_UPDATE_USER_RESPONSE',
);

export const resetUpdateUserPhotoResponse = createAction<void>(
  'RESET_UPDATE_USER_PHOTO_RESPONSE',
);

export const resetDeleteUserPhotoResponse = createAction<void>(
  'RESET_DELETE_USER_PHOTO',
);

export const saveUpdatedUserPhoto = createAction<string>(
  'SAVE_UPDATED_USER_PHOTO',
);

export const authenticateUser = createAsyncThunk<
  AuthenticateResponse,
  AuthenticateRequest,
  {rejectValue: ErrorResponse}
>('auth/authenticate', async (payload, {dispatch, rejectWithValue}) => {
  console.log("login----11111111")
  try {
    dispatch(setLoading(true));
    await removeToken();
    const response = await api.post(endPoints.AUTHENTICATE_USER, payload);
    console.log("login----",endPoints.AUTHENTICATE_USER, payload)
    await storeToken(response.data.payload.token);
    return response.data as AuthenticateResponse;
  } catch (error: any) {
    console.log('errr1111', error);
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(true));
    await dispatch(loginUser(payload));
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  AuthenticateRequest,
  {rejectValue: ErrorResponse}
>('auth/login', async (payload, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.post(endPoints.LOGIN_USER, payload);
    return response.data as LoginResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const forgotPassword = createAsyncThunk<
  ForgotPasswordResponse,
  string,
  {rejectValue: ErrorResponse}
>(
  'auth/forgotPassword',
  async (loggedInUserName, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(
        endPoints.FORGOT_PASSWORD + loggedInUserName,
      );
      return response.data as ForgotPasswordResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const updateUserDetails = createAsyncThunk<
  UpdateUserDetailsResponse,
  [number, UpdateUserDetailsRequest],
  {rejectValue: ErrorResponse}
>(
  'auth/updateUserDetails',
  async ([userId, payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.put(endPoints.UPDATE_USER + userId, payload);
      return response.data as UpdateUserDetailsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);
export const deleteUserPhoto = createAsyncThunk<
  UpdateUserDetailsResponse,
  [number, string],
  {rejectValue: ErrorResponse}
>(
  'auth/deleteUserPhoto',
  async ([userId, loggedInUserName], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.delete(
        endPoints.DELETE_USER_PHOTO +
          userId +
          `?loggedInUserName=${loggedInUserName}`,
      );
      return response.data as UpdateUserDetailsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const updateUserPhoto = createAsyncThunk<
  UpdateUserDetailsResponse,
  [number, FileObject, string],
  {rejectValue: ErrorResponse}
>(
  'auth/updateUserPhoto',
  async ([userId, file, loggedInUserName], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const token = await getToken();
      const {BASE_URL}=Config;
      const formData = [
        {
          name: 'profilePhoto',
          filename: file.name,
          type: file.type,
          data: RNFetchBlob.wrap(file.uri),
        },
        {name: 'loggedInUserName', data: loggedInUserName},
      ];
      const requestUrl =
        BASE_URL + '/' + endPoints.UPDATE_USER_PHOTO + `${userId}`;
      const response = await RNFetchBlob.fetch(
        'PUT',
        requestUrl,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        formData,
      );
      logRequest('PUT', requestUrl, JSON.stringify(formData));
      const data = JSON.parse(response.data);
      return data as UpdateUserDetailsResponse;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data ?? {message: 'An error occurred'},
      );
    } finally {
      dispatch(setLoading(false));
    }
  },
);

interface initialState {
  isLoading: boolean;
  isLoggedIn: boolean;
  userData: {
    id: number;
    userName: string;
    name: string;
    role: string;
    roleId: number;
    roleType: ParentRoles | null;
    isAdmin: boolean;
    userImage: string;
    userImageUrl: string;
  };
  isAdmin: boolean;
  pageData: PageData | null;
  moduleNames: string[] | null;
  updateUserResponse: UpdateUserDetailsResponsePayload | null;
  forgotPasswordResponse: ForgotPasswordResponsePayload | null;
  updateUserPhotoResponse: UpdateUserPhotoResponsePayload | null;
  deleteUserPhotoResponse: DeleteUserPhotoResponsePayload | null;
  authShowMessage: ErrorStatusObject | null;
  passwordErrorMessage: string;
  usernameErrorMessage: string;
}

const initialState: initialState = {
  isLoading: false,
  isLoggedIn: false,
  userData: {
    id: 0,
    userName: '',
    name: '',
    role: '',
    roleId: 0,
    roleType: null,
    isAdmin: false,
    userImage: '',
    userImageUrl: '',
  },
  isAdmin: false,
  pageData: null,
  moduleNames: null,
  updateUserResponse: null,
  forgotPasswordResponse: null,
  updateUserPhotoResponse: null,
  deleteUserPhotoResponse: null,
  authShowMessage: null,
  passwordErrorMessage: 'sfdds',
  usernameErrorMessage: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initateLogout(state) {
      state.isLoggedIn = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(logoutAndclearToken, () => {
        removeToken();
        return initialState;
      })
      .addCase(setLoading, (state, action) => {
        state.isLoading = action.payload;
      })
      .addCase(resetPasswordResponse, state => {
        state.forgotPasswordResponse = null;
      })
      .addCase(resetUpdateUserResponse, state => {
        state.updateUserResponse = null;
      })
      .addCase(resetUpdateUserPhotoResponse, state => {
        state.updateUserPhotoResponse = null;
      })
      .addCase(resetDeleteUserPhotoResponse, state => {
        state.deleteUserPhotoResponse = null;
      })
      .addCase(saveUpdatedUserPhoto, (state, action) => {
        state.userData.userImageUrl = action.payload;
      })
      .addCase(setAuthShowMessage, (state, action) => {
        state.authShowMessage = action.payload;
      })
      .addCase(resetUsernamePasswordErrorMessages, (state, action) => {
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(authenticateUser.pending, state => {
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        storeToken(action.payload?.payload?.token);
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        if (action?.payload?.error?.errorMessage) {
          state.usernameErrorMessage = 'Invalid username entered';
        } else {
          state.passwordErrorMessage = 'Invalid password entered';
        }
      })

      .addCase(updateUserDetails.pending, state => {
        state.updateUserResponse = null;
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.updateUserResponse = action.payload.payload;
        state.authShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message?.toString(),
        };
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.updateUserResponse = null;
        state.authShowMessage = {
          status: 'Informative',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
      .addCase(loginUser.pending, state => {
        state.isLoading = true;
        state.isLoading = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
        state.userData = action.payload.payload;
        state.pageData = action.payload.payload.pageData;
        state.isAdmin = Boolean(
          getRoleLevel(action.payload.payload.roleType) === UserTypes.PAF_USER,
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
      })
      .addCase(forgotPassword.pending, state => {
        state.passwordErrorMessage = '';
        state.usernameErrorMessage = '';
        state.forgotPasswordResponse = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPasswordResponse = action.payload.payload;
        state.authShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message?.toString(),
        };
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.forgotPasswordResponse = null;
        state.authShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })

      .addCase(updateUserPhoto.pending, state => {})
      .addCase(updateUserPhoto.fulfilled, (state, action) => {
        state.updateUserPhotoResponse = action.payload.payload;
        console.log('efsf', action.payload);
        state.authShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message?.toString(),
        };
      })
      .addCase(updateUserPhoto.rejected, (state, action) => {
        console.log('efsf errrrr', action.payload);
        state.updateUserPhotoResponse = null;
        state.authShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })

      .addCase(deleteUserPhoto.pending, state => {})
      .addCase(deleteUserPhoto.fulfilled, (state, action) => {
        state.deleteUserPhotoResponse = action.payload.payload;
        state.authShowMessage = {
          status: 'Success',
          message: action?.payload?.payload?.message?.toString(),
        };
      })
      .addCase(deleteUserPhoto.rejected, (state, action) => {
        state.deleteUserPhotoResponse = null;
        state.authShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      });
  },
});

export default authSlice.reducer;
