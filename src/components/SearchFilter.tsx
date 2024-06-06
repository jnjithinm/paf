import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon, {IconTypes} from './Icon';
import colors from '../config/colors';

interface SearchFilterProps {
  onSearch: (text: string) => void;
  onFilter?: () => void;
  placeholder: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, onFilter,placeholder }) => {
  const [searchText, setSearchText] = useState<string>('');

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.darkGrey}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch(text);
          }}
          value={searchText}
        />
        <TouchableOpacity onPress={onFilter} style={styles.iconSearchContainer}>
          <Icon name="search_icon" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={onFilter} style={styles.iconContainer}>
          <Icon name="filter_icon" />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    backgroundColor: '#F5F7FA',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: colors.blackColor,
    paddingVertical: 5,
  },
  iconContainer: {
    borderWidth: 1,
    borderColor: colors.primaryColor,
    padding: 8,
    borderRadius: 10,
  },
  iconSearchContainer: {
    padding: 8,
    borderRadius: 10,
  },
});

export default SearchFilter;
