import React, {FC, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, ScrollView} from 'react-native';
import Text from './Text';
import Icon from './Icon';

type PaginationBarTypes = {
  count: number;
  onPressPageIndex: (index: number) => void;
};

const PaginationBar: FC<PaginationBarTypes> = ({
  count = 1,
  onPressPageIndex,
}) => {
  const [selectedPageIndex, setSelectedPageIndex] = useState(1);
  const roundedCount = Math.ceil(count);
  const isMoreThanNinePages = roundedCount > 9;

  const onPressPaginationIndex = (index: number) => {
    setSelectedPageIndex(index);
    onPressPageIndex(index - 1);
  };

  if (!count || count <= 1) {
    return null;
  }

  const getPaginationElements = () => {
    const elements: JSX.Element[] = [];

    if (roundedCount <= 3) {
      for (let i = 1; i <= roundedCount; i++) {
        elements.push(
          <TouchableOpacity
            key={i}
            onPress={() => onPressPaginationIndex(i)}
            style={[
              styles.pageNumber,
              i === selectedPageIndex && styles.selectedPageNumber,
            ]}>
            <Text
              style={
                i === selectedPageIndex
                  ? styles.selectedPageNumberText
                  : styles.pageNumberText
              }
              size="small1">
              {i}
            </Text>
          </TouchableOpacity>,
        );
      }
    } else {
      elements.push(
        <TouchableOpacity
          key={1}
          onPress={() => onPressPaginationIndex(1)}
          style={[
            styles.pageNumber,
            1 === selectedPageIndex && styles.selectedPageNumber,
          ]}>
          <Text
            style={
              1 === selectedPageIndex
                ? styles.selectedPageNumberText
                : styles.pageNumberText
            }
            size="small1">
            1
          </Text>
        </TouchableOpacity>,
      );

      if (selectedPageIndex > 4) {
        elements.push(
          <Text key="leftEllipsis" style={styles.ellipsisText}>
            ...
          </Text>,
        );
      }

      const start = Math.max(2, selectedPageIndex - 2);
      const end = Math.min(roundedCount - 1, selectedPageIndex + 2);

      for (let i = start; i <= end; i++) {
        elements.push(
          <TouchableOpacity
            key={i}
            onPress={() => onPressPaginationIndex(i)}
            style={[
              styles.pageNumber,
              i === selectedPageIndex && styles.selectedPageNumber,
            ]}>
            <Text
              style={
                i === selectedPageIndex
                  ? styles.selectedPageNumberText
                  : styles.pageNumberText
              }
              size="small1">
              {i}
            </Text>
          </TouchableOpacity>,
        );
      }

      if (selectedPageIndex < roundedCount - 3) {
        elements.push(
          <Text key="rightEllipsis" style={styles.ellipsisText}>
            ...
          </Text>,
        );
      }

      elements.push(
        <TouchableOpacity
          key={roundedCount}
          onPress={() => onPressPaginationIndex(roundedCount)}
          style={[
            styles.pageNumber,
            roundedCount === selectedPageIndex && styles.selectedPageNumber,
          ]}>
          <Text
            style={
              roundedCount === selectedPageIndex
                ? styles.selectedPageNumberText
                : styles.pageNumberText
            }
            size="small1">
            {roundedCount}
          </Text>
        </TouchableOpacity>,
      );
    }

    return elements;
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'center',
        marginVertical: 20,
      }}>
      {isMoreThanNinePages && (
        <TouchableOpacity
          onPress={() => {
            if (selectedPageIndex > 1) {
              setSelectedPageIndex(selectedPageIndex - 1);
              onPressPageIndex(selectedPageIndex - 2);
            }
          }}>
          <Icon name="arrow_left_icon" />
        </TouchableOpacity>
      )}
      {getPaginationElements()}
      {isMoreThanNinePages && (
        <TouchableOpacity
          onPress={() => {
            if (selectedPageIndex < roundedCount) {
              setSelectedPageIndex(selectedPageIndex + 1);
              onPressPageIndex(selectedPageIndex);
            }
          }}>
          <Icon name="arrow_right_pagination" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageNumber: {
    backgroundColor: '#F5F7FA',
    width: 26,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedPageNumber: {
    backgroundColor: '#EA7604',
  },
  pageNumberText: {
    color: '#000',
  },
  selectedPageNumberText: {
    color: '#fff',
  },
  ellipsisText: {
    color: '#ABB4BD',
    marginHorizontal: 5,
  },
});

export default PaginationBar;
