// import React, { FC } from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import { BarChart, Grid } from 'react-native-svg-charts';
// import { G, Text as SvgText } from 'react-native-svg';

// interface HorizontalBarChartProps {
//   data: Array<{ label: string; count: number; percentage: number }>;
//   yAccessor: (item: { count: number }) => number;
//   svg: { fill: string };
//   spacingInner: number;
//   contentInset: { top: number; bottom: number };
//   style?: object;
// }

// const HorizontalBarChart: FC<HorizontalBarChartProps> = ({
//   data,
//   yAccessor,
//   svg,
//   spacingInner,
//   contentInset,
//   style,
// }) => {
//   const maxValue = Math.max(...data.map(item => item.count)); // Maximum value for scaling

//   return (
//     <View style={style}>
//       <View style={{ flexDirection: 'row' }}>
//         <View style={{ justifyContent: 'center' }}>
//           {data.map((item, index) => (
//             <Text
//               key={index}
//               style={[
//                 styles.label,
//                 { top: index * 40 + 20 - 10 }, // Adjust top position for labels
//               ]}
//             >
//               {item.label}
//             </Text>
//           ))}
//         </View>
//         <View style={{ flex: 1 }}>
//           <BarChart
//             style={{ height: data.length * 40 }}
//             data={data}
//             yAccessor={yAccessor}
//             svg={svg}
//             spacingInner={spacingInner}
//             contentInset={contentInset}
//             horizontal={true}
//           >
//             <Grid direction={Grid.Direction.VERTICAL} />
//             {data.map((item, index) => {
//               const xPos = (item.count / maxValue) * 300 + 5;
//               return (
//                 <G key={index}>
//                   <SvgText
//                     x={isNaN(xPos) ? 0 : xPos} // Ensure x is a valid number
//                     y={index * 40 + 20} // Adjust y position to match label position
//                     fontSize="12"
//                     fill="black"
//                     alignmentBaseline="middle"
//                   >
//                     {item.count} ({item.percentage * 100}%)
//                   </SvgText>
//                 </G>
//               );
//             })}
//           </BarChart>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   chart: {
//     height: 300,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 5,
//   },
//   label: {
//     flex: 1,
//     fontSize: 12,
//     textAlign: 'right',
//     paddingRight: 10,
//   },
//   info: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   count: {
//     fontSize: 12,
//     marginRight: 5,
//   },
//   percentage: {
//     fontSize: 12,
//     color: 'grey',
//   },
// });

// export default HorizontalBarChart;


//new 
// import React, { FC } from 'react';
// import { View, StyleSheet, Text, Dimensions } from 'react-native';
// import { BarChart, Grid, XAxis } from 'react-native-svg-charts';
// import { G, Text as SvgText } from 'react-native-svg';
// import colors from '../config/colors';

// interface HorizontalBarChartProps {
//   data: Array<{ label: string; count: number; percentage: number }>;
//   yAccessor: (item: { count: number }) => number;
//   svg: { fill: string };
//   spacingInner: number;
//   contentInset: { top: number; bottom: number };
//   style?: object;
// }

// const HorizontalBarChart: FC<HorizontalBarChartProps> = ({
//   data,
//   yAccessor,
//   svg,
//   spacingInner,
//   contentInset,
//   style,
// }) => {
//   const maxValue = Math.max(...data.map(item => item.count));
//   const screenWidth ="100%"
//   // Dimensions.get('window').width;
//   const tickValues = [];

//   return (
//     <View style={[style, { paddingVertical: 20 }]}>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <View style={{ justifyContent: 'center', paddingRight: 10 }}>
//           {data.map((item, index) => (
//             <Text
//               key={index}
//               style={[
//                 styles.label,
//                 { marginTop: index === 0 ? 0 : 15 },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {item.label}
//             </Text>
//           ))}
//         </View>
//         <View style={{ flex: 1 }}>
//           <BarChart
//             style={{ height: data.length * 40 }} // Adjust height dynamically
//             data={data}
//             yAccessor={yAccessor}
//             svg={{ fill: colors.primaryColor }}
//             spacingInner={spacingInner}
//             contentInset={contentInset}
//             horizontal={true}
//             xMin={0}
//             xMax={1}
//           >
//             <Grid direction={Grid.Direction.VERTICAL} />
//             {data.map((item, index) => {
//               const xPos = (item.count / maxValue) * (screenWidth - 60); // Adjusted for screen width
//               return (
//                 <G key={index}>
//                   <SvgText
//                     x={isNaN(xPos) ? 0 : xPos + 5}
//                     y={index * 40 + 20} // Adjusted y position for centering the label
//                     fontSize="12"
//                     fill="black"
//                     alignmentBaseline="middle"
//                   >
//                     {item.count} ({item.percentage.toFixed(1)}%)
//                   </SvgText>
//                 </G>
//               );
//             })}
//           </BarChart>
//         </View>
//       </View>
//       <View style={{ paddingTop: 10 }}>
//         <XAxis
//           style={{ marginHorizontal: 0, marginTop: 10 }}
//           data={tickValues}
//           formatLabel={(value) => value.toFixed(1)}
//           contentInset={{ left: 20, right: 20 }} // Adjusted to properly align the X-axis
//           svg={{ fontSize: 12, fill: colors.blackColor }}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   label: {
//     fontSize: 14,
//     color: colors.blackColor,
//     width: 80, // Adjust width for labels to ensure they fit properly
//   },
// });

// export default HorizontalBarChart;
// import React, { FC } from 'react';
// import { View, StyleSheet, Text, Dimensions } from 'react-native';
// import { BarChart, Grid } from 'react-native-svg-charts';
// import { G, Text as SvgText, Line } from 'react-native-svg';
// import colors from '../config/colors';

// interface HorizontalBarChartProps {
//   data: Array<{ label: string; count: number; percentage: number }>;
//   yAccessor: (item: { count: number }) => number;
//   svg: { fill: string };
//   spacingInner: number;
//   contentInset: { top: number; bottom: number };
//   style?: object;
// }

// const HorizontalBarChart: FC<HorizontalBarChartProps> = ({
//   data,
//   yAccessor,
//   svg,
//   spacingInner,
//   contentInset,
//   style,
// }) => {
//   const maxValue = Math.max(...data.map(item => item.count));
//   const screenWidth = Dimensions.get('window').width;

//   return (
//     <View style={[style, { paddingVertical: 20 }]}>
//       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//         <View style={{ justifyContent: 'center',right:2}}>
//           {data.map((item, index) => (
//             <Text
//               key={index}
//               style={[
//                 styles.label,
//                 { marginTop: index === 0 ? 0 : 15 },
//               ]}
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {item.label}
//             </Text>
//           ))}
//         </View>
//         <View style={{ flex: 1}}>
//           <BarChart
//             style={{ height: data.length * 40 }} // Adjust height dynamically
//             data={data}
//             yAccessor={yAccessor}
//             svg={{ fill: '#F4C24A' }}
//             spacingInner={spacingInner}
//             contentInset={contentInset}
//             horizontal={true}
//             xMin={0}
//             xMax={1}
//           >
//             <Grid
//               direction={Grid.Direction.VERTICAL}
//               ticks={10} // Set tick values for gridlines
//             />
//             {data.map((item, index) => {
//               const xPos = item.count > 0 
//                 ? (item.count / maxValue) * (screenWidth - 60) 
//                 : 10; // Small x position for 0 count
              
//               return (
//                 <G key={index}>
//                   <SvgText
//                     x={xPos + 5}
//                     y={index * 40 + 20} // Adjusted y position for centering the label
//                     fontSize="12"
//                     fill="black"
//                     alignmentBaseline="middle"
//                   >
//                       {item.count}({item.percentage*100/2}%)
//                   </SvgText>
//                   {item.count === 0 && (
//                     <Line
//                       x1={xPos} // Start the dash before the count label
//                       y1={index * 40 + 20}
//                       x2={xPos + 10} // Length of the dash
//                       y2={index * 40 + 20}
//                       stroke={"#F4C24A"}
//                       strokeWidth="2"
//                     />
//                   )}
//                 </G>
//               );
//             })}
//           </BarChart>
//         </View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   label: {
//     fontSize: 14,
//     color: colors.blackColor,
//     width: '100%', // Adjust width to ensure the label fits properly
//   },
// });

// export default HorizontalBarChart;
import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import colors from '../config/colors';

interface HorizontalBarChartProps {
  data: Array<{ label: string; count: number; percentage: number }>;
  style?: object;
}

const HorizontalBarChartComponent: React.FC<HorizontalBarChartProps> = ({ data, style }) => {
  const screenWidth = Dimensions.get('window').width;
  const barHeight = 30; // Set bar height based on screen width
  const barWidth = screenWidth - 150; // Set bar width with some margin

  const maxValue = Math.max(...data.map(item => item.count));

  const formattedData = data.map((item) => ({
    value: item.count,
    label: item.label,
    frontColor: '#F4C24A',
    topLabelComponent: () => (
      <View style={styles.topLabelContainer}>
        <Text style={styles.topLabelText}>
        {`${item.count} (${(item.percentage * 100)/2}%)`}
        </Text>
      </View>
    ),
    labelComponent: () => (
      <View style={styles.labelContainer}>
        <Text
          style={styles.yAxisLabel}
          numberOfLines={2} // Allow wrapping to two lines
          ellipsizeMode="tail"
        >
          {item.label}
        </Text>
      </View>
    ),
  }));

  return (
    <View style={[style, { paddingVertical: 20 }]}>
      <BarChart
        data={formattedData}
        height={data.length * (barHeight + 20)} // Dynamically adjust height based on data length
        barWidth={barHeight} // Set bar height
        noOfSections={maxValue} // Adjust sections based on max value
        maxValue={maxValue}
        isAnimated
        hideRules
        horizontal
        yAxisThickness={0}
        xAxisLabelTextStyle={{ color: colors.blackColor }} // Ensures x-axis labels are visible
        yAxisLabelTextStyle={{ color: colors.blackColor }} // Ensures y-axis labels are visible
        spacing={20} // Space between bars
      />
    </View>
  );
};

const styles = StyleSheet.create({
  labelContainer: {
    width: 100, // Adjust this width to allow more space for labels
    marginRight: 8, // Add some spacing between label and bar
  },
  yAxisLabel: {
    fontSize: 14,
    color: colors.blackColor,
  },
  topLabelContainer: {
    alignItems: 'center',
    marginBottom: 5,
     // Adjust this to position the label above the bar
  },
  topLabelText: {
    fontSize: 12,
    color: colors.blackColor, // Adjust color as needed
    textAlign: 'center',
    width: 100, // Adjust the width of the top label
  },
  responseTitle: {
    fontSize: 18,
    marginBottom: 8,
    color: colors.blackColor,
  },
});

export default HorizontalBarChartComponent;



















// import React from 'react';
// import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
// import { BarChart, Grid, YAxis } from 'react-native-svg-charts';
// import { Text, G } from 'react-native-svg';

// interface BarChartProps {
//     data: { value: number, label: string, percentage: string }[];
// }

// const HorizontalBarChart: React.FC<BarChartProps> = ({ data }) => {
//     const values = data.map(item => item.value);
//     const labels = data.map(item => item.label);

//     const CUT_OFF = 20;

//     const Labels = ({ x, y, bandwidth, data }: any) => {
//         return data.map((item: { value: number, percentage: string }, index: number) => (
//             <G key={index} x={x(0)} y={y(index) + (bandwidth / 2) - 8}>
//                 <Text
//                     fontSize={14}
//                     fill={item.value < CUT_OFF ? 'black' : 'white'}
//                     alignmentBaseline={'middle'}
//                 >
//                     {`${item.value} (${item.percentage})`}
//                 </Text>
//             </G>
//         ));
//     };

//     return (
//         <View style={{ flexDirection: 'row', height: 200, paddingVertical: 16 }}>
//             <YAxis
//                 data={values}
//                 formatLabel={(value, index) => labels[index]}
//                 contentInset={{ top: 10, bottom: 10 }}
//                 svg={{
//                     fontSize: 12,
//                     fill: 'black',
//                     fontWeight: 'bold',
//                 }}
//                 style={{ marginRight: 10 }}
//             />
//             <BarChart
//                 style={{ flex: 1 }}
//                 data={values}
//                 horizontal={true}
//                 svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
//                 contentInset={{ top: 10, bottom: 10 }}
//                 spacingInner={0.5}
//                 gridMin={0}
//             >
//                 <Grid direction={Grid.Direction.VERTICAL} />
//                 <Labels x={(value: number) => value.toString()} y={(index: number) => index * 20} bandwidth={10} data={data} />
//             </BarChart>
//         </View>
//     );
// };
