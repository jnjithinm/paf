import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

interface DropdownProps {
  options: string[];
  onOptionSelected: (option: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onOptionSelected }) => {
  const [searchText, setSearchText] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);

  const filterOptions = (text: string) => {
    setSearchText(text);
    setFilteredOptions(options.filter((option) => option.includes(text)));
  };

  const onOptionPress = (option: string) => {
    setSearchText(option);
    setFilteredOptions(options);
    onOptionSelected(option);
  };

  return (
    <View>
      <TextInput
        value={searchText}
        onChangeText={filterOptions}
        placeholder="Search..."
      />
      <FlatList
        data={filteredOptions}
        renderItem={({ item }: ListRenderItemInfo<string>) => (
          <TouchableOpacity onPress={() => onOptionPress(item)}>
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );
};

export default Dropdown;
