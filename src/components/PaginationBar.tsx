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

  console.log('sss', selectedPageIndex);
  if (!count || count == 0) return null;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 20,
      }}>
      {isMoreThanNinePages && (
        <TouchableOpacity
          onPress={() => {
            if (selectedPageIndex > 1) {
              setSelectedPageIndex(selectedPageIndex - 1);
            }
          }}>
          <Icon name="arrow_left_icon" />
        </TouchableOpacity>
      )}
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
      </TouchableOpacity>
      <ScrollView
        style={{}}
        contentContainerStyle={styles.paginationContainer}
        horizontal>
        {roundedCount > 2 &&
          [...Array(Math.max(roundedCount - 2, 0))].map((_, index) => {
            const pageIndex = index + 2;
            return (
              <TouchableOpacity
                key={pageIndex}
                onPress={() => onPressPaginationIndex(pageIndex)}
                style={[
                  styles.pageNumber,
                  pageIndex === selectedPageIndex && styles.selectedPageNumber,
                ]}>
                <Text
                  style={
                    pageIndex === selectedPageIndex
                      ? styles.selectedPageNumberText
                      : styles.pageNumberText
                  }
                  size="small1">
                  {pageIndex}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      {roundedCount > 1 && (
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
        </TouchableOpacity>
      )}

      {isMoreThanNinePages && (
        <TouchableOpacity
          onPress={() => {
            if (selectedPageIndex < roundedCount) {
              setSelectedPageIndex(selectedPageIndex + 1);
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
});

export default PaginationBar;
