// LineChart.tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Line, Paint, Path, SkPath, vec } from '@shopify/react-native-skia';
import Text from './Text';

type LineChartProps = {
  data: { label: string; value: number }[][];
  colors: string[];
  width: number;
  height: number;
  labels: string[];
};

const LineChart: React.FC<LineChartProps> = ({ data, colors, width, height, labels }) => {
  const paths = data.map((dataSet) => {
    const path = SkPath();
    dataSet.forEach((point, index) => {
      const x = (index / (dataSet.length - 1)) * width;
      const y = height - (point.value / 5) * height; // Assuming the max value is 5
      if (index === 0) {
        path.moveTo(x, y);
      } else {
        path.lineTo(x, y);
      }
    });
    return path;
  });

  return (
    <View style={[styles.container, { width, height }]}>
      <Canvas style={{ flex: 1 }}>
        {paths.map((path, index) => (
          <Path key={index} path={path} strokeWidth={2} stroke={colors[index]} />
        ))}
      </Canvas>
      <View style={styles.labelsContainer}>
        {labels.map((label, index) => (
          <View key={index} style={styles.label}>
            <Text>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  labelsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    flex: 1,
    alignItems: 'center',
  },
});

export default LineChart;
