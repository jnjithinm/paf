import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {ErrorResponse, setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';

interface Indicator {
  domainId: number;
  domainName: string;
  indicatorId: number;
  indicatorName: string;
}

export interface IndicatorIndividualResponse {
  domainId: number;
  domainName: string;
  indicatorId: number;
  indicatorName: string;
  avgRating: number;
}

export interface Question {
  questionId: number;
  questionText: string;
  indicators: Indicator[];
}

export interface QuestionWiseResponse {
  name: string;
  userName: string;
  responseValues: string;
  responseDate: string;
}

interface QuestionWiseResponses {
  [key: string]: QuestionWiseResponse[];
}

export interface IndividualResponse {
  userId: number;
  userName: string;
  name: string;
  questionAvgRating:number;
  responses: {
    questionId: number;
    questionText: string;
    responseValues: string;
    responseDate: string;
    indicators: IndicatorIndividualResponse[];
  }[];
}

interface FormDetails {
  formId: number;
  formName: string;
  formText: string;
  formDescription: string;
  isDraft: boolean;
  questionImage1: string;
  questionImage1Desc: string;
  questionImage2Desc: string;
  questionImage3Desc: string;
  questionImage4Desc: string;
  questionImage5Desc: string;
  questionVideo1Desc: string;
  questionVideo2Desc: string;
  questionVideo3Desc: string;
  questionVideo4Desc: string;
  questionVideo5Desc: string;
  questionFile1Desc: string;
  questionFile2Desc: string;
  questionFile3Desc: string;
  questionFile4Desc: string;
  questionFile5Desc: string;
  questionLink1: string;
  questionLink1Desc: string;
  questionLink2: string;
  questionLink2Desc: string;
  questionLink3: string;
  questionLink3Desc: string;
  questionLink4: string;
  questionLink4Desc: string;
  questionLink5: string;
  questionLink5Desc: string;
  status: boolean;
  acceptingResponse: boolean;
  totalQuestions: number;
  questionWiseResponses: QuestionWiseResponses;
  questionList: Question[];
  individualResponses: IndividualResponse[];
}

interface GetFormByIdResponse {
  payload: {
    message: string;
    dataList: FormDetails;
  };
  status: number;
}

type GetAllFlowsResponsePayload = GetFormByIdResponse['payload'];

export interface QuestionOption {
  optionMappingId: number;
  optionText: string;
}

export interface IndicatorPreviewForm {
  domainId: number;
  indicatorId: number;
  indicatorName: string;
  indicatorDescription: string;
  status: boolean;
}

type QuestionTypes =
  | 'Question 3 description'
  | 'Question 2 Time Type'
  | 'Question 3 Dropdown Type'
  | 'Question 1 Short answer Type'
  | 'Question 2 Date type';

interface QuestionPreviewForm {
  questionOptionId: number;
  questionId: number;
  questionText: string;
  questionDescription: QuestionTypes;
  isRequired: boolean;
  questionOptions: QuestionOption[];
  indicators: IndicatorPreviewForm[];
}

interface Section {
  sectionId: number;
  sectionName: string;
  sectionDescription: string;
  sectionOrder: number;
  questions: QuestionPreviewForm[];
}

interface GetPreviewFormResponse {
  payload: {
    message: string;
    dataList: {
      formId: number;
      formName: string;
      formText: string;
      formDescription: string;
      isDraft: boolean;
      status: boolean;
      acceptingResponse: boolean;
      sections: Section[];
    };
  };
  status: number;
}

type GetPreviewFormResponsePayload = GetPreviewFormResponse['payload'];

export type IndicatorRatingType = Array<{[key: number]: number}>;

export type FormSubmission = {
  questionId: number;
  questionOptionId: number;
  optionMappingId: number | null;
  responseValue: string | null;
  indicatorRating: string | null;
};

type SubmitPreviewFormRequest = {
  flowId: number;
  formId: number;
  userId: number;
  formQuestionRequestList: FormSubmission[];
};

interface SubmitPreviewFormResponse {
  payload: {
    id: number;
    message: string;
  };
  status: number;
}

type SubmitPreviewFormResponsePayload = SubmitPreviewFormResponse['payload'];

interface AcceptingFormResponsesRequest {
  formId: number;
  isActive: boolean;
  loggedInUserName: string;
}

interface AcceptingFormResponsesResponse {
  payload: {
    message: string;
  };
  status: number;
}

type AcceptingFormResponsesResponsePayload =
  AcceptingFormResponsesResponse['payload'];

interface AssignFormRequest {
  userIds: number[];
  userGroupIds: number[];
  flowId: number;
  formId: number;
  loggedInUserName: string;
}

interface AssignFormResponse {
  payload: {
    message: string;
  };
  status: number;
}

type AssignFormResponsePayload = AssignFormResponse['payload'];


interface DeleteFormRequest{
  ids: number[];
  loggedInUserName: string;
}

interface DeleteFormResponse{
  payload: {
    message: string;
  };
  status: number;
}

export const setFormsShowMessage = createAction<ErrorStatusObject | null>(
  'SET_FORMS_SHOW_MESSAGE',
);

export const resetAssignFormResponse = createAction<void>(
  'RESET_ASSIGN_FORM_RESPONSE',
);

export const resetDeleteFormResponse = createAction<void>(
  'RESET_DELETE_FORM_RESPONSE',
);

export const getFormById = createAsyncThunk<
  GetFormByIdResponse,
  [number, number],
  {rejectValue: ErrorResponse}
>(
  'forms/getFormById',
  async ([formId, flowId], {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(
        endPoints.GET_FORM_BY_ID + formId + `?flowId=${flowId}`,
      );
      return response.data as GetFormByIdResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getPreviewForm = createAsyncThunk<
  GetPreviewFormResponse,
  number,
  {rejectValue: ErrorResponse}
>('forms/getPreviewForm', async (formId, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(endPoints.GET_PREVIEW_FORM + formId);
    return response.data as GetPreviewFormResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const submitPreviewForm = createAsyncThunk<
  SubmitPreviewFormResponse,
  SubmitPreviewFormRequest,
  {rejectValue: ErrorResponse}
>('forms/submitPreviewForm', async (payload, {dispatch, rejectWithValue}) => {
  try {
    dispatch(setLoading(true));
    const response = await api.put(endPoints.SUBMIT_FORM_RESPONSE, payload);
    return response.data as SubmitPreviewFormResponse;
  } catch (error: any) {
    return rejectWithValue(error.response.data);
  } finally {
    dispatch(setLoading(false));
  }
});

export const acceptingFormResponses = createAsyncThunk<
  SubmitPreviewFormResponse,
  AcceptingFormResponsesRequest,
  {rejectValue: ErrorResponse}
>(
  'forms/acceptingFormResponses',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.put(endPoints.ACCEPTING_RESPONSES, payload);
      return response.data as SubmitPreviewFormResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const assignFormToUsersAndGroups = createAsyncThunk<
  AssignFormResponse,
  AssignFormRequest,
  {rejectValue: ErrorResponse}
>(
  'forms/assignFormToUsersAndGroups',
  async (payload, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.put(
        endPoints.ASSIGN_FORM_TO_USERS_AND_GROUPS,
        payload,
      );
      console.log('re', response.data);
      return response.data as AssignFormResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const deleteForm = createAsyncThunk<
  DeleteFormResponse,
  [number,number,DeleteFormRequest],
  {rejectValue: ErrorResponse}
>(
  'forms/deleteForm',
  async ([forceDelete,flowId,payload], {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.delete(
        endPoints.DELETE_FORMS+`forceDelete=${forceDelete}&flowId=${flowId}`,{data:payload}
        ,
      );
      console.log('re', response.data);
      return response.data as DeleteFormResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);


interface InitialState {
  formById: GetAllFlowsResponsePayload | null;
  previewForm: GetPreviewFormResponsePayload | null;
  submitPreviewFormResponse: SubmitPreviewFormResponsePayload | null;
  acceptingFormResponses: AcceptingFormResponsesResponsePayload | null;
  assignFormResponse: AssignFormResponsePayload | null;
  deleteFormResponse:DeleteFormResponse|null;
  formsShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  formById: null,
  previewForm: null,
  submitPreviewFormResponse: null,
  acceptingFormResponses: null,
  deleteFormResponse:null,
  formsShowMessage: null,
  assignFormResponse: null,
  errorMessage: '',
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(setFormsShowMessage, (state, action) => {
        state.formsShowMessage = action.payload;
      })
      .addCase(resetAssignFormResponse, (state, action) => {
        state.assignFormResponse = null;
      })
      .addCase(resetDeleteFormResponse, (state, action) => {
        state.deleteFormResponse = null;
      })
      .addCase(getFormById.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getFormById.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.formById = action.payload.payload;
      })
      .addCase(getFormById.rejected, (state, action) => {
        state.formsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
      .addCase(getPreviewForm.pending, state => {
        state.previewForm = null;
      })
      .addCase(getPreviewForm.fulfilled, (state, action) => {
        state.previewForm = action.payload.payload;
      })
      .addCase(getPreviewForm.rejected, (state, action) => {
        state.previewForm = null;
        state.formsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
      .addCase(submitPreviewForm.pending, state => {
        // state.isLoading = true;
      })
      .addCase(submitPreviewForm.fulfilled, (state, action) => {
        state.formsShowMessage = {
          status: 'Success',
          message: action.payload.payload.message,
        };
        state.submitPreviewFormResponse = action.payload.payload;
      })
      .addCase(submitPreviewForm.rejected, (state, action) => {
        state.formsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
      .addCase(acceptingFormResponses.pending, state => {
        // state.isLoading = true;
      })
      .addCase(acceptingFormResponses.fulfilled, (state, action) => {
        state.acceptingFormResponses = action.payload.payload;
      })
      .addCase(acceptingFormResponses.rejected, (state, action) => {
        state.formsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
      .addCase(assignFormToUsersAndGroups.pending, state => {
        // state.isLoading = true;
      })
      .addCase(assignFormToUsersAndGroups.fulfilled, (state, action) => {
        state.assignFormResponse = action.payload.payload;
      })
      .addCase(assignFormToUsersAndGroups.rejected, (state, action) => {
        state.formsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
      .addCase(deleteForm.pending, state => {
        state.deleteFormResponse=null;
      })
      .addCase(deleteForm.fulfilled, (state, action) => {
        state.deleteFormResponse = action.payload;
        state.formsShowMessage = {
          status: 'Success',
          message:  action.payload?.payload?.message
        };
      })
      .addCase(deleteForm.rejected, (state, action) => {
        state.formsShowMessage = {
          status: 'Error',
          message: action?.payload?.error?.errorMessage?.toString(),
        };
      })
  },
});

export default formsSlice.reducer;
