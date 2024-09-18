import React, {FC, Dispatch, SetStateAction} from 'react';
import {View, TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import Text from './Text';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {AnswerObject} from '../screens/flowsAndForms/EvaluationForm';
import {LinearOptionInterface} from '../redux/features/formsSlice';

type RationRadioButtonGroupPropsTypes = {
  lowerLimit?: number;
  upperLimit?: number;
  answers: AnswerObject[];
  itemAnswer: AnswerObject | undefined;
  setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
  questionId: number;
  questionOptionId: number;
  lowerLimitLabel?: string;
  upperLimitLabel?: string;
  disabled?: boolean;
  style?: ViewStyle;
  linearOptions: LinearOptionInterface[];
};

const RationRadioButtonGroup: FC<RationRadioButtonGroupPropsTypes> = ({
  lowerLimit = 1,
  upperLimit = 10,
  answers,
  itemAnswer,
  disabled = false,
  setAnswers,
  questionId,
  questionOptionId,
  lowerLimitLabel = 'Not very',
  upperLimitLabel = 'Very much',
  style,
  linearOptions = [],
}) => {
  // Map the value to the corresponding linearScaleMappingId
  const mapValueToId = (value: number) => {
    let mappingId = linearOptions.find(cc => cc.numberLimit == value);
    return mappingId?.linerMappingId; // 1 maps to 69, 2 to 70, and so on
    // return 345
  };

  const handlePress = (value: number) => {
    const linearScaleMappingId = mapValueToId(value);
    const updatedAnswers = answers.some(
      ans =>
        ans.questionId === questionId &&
        ans.questionOptionId === questionOptionId,
    )
      ? answers.map(ans =>
          ans.questionId === questionId &&
          ans.questionOptionId === questionOptionId
            ? {...ans, answer: value, linearScaleMappingId}
            : ans,
        )
      : [
          ...answers,
          {questionId, questionOptionId, answer: value, linearScaleMappingId},
        ];

    setAnswers(updatedAnswers);
  };

  const isSelected = (value: number) => {
    return itemAnswer?.answer === value;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelRow}>
        <Text fontVariant="regular" size="small1" style={styles.limitLabel}>
          {lowerLimitLabel}
        </Text>
        <View style={styles.radioGroup}>
          {Array.from(
            {length: upperLimit - lowerLimit + 1},
            (_, i) => i + lowerLimit,
          ).map(value => (
            <View key={value} style={styles.radioContainer}>
              <Text
                fontVariant="regular"
                size="small1"
                style={styles.numberLabel}>
                {value}
              </Text>
              <TouchableOpacity
                disabled={disabled}
                onPress={() => handlePress(value)}
                style={[
                  styles.radioButton,
                  isSelected(value) && styles.radioButtonSelected,
                ]}>
                {isSelected(value) && (
                  <View style={styles.radioButtonSelectedInner} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <Text fontVariant="regular" size="small1" style={styles.limitLabel}>
          {upperLimitLabel}
        </Text>
      </View>
    </View>
  );
};

export default RationRadioButtonGroup;

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute labels evenly
    alignItems: 'center',
    width: '100%',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 2,
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  radioButton: {
    width: normaliseDesigns(12),
    height: normaliseDesigns(12),
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ABB4BD',
    marginTop: 5,
    backgroundColor: '#FFF', // Default background color
  },
  radioButtonSelected: {
    backgroundColor: '#EA7804', // Background color when selected
    borderColor: '#EA7804',
  },
  radioButtonSelectedInner: {
    width: normaliseDesigns(6),
    height: normaliseDesigns(6),
    borderRadius: 3,
    backgroundColor: '#EA7804', // Inner circle color to be white on selection
  },
  limitLabel: {
    color: '#4E565F',
    fontSize: 12,
    marginHorizontal: normaliseDesigns(1),
    textAlign: 'center',
  },
  numberLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: '#4E565F',
    marginBottom: 3,
  },
});
