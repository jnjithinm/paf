import React, {useEffect, useState} from 'react';
import {
  View,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import Icon from './Icon';
import colors from '../config/colors';
import Calendar, {FilterObject} from './Calendar';
import {ItemType} from '../config/types';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {
  AutocompleteDropdown,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import {FONT_SIZES} from '../config/themes';
import Text from './Text';

type RenderSearchTypes = {
  placeHolder?: string;
  onTextChange?: (text: string) => void;
  onProceed: (filter: FilterObject) => void;
  filterNotNeeded?: boolean;
  options?: ItemType[];
  selectedItem?: ItemType;
  style?: ViewStyle;
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
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);

  const onSearch = (text: string) => {
    if (onTextChange) {
      onTextChange(text);
    }
  };

  const onOptionPress = (option: TAutocompleteDropdownItem) => {
    onProceed({selectedItem: {value: option?.id, label: option?.title || ''}});
  };

  return (
    <>
      <Calendar
        onProceed={filter => {
          onProceed(filter);
        }}
        onClose={() => {
          setIsOpenCalendar(false);
        }}
        isVisible={isOpenCalendar}
      />
      <View style={[styles.container, style]}>
        <AutocompleteDropdown
          inputContainerStyle={[
            styles.dropdownTextInputStyle,
            {
              width: filterNotNeeded
                ? normaliseDesigns(295)
                : normaliseDesigns(235),
            },
          ]}
          clearOnFocus={false}
          closeOnBlur={true}
          closeOnSubmit={false}
          onChangeText={onSearch}
          textInputProps={{style: {color: colors.blackColor,}}}
          suggestionsListTextStyle={{
            color: colors.blackColor,
            fontSize: FONT_SIZES.body1,
          }}
          // placeholder={placeHolder}
          emptyResultText={placeHolder}
          EmptyResultComponent={<Text style={{color:colors.blackColor}}>{placeHolder}</Text>}
          suggestionsListContainerStyle={{borderRadius: 10}}
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
            onPress={() => {
              setIsOpenCalendar(true);
            }}>
            <Icon name="filter_icon" />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    color: colors.blackColor,
    fontSize: FONT_SIZES.body1,
  },
  dropdownTextInputStyle: {
    height: 40,
    color: colors.blackColor,
    fontSize: FONT_SIZES.body1,
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
  },
  input: {
    flex: 1,
    color: colors.blackColor,
    paddingVertical: 5,
  },
  icon: {
    marginLeft: 'auto',
  },
  activeDropdown: {
    borderRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 5,
    maxHeight: normaliseDesigns(250),
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: colors.blackColor,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  filterButton: {
    padding: 8,
    borderRadius: 10,
    borderColor: '#EA7804',
    borderWidth: 1,
  },
  itemStyle: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
});

export default SearchWithFilter;
