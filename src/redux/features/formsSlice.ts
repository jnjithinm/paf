import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import api from '../../config/axios';
import endPoints from '../../config/endPoints';
import {PaginationRequest} from './usersSlice';

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

export const getFormById = createAsyncThunk<
GetFormByIdResponse,
  number
>(
  'forms/getFormById',
  async (formId, {rejectWithValue}) => {
    try {
      const response = await api.get(endPoints.GET_FORM_BY_ID+formId);
      return response.data as GetFormByIdResponse;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);


interface InitialState {
  formById: GetAllFlowsResponsePayload | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InitialState = {
    formById: null,
  isLoading: false,
  error: null,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getFormById.pending, state => {
        state.isLoading = true;
      })
      .addCase(getFormById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.formById = {
          ...state.formById,
          ...action.payload.payload,
        };
      })
      .addCase(getFormById.rejected, (state, action) => {
        state.isLoading = false;
      })
  },
});

export default formsSlice.reducer;
