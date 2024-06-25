import React, {
  Dispatch,
  FC,
  JSX,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {TextInput, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import colors from '../../config/colors';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import {
  normaliseDesigns,
  normaliseFont,
} from '../../utils/helpers/responsiveHelpers';
import CheckboxGroup from '../../components/CheckBoxGroup';
import {
  FormSubmission,
  QuestionOption,
  getPreviewForm,
  submitPreviewForm,
} from '../../redux/features/formsSlice';
import FooterWithButtons from '../../components/FooterWithButtons';
import {Dropdown} from 'react-native-element-dropdown';
import {FONT_VARIANT} from '../../config/themes';

type EvaluationFormNavigationProp = StackNavigationProp<
  AdminTabStackTabBarStackParamList,
  'EvaluationForm'
>;
type EvaluationFormRouteProp = RouteProp<
  AdminTabStackTabBarStackParamList,
  'EvaluationForm'
>;

type RenderSectionTitleTypes = {
  title: string;
  description?: string;
};

const RenderSectionTitle: FC<RenderSectionTitleTypes> = ({
  title,
  description,
}) => (
  <View
    style={{
      borderRadius: 8,
      elevation: 3,
      backgroundColor: colors.backgroundColor,
      marginVertical: 5,
    }}>
    <View
      style={{
        backgroundColor: '#EA7804',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        paddingVertical: 3,
      }}
    />
    <View style={{paddingVertical: 10, paddingHorizontal: 7}}>
      <Text fontVariant="bold" size="body1">
        {title}
      </Text>
      {description && (
        <Text size="small1" style={{marginVertical: 5, color: '#4E565F'}}>
          {description}
        </Text>
      )}
    </View>
  </View>
);

type RenderTaskItemTypes = {
  index: number;
  question: string;
  renderSelection: JSX.Element;
};

const RenderTaskItem: FC<RenderTaskItemTypes> = ({
  index,
  question,
  renderSelection,
}) => (
  <View
    style={{
      borderRadius: 8,
      alignItems: 'center',
      elevation: 4,
      backgroundColor: colors.backgroundColor,
      padding: 7,
      marginVertical: 5,
      flexDirection: 'row',
      borderColor: '#E4E7EB',
      borderWidth: 1,
    }}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'flex-start',
      }}>
      <Text style={{flex: 3}}>{index + 1}</Text>
      <View style={{flex: 2}}>
        <Icon name="arrow_narrow_right" />
      </View>
    </View>
    <View style={{flex: 7}}>
      <Text size="small3">{question}</Text>
      <View style={{marginVertical: 5}}>{renderSelection}</View>
    </View>
  </View>
);

type RenderInputAnswerTypes = {
  itemAnswer: AnswerObject | undefined;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  longText?: boolean;
};
const RenderInputAnswer: FC<RenderInputAnswerTypes> = ({
  itemAnswer,
  answers,
  setAnswers,
  questionId,
  questionOptionId,
  longText = false,
}) => (
  <TextInput
    value={itemAnswer?.answer as string}
    onChangeText={(text: string) => {
      if (itemAnswer) {
        setAnswers(
          answers.map(item =>
            item === itemAnswer ? {...item, answer: text} : item,
          ),
        );
      } else {
        setAnswers([...answers, {questionId, questionOptionId, answer: text}]);
      }
    }}
    placeholderTextColor={'#ABB4BD'}
    placeholder="Type your answer here"
    style={{
      borderBottomColor: '#E4E7EB',
      borderBottomWidth: 1,
      paddingBottom: 0,
      fontSize: normaliseFont(11),
      color: colors.blackColor,
      minHeight: normaliseDesigns(25),
    }}
  />
);

type RenderDropdownTypes = {
  itemAnswer: AnswerObject | undefined;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  options: QuestionOption[];
  placeHolder?:string
};
const RenderDrodpwown: FC<RenderDropdownTypes> = ({
  itemAnswer,
  answers,
  setAnswers,
  questionId,
  questionOptionId,
  options,
  placeHolder='Select an Item'
}) => {
  console.log("ite",itemAnswer?.answer,(
    itemAnswer?.answer as QuestionOption
  )?.optionMappingId?.toString())
  return (
    <Dropdown
      value={(
        itemAnswer?.answer as QuestionOption
      )?.optionMappingId?.toString()}
      labelField="label"
      valueField="value"
      data={options.map(item => ({
        value: item.optionMappingId?.toString(),
        label: item.optionText,
      }))}
      placeholder={placeHolder}
      renderItem={(item)=>(
        <View style={{width:'70%'}}>
        <Text style={{paddingHorizontal:10}} size='small1'>{item.label}</Text>
        </View>
      )}
      style={{width:'80%'}}
      selectedTextStyle={{
        fontSize: normaliseFont(13),
        color: colors.blackColor,
        fontFamily: FONT_VARIANT.regular,
        textTransform: 'capitalize',
      }}
      containerStyle={{}}
      itemContainerStyle={{
        paddingVertical:2,
        height:normaliseDesigns(30)
      }}
      onChange={item => {
        const updatedAnswers = answers.some(
          ans => ans.questionId === questionId && ans.questionOptionId === questionOptionId
        )
          ? answers.map(ans =>
              ans.questionId === questionId && ans.questionOptionId === questionOptionId
                ? {
                    ...ans,
                    answer: { optionMappingId: Number(item.value), optionText: item.label },
                  }
                : ans,
            )
          : [
              ...answers,
              {
                questionId: questionId,
                questionOptionId: questionOptionId,
                answer: { optionMappingId: Number(item.value), optionText: item.label },
              },
            ];
      
        console.log("sfd", updatedAnswers);
        setAnswers(updatedAnswers);
      }}
    />
  );
};

export type AnswerObject = {
  questionId: number;
  questionOptionId: number;
  answer: string | QuestionOption[] | QuestionOption;
};

type QuestionTypeSelectorTypes = {
  questionOptionId: number;
  questionId: number;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  options?: QuestionOption[];
};

const QuestionTypeSelector: FC<QuestionTypeSelectorTypes> = ({
  questionOptionId,
  questionId,
  answers,
  setAnswers,
  options,
}) => {
  let itemAnswer = answers?.find(item => item.questionId === questionId);
  switch (questionOptionId) {
    case 1:
      return (
        <RenderDrodpwown
          options={options || []}
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
        />
      );
    case 2:
      return (
        <CheckboxGroup
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          options={options || []}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
        />
      );
    case 3:
      return (
        <RadioButtonGroup
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          options={options || []}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
        />
      );
    case 4:
      return (
        <RenderInputAnswer
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
        />
      );
    case 5:
      return (
        <RenderInputAnswer
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
          longText
        />
      );
    case 6:
      return <></>;
    case 7:
      return <></>;
    default:
      return <></>;
  }
};

const formatAnswer = (answers: AnswerObject[]): FormSubmission[] => {
  let formattedAnswer: FormSubmission[] = [];
  answers.map(item => {
    switch (item.questionOptionId) {
      case 1:
      case 3:
        formattedAnswer.push({
          questionId: item.questionId,
          questionOptionId: item.questionOptionId,
          optionMappingId: (item.answer as QuestionOption).optionMappingId,
          responseValue: null,
        });
        break;
      case 2:
        (item.answer as QuestionOption[]).map(ele => {
          formattedAnswer.push({
            questionId: item.questionId,
            questionOptionId: item.questionOptionId,
            optionMappingId: ele.optionMappingId,
            responseValue: null,
          });
        });
        break;
      case 4:
      case 5:
        formattedAnswer.push({
          questionId: item.questionId,
          questionOptionId: item.questionOptionId,
          optionMappingId: null,
          responseValue: item.answer as string,
        });
        break;
      default:
        break;
    }
  });
  return formattedAnswer;
};

interface EvaluationFormScreenProps {
  navigation: EvaluationFormNavigationProp;
  route: EvaluationFormRouteProp;
}

const EvaluationForm: FC<EvaluationFormScreenProps> = ({navigation, route}) => {
  const {flowDetailItem} = route.params;

  const [answers, setAnswers] = useState<AnswerObject[]>([]);
  const {userData} = useAppSelector(state => state.auth);
  const {previewForm, submitPreviewFormResponse} = useAppSelector(
    state => state.forms,
  );
  
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPreviewForm(flowDetailItem.flowId));
  }, []);

  const onPressSubmit = () => {
    dispatch(
      submitPreviewForm({
        formId: flowDetailItem.formId,
        flowId: flowDetailItem.flowId,
        userId: userData.id,
        formQuestionRequestList: formatAnswer(answers),
      }),
    );
  };

  useEffect(() => {
    if (submitPreviewFormResponse) {
      navigation.navigate('AdminFormResponses', {flowDetailItem});
    }
  }, [submitPreviewFormResponse]);

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15, paddingVertical: 15}}
        title={flowDetailItem.formName}>
        {previewForm?.dataList?.sections.map((item, index) => (
          <View>
            <RenderSectionTitle
              title={item.sectionName}
              description={item.sectionDescription}
              key={index}
            />
            {item?.questions?.map((item, index) => (
              <RenderTaskItem
                index={index}
                key={index}
                question={item.questionText}
                renderSelection={
                  (
                    <QuestionTypeSelector
                      questionOptionId={item.questionOptionId}
                      answers={answers}
                      setAnswers={setAnswers}
                      options={item.questionOptions}
                      questionId={item.questionId}
                    />
                  ) || <></>
                }
              />
            ))}
          </View>
        ))}
      </Layout>
      <FooterWithButtons
        isActiveProceedButton
        onPressProceedButton={onPressSubmit}
        onPressCancelButton={() => {
          setAnswers([]);
        }}
        proceedButtonText={'Submit'}
        cancelButtonText={'Clear Form'}
      />
    </>
  );
};
export default EvaluationForm;
