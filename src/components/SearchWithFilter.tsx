import React, { useEffect, useState } from 'react';
import { View, ViewStyle, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Icon from './Icon';
import colors from '../config/colors';
import Calendar, { FilterObject } from './Calendar';
import Dropdown from '../components/SearchableDropdown'; // Adjust the import path as per your project structure

type RenderSearchTypes = {
  placeHolder?: string;
  onTextChange: (text: string) => void;
  onProceed: (filter: FilterObject) => void;
  filterNotNeeded?: boolean;
  style?: ViewStyle;
};

const SearchWithFilter: React.FC<RenderSearchTypes> = ({
  placeHolder = 'Search',
  onTextChange,
  onProceed,
  filterNotNeeded,
  style,
}) => {
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [searchText, setSearchText] = useState<string>(''); // State to hold search text
  const itemValues = ["Option 1", "Option 2", "Option 3", "Option 4", "Option 5"];

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const filterOptions = (text: string) => {
    setSearchText(text);
  };

  useEffect(()=>{

  },[searchText])

  const filteredOptions = itemValues.filter(option =>
    option.toLowerCase().includes(searchText.toLowerCase())
  );

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
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[
              styles.textInput,
              { width: filterNotNeeded ? '100%' : '85%' },
              isDropdownOpen && styles.activeDropdown,
            ]}
            onPress={toggleDropdown}
          >
            <TextInput
              style={styles.input}
              placeholder={placeHolder}
              placeholderTextColor={colors.darkGrey}
              value={selectedItem} // Display selected item in TextInput
              onChangeText={filterOptions} // Update search text state
              onFocus={openDropdown}
              // onBlur={closeDropdown}
              editable={!isDropdownOpen} // Disable editing while dropdown is open
            />
            <Icon name="search_icon" style={styles.icon} />
          </TouchableOpacity>
          {isDropdownOpen && (
            <View style={styles.dropdown}>
              <Dropdown
                options={filteredOptions} // Pass filtered options to Dropdown
                onOptionSelected={(option: string) => {
                  onTextChange(option); // Call the onTextChange handler when an option is selected
                  setSelectedItem(option); // Set selected item in TextInput
                  closeDropdown(); // Close the dropdown after selection (optional)
                }}
              />
            </View>
          )}
        </View>
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
    borderWidth: 1,
    borderColor: colors.primaryColor,
    height: 40,
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: colors.primaryColor,
    borderWidth: 1,
    marginTop: 5,
    maxHeight: 200,
    zIndex: 10,
  },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    padding: 8,
    borderRadius: 10,
  },
});

export default SearchWithFilter;
