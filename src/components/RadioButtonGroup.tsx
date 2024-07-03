import React, { FC, Dispatch, SetStateAction, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import colors from '../config/colors';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import { QuestionOption } from '../redux/features/formsSlice';
import { AnswerObject } from '../screens/flowsAndForms/EvaluationForm';

type RadioButtonGroupPropsTypes = {
  options: QuestionOption[];
  answers: AnswerObject[];
  itemAnswer: AnswerObject | undefined;
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  disabled?: boolean;
  style?: ViewStyle;
};

const RadioButtonGroup: FC<RadioButtonGroupPropsTypes> = ({
  options,
  answers,
  itemAnswer,
  disabled = false,
  setAnswers,
  questionId,
  questionOptionId,
  style,
}) => {
  const handlePress = (option: QuestionOption) => {
    const updatedAnswers = answers.some(
      ans => ans.questionId === questionId && ans.questionOptionId === questionOptionId
    )
      ? answers.map(ans =>
          ans.questionId === questionId && ans.questionOptionId === questionOptionId
            ? { ...ans, answer: option }
            : ans
        )
      : [
          ...answers,
          { questionId, questionOptionId, answer: option }
        ];

    setAnswers(updatedAnswers);
  };

  const isSelected = (option: QuestionOption) => {
    return (
      itemAnswer?.answer &&
      (itemAnswer.answer as QuestionOption).optionMappingId === option.optionMappingId
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
              onPress={() => handlePress(item)}
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
                  styles.RadioButton,
                  isSelected(item) ? {     borderColor:'#EA7804' } : null,
                ]}
              >
                {isSelected(item) && <View style={styles.RadioButtonSelected} />}
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

export default RadioButtonGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
  },
  RadioButton: {
    width: normaliseDesigns(12),
    height: normaliseDesigns(12),
    borderRadius: 15,
    borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    borderColor: '#ABB4BD',
  },
  RadioButtonSelected: {
    width: normaliseDesigns(7),
    height: normaliseDesigns(7),
    borderRadius: 15,
    backgroundColor: '#EA7804',

  },
});
