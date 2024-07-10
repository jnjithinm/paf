import {FC, useEffect, useState} from 'react';
import {FlowsAndFormsStackParamList} from '../../navigation/FlowsAndFormsStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getPreviewForm} from '../../redux/features/formsSlice';
import Layout from '../../components/Layout';
import {View} from 'react-native';
import {
  AnswerObject,
  QuestionTypeSelector,
  RenderSectionTitle,
  RenderTaskItem,
} from './EvaluationForm';

type PreviewFormNavigationProp = StackNavigationProp<
  FlowsAndFormsStackParamList,
  'PreviewForm'
>;
type PreviewFormRouteProp = RouteProp<
  FlowsAndFormsStackParamList,
  'PreviewForm'
>;

interface PreviewFormScreenProps {
  navigation: PreviewFormNavigationProp;
  route: PreviewFormRouteProp;
}

const PreviewForm: FC<PreviewFormScreenProps> = ({navigation, route}) => {
  const {flowDetailItem} = route.params;
  const [answers, setAnswers] = useState<AnswerObject[]>([]);
  const dispatch = useAppDispatch();

  const {previewForm} = useAppSelector(state => state.forms);
  useEffect(() => {
    dispatch(getPreviewForm(flowDetailItem.formId));
  }, [flowDetailItem]);
  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15, paddingVertical: 25}}
      title={'Preview Form'}>
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
                    disabled
                    indicators={ele.indicators}
                  />
                ) || <></>
              }
            />
          ))}
        </View>
      ))}
    </Layout>
  );
};

export default PreviewForm;
