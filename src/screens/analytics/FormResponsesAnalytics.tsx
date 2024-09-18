import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Dimensions} from 'react-native';
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
//import {PieChart} from 'react-native-chart-kit';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import {
  normaliseDesigns,
  normaliseFont,
} from '../../utils/helpers/responsiveHelpers';
import TextInput from '../../components/TextInput';
import HorizontalBarChart from '../../components/BarChart';
import WebView from 'react-native-webview';

const screenWidth = Dimensions.get('window').width;

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
  }) => {
    // Check if the answer is a date string
    const isDateAnswer = (answer: any) => {
      const date = new Date(answer);
      return !isNaN(date.getTime());
    };

    if (itemAnswer && isDateAnswer(itemAnswer.answer)) {
      // If the answer is a date, display it as plain text
      return (
        <View
          style={{
            borderBottomColor: '#E4E7EB',
            borderBottomWidth: 1,
            paddingBottom: 0,
            minHeight: normaliseDesigns(25),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: normaliseFont(11),
              color: colors.blackColor,
            }}>
            {new Date(itemAnswer.answer as string).toLocaleString()}
          </Text>
        </View>
      );
    }

    // Otherwise, render the TextInput as before
    // return (
    //   <TextInput
    //     value={itemAnswer?.answer as string}
    //     editable={!disabled}
    //     onChangeText={(text: string) => {
    //       if (itemAnswer) {
    //         setAnswers(
    //           answers.map(item =>
    //             item === itemAnswer ? { ...item, answer: text } : item,
    //           ),
    //         );
    //       } else {
    //         setAnswers([
    //           ...answers,
    //           { questionId, questionOptionId, answer: text },
    //         ]);
    //       }
    //     }}
    //     placeholderTextColor={'#ABB4BD'}
    //     placeholder="Type your answer here"
    //     style={{
    //       borderBottomColor: '#E4E7EB',
    //       borderBottomWidth: 1,
    //       paddingBottom: 0,
    //       fontSize: normaliseFont(11),
    //       color: colors.blackColor,
    //       minHeight: normaliseDesigns(25),
    //     }}
    //   />
    // );
  };

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
    const chartData =
      responseValue && responseValue.analyticsData
        ? formatDataForBarChart(responseValue.analyticsData)
        : [];
    const [first, setfirst] = useState('');
    //Prepare data for PieChart
    //  const pieData = responseValue && responseValue.analyticsData
    //      ? responseValue.analyticsData.slice(1).map((item, idx) => ({
    //   value: item[1],
    //   text: `${item[2]}%`,
    //   label: item[0],
    //   color: '#2F68C4' // Adjust color based on index if needed
    // })):[];

    function convertBarChartData(data) {
      if (data && data.length > 0) {
        const headers = data[0];
        const rows = data.slice(1);
        const output = [
          [
            'Selected Option',
            'Option Count',
            {role: 'style'},
            {role: 'annotation'},
          ],
        ];
        rows.forEach(row => {
          const [option, count, percentage] = row;
          output.push([
            option,
            count,
            `color:#F4C24A;`,
            `${count} (${percentage}%)`,
          ]);
        });
        return output;
      }
    }
    useEffect(() => {
      if (responseValue && responseValue.analyticsData) {
        let htmlContent = `
        <html>
      <head>
        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
        <script type="text/javascript">
          google.charts.load('current', {'packages':['corechart']});
          google.charts.setOnLoadCallback(drawChart);
    
          function drawChart() {
            var data = google.visualization.arrayToDataTable(${JSON.stringify(
              convertBarChartData(responseValue.analyticsData),
            )});
    
           var options = {
                chartArea: {width: '80%'}, // Adjust chart area width
                hAxis: {
                  minValue: 0,
              
                },
                vAxis: {
                 
                },
                legend: { position: 'none' },
                annotations: {
                  alwaysOutside: true,
                  textStyle: {
                    fontSize: 22,
                    auraColor: 'none', // Remove the background color (aura) from annotations
                    color: 'red' // Annotation text color
                  }
                }
              };
    
            var chart = new google.visualization.BarChart(document.getElementById('barchart'));
    
            chart.draw(data, options);
          }
        </script>
      </head>
      <body>
        <div id="barchart" style="width: 100%; height: 100%;"></div>
      </body>
    </html>
      `;

        console.log(htmlContent, responseValue.analyticsData, 'htmlContent');

        setfirst(htmlContent);
      }
    }, [responseValue && responseValue.analyticsData]);

    const pieData =
      responseValue && responseValue.analyticsData
        ? responseValue.analyticsData.slice(1).map((item, idx) => {
            let color;
            if (idx === 0) {
              color = colors.secondaryColor;
              // "#F4C24A"; // Primary color for the first item
            } else if (idx === 1) {
              color = '#F4C24A';
              // colors.secondaryColor; // Secondary color for the second item
            } else if (idx === 2) {
              color = '#749E35'; // Specific color for the third item
            } else {
              do {
                color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random hex color
              } while (
                [
                  colors.primaryColor,
                  colors.secondaryColor,
                  '#749E35',
                ].includes(color)
              );
            }

            return {
              value: item[1],
              label: item[0],
              color: color, // Use the determined color
            };
          })
        : [];

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

    const config = {
      backgroundGradientFrom: '#1E2923',
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: '#08130D',
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5,
      useShadowColorFromDataset: false, // optional
    };

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
            <View
              style={{
                backgroundColor: 'red',
                paddingHorizontal: 'auto',
                overflow: 'scroll',
                height: 300,
              }}>
              <View style={{flex: 1}}>
                <WebView
                  originWhitelist={['*']}
                  source={{html: first}}
                  style={{flex: 1}}
                />
              </View>
              {/* <View style={styles.chartContainer}>
                <View style={{...styles.chartContent}}>
                  {chartData.length > 0 ? (
                    <HorizontalBarChart
                      data={chartData}
                      // yAccessor={({item}) => item.count}
                      // svg={{fill: colors.primaryColor}}
                      // spacingInner={0.2}
                      // contentInset={{top: 10, bottom: 10}}
                      // style={styles.barChart}
                    />
                  ) : (
                    <Text>No data available</Text>
                  )}
                </View>
              </View> */}
              {/* {chartData.length > 0 ? (
                <BarChart
                  data={chartData.map(item => ({
                    value: item.count,
                    label: item.label,
                    frontColor: '#F4C24A',
                    topLabelComponent: () => (
                      <View style={{width: 250}}>
                        <Text
                          style={{
                            fontSize: 12,
                            color: colors.blackColor, // Adjust color as needed
                            textAlign: 'center',
                            width: 'auto',
                          }}>
                          {`${item.count} (${(item.percentage * 100) / 2}%)`}
                        </Text>
                      </View>
                    ),
                    labelComponent: () => (
                      <View style={{width: 'auto'}}>
                        <Text
                          style={{color: colors.blackColor, fontSize: 14}}
                          numberOfLines={1}
                          ellipsizeMode="tail">
                          {item.label}
                        </Text>
                      </View>
                    ),
                  }))}
                  noOfSections={Math.max(...chartData.map(item => item.count))}
                  maxValue={Math.max(...chartData.map(item => item.count))}
                  isAnimated
                  hideRules
                  horizontal
                  yAxisThickness={0}
                  spacing={20}
                  backgroundColor={'yellow'}
                  width={250}
                  height={200}
                />
              ) : (
                <Text>No data available</Text>
              )} */}
            </View>
          ) : questionOptionId === 1 ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PieChart
                data={pieData}
                //donut
                //showText
                textColor="white"
                textSize={20}
                showValuesAsLabels
                radius={90}
              />
              <View style={styles.pieChartLabels}>
                {pieData.map((data, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      bottom: 50,
                      left: 15,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: data.color,
                        marginRight: 9,
                      }}
                    />
                    <Text style={{color: '#000', fontSize: 12, bottom: 2}}>
                      {data.label}
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
              <QuestionTypeSelector
                key={item.questionId}
                questionOptionId={item.questionOptionId}
                answers={answers}
                setAnswers={setAnswers}
                options={item.questionOptions}
                questionId={item.questionId}
              />
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
    // marginVertical: 10,
    // marginHorizontal: 20,
    // backgroundColor: 'red',
    width: '100%',
  },
  chartContent: {
    // flexDirection: 'row',
    // alignItems: 'center',
    width: '100%',
  },
  barChart: {
    height: 200,
    width: '100%', // Adjust width as needed
    backgroundColor: '#fff',
    marginHorizontal: 5,
    justifyContent: 'center',
    right: 40,
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
