import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Layout from '../../components/Layout';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {QuestionOption} from '../../redux/features/formsSlice';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {getFormAnalytics} from '../../redux/features/analyticsSlice';
import Icon from '../../components/Icon';
import colors from '../../config/colors';
import Text from '../../components/Text';
//import { BarChart } from 'react-native-svg-charts';
import {
  normaliseDesigns,
  normaliseFont,
} from '../../utils/helpers/responsiveHelpers';
import TextInput from '../../components/TextInput';
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import {PieChart} from 'react-native-chart-kit';

import {Svg, Rect, G, Text as SvgText} from 'react-native-svg';
//import {PieChart} from 'react-native-gifted-charts/src/PieChart';
import HorizontalBarChart from '../../components/BarChart';
//import { PieChart } from 'react-native-gifted-charts';
type FormResponsesAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'FormResponsesAnalytics'
>;
type FormResponsesAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'FormResponsesAnalytics'
>;

interface FormResponsesAnalyticsScreenProps {
  navigation: FormResponsesAnalyticsNavigationProp;
  route: FormResponsesAnalyticsRouteProp;
}

const FormResponsesAnalytics: FC<FormResponsesAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  type AnswerObject = {
    questionId: number;
    questionOptionId: number;
    answer: string | QuestionOption[] | QuestionOption;
  };

  const {flowDetailItem} = route.params;
  const {formAnalytics} = useAppSelector(state => state.analytics);
  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [answers, setAnswers] = useState<AnswerObject[]>([]);

  useEffect(() => {
    dispatch(getFormAnalytics([flowDetailItem.formId, flowDetailItem.flowId]));
  }, []);

  console.log(
    'formAnalytics==',
    formAnalytics?.map(item => item),
  );

  const formatDataForBarChart = (data: any[]) => {
    if (!data || !Array.isArray(data) || data.length < 2) return [];

    const headers = data[0];
    const rows = data.slice(1);

    return rows.map(([option, count]: any) => ({
      label: option,
      count,
      percentage: count,
    }));
  };

  type RenderInputAnswerTypes = {
    itemAnswer: AnswerObject | undefined;
    answers: AnswerObject[];
    setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
    questionId: number;
    questionOptionId: number;
    longText?: boolean;
    disabled?: boolean;
  };
  const RenderInputAnswer: FC<RenderInputAnswerTypes> = ({
    itemAnswer,
    answers,
    setAnswers,
    questionId,
    questionOptionId,
    longText = false,
    disabled,
  }) => (
    <TextInput
      value={itemAnswer?.answer as string}
      editable={!disabled}
      onChangeText={(text: string) => {
        if (itemAnswer) {
          setAnswers(
            answers.map(item =>
              item === itemAnswer ? {...item, answer: text} : item,
            ),
          );
        } else {
          setAnswers([
            ...answers,
            {questionId, questionOptionId, answer: text},
          ]);
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

  type QuestionTypeSelectorTypes = {
    questionOptionId: number;
    questionId: number;
    answers: AnswerObject[];
    setAnswers: Dispatch<SetStateAction<AnswerObject[]>>;
    options?: QuestionOption[];
    disabled?: boolean;
  };

  const QuestionTypeSelector: FC<QuestionTypeSelectorTypes> = ({
    questionOptionId,
    questionId,
    answers,
    setAnswers,
    options,
    disabled,
  }) => {
    let itemAnswer = answers?.find(item => item.questionId === questionId);
    switch (questionOptionId) {
      case 6:
        return (
          <RenderInputAnswer
            itemAnswer={itemAnswer}
            setAnswers={setAnswers}
            questionId={questionId}
            questionOptionId={questionOptionId}
            answers={answers}
            key={questionId}
            disabled={disabled}
          />
        );
      default:
        return <></>;
    }
  };

  type RenderTaskItemTypes = {
    index: number;
    question: string;
    renderSelection: JSX.Element;
    isRequired: boolean;
    responseValue: any;
    questionOptionId: number;
    responseCount: number;
  };

  const RenderTaskItem: FC<RenderTaskItemTypes> = ({
    index,
    question,
    renderSelection,
    isRequired,
    responseValue,
    questionOptionId,
    responseCount,
  }) => {
    // Format data for the bar chart
    const chartData =
      responseValue && responseValue.analyticsData
        ? formatDataForBarChart(responseValue.analyticsData)
        : [];

    console.log('chartData==', chartData);

    // Prepare data for PieChart
    const pieData = chartData.map((item, idx) => ({
      value: item.count,
      svg: {fill: colors[`pieColor${idx + 1}`]},
      key: `pie-${idx}`,
      label: item.label,
      percentage: item.percentage,
    }));

    // Background color for response values
    const getBackgroundColor = () => '#F5F7FA';

    // Render response values when questionOptionId is not for a chart
    const renderResponseValue = () => {
      if (
        Array.isArray(responseValue) &&
        questionOptionId !== 1 &&
        questionOptionId !== 2 &&
        questionOptionId !== 3
      ) {
        return (
          <View style={styles.answerContainer}>
            {responseValue.map((response, idx) => (
              <View
                key={idx}
                style={[
                  styles.responseItem,
                  {backgroundColor: getBackgroundColor()},
                ]}>
                <Text style={styles.responseText}>{response}</Text>
              </View>
            ))}
          </View>
        );
      }
      return null;
    };
    const config ={backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
    }
    console.log('chartData:', chartData);
    console.log('data passed to HorizontalBarChart:', chartData);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.index}>{index + 1}</Text>
          <Icon name="arrow_narrow_right" style={styles.arrowIcon} />
          <View style={styles.questionArrowContainer}>
            <Text style={styles.questionText}>
              {question}
              {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
          </View>
        </View>
        <View style={styles.questionLine} />
        <View style={styles.body}>
          {responseCount > 0 && (
            <Text
              size="body1"
              fontVariant="semiBold"
              style={{marginVertical: 7}}>
              <Text fontVariant="bold">{responseCount} </Text>Responses
            </Text>
          )}
          {questionOptionId === 2 || questionOptionId === 3 ? (
            <View style={styles.chartContainer}>
              <View style={styles.chartContent}>
                {chartData.length > 0 ? (
                  //   <HorizontalBarChart
                  //   horizontal={true}
                  //   style={styles.barChart}
                  //   data={chartData}
                  //   yAccessor={({ item }) => item.count}
                  //   svg={{ fill: colors.primaryColor }}
                  //   spacingInner={0.2}
                  //   contentInset={{ top: 10, bottom: 10 }}

                  // />
                  <HorizontalBarChart
                    data={chartData}
                    yAccessor={({item}) => item.count}
                    svg={{fill: colors.primaryColor}}
                    spacingInner={0.2}
                    contentInset={{top: 10, bottom: 10}}
                    style={styles.barChart}
                  />
                ) : (
                  <Text>No data available</Text>
                )}
                {/* <View style={styles.barChartLabels}>
                  {chartData.map((item, idx) => (
                    <View key={idx} style={styles.barChartLabelRow}>
                      <Text style={styles.barChartLabel}>{item.label}</Text>
                      <Text style={styles.barChartLabel}>{item.count}</Text>
                      <Text style={styles.barChartLabel}>{item.percentage}%</Text>
                    </View>
                  ))}
                </View> */}
              </View>
            </View>
          ) : questionOptionId === 1 ? (
            <View style={styles.chartContainer}>
              {/* <PieChart
                style={{height: 200, width: '90%'}}
                data={pieData}
                innerRadius={50}
                outerRadius="80%"
              /> */}
              {/* <PieChart
                data={pieData}
                width={screenWidth}
                height={220}
                chartConfig={config}
                accessor={'population'}
                backgroundColor={'transparent'}
                paddingLeft={'15'}
                center={[10, 50]}
                absolute
              /> */}

              <View style={styles.pieChartLabels}>
                {pieData.map((item, idx) => (
                  <View key={idx} style={styles.pieChartLabelRow}>
                    <View
                      style={[
                        styles.pieChartColorBox,
                        {backgroundColor: item.svg.fill},
                      ]}
                    />
                    <Text style={styles.pieChartLabel}>
                      {item.label}: {item.percentage}%
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            renderResponseValue()
          )}
          <View style={styles.chartContainer}>{renderSelection}</View>
        </View>
      </View>
    );
  };

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15, top: 15}}
      title={flowDetailItem.formName}>
      <FlatList
        data={formAnalytics}
        keyExtractor={item => item.questionId.toString()}
        renderItem={({item, index}) => (
          <RenderTaskItem
            index={index}
            key={item.questionId}
            question={item.questionText}
            isRequired={false}
            responseValue={item.responseValue}
            questionOptionId={item.questionOptionId}
            responseCount={item.responseCount}
            renderSelection={
              // <QuestionTypeSelector
              //   key={item.questionId}
              //   questionOptionId={item.questionOptionId}
              //   answers={answers}
              //   setAnswers={setAnswers}
              //   options={item.questionOptions}
              //   questionId={item.questionId}
              // /> ||
              <></>
            }
          />
        )}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  index: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  body: {
    paddingHorizontal: 10,
  },
  required: {
    color: 'red',
  },
  chartContainer: {
    marginVertical: 10,
  },
  chartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barChart: {
    height: 200,
    width: '80%', // Adjust width as needed
  },
  barChartLabels: {
    position: 'absolute',
    left: '80%', // Align labels to the right of the chart
    top: 10,
    width: '20%', // Adjust width based on chart width
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  barChartLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barChartLabel: {
    fontSize: 12,
  },
  pieChartLabels: {
    marginTop: 10,
  },
  pieChartLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  pieChartColorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  pieChartLabel: {
    fontSize: 12,
  },
  answerContainer: {
    marginTop: 10,
  },
  responseItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  questionLine: {
    height: 1,
    backgroundColor: '#E4E7EB',
    marginVertical: 10,
  },
  responseText: {
    fontSize: 14,
    color: '#333',
  },
});

export default FormResponsesAnalytics;
