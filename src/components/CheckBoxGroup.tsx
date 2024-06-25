import React, { FC, Dispatch, SetStateAction } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import colors from '../config/colors';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import { QuestionOption } from '../redux/features/formsSlice';
import { AnswerObject } from '../screens/admin/EvaluationForm';
import Icon from './Icon';

type CheckboxGroupPropsTypes = {
  options: QuestionOption[];
  answers: AnswerObject[];
  itemAnswer: AnswerObject | undefined;
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  disabled?: boolean;
  style?: ViewStyle;
};

const CheckboxGroup: FC<CheckboxGroupPropsTypes> = ({
  options,
  answers,
  setAnswers,
  itemAnswer,
  questionId,
  questionOptionId,
  disabled = false,
  style,
}) => {
  const handlePress = (index: number, option: QuestionOption) => {
    const newValues = itemAnswer?.answer
      ? (itemAnswer.answer as QuestionOption[]).some(
          v => v.optionMappingId === option.optionMappingId,
        )
        ? (itemAnswer.answer as QuestionOption[]).filter(
            v => v.optionMappingId !== option.optionMappingId,
          )
        : [
            ...(itemAnswer.answer as QuestionOption[]),
            {
              optionMappingId: option.optionMappingId,
              optionText: option.optionText,
            },
          ]
      : [
          {
            optionMappingId: option.optionMappingId,
            optionText: option.optionText,
          },
        ];

    const existingAnswerIndex = answers.findIndex(
      ans =>
        ans.questionId === questionId && ans.questionOptionId === questionOptionId
    );

    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = {
        ...updatedAnswers[existingAnswerIndex],
        answer: newValues,
      };
      setAnswers(updatedAnswers);
    } else {
      setAnswers(prevAnswers => [
        ...prevAnswers,
        {
          questionId,
          questionOptionId,
          answer: newValues,
        },
      ]);
    }
  };

  const isSelected = (option: QuestionOption) => {
    return (
      itemAnswer?.answer &&
      (itemAnswer.answer as QuestionOption[]).some(
        v => v.optionMappingId === option.optionMappingId,
      )
    );
  };

  let modifiedOptions = [...options];
  const remainder = options.length % 3;
  if (remainder === 1 || remainder === 2) {
    const numToAdd = 3 - remainder;
    for (let i = 0; i < numToAdd; i++) {
      modifiedOptions.push({ optionMappingId: 0, optionText: '' });
    }
  }

  return (
    <View>
      {modifiedOptions.map((item, index) => (
        <View
          style={{
            width: '100%',
            flex: 1,
          }}
          key={index}
        >
          {item.optionMappingId !== 0 && (
            <TouchableOpacity
              key={index}
              disabled={disabled}
              onPress={() => handlePress(index, item)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderColor: '#E4E7EB',
                borderWidth: 1,
                width: '65%',
                padding: 5,
                borderRadius: 7,
                marginVertical: 3,
              }}
            >
              <View
                style={[
                  styles.Checkbox,
                  isSelected(item) ? { backgroundColor: '#EA7804', borderWidth: 0 } : null,
                ]}
              >
                {isSelected(item) && <Icon name='checkbox' width={10} height={10} />}
              </View>
              <Text
                fontVariant="regular"
                size="small1"
                style={{ width: '100%', color: '#4E565F' }}
              >
                {item.optionText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
};

export default CheckboxGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  Checkbox: {
    width: normaliseDesigns(12),
    height: normaliseDesigns(12),
    borderRadius: 4,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderColor: '#ABB4BD',
  },
  CheckboxSelected: {
    width: normaliseDesigns(8),
    height: normaliseDesigns(8),
    borderRadius: 4,
    backgroundColor: colors.secondaryColor,
  },
});
