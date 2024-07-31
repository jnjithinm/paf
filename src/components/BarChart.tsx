import React, { FC } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BarChart, Grid } from 'react-native-svg-charts';
import { G, Text as SvgText } from 'react-native-svg';

interface HorizontalBarChartProps {
  data: Array<{ label: string; count: number; percentage: number }>;
  yAccessor: (item: { count: number }) => number;
  svg: { fill: string };
  spacingInner: number;
  contentInset: { top: number; bottom: number };
  style?: object;
}

const HorizontalBarChart: FC<HorizontalBarChartProps> = ({
  data,
  yAccessor,
  svg,
  spacingInner,
  contentInset,
  style,
}) => {
  const maxValue = Math.max(...data.map(item => item.count)); // Maximum value for scaling

  return (
    <View style={style}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ justifyContent: 'center' }}>
          {data.map((item, index) => (
            <Text
              key={index}
              style={[
                styles.label,
                { top: index * 40 + 20 - 10 }, // Adjust top position for labels
              ]}
            >
              {item.label}
            </Text>
          ))}
        </View>
        <View style={{ flex: 1 }}>
          <BarChart
            style={{ height: data.length * 40 }}
            data={data}
            yAccessor={yAccessor}
            svg={svg}
            spacingInner={spacingInner}
            contentInset={contentInset}
            horizontal={true}
          >
            <Grid direction={Grid.Direction.VERTICAL} />
            {data.map((item, index) => {
              const xPos = (item.count / maxValue) * 300 + 5;
              return (
                <G key={index}>
                  <SvgText
                    x={isNaN(xPos) ? 0 : xPos} // Ensure x is a valid number
                    y={index * 40 + 20} // Adjust y position to match label position
                    fontSize="12"
                    fill="black"
                    alignmentBaseline="middle"
                  >
                    {item.count} ({item.percentage * 100}%)
                  </SvgText>
                </G>
              );
            })}
          </BarChart>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  chart: {
    height: 300,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    flex: 1,
    fontSize: 12,
    textAlign: 'right',
    paddingRight: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    fontSize: 12,
    marginRight: 5,
  },
  percentage: {
    fontSize: 12,
    color: 'grey',
  },
});

export default HorizontalBarChart;