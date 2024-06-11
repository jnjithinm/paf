import React, {Dispatch, FC, JSX, SetStateAction, useState} from 'react';
import {TextInput, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {useAppDispatch} from '../../redux/store';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import colors from '../../config/colors';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import RadioButtonGroup from '../../components/RadioButtonGroup';
import {
  normaliseFont,
} from '../../utils/helpers/responsiveHelpers';
import CheckboxGroup from '../../components/CheckBoxGroup';
import RatingRadioButton from '../../components/RatingRadioButtons';

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
      <Text style={{flex: 3}}>{index}</Text>
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
  answer: string;
  setAnswer: Dispatch<SetStateAction<string>>;
};
const RenderInputAnswer: FC<RenderInputAnswerTypes> = ({answer, setAnswer}) => (
  <TextInput
    value={answer}
    onChangeText={(text: string) => {
      setAnswer(text);
    }}
    placeholderTextColor={'#ABB4BD'}
    placeholder="Type your answer here"
    style={{
      borderBottomColor: '#E4E7EB',
      borderBottomWidth: 1,
      paddingBottom: 0,
      fontSize: normaliseFont(11),
    }}
  />
);



interface EvaluationFormScreenProps {
  navigation: EvaluationFormNavigationProp;
  route: EvaluationFormRouteProp;
}

const EvaluationForm: FC<EvaluationFormScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();

  const [answer, setAnswer] = useState<string>('');
  // useEffect(() => {
  //   if (deleteSuccess) {
  //     dispatch(
  //       getAllRubrics({
  //         page: 0,
  //         size: 15,
  //         type: 'all',
  //       }),
  //     );
  //   }
  // }, [deleteSuccess]);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15, paddingVertical: 15}}>
      <RenderSectionTitle
        title="Section 1"
        description="Lorem ipsum dolor sit amet consectetur. Dolor morbi cras scelerisque risus nulla."
      />
      <RenderTaskItem
        index={0}
        question={'How do you approach classroom management?'}
        renderSelection={
          <RadioButtonGroup
            options={['Positive learning', 'Activities', 'Engaging students']}
            onChange={() => {}}
          />
        }
      />
      <RenderTaskItem
        index={1}
        question={'How do you approach classroom management?'}
        renderSelection={
          <RenderInputAnswer answer={answer} setAnswer={setAnswer} />
        }
      />
      <RenderTaskItem
        index={2}
        question={'How do you approach classroom management?'}
        renderSelection={
          <CheckboxGroup
            options={['Positive learning', 'Activities', 'Engaging students']}
            onChange={() => {}}
          />
        }
      />
      <RenderTaskItem
        index={3}
        question={'How do you approach classroom management?'}
        renderSelection={<RatingRadioButton onChange={() => {}} />}
      />
    </Layout>
  );
};
export default EvaluationForm;
