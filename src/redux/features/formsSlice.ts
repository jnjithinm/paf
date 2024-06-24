import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {setLoading} from './authSlice';
import {ErrorStatusObject} from '../../config/types';

interface Indicator {
  domainId: number;
  domainName: string;
  indicatorId: number;
  indicatorName: string;
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
  responses: {
    questionId: number;
    questionText: string;
    responseValues: string;
    responseDate: string;
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

interface Indicator {
  //
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
  indicators: Indicator[];
}

interface Section {
  sectionId: number;
  sectionName: string;
  sectionDescription: string;
  sectionOrder: number;
  questions: QuestionPreviewForm[];
}

interface DataList {
  formId: number;
  formName: string;
  formText: string;
  formDescription: string;
  isDraft: boolean;
  status: boolean;
  acceptingResponse: boolean;
  sections: Section[];
}

interface GetPreviewFormResponse {
  payload: {
    message: string;
    dataList: DataList;
  };
  status: number;
}

type GetPreviewFormResponsePayload = GetPreviewFormResponse['payload'];

export type FormSubmission = {
  questionId: number;
  questionOptionId: number;
  optionMappingId: number | null;
  responseValue: string | null;
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

export const setFormsShowMessage = createAction<ErrorStatusObject | null>(
  'SET_FORMS_SHOW_MESSAGE',
);

export const getFormById = createAsyncThunk<GetFormByIdResponse, number>(
  'forms/getFormById',
  async (formId, {rejectWithValue, dispatch}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(endPoints.GET_FORM_BY_ID + formId);
      return response.data as GetFormByIdResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const getPreviewForm = createAsyncThunk<GetPreviewFormResponse, number>(
  'forms/getPreviewForm',
  async (formId, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get(endPoints.GET_PREVIEW_FORM + formId);
      console.log('reesoi', response.data);
      return response.data as GetPreviewFormResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    } finally {
      dispatch(setLoading(false));
    }
  },
);

export const submitPreviewForm = createAsyncThunk<
SubmitPreviewFormResponse,
  SubmitPreviewFormRequest
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

interface InitialState {
  formById: GetAllFlowsResponsePayload | null;
  previewForm: GetPreviewFormResponsePayload | null;
  submitPreviewFormResponse:SubmitPreviewFormResponsePayload|null;
  formsShowMessage: ErrorStatusObject | null;
  errorMessage: string;
}

const initialState: InitialState = {
  formById: null,
  previewForm: null,
  submitPreviewFormResponse:null,
  formsShowMessage: null,
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
      .addCase(getFormById.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getFormById.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.formById = {
          ...state.formById,
          ...action.payload.payload,
        };
      })
      .addCase(getFormById.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(getPreviewForm.pending, state => {
        // state.isLoading = true;
      })
      .addCase(getPreviewForm.fulfilled, (state, action) => {
        // state.isLoading = false;
        state.previewForm = {
          ...state.previewForm,
          ...action.payload.payload,
        };
      })
      .addCase(getPreviewForm.rejected, (state, action) => {
        // state.isLoading = false;
      })
      .addCase(submitPreviewForm.pending, state => {
        // state.isLoading = true;
      })
      .addCase(submitPreviewForm.fulfilled, (state, action) => {
        state.formsShowMessage = {
          status: 'Success',
          message: action.payload.payload.message,
        };
        state.submitPreviewFormResponse=action.payload.payload
      })
      .addCase(submitPreviewForm.rejected, (state, action) => {
        state.formsShowMessage = {
          status: 'Failed',
          message: action?.payload?.error?.errorMessage,
        };
      });
  },
});

export default formsSlice.reducer;
