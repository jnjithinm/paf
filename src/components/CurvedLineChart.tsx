// import React, {FC} from 'react';
// import {View, StyleSheet, ViewStyle} from 'react-native';
// import {LineChart} from 'react-native-gifted-charts';

// import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
// import {FONT_SIZES} from '../config/themes';
// import Text from './Text';

// export type LineDataItem = {value: number};

// const initialValues: LineDataItem[] = [{value: 0}];

// function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
//   return data?.map(item => ({value: item})) || initialValues;
// }

// const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

// type RenderIndicatorTypes = {
//   label: string;
//   color: string;
// };
// const RenderIndicator: FC<RenderIndicatorTypes> = ({label, color}) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           height: 7,
//           aspectRatio: 1,
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: 'center',
//         }}
//       />
//       <Text size="verysmall3" style={{left: 5}}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   indicators?: string[];
//   labels: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
//   value1,
//   value2,
//   value3,
//   labels,
//   indicators,
//   style,
//   title,
// }) => {
//   // Calculate the maximum value for the Y-axis
//   const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
//   const maxValue = Math.max(...allValues);
//   const stepValue = Math.ceil(maxValue / 5);

//   const yAxisLabels = Array.from({length: 6}, (_, i) =>
//     (i * stepValue).toString(),
//   );

//   // Render horizontal lines with labels
//   const renderHorizontalLines = () => {
//     const lines = [];
//     for (let i = 0; i <= 5; i++) {
//       const value = i * stepValue;
//       const bottomPosition = (i * 80) / 5; // Adjusted bottom position

//       lines.push(
//         <View
//           key={`line-${i}`}
//           style={[
//             styles.horizontalLineContainer,
//             {bottom: `${bottomPosition}%`},
//           ]}>
//           <Text size="small1" style={styles.lineLabel}>
//             {value.toFixed(0)}
//           </Text>
//           <View style={styles.line} />
//         </View>,
//       );
//     }
//     return lines;
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);

//   return (
//     <View style={[styles.chartContainer, style]}>
//       {title && (
//         <Text style={styles.title} size="body1" fontVariant="bold">
//           {title}
//         </Text>
//       )}
//       <View style={styles.chartWrapper}>
//         <LineChart
//           initialSpacing={0}
//           xAxisThickness={0}
//           xAxisLabelTexts={labels}
//           yAxisLabelTexts={yAxisLabels}
//           data={data1 || initialValues}
//           data2={data2}
//           data3={data3}
//           color1={colors[0]}
//           color2={colors[1]}
//           color3={colors[2]}
//           yAxisColor={'#F5F7FA'}
//           spacing={normaliseDesigns(35)}
//           width={normaliseDesigns(270)}
//           showDataPointOnFocus
//           showValuesAsDataPointsText
//           showDataPointLabelOnFocus
//           hideDataPoints
//           thickness={2}
//           showVerticalLines={false}
//           curved
//           xAxisLabelTextStyle={{
//             color: '#4E565F',
//             width: normaliseDesigns(50),
//             fontSize: FONT_SIZES.small1,
//             marginTop: 5, // Ensure labels are positioned correctly relative to the x-axis
//           }}
//           xAxisColor="#CBD2D9"
//           xAxisLength={normaliseDesigns(250)}
//           yAxisThickness={0}
//           hideAxesAndRules
//         />
//         <View style={styles.horizontalLinesContainer}>
//           {renderHorizontalLines()}
//         </View>
//       </View>
//       {indicators && (
//         <View style={styles.indicatorsContainer}>
//           <RenderIndicator label={indicators[0]} color={colors[0]} />
//           <RenderIndicator label={indicators[1]} color={colors[1]} />
//           {indicators.length > 2 && (
//             <RenderIndicator label={indicators[2]} color={colors[2]} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#F5F7FA',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     marginVertical: 15,
//     paddingVertical: 15,
//   },
//   title: {
//     alignSelf: 'flex-start',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   chartWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   horizontalLinesContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     bottom: '8.5%',
//     zIndex: -1,
//   },
//   horizontalLineContainer: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//   },
//   line: {
//     position: 'absolute',
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     width: '90%',
//     justifyContent: 'flex-end',
//     right: 0,
//   },
//   lineLabel: {
//     position: 'absolute',
//     left: 10,
//     transform: [{translateY: -8}],
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//     justifyContent: 'flex-start',
//     marginTop: '5%',
//     left: '5%',
//   },
// });

// export default CurvedLineChart;


///commented


// import React, { FC } from 'react';
// import { View, StyleSheet, ViewStyle } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';

// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import { FONT_SIZES } from '../config/themes';
// import Text from './Text';

// export type LineDataItem = { value: number };

// const initialValues: LineDataItem[] = [{ value: 0 }];

// function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
//   return data?.map(item => ({ value: item })) || initialValues;
// }

// const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

// type RenderIndicatorTypes = {
//   label: string;
//   color: string;
// };

// const RenderIndicator: FC<RenderIndicatorTypes> = ({ label, color }) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           height: 7,
//           aspectRatio: 1,
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: 'center',
//         }}
//       />
//       <Text size="verysmall3" style={{ left: 5 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   labels: string[];
//   indicators?: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
//   value1,
//   value2,
//   value3,
//   labels,
//   indicators,
//   style,
//   title,
// }) => {
//   // Calculate the maximum value for the Y-axis
//   const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
//   const maxValue = Math.max(...allValues);
//   const stepValue = Math.ceil(maxValue / 5);

//   const yAxisLabels = Array.from({ length: 6 }, (_, i) =>
//     (i * stepValue).toString(),
//   );

//   // Render horizontal lines with labels
//   const renderHorizontalLines = () => {
//     const lines = [];
//     for (let i = 0; i <= 5; i++) {
//       const value = i * stepValue;
//       const bottomPosition = (i * 80) / 5; // Adjusted bottom position

//       lines.push(
//         <View
//           key={`line-${i}`}
//           style={[
//             styles.horizontalLineContainer,
//             { bottom: `${bottomPosition}%` },
//           ]}>
//           <Text size="small1" style={styles.lineLabel}>
//             {value.toFixed(0)}
//           </Text>
//           <View style={styles.line} />
//         </View>,
//       );
//     }
//     return lines;
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);
// // console.log("data1",data1);
// // console.log("data2",data2);
// // console.log("data3",data3);
//   return (
//     <View style={[styles.chartContainer, style]}>
//       {title && (
//         <Text style={styles.title} size="body1" fontVariant="bold">
//           {title}
//         </Text>
//       )}
//       <View style={styles.chartWrapper}>
// {(data1.length != 0 &&data2.length != 0&&data3.length != 0)&&
//         <LineChart
//           initialSpacing={0}
//           xAxisThickness={0}
//           xAxisLabelTexts={labels}
//           yAxisLabelTexts={yAxisLabels}
//           data={data1 || initialValues}
//           data2={data2}
//           data3={data3}
//           color1={colors[0]}
//           color2={colors[1]}
//           color3={colors[2]}
//           yAxisColor={'#F5F7FA'}
//           spacing={normaliseDesigns(35)}
//           width={normaliseDesigns(270)}
//           showDataPointOnFocus
//           showValuesAsDataPointsText
//           showDataPointLabelOnFocus
//           hideDataPoints
//           thickness={2}
//           showVerticalLines={false}
//           curved
//           xAxisLabelTextStyle={{
//             color: '#4E565F',
//             width: normaliseDesigns(50),
//             fontSize: FONT_SIZES.small1,
//             marginTop: 2,
//           }}
//           xAxisColor="#CBD2D9"
//           xAxisLength={normaliseDesigns(250)}
//           yAxisThickness={0}
//           hideAxesAndRules
//         />}
//         <View style={styles.horizontalLinesContainer}>
//           {renderHorizontalLines()}
//         </View>
//       </View>
//       {indicators && (
//         <View style={styles.indicatorsContainer}>
//           <RenderIndicator label={indicators[0]} color={colors[0]} />
//           <RenderIndicator label={indicators[1]} color={colors[1]} />
//           {indicators.length > 2 && (
//             <RenderIndicator label={indicators[2]} color={colors[2]} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#F5F7FA',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     marginVertical: 15,
//     paddingVertical: 15,
//   },
//   title: {
//     alignSelf: 'flex-start',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   chartWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   horizontalLinesContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     bottom: '8.5%',
//     zIndex: -1,
//   },
//   horizontalLineContainer: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//   },
//   line: {
//     position: 'absolute',
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     width: '90%',
//     justifyContent: 'flex-end',
//     right: 0,
//   },
//   lineLabel: {
//     position: 'absolute',
//     left: 10,
//     transform: [{ translateY: -8 }],
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//     justifyContent: 'flex-start',
//     marginTop: '5%',
//     left: '5%',
//   },
// });

// export default CurvedLineChart;


//new

// import React, { FC } from 'react';
// import { View, StyleSheet, ViewStyle } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import moment from 'moment';

// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import { FONT_SIZES } from '../config/themes';
// import Text from './Text';

// export type LineDataItem = { value: number };

// const initialValues: LineDataItem[] = [{ value: 0 }];

// function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
//   return data?.map(item => ({ value: item })) || initialValues;
// }

// const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

// type RenderIndicatorTypes = {
//   label: string;
//   color: string;
// };

// const RenderIndicator: FC<RenderIndicatorTypes> = ({ label, color }) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           height: 7,
//           aspectRatio: 1,
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: 'center',
//         }}
//       />
//       <Text size="verysmall3" style={{ left: 5 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   labels: string[];
//   indicators?: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
//   value1,
//   value2,
//   value3,
//   labels,
//   indicators,
//   style,
//   title,
// }) => {
//   // Format labels to a more readable form
//   const formattedLabels = labels.map(label => moment(label).format('MMM YYYY'));

//   // Calculate the maximum value for the Y-axis
//   const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
//   const maxValue = Math.max(...allValues);
//   const stepValue = Math.ceil(maxValue / 5);

//   const yAxisLabels = Array.from({ length: 6 }, (_, i) =>
//     (i * stepValue).toString(),
//   );

//   // Render horizontal lines with labels
//   const renderHorizontalLines = () => {
//     const lines = [];
//     for (let i = 0; i <= 5; i++) {
//       const value = i * stepValue;
//       const bottomPosition = (i * 80) / 5; // Adjusted bottom position

//       lines.push(
//         <View
//           key={`line-${i}`}
//           style={[
//             styles.horizontalLineContainer,
//             { bottom: `${bottomPosition}%` },
//           ]}>
//           <Text size="small1" style={styles.lineLabel}>
//             {value.toFixed(0)}
//           </Text>
//           <View style={styles.line} />
//         </View>,
//       );
//     }
//     return lines;
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);

//   return (
//     <View style={[styles.chartContainer, style]}>
//       {title && (
//         <Text style={styles.title} size="body1" fontVariant="bold">
//           {title}
//         </Text>
//       )}
//       <View style={styles.chartWrapper}>
//         <LineChart
//           initialSpacing={0}
//           xAxisThickness={0}
//           xAxisLabelTexts={formattedLabels}
//           yAxisLabelTexts={yAxisLabels}
//           data={data1 || initialValues}
//           data2={data2}
//           data3={data3}
//           color1={colors[0]}
//           color2={colors[1]}
//           color3={colors[2]}
//           yAxisColor={'#F5F7FA'}
//           spacing={normaliseDesigns(35)}
//           width={normaliseDesigns(270)}
//           showDataPointOnFocus
//           showValuesAsDataPointsText
//           showDataPointLabelOnFocus
//           hideDataPoints
//           thickness={2}
//           showVerticalLines={false}
//           curved
//           xAxisLabelTextStyle={{
//             color: '#4E565F',
//             width: normaliseDesigns(70), // Adjust width for better spacing
//             fontSize: FONT_SIZES.small1,
//             marginTop: 2,
//             transform: [{ rotate: '45deg' }], // Rotate labels for better readability
//           }}
//           xAxisColor="#CBD2D9"
//           xAxisLength={normaliseDesigns(250)}
//           yAxisThickness={0}
//           hideAxesAndRules
//         />
//         <View style={styles.horizontalLinesContainer}>
//           {renderHorizontalLines()}
//         </View>
//       </View>
//       {indicators && (
//         <View style={styles.indicatorsContainer}>
//           <RenderIndicator label={indicators[0]} color={colors[0]} />
//           <RenderIndicator label={indicators[1]} color={colors[1]} />
//           {indicators.length > 2 && (
//             <RenderIndicator label={indicators[2]} color={colors[2]} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#F5F7FA',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     marginVertical: 15,
//     paddingVertical: 15,
//   },
//   title: {
//     alignSelf: 'flex-start',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   chartWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   horizontalLinesContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     bottom: '8.5%',
//     zIndex: -1,
//   },
//   horizontalLineContainer: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//   },
//   line: {
//     position: 'absolute',
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     width: '90%',
//     justifyContent: 'flex-end',
//     right: 0,
//   },
//   lineLabel: {
//     position: 'absolute',
//     left: 10,
//     transform: [{ translateY: -8 }],
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//     justifyContent: 'flex-start',
//     marginTop: '5%',
//     left: '5%',
//   },
// });

// export default CurvedLineChart;

//latest code
import React, { FC } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import { FONT_SIZES } from '../config/themes';
import Text from './Text';

export type LineDataItem = { value: number };

const initialValues: LineDataItem[] = [{ value: 0 }];

function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
  return data?.map(item => ({ value: Math.max(0, item) })) || initialValues;
}

const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

type RenderIndicatorTypes = {
  label: string;
  color: string;
};

const RenderIndicator: FC<RenderIndicatorTypes> = ({ label, color }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        justifyContent: 'center',
      }}>
      <View
        style={{
          height: 7,
          aspectRatio: 1,
          backgroundColor: color,
          borderRadius: 10,
          alignSelf: 'center',
        }}
      />
      <Text size="verysmall3" style={{ left: 5 }}>
        {label}
      </Text>
    </View>
  );
};

interface CurvedLineChartProps {
  value1: number[];
  value2?: number[];
  value3?: number[];
  labels: string[];
  indicators?: string[];
  style?: ViewStyle;
  title?: string;
}

const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
  value1,
  value2,
  value3,
  labels,
  indicators,
  style,
  title,
}) => {
  const isDateFormat = (label: string): boolean => {
    return /\d{4}-\d{2}-\d{2}/.test(label);
  };

  const convertDateFormat = (label: string): string => {
    if (isDateFormat(label)) {
      const [year, month, day] = label.split('-');
      return `${day}-${month}-${year.slice(-2)}`;
    }
    return label;
  };

  const areLabelsDateFormat = labels.some(isDateFormat);

  // Apply a minimum value of 0 to ensure lines don't dip below zero
  const adjustedValue1 = value1.map(val => Math.max(0, val));
  const adjustedValue2 = value2 ? value2.map(val => Math.max(0, val)) : [];
  const adjustedValue3 = value3 ? value3.map(val => Math.max(0, val)) : [];

  // Get the maximum value for scaling Y-axis appropriately
  const allValues = [...adjustedValue1, ...adjustedValue2, ...adjustedValue3];
  const maxValue = Math.max(...allValues);

  // Adjusted stepValue to ensure it covers the range including maxValue
  const stepValue = Math.ceil(maxValue / 5);

  // Create yAxisLabels ensuring maxValue is covered
  const yAxisLabels = Array.from({ length: 6 }, (_, i) => (i * stepValue).toString());

  // Add this line to ensure the last label includes the maximum value
  if (maxValue > stepValue * 5) {
    yAxisLabels.push(maxValue.toString());
  }

  const formattedLabels = labels.map(label => convertDateFormat(label));

  const renderHorizontalLines = () => {
    const lines = [];
    for (let i = 0; i <= 5; i++) {
      const value = i * stepValue;
      const bottomPosition = (i * 80) / 5;

      lines.push(
        <View
          key={`line-${i}`}
          style={[
            styles.horizontalLineContainer,
            { bottom: `${bottomPosition}%` },
          ]}>
          <Text size="small1" style={styles.lineLabel}>
            {value.toFixed(0)}
          </Text>
          <View style={styles.line} />
        </View>,
      );
    }
    return lines;
  };

  const data1 = convertToLineDataItem(adjustedValue1);
  const data2 = convertToLineDataItem(adjustedValue2);
  const data3 = convertToLineDataItem(adjustedValue3);

  return (
    <View style={[styles.chartContainer, style, { overflow: 'hidden' }]}>
      {title && (
        <Text style={styles.title} size="body1" fontVariant="bold">
          {title}
        </Text>
      )}
      <View style={styles.chartWrapper}>
        {(data1.length !== 0 || data2.length !== 0 || data3.length !== 0) && (
          <LineChart
            xAxisThickness={0}
            xAxisLabelTexts={formattedLabels}
            yAxisLabelTexts={yAxisLabels}
            data={data1 || initialValues}
            data2={data2.length ? data2 : undefined}
            data3={data3.length ? data3 : undefined}
            color1={colors[0]}
            color2={colors[1]}
            color3={colors[2]}
            yAxisColor={'#F5F7FA'}
            spacing={areLabelsDateFormat ? normaliseDesigns(70) : normaliseDesigns(35)}
            width={normaliseDesigns(280)}
            showDataPointOnFocus
            showValuesAsDataPointsText
            showDataPointLabelOnFocus
            hideDataPoints
            thickness={2}
            showVerticalLines={false}
            curved
            xAxisLabelTextStyle={{
              color: '#4E565F',
              width: areLabelsDateFormat ? normaliseDesigns(80) : normaliseDesigns(50),
              fontSize: FONT_SIZES.small1,
              marginTop: 2,
              textAlign: 'center',
              left:-10,
            }}
            xAxisColor="#CBD2D9"
            xAxisLength={normaliseDesigns(350)}
            yAxisThickness={0}
            hideAxesAndRules
          />
        )}
        
        {/* X and Y Axis Labels */}
        <Text size="small1" style={styles.yAxisLabel}>
          Count
        </Text>
        <Text size="small1" style={styles.xAxisLabel}>
          Date
        </Text>
        <View style={styles.horizontalLinesContainer}>
          {renderHorizontalLines()}
        </View>
        
      </View>
      {indicators && (
        <View style={styles.indicatorsContainer}>
          <RenderIndicator label={indicators[0]} color={colors[0]} />
          <RenderIndicator label={indicators[1]} color={colors[1]} />
          {indicators.length > 2 && (
            <RenderIndicator label={indicators[2]} color={colors[2]} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor:'#F5F7FA',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD2D9',
    marginVertical: 15,
    paddingVertical: 22,
    paddingHorizontal:7,
  },
  title: {
    alignSelf: 'flex-start',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  horizontalLinesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    bottom: '9.3%',
    zIndex: -1,
  },
  horizontalLineContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
    left:5
  },
  line: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#CBD2D9',
    opacity: 0.5,
    width: '90%',
    justifyContent: 'flex-end',
    right: -10,
  },
  lineLabel: {
    position: 'absolute',
    left: 10,
    transform: [{ translateY: -8 }],
  },
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '7%',
    left: '5%',
  },
  yAxisLabel: {
    position: 'absolute',
    left: normaliseDesigns(-12),
    marginHorizontal:2,
    top: '45%', // Adjusted for better alignment
    transform: [{ rotate: '-90deg' }],
    fontSize: FONT_SIZES.small1,
    color:'#ABB4BD',
    //paddingVertical:15,
    
  },
  xAxisLabel: {
    alignSelf: 'center',
    marginTop: -20, // Adjusted for better alignment
    fontSize: FONT_SIZES.small1,
    top: '10%',
    color:'#ABB4BD',
    marginVertical:4,
    bottom:10
    
  },
});

export default CurvedLineChart;




// import React, { FC, useState } from 'react';
// import { View, StyleSheet, ViewStyle, TouchableOpacity, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';

// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import { FONT_SIZES } from '../config/themes';
// import Text from './Text';

// export type LineDataItem = { value: number };

// const initialValues: LineDataItem[] = [{ value: 0 }];

// function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
//   return data?.map(item => ({ value: item })) || initialValues;
// }

// const chartWidth = Dimensions.get('window').width;
// const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

// type RenderIndicatorTypes = {
//   label: string;
//   color: string;
// };

// const RenderIndicator: FC<RenderIndicatorTypes> = ({ label, color }) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           height: 7,
//           aspectRatio: 1,
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: 'center',
//         }}
//       />
//       <Text size="verysmall3" style={{ left: 5 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   labels: string[];
//   indicators?: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
//   value1,
//   value2,
//   value3,
//   labels,
//   indicators,
//   style,
//   title,
// }) => {
//   const isDateFormat = (label: string): boolean => {
//     return /\d{4}-\d{2}-\d{2}/.test(label);
//   };

//   const convertDateFormat = (label: string): string => {
//     if (isDateFormat(label)) {
//       const [year, month, day] = label.split('-');
//       return `${day}-${month}-${year.slice(-2)}`;
//     }
//     return label;
//   };

//   const [tooltipPos, setTooltipPos] = useState({ visible: false, x: 0, y: 0, value: 0 });
//   const areLabelsDateFormat = labels.some(isDateFormat);

//   const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
//   const maxValue = Math.max(...allValues);
//   const minValue = Math.min(...allValues);
  
//   // Adjust the range to avoid overshooting 100
//   const range = maxValue - minValue;
//   const stepValue = Math.ceil(range / 5);

//   const yAxisLabels = Array.from({ length: 6 }, (_, i) =>
//     (minValue + i * stepValue).toString(),
//   );

//   const formattedLabels = labels.map(label => convertDateFormat(label));

//   const renderHorizontalLines = () => {
//     const lines = [];
//     for (let i = 0; i <= 5; i++) {
//       // console.log("iiiiii",i,minValue,stepValue);
      
//       const value = minValue + i * stepValue;
//       const bottomPosition = (i * 80) / 5;
//       console.log("iiiiibottomPositioni",i,value,bottomPosition);

//       lines.push(
//         <View
//           key={`line-${i}`}
//           style={[
//             styles.horizontalLineContainer,
//             { bottom: `${bottomPosition}%` },
//           ]}>
//           <Text size="small1" style={styles.lineLabel}>
//             {value.toFixed(0)}
//           </Text>
//           <View style={styles.line} />
//         </View>,
//       );
//     }
//     return lines;
//   };

//   const handleDotPress = (value: any, x: any, y: any) => {
//     console.log("value==",value,x,y);
    
//     setTooltipPos({ visible: true, x, y, value });
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);

//   return (
//     <View style={[styles.chartContainer, style, { overflow: 'hidden' }]}>
//       {title && (
//         <Text style={styles.title} size="body1" fontVariant="bold">
//           {title}
//         </Text>
//       )}
//       <View style={styles.chartWrapper}>
//         {(data1.length !== 0 && data2.length !== 0 && data3.length !== 0) && (
//           <LineChart
//             xAxisThickness={0}
//             xAxisLabelTexts={formattedLabels}
//             // onDotClick={(dot, index) => {
//             //   setToolTips({
//             //     visible: true,
//             //     x: dot.x,
//             //     y: dot.y,
//             //     value: dot.value,
//             //   });
//             // }}
//             customDataPoint={(point, index) =>{
//               console.log("(point, index",point, index);
              
//               return (
//               <TouchableOpacity
//                 key={index}
//                 onPress={() => handleDotPress(point.value, point.x, point.y)}
//                 style={{ position: 'absolute', left: point.x - 10, top: point.y - 10, width: 20, height: 20 }}
//               >
//                 <View style={styles.dot} />
//               </TouchableOpacity>
//             )}}
//             yAxisLabelTexts={yAxisLabels}
//             data={data1 || initialValues}
//             data2={data2}
//             data3={data3}
//             color1={colors[0]}
//             color2={colors[1]}
//             color3={colors[2]}
//             yAxisColor={'#F5F7FA'}
//             spacing={areLabelsDateFormat ? normaliseDesigns(70) : normaliseDesigns(35)}
//             width={normaliseDesigns(280)}
//             showDataPointOnFocus
//             showValuesAsDataPointsText
//             showDataPointLabelOnFocus
//             hideDataPoints
//             thickness={2}
//             showVerticalLines={false}
//             curved
//             xAxisLabelTextStyle={{
//               color: '#4E565F',
//               width: areLabelsDateFormat ? normaliseDesigns(80) : normaliseDesigns(50),
//               fontSize: FONT_SIZES.small1,
//               marginTop: 2,
//               textAlign: 'center',
//               left: -10
//             }}
//             xAxisColor="#CBD2D9"
//             xAxisLength={normaliseDesigns(350)}
//             yAxisThickness={0}
//             hideAxesAndRules
//           />
//         )}
//         <View style={styles.horizontalLinesContainer}>
//           {renderHorizontalLines()}
//         </View>
//         {/* X and Y Axis Labels */}
//         <Text size="small1" style={styles.yAxisLabel}>
//           Count
//         </Text>
//         <Text size="small1" style={styles.xAxisLabel}>
//           Date
//         </Text>
//       </View>
//       {indicators && (
//         <View style={styles.indicatorsContainer}>
//           <RenderIndicator label={indicators[0]} color={colors[0]} />
//           <RenderIndicator label={indicators[1]} color={colors[1]} />
//           {indicators.length > 2 && (
//             <RenderIndicator label={indicators[2]} color={colors[2]} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#F5F7FA',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     marginVertical: 15,
//     paddingVertical: 15,
//   },
//   title: {
//     alignSelf: 'flex-start',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   chartWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   horizontalLinesContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     bottom: '9.3%',
//     zIndex: -1,
//   },
//   horizontalLineContainer: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//     left: 5,
//   },
//   line: {
//     position: 'absolute',
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     width: '90%',
//     justifyContent: 'flex-end',
//     right: -10,
//   },
//   lineLabel: {
//     position: 'absolute',
//     left: 10,
//     transform: [{ translateY: -8 }],
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//     justifyContent: 'flex-start',
//     marginTop: '7%',
//     left: '5%',
//   },
//   yAxisLabel: {
//     position: 'absolute',
//     left: -14,
//     marginHorizontal: 2,
//     top: '45%',
//     transform: [{ rotate: '-90deg' }],
//     fontSize: FONT_SIZES.small1,
//     color: '#ABB4BD',
//   },
//   xAxisLabel: {
//     alignSelf: 'center',
//     marginTop: -20,
//     fontSize: FONT_SIZES.small1,
//     top: '8%',
//     color: '#ABB4BD',
//     marginVertical: 4,
//   },
//   dot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//     backgroundColor: 'blue',
//   },
//   tooltip: {
//     position: 'absolute',
//     backgroundColor: 'black',
//     padding: 5,
//     borderRadius: 5,
//   },

// });

// export default CurvedLineChart;

// import React, { FC } from 'react';
// import { View, StyleSheet, ViewStyle } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';

// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import { FONT_SIZES } from '../config/themes';
// import Text from './Text';

// export type LineDataItem = { value: number };

// const initialValues: LineDataItem[] = [{ value: 0 }];

// function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
//   return data?.map(item => ({ value: item })) || initialValues;
// }

// const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

// type RenderIndicatorTypes = {
//   label: string;
//   color: string;
// };

// const RenderIndicator: FC<RenderIndicatorTypes> = ({ label, color }) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           height: 7,
//           aspectRatio: 1,
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: 'center',
//         }}
//       />
//       <Text size="verysmall3" style={{ left: 5 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   labels: string[];
//   indicators?: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
//   value1,
//   value2,
//   value3,
//   labels,
//   indicators,
//   style,
//   title,
// }) => {
//   const isDateFormat = (label: string): boolean => {
//     return /\d{4}-\d{2}-\d{2}/.test(label);
//   };

//   const convertDateFormat = (label: string): string => {
//     if (isDateFormat(label)) {
//       const [year, month, day] = label.split('-');
//       return `${day}-${month}-${year.slice(-2)}`;
//     }
//     return label;
//   };

//   const areLabelsDateFormat = labels.some(isDateFormat);

//   const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
//   const maxValue = Math.max(...allValues);
//   const minValue = Math.min(...allValues);
  
//   // Adjust the range to avoid overshooting 100
//   const range = maxValue - minValue;
//   const stepValue = Math.ceil(range / 5);

//   const yAxisLabels = Array.from({ length: 6 }, (_, i) =>
//     (minValue + i * stepValue).toString(),
//   );

//   const formattedLabels = labels.map(label => convertDateFormat(label));

//   const renderHorizontalLines = () => {
//     const lines = [];
//     const chartHeight = 85; // This should ideally match the height of your chart in percentage or pixels
//     const stepPercentage = chartHeight / 5;
  
//     for (let i = 0; i <= 5; i++) {
//       const value = minValue + i * stepValue;
      
//       // Calculate the bottom position for each line
//       const bottomPosition = (i * stepPercentage);
  
//       lines.push(
//         <View
//           key={`line-${i}`}
//           style={[
//             styles.horizontalLineContainer,
//             { bottom: `${bottomPosition}%` },
//           ]}
//         >
//           <Text size="small1" style={styles.lineLabel}>
//             {value.toFixed(0)}
//           </Text>
//           <View style={styles.line} />
//         </View>
//       );
//     }
//     return lines;
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);

//   return (
//     <View style={[styles.chartContainer, style, { overflow: 'hidden' }]}>
//       {title && (
//         <Text style={styles.title} size="body1" fontVariant="bold">
//           {title}
//         </Text>
//       )}
//       <View style={styles.chartWrapper}>
//         {(data1.length !== 0 && data2.length !== 0 && data3.length !== 0) && (
//        <LineChart
//        xAxisThickness={0}
//        xAxisLabelTexts={formattedLabels}
//        yAxisLabelTexts={yAxisLabels}
//        data={data1 || initialValues}
//        data2={data2}
//        data3={data3}
//        color1={colors[0]}
//        color2={colors[1]}
//        color3={colors[2]}
//        yAxisColor={'#F5F7FA'}
//        spacing={areLabelsDateFormat ? normaliseDesigns(70) : normaliseDesigns(35)}
//        width={normaliseDesigns(280)}
//        showDataPointOnFocus
//        showValuesAsDataPointsText
//        showDataPointLabelOnFocus
//        hideDataPoints={false} // Ensure data points are shown
//        thickness={2}
//        showVerticalLines={false}
//        curved
//        xAxisLabelTextStyle={{
//          color: '#4E565F',
//          width: areLabelsDateFormat ? normaliseDesigns(80) : normaliseDesigns(50),
//          fontSize: FONT_SIZES.small1,
//          marginTop: 2,
//          textAlign: 'center',
//          left: -10,
//        }}
//        xAxisColor="#CBD2D9"
//        xAxisLength={normaliseDesigns(350)}
//        yAxisThickness={0}
//        hideAxesAndRules
//        dataPointsRadius={4} // Adjust radius to show data points
//        dataPointsColor={colors[0]} // Adjust data point color as needed
//        dataPointTextStyle={{
//          color: '#000', // Adjust text color
//          fontSize: FONT_SIZES.small1, // Adjust font size
//          marginBottom: -15, // Adjust positioning
//        }}
//      />
     
//         )}
//         <View style={styles.horizontalLinesContainer}>
//           {renderHorizontalLines()}
//         </View>
//         {/* X and Y Axis Labels */}
//         <Text size="small1" style={styles.yAxisLabel}>
//           Count
//         </Text>
//         <Text size="small1" style={styles.xAxisLabel}>
//           Date
//         </Text>
//       </View>
//       {indicators && (
//         <View style={styles.indicatorsContainer}>
//           <RenderIndicator label={indicators[0]} color={colors[0]} />
//           <RenderIndicator label={indicators[1]} color={colors[1]} />
//           {indicators.length > 2 && (
//             <RenderIndicator label={indicators[2]} color={colors[2]} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#F5F7FA',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     marginVertical: 15,
//     paddingVertical: 15,
//   },
//   title: {
//     alignSelf: 'flex-start',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   chartWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   horizontalLinesContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     bottom: '9.3%',
//     zIndex: -1,
//   },
//   horizontalLineContainer: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//     left: 5,
//   },
//   line: {
//     position: 'absolute',
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     width: '90%',
//     justifyContent: 'flex-end',
//     right: -10,
//   },
//   lineLabel: {
//     position: 'absolute',
//     left: 10,
//     transform: [{ translateY: -8 }],
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//     justifyContent: 'flex-start',
//     marginTop: '7%',
//     left: '5%',
//   },
//   yAxisLabel: {
//     position: 'absolute',
//     left: -14,
//     marginHorizontal: 2,
//     top: '45%',
//     transform: [{ rotate: '-90deg' }],
//     fontSize: FONT_SIZES.small1,
//     color: '#ABB4BD',
//   },
//   xAxisLabel: {
//     alignSelf: 'center',
//     marginTop: -20,
//     fontSize: FONT_SIZES.small1,
//     top: '8%',
//     color: '#ABB4BD',
//     marginVertical: 4,
//   },
// });

// export default CurvedLineChart;

// import React from 'react';
// import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';
// import Text from './Text'; // Assuming you have a custom Text component

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   labels: string[];
//   indicators?: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart = ({
//   value1,
//   value2 = [],  // Default to empty array if not provided
//   value3 = [],  // Default to empty array if not provided
//   labels,
//   indicators = ['Count of users', 'Count of roles', 'User groups'],
//   title = 'User Analytics',
//   style,
// }: CurvedLineChartProps) => {
//   const colors = ['#F4C24A', '#2F68C4', '#749E35'];
//   const chartHeight = 200; // Fixed height for the chart

//   const allData = [...value1, ...value2, ...value3];
//   const yAxisMaxValue = Math.max(...allData) || 5; // Max value for the y-axis
//   const yAxisMinValue = 0;
//   const numberOfHorizontalLines = 5;

//   const yAxisStepValue = (yAxisMaxValue - yAxisMinValue) / numberOfHorizontalLines;
//   const yAxisValues = Array.from({ length: numberOfHorizontalLines + 1 }).map((_, index) => (
//     (yAxisMinValue + yAxisStepValue * index).toFixed(1)
//   ));

//   const convertToLineDataItem = (data: number[]) => {
//     return data.map(item => ({ value: item }));
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);

//   return (
//     <View style={[styles.chartContainer, style]}>
//       <View style={styles.header}>
//         {title && <Text style={styles.title}>{title}</Text>}
//         {/* Icons can be added here if necessary */}
//       </View>
//       <View style={{ position: 'relative' }}>
//         {yAxisValues.map((value, index) => (
//           <View
//             key={index}
//             style={[
//               styles.horizontalLine,
//               { bottom: (chartHeight / numberOfHorizontalLines) * index },
//             ]}
//           >
//             <Text style={styles.yAxisLabel}>{value}</Text>
//             <View style={styles.horizontalLineLine} />
//           </View>
//         ))}
//         <LineChart
//           data={data1}
//           data2={data2.length ? data2 : undefined}
//           data3={data3.length ? data3 : undefined}
//           labels={labels}
//           color1={colors[0]}
//           color2={colors[1]}
//           color3={colors[2]}
//           curved
//           thickness={2}
//           yAxisThickness={0}
//           xAxisThickness={0}
//           height={chartHeight}
//           width={Dimensions.get('window').width - 40}
//           xAxisLabelTextStyle={styles.xAxisLabelTextStyle}
//           yAxisLabelTextStyle={styles.yAxisLabelTextStyle}
//           hideAxesAndRules
//           dataPointsRadius={4}
//           dataPointsColor={colors[0]}
//           showVerticalLines={false}
//         />
//       </View>
//       <View style={styles.indicatorsContainer}>
//         {indicators.map((indicator, index) => (
//           <View key={index} style={styles.indicatorItem}>
//             <View style={[styles.indicatorDot, { backgroundColor: colors[index] }]} />
//             <Text style={styles.indicatorText}>{indicator}</Text>
//           </View>
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 2,
//     marginVertical: 10,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   xAxisLabelTextStyle: {
//     color: '#4E565F',
//     fontSize: 12,
//     marginTop: 2,
//     textAlign: 'center',
//   },
//   yAxisLabelTextStyle: {
//     color: '#ABB4BD',
//     fontSize: 12,
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   indicatorItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   indicatorDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginRight: 4,
//   },
//   indicatorText: {
//     fontSize: 12,
//     color: '#4E565F',
//   },
//   horizontalLine: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   horizontalLineLine: {
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     flex: 1,
//     marginLeft: 5,
//   },
//   yAxisLabel: {
//     position: 'absolute',
//     left: -30,
//     color: '#ABB4BD',
//     fontSize: 12,
//   },
// });

// export default CurvedLineChart;








// import React, { FC } from 'react';
// import { View, StyleSheet, ViewStyle } from 'react-native';
// import { LineChart } from 'react-native-gifted-charts';

// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import { FONT_SIZES } from '../config/themes';
// import Text from './Text';

// export type LineDataItem = { value: number };

// const initialValues: LineDataItem[] = [{ value: 0 }];

// function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
//   return data?.map(item => ({ value: item })) || initialValues;
// }

// const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

// type RenderIndicatorTypes = {
//   label: string;
//   color: string;
// };

// const RenderIndicator: FC<RenderIndicatorTypes> = ({ label, color }) => {
//   return (
//     <View
//       style={{
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         justifyContent: 'center',
//       }}>
//       <View
//         style={{
//           height: 7,
//           aspectRatio: 1,
//           backgroundColor: color,
//           borderRadius: 10,
//           alignSelf: 'center',
//         }}
//       />
//       <Text size="verysmall3" style={{ left: 5 }}>
//         {label}
//       </Text>
//     </View>
//   );
// };

// interface CurvedLineChartProps {
//   value1: number[];
//   value2?: number[];
//   value3?: number[];
//   labels: string[];
//   indicators?: string[];
//   style?: ViewStyle;
//   title?: string;
// }

// const CurvedLineChart: React.FC<CurvedLineChartProps> = ({
//   value1,
//   value2,
//   value3,
//   labels,
//   indicators,
//   style,
//   title,
// }) => {
  
//   const isDateFormat = (label: string): boolean => {
//     return /\d{4}-\d{2}-\d{2}/.test(label);
//   };

//   const convertDateFormat = (label: string): string => {
//     if (isDateFormat(label)) {
//       const [year, month, day] = label.split('-');
//       return `${day}-${month}-${year.slice(-2)}`;
//     }
//     return label;
//   };

//   const areLabelsDateFormat = labels.some(isDateFormat);

//   const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
//   const maxValue = Math.max(...allValues);
//   const stepValue = Math.ceil(maxValue / 5);

//   const yAxisLabels = Array.from({ length: 6 }, (_, i) =>
//     (i * stepValue).toString(),
//   );

//   const formattedLabels = labels.map(label => convertDateFormat(label));

//   const renderHorizontalLines = () => {
//     const lines = [];
//     for (let i = 0; i <= 5; i++) {
//       const value = i * stepValue;
//       const bottomPosition = (i * 80) / 5;

//       lines.push(
//         <View
//           key={`line-${i}`}
//           style={[
//             styles.horizontalLineContainer,
//             { bottom: `${bottomPosition}%` },
//           ]}>
//           <Text size="small1" style={styles.lineLabel}>
//             {value.toFixed(0)}
//           </Text>
//           <View style={styles.line} />
//         </View>,
//       );
//     }
//     return lines;
//   };

//   const data1 = convertToLineDataItem(value1);
//   const data2 = convertToLineDataItem(value2);
//   const data3 = convertToLineDataItem(value3);

//   return (
//     <View style={[styles.chartContainer, style, { overflow: 'hidden' }]}>
//       {title && (
//         <Text style={styles.title} size="body1" fontVariant="bold">
//           {title}
//         </Text>
//       )}
//       <View style={styles.chartWrapper}>
//         {(data1.length !== 0 && data2.length !== 0 && data3.length !== 0) && (
//           <LineChart
//             xAxisThickness={0}
//             xAxisLabelTexts={formattedLabels}
//             yAxisLabelTexts={yAxisLabels}
//             data={data1 || initialValues}
//             data2={data2}
//             data3={data3}
//             color1={colors[0]}
//             color2={colors[1]}
//             color3={colors[2]}
//             yAxisColor={'#F5F7FA'}
//             spacing={areLabelsDateFormat ? normaliseDesigns(70) : normaliseDesigns(35)}
//             width={normaliseDesigns(280)}
//             showDataPointOnFocus
//             showValuesAsDataPointsText
//             showDataPointLabelOnFocus
//             hideDataPoints
//             thickness={2}
//             showVerticalLines={false}
//             curved
//             xAxisLabelTextStyle={{
//               color: '#4E565F',
//               width: areLabelsDateFormat ? normaliseDesigns(80) : normaliseDesigns(50),
//               fontSize: FONT_SIZES.small1,
//               marginTop: 2,
//               textAlign: 'center',
//             }}
//             xAxisColor="#CBD2D9"
//             xAxisLength={normaliseDesigns(350)}
//             yAxisThickness={0}
//             hideAxesAndRules
//           />
//         )}
//         <View style={styles.horizontalLinesContainer}>
//           {renderHorizontalLines()}
//         </View>
//         {/* X and Y Axis Labels */}
//         <Text size="small1" style={styles.yAxisLabel}>
//           Count
//         </Text>
//         <Text size="small1" style={styles.xAxisLabel}>
//           Date
//         </Text>
//       </View>
//       {indicators && (
//         <View style={styles.indicatorsContainer}>
//           <RenderIndicator label={indicators[0]} color={colors[0]} />
//           <RenderIndicator label={indicators[1]} color={colors[1]} />
//           {indicators.length > 2 && (
//             <RenderIndicator label={indicators[2]} color={colors[2]} />
//           )}
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   chartContainer: {
//     backgroundColor: '#F5F7FA',
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     marginVertical: 15,
//     paddingVertical: 15,
//   },
//   title: {
//     alignSelf: 'flex-start',
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   chartWrapper: {
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   horizontalLinesContainer: {
//     position: 'absolute',
//     width: '100%',
//     height: '100%',
//     bottom: '8.5%',
//     zIndex: -1,
//   },
//   horizontalLineContainer: {
//     position: 'absolute',
//     width: '100%',
//     flexDirection: 'row',
//   },
//   line: {
//     position: 'absolute',
//     height: 1,
//     backgroundColor: '#CBD2D9',
//     opacity: 0.5,
//     width: '90%',
//     justifyContent: 'flex-end',
//     right: 0,
//   },
//   lineLabel: {
//     position: 'absolute',
//     left: 10,
//     transform: [{ translateY: -8 }],
//   },
//   indicatorsContainer: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     alignSelf: 'flex-start',
//     justifyContent: 'flex-start',
//     marginTop: '7%',
//     left: '5%',
//   },
//   yAxisLabel: {
//     position: 'absolute',
//     left: -15,
//     top: '45%', // Adjusted for better alignment
//     transform: [{ rotate: '-90deg' }],
//     fontSize: FONT_SIZES.small1,
//     color:'#ABB4BD'
//   },
//   xAxisLabel: {
//     alignSelf: 'center',
//     marginTop: -20, // Adjusted for better alignment
//     fontSize: FONT_SIZES.small1,
//     top: '8%',
//     color:'#ABB4BD',
//     marginVertical:4
//   },
// });

// export default CurvedLineChart;









