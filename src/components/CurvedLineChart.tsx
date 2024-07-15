import React, {FC} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {LineChart} from 'react-native-gifted-charts';

import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {FONT_SIZES} from '../config/themes';
import Text from './Text';

export type LineDataItem = {value: number};

const initialValues: LineDataItem[] = [{value: 0}];

function convertToLineDataItem(data: number[] | undefined): LineDataItem[] {
  return data?.map(item => ({value: item})) || initialValues;
}

const colors: string[] = ['#F4C24A', '#2F68C4', '#749E35'];

type RenderIndicatorTypes = {
  label: string;
  color: string;
};
const RenderIndicator: FC<RenderIndicatorTypes> = ({label, color}) => {
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
      <Text size="verysmall3" style={{left: 5}}>
        {label}
      </Text>
    </View>
  );
};

interface CurvedLineChartProps {
  value1: number[];
  value2?: number[];
  value3?: number[];
  indicators?: string[];
  labels: string[];
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
  // Calculate the maximum value for the Y-axis
  const allValues = [...value1, ...(value2 || []), ...(value3 || [])];
  const maxValue = Math.max(...allValues);
  const stepValue = Math.ceil(maxValue / 5);

  const yAxisLabels = Array.from({length: 6}, (_, i) =>
    (i * stepValue).toString(),
  );

  // Render horizontal lines with labels
  const renderHorizontalLines = () => {
    const lines = [];
    for (let i = 0; i <= 5; i++) {
      const value = i * stepValue;
      const bottomPosition = (i * 80) / 5; // Adjusted bottom position

      lines.push(
        <View
          key={`line-${i}`}
          style={[
            styles.horizontalLineContainer,
            {bottom: `${bottomPosition}%`},
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

  const data1 = convertToLineDataItem(value1);
  const data2 = convertToLineDataItem(value2);
  const data3 = convertToLineDataItem(value3);

  return (
    <View style={[styles.chartContainer, style]}>
      {title && (
        <Text style={styles.title} size="body1" fontVariant="bold">
          {title}
        </Text>
      )}
      <View style={styles.chartWrapper}>
        <LineChart
          initialSpacing={0}
          xAxisThickness={0}
          xAxisLabelTexts={labels}
          yAxisLabelTexts={yAxisLabels}
          data={data1 || initialValues}
          data2={data2}
          data3={data3}
          color1={colors[0]}
          color2={colors[1]}
          color3={colors[2]}
          yAxisColor={'#F5F7FA'}
          spacing={normaliseDesigns(35)}
          width={normaliseDesigns(270)}
          showDataPointOnFocus
          showValuesAsDataPointsText
          showDataPointLabelOnFocus
          hideDataPoints
          thickness={2}
          showVerticalLines={false}
          curved
          xAxisLabelTextStyle={{
            color: '#4E565F',
            width: normaliseDesigns(50),
            fontSize: FONT_SIZES.small1,
            marginTop: 5, // Ensure labels are positioned correctly relative to the x-axis
          }}
          xAxisColor="#CBD2D9"
          xAxisLength={normaliseDesigns(250)}
          yAxisThickness={0}
          hideAxesAndRules
        />
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
    backgroundColor: '#F5F7FA',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD2D9',
    marginVertical: 15,
    paddingVertical: 15,
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
    bottom: '8.5%',
    zIndex: -1,
  },
  horizontalLineContainer: {
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
  },
  line: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#CBD2D9',
    opacity: 0.5,
    width: '90%',
    justifyContent: 'flex-end',
    right: 0,
  },
  lineLabel: {
    position: 'absolute',
    left: 10,
    transform: [{translateY: -8}],
  },
  indicatorsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    marginTop: '5%',
    left: '5%',
  },
});

export default CurvedLineChart;
