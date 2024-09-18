import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from './Icon';
import colors from '../config/colors';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import { FONT_SIZES } from '../config/themes';
import FilterModal, { FilterOption } from './ScheduleChartFilter';


type RenderSearchTypes = {
  placeHolder?: string;
  onTextChange?: (text: string) => void;
  onProceed: (filter: any) => void;
  filterNotNeeded?: boolean;
  options?: any[];
  selectedItem?: any;
  style?: any;
};

const SearchWithFilter: React.FC<RenderSearchTypes> = ({
  placeHolder = 'Search',
  onTextChange,
  onProceed,
  filterNotNeeded,
  selectedItem,
  options,
  style,
}) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState<boolean>(false);

  const onSearch = (text: string) => {
    if (onTextChange) {
      onTextChange(text);
    }
  };

  const onOptionPress = (option: TAutocompleteDropdownItem) => {
    onProceed({ selectedItem: { value: option?.id, label: option?.title || '' } });
  };

  const handleFilterSelect = (filter: FilterOption) => {
    onProceed({ dateFilterOption: filter });
    setIsFilterModalVisible(false);
  };

  return (
    <>
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onSelectFilter={handleFilterSelect}
      />

      <View style={[styles.container, style]}>
        <AutocompleteDropdown
          inputContainerStyle={[
            styles.dropdownTextInputStyle,
            {
              width: filterNotNeeded
                ? normaliseDesigns(295)
                : normaliseDesigns(260),
            },
          ]}
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={false}
          onChangeText={onSearch}
          textInputProps={{
            style: { color: colors.blackColor, fontSize: FONT_SIZES.small2 },
            placeholder: placeHolder,
            placeholderTextColor: '#4E565F',
          }}
          suggestionsListTextStyle={{
            color: colors.blackColor,
            fontSize: FONT_SIZES.body1,
          }}
          suggestionsListContainerStyle={{ borderRadius: 10 }}
          RightIconComponent={<Icon name="search_icon" style={styles.icon} />}
          showChevron={false}
          showClear={false}
          onSelectItem={onOptionPress}
          dataSet={options?.map(item => ({
            id: item.value,
            title: item.label,
          }))}
        />

        {!filterNotNeeded && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}  // Show the filter modal when the filter button is pressed
          >
            <Icon name={isFilterModalVisible ? 'filter_icon_contain_color' : 'filter_icon_contain_copy'} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 20,

  },
  dropdownTextInputStyle: {
    height: 40,
    color: colors.blackColor,
    fontSize: FONT_SIZES.body1,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
  },
  icon: {
    marginLeft: 'auto',
  },
  filterButton: {
    padding: 8,
    borderRadius: 10,
    borderColor: '#EA7804',
  },
});

export default SearchWithFilter;
