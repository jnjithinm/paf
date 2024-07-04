import React, {
  Dispatch,
  FC,
  JSX,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {useAppDispatch, useAppSelector} from '../../redux/store';
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
  IndicatorPreviewForm,
  QuestionOption,
  getPreviewForm,
  submitPreviewForm,
} from '../../redux/features/formsSlice';
import FooterWithButtons from '../../components/FooterWithButtons';
import {Dropdown} from 'react-native-element-dropdown';
import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import moment from 'moment';
import RatingInput from '../../components/RatingInput';
import {FlowsAndFormsStackParamList} from '../../navigation/FlowsAndFormsStack';

type EvaluationFormNavigationProp = StackNavigationProp<
  FlowsAndFormsStackParamList,
  'EvaluationForm'
>;
type EvaluationFormRouteProp = RouteProp<
  FlowsAndFormsStackParamList,
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
  isRequired: boolean;
};

const RenderTaskItem: FC<RenderTaskItemTypes> = ({
  index,
  question,
  renderSelection,
  isRequired,
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
      <View style={{flexDirection: 'row'}}>
        <Text size="small3">{question}</Text>
        {isRequired && <Text style={{color: 'red', left: 4}}>*</Text>}
      </View>
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

type RenderShortAnswerWithRatingInputTypes = {
  itemAnswer: AnswerObject | undefined;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  indicators?: IndicatorPreviewForm[];
};
const RenderShortAnswerWithRatingInput: FC<
  RenderShortAnswerWithRatingInputTypes
> = ({
  itemAnswer,
  answers,
  setAnswers,
  questionId,
  questionOptionId,
  indicators,
}) => {
  const handleTextChange = (text: string) => {
    if (itemAnswer) {
      const updatedAnswer = {
        ...itemAnswer,
        answer: {...(itemAnswer.answer as ShortAnswer), comment: text},
      };
      setAnswers(
        answers.map(item => (item === itemAnswer ? updatedAnswer : item)),
      );
    } else {
      const newAnswer: AnswerObject = {
        questionId,
        questionOptionId,
        answer: {comment: text, rating: []},
      };
      setAnswers([...answers, newAnswer]);
    }
  };

  const handleRatingChange = (indicatorId: number, rating: number) => {
    if (itemAnswer) {
      const existingRatings = (itemAnswer.answer as ShortAnswer).rating || [];
      const updatedRatings = existingRatings.map(r =>
        r.indicatorId === indicatorId ? {...r, rating} : r,
      );
      if (!existingRatings.some(r => r.indicatorId === indicatorId)) {
        updatedRatings.push({indicatorId, rating});
      }
      const updatedAnswer = {
        ...itemAnswer,
        answer: {...(itemAnswer.answer as ShortAnswer), rating: updatedRatings},
      };
      setAnswers(
        answers.map(item => (item === itemAnswer ? updatedAnswer : item)),
      );
    } else {
      const newAnswer: AnswerObject = {
        questionId,
        questionOptionId,
        answer: {comment: '', rating: [{indicatorId, rating}]},
      };
      setAnswers([...answers, newAnswer]);
    }
  };
  return (
    <View>
      {indicators &&
        indicators.length > 0 &&
        indicators.map((item, index) => (
          <RatingInput
            key={index}
            label={item.indicatorName}
            rating={
              (itemAnswer?.answer as ShortAnswer)?.rating?.find(
                r => r.indicatorId === item.indicatorId,
              )?.rating || 0
            }
            onChangeRating={(rating: number) =>
              handleRatingChange(item.indicatorId, rating)
            }
            style={{marginVertical: 3}}
            labelStyle={{
              fontSize: FONT_SIZES.small3,
              fontFamily: FONT_VARIANT.regular,
            }}
            showRating={false}
          />
        ))}

      <TextInput
        value={(itemAnswer?.answer as ShortAnswer)?.comment || ''}
        onChangeText={handleTextChange}
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
    </View>
  );
};

type RenderDropdownTypes = {
  itemAnswer: AnswerObject | undefined;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  options: QuestionOption[];
  placeHolder?: string;
};
const RenderDrodpwown: FC<RenderDropdownTypes> = ({
  itemAnswer,
  answers,
  setAnswers,
  questionId,
  questionOptionId,
  options,
  placeHolder = 'Select an Item',
}) => {
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
      renderItem={item => (
        <View style={{width: '70%'}}>
          <Text style={{paddingHorizontal: 10}} size="small1">
            {item.label}
          </Text>
        </View>
      )}
      style={{width: '80%'}}
      selectedTextStyle={{
        fontSize: normaliseFont(13),
        color: colors.blackColor,
        fontFamily: FONT_VARIANT.regular,
        textTransform: 'capitalize',
      }}
      containerStyle={{}}
      itemContainerStyle={{
        paddingVertical: 2,
        height: normaliseDesigns(30),
      }}
      onChange={item => {
        const updatedAnswers = answers.some(
          ans =>
            ans.questionId === questionId &&
            ans.questionOptionId === questionOptionId,
        )
          ? answers.map(ans =>
              ans.questionId === questionId &&
              ans.questionOptionId === questionOptionId
                ? {
                    ...ans,
                    answer: {
                      optionMappingId: Number(item.value),
                      optionText: item.label,
                    },
                  }
                : ans,
            )
          : [
              ...answers,
              {
                questionId: questionId,
                questionOptionId: questionOptionId,
                answer: {
                  optionMappingId: Number(item.value),
                  optionText: item.label,
                },
              },
            ];

        setAnswers(updatedAnswers);
      }}
    />
  );
};

type RenderDateSelectorTypes = {
  itemAnswer: AnswerObject | undefined;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
};
const RenderDateSelector: FC<RenderDateSelectorTypes> = ({
  itemAnswer,
  answers,
  setAnswers,
  questionId,
  questionOptionId,
}) => {
  const [isPickeOpen, setIsPickerOpen] = useState<boolean>(false);

  const handleDateSelection = (date: string) => {
    setIsPickerOpen(false);

    if (itemAnswer) {
      setAnswers(
        answers.map(item =>
          item === itemAnswer
            ? {...item, answer: moment(date).format('DD-MM-YYYY')}
            : item,
        ),
      );
    } else {
      setAnswers([
        ...answers,
        {
          questionId,
          questionOptionId,
          answer: moment(date).format('DD-MM-YYYY'),
        },
      ]);
    }
  };

  return (
    <>
      <DateTimePickerComponent
        selectedDate={itemAnswer?.answer as string}
        onDateChange={handleDateSelection}
        showPicker={isPickeOpen}
      />
      <TouchableOpacity
        onPress={() => {
          setIsPickerOpen(true);
        }}
        style={{}}>
        <View>
          <View
            style={{
              width: '50%',
              borderBottomWidth: 1,
              borderColor: '#CBD2D9',
              marginTop: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 3,
            }}>
            <Text
              style={{
                color: itemAnswer?.answer ? colors.blackColor : '#ABB4BD',
              }}
              size="small2">
              {itemAnswer?.answer
                ? moment(itemAnswer?.answer as string)
                    ?.format('MM/DD/YYYY')
                    ?.toString()
                : 'Month/Day/Year'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsPickerOpen(!isPickeOpen);
              }}
              style={{}}>
              <Icon name="calendar_icon" stroke={'#ABB4BD'} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

type RenderTimeSelectorTypes = {
  itemAnswer: AnswerObject | undefined;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
};
const RenderTimeSelector: FC<RenderTimeSelectorTypes> = ({
  itemAnswer,
  answers,
  setAnswers,
  questionId,
  questionOptionId,
}) => {
  const [isPickeOpen, setIsPickerOpen] = useState<boolean>(false);

  const handleTimeSelection = (time: string) => {
    setIsPickerOpen(false);

    if (itemAnswer) {
      setAnswers(
        answers.map(item =>
          item === itemAnswer ? {...item, answer: time} : item,
        ),
      );
    } else {
      setAnswers([...answers, {questionId, questionOptionId, answer: time}]);
    }
  };
  return (
    <>
      <DateTimePickerComponent
        selectedDate={itemAnswer?.answer as string}
        onDateChange={handleTimeSelection}
        showPicker={isPickeOpen}
        mode="time"
      />
      <TouchableOpacity
        onPress={() => {
          setIsPickerOpen(!isPickeOpen);
        }}
        style={{}}>
        <View>
          <View
            style={{
              width: '50%',
              borderBottomWidth: 1,
              borderColor: '#CBD2D9',
              marginTop: 10,
              paddingHorizontal: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 3,
            }}>
            <Text
              style={{
                color: itemAnswer?.answer ? colors.blackColor : '#ABB4BD',
              }}
              size="small2">
              {itemAnswer?.answer
                ? moment(itemAnswer?.answer as string)
                    .format('hh:mm A')
                    .toString()
                : 'Time'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsPickerOpen(true);
              }}
              style={{}}>
              <Icon name="clock_icon" stroke={'#ABB4BD'} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export type RatingInputType = {
  indicatorId: number;
  rating: number;
};
export type ShortAnswer = {
  comment: string;
  rating?: RatingInputType[];
};
export type AnswerObject = {
  questionId: number;
  questionOptionId: number;
  answer: string | QuestionOption[] | QuestionOption | ShortAnswer;
};

type QuestionTypeSelectorTypes = {
  questionOptionId: number;
  questionId: number;
  answers: AnswerObject[];
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  options?: QuestionOption[];
  indicators?: IndicatorPreviewForm[];
};

const QuestionTypeSelector: FC<QuestionTypeSelectorTypes> = ({
  questionOptionId,
  questionId,
  answers,
  setAnswers,
  options,
  indicators,
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
          key={questionId}
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
          key={questionId}
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
          key={questionId}
        />
      );
    case 4:
      return (
        <RenderShortAnswerWithRatingInput
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
          indicators={indicators}
          key={questionId}
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
          key={questionId}
        />
      );
    case 6:
      return (
        <RenderDateSelector
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
          key={questionId}
        />
      );
    case 7:
      return (
        <RenderTimeSelector
          itemAnswer={itemAnswer}
          setAnswers={setAnswers}
          questionId={questionId}
          questionOptionId={questionOptionId}
          answers={answers}
          key={questionId}
        />
      );
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
          indicatorRating: null,
        });
        break;
      case 2:
        (item.answer as QuestionOption[]).map(ele => {
          formattedAnswer.push({
            questionId: item.questionId,
            questionOptionId: item.questionOptionId,
            optionMappingId: ele.optionMappingId,
            responseValue: null,
            indicatorRating: null,
          });
        });
        break;
      case 4:
        const shortAnswer = item.answer as ShortAnswer;
        if (shortAnswer.rating && shortAnswer.rating.length > 0) {
          const indicatorRatingString = shortAnswer.rating
            .map(rating => `{${rating.indicatorId},${rating.rating}.0}`)
            .join(',');
          formattedAnswer.push({
            questionId: item.questionId,
            questionOptionId: item.questionOptionId,
            optionMappingId: null,
            responseValue: shortAnswer.comment,
            indicatorRating: `{[${indicatorRatingString}]}`,
          });
        } else {
          formattedAnswer.push({
            questionId: item.questionId,
            questionOptionId: item.questionOptionId,
            optionMappingId: null,
            responseValue: shortAnswer.comment,
            indicatorRating: null,
          });
        }
        break;
      case 5:
      case 6:
      case 7:
        formattedAnswer.push({
          questionId: item.questionId,
          questionOptionId: item.questionOptionId,
          optionMappingId: null,
          responseValue: item.answer as string,
          indicatorRating: null,
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
  const {flowDetailItem, flowItem} = route.params;

  const [answers, setAnswers] = useState<AnswerObject[]>([]);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isShownKeyboard, setIsShownKeyboard] = useState<boolean>(false);
  const {userData} = useAppSelector(state => state.auth);
  const {previewForm, submitPreviewFormResponse} = useAppSelector(
    state => state.forms,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPreviewForm(flowDetailItem.formId));
  }, [flowDetailItem]);

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
      navigation.navigate('FormListAndResponses', {flowItem});
    }
  }, [submitPreviewFormResponse]);

  useEffect(() => {
    validateSubmission();
  }, [answers,previewForm]);

  // Validate submission logic
  const validateSubmission = () => {
    let canProceed = true;

    previewForm?.dataList?.sections?.forEach(section => {
      section?.questions?.forEach(question => {
        if (question.isRequired) {
          if (!answers.some(ans => ans.questionId === question.questionId)) {
            canProceed = false;
          }
          if (question.questionOptionId === 4) {
            const requiredIndicatorsFilled = question.indicators.every(
              indicator => {
                return answers.some(
                  ans =>
                    ans.questionId === question.questionId &&
                    (ans.answer as ShortAnswer).rating?.find(
                      ind => ind.indicatorId === indicator.indicatorId,
                    ),
                );
              },
            );

            if (!requiredIndicatorsFilled) {
              canProceed = false;
            }
          }
        }
      });
    });

    setCanSubmit(canProceed);
  };

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        onKeyboardShow={keyboardShown => {
          setIsShownKeyboard(keyboardShown);
        }}
        style={{paddingHorizontal: 15, paddingVertical: 15}}
        title={flowDetailItem.formName}>
        {previewForm?.dataList?.sections?.map((item, index) => (
          <View key={item.sectionId}>
            <RenderSectionTitle
              title={item.sectionName}
              description={item.sectionDescription}
              key={index}
            />
            {item?.questions?.map((ele, indexx) => (
              <RenderTaskItem
                index={indexx}
                key={indexx}
                question={ele.questionText}
                isRequired={ele.isRequired}
                renderSelection={
                  (
                    <QuestionTypeSelector
                      key={ele.questionId}
                      questionOptionId={ele.questionOptionId}
                      answers={answers}
                      setAnswers={setAnswers}
                      options={ele.questionOptions}
                      questionId={ele.questionId}
                      indicators={ele.indicators}
                    />
                  ) || <></>
                }
              />
            ))}
          </View>
        ))}
      </Layout>
      {!isShownKeyboard && (
        <FooterWithButtons
          isActiveProceedButton={canSubmit}
          onPressProceedButton={onPressSubmit}
          onPressCancelButton={() => {
            setAnswers([]);
          }}
          proceedButtonText={'Submit'}
          isActiveCancelButton={answers.length !== 0}
          cancelButtonText={'Clear Form'}
        />
      )}
    </>
  );
};
export default EvaluationForm;
