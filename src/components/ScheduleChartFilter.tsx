import React, { FC, useState } from 'react';
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Text from './Text';
import Icon from './Icon';
import colors from '../config/colors';

export type FilterOption = 'Schedule' | 'Today' | '3 Day' | 'Week' | 'Month';

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectFilter: (filter: FilterOption) => void;
}

const FilterModal: FC<FilterModalProps> = ({ isVisible, onClose, onSelectFilter }) => {
  const [selectedFilter, setSelectedFilter] = useState<FilterOption | null>(null);

  const handleSelect = (filter: FilterOption) => {
    setSelectedFilter(filter);
    onSelectFilter(filter);
    onClose();
  };

  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <View style={styles.overlay} />
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text size="body2" fontVariant="bold">Filter</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="cross_icon_thin" width={20} height={20} />
            </TouchableOpacity>
          </View>

          <View style={styles.filterOptions}>
            {(['Schedule', 'Today', '3 Day', 'Week', 'Month'] as FilterOption[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterOption,
                  selectedFilter === filter && styles.selectedFilterOption,
                ]}
                onPress={() => handleSelect(filter)}
              >
                <Text
                  size="body1"
                  style={selectedFilter === filter ? styles.selectedFilterText : styles.filterText}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    //backgroundColor:"red",
    borderRadius:10
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterOptions: {
    flexDirection: 'column',
  },
  filterOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E4E7EB',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedFilterOption: {
    backgroundColor: '#FCEBC5',
    borderColor: '#F4C24A',
  },
  filterText: {
    color: '#1F2933',
    fontSize: 16,
  },
  selectedFilterText: {
    color: '#F4C24A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FilterModal;
