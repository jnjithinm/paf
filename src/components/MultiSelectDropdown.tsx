import {FC, SetStateAction,Dispatch} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';

import Text from './Text';
import Icon from './Icon';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {MultiSelect} from 'react-native-element-dropdown';
import {DropdownObject} from './LabeledDropdown';
import colors from '../config/colors';

const customSearchInput = (onSearch: (arg0: string) => void) => (
  <View style={{padding: 10}}>
    <TextInput
      style={{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
      }}
      placeholder="Search"
      onChangeText={text => onSearch(text)}
    />
  </View>
);

type MultiSelectDropdownTypes = {
  label?: string;
  style?: ViewStyle;
  options: DropdownObject[];
  placeHolder?: string;
  selectedValues: string[];
  setSelectedValues:Dispatch<SetStateAction<string[]>>;
  onSelectItem?: () => void;
};

const MultiSelectDropdown: FC<MultiSelectDropdownTypes> = ({
  label,
  style,
  options,
  placeHolder,
  selectedValues,
  onSelectItem,
  setSelectedValues,
}) => (
  <View style={{...style, marginVertical: 5}}>
    {label && (
      <Text style={{marginBottom: 4}} fontVariant="bold">
        {label}
      </Text>
    )}
    <MultiSelect
      data={options}
      labelField="label"
      valueField="value"
      placeholder="select"
      style={{
        borderColor: '#CBD2D9',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 7,
      }}
      search
      value={selectedValues}
      onChange={(value: string[]) => {
        setSelectedValues(value);
        onSelectItem && onSelectItem();
      }}
      containerStyle={{paddingHorizontal: 8}}
      renderInputSearch={customSearchInput}
      renderItem={({label, value}) => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 7,
          }}>
          <View
            style={{
              backgroundColor: selectedValues.find(item => item === value)
                ?'#EA7804'
                : colors.backgroundColor,
              width: 15,
              height: 15,
              aspectRatio: 1,
              alignItems: 'center',
              justifyContent: 'center',
              borderColor: '#ABB4BD',
              borderWidth: selectedValues.find(item => item === value) ? 0 : 1,
              borderRadius: 5,
            }}>
            {selectedValues.find(item => item === value) && (
              <Icon name="checkbox" width={10} height={10} />
            )}
          </View>
          <Text style={{marginLeft: 8}}>{label}</Text>
        </View>
      )}
      renderSelectedItem={({label, value}) => (
        <View
          style={{
            flexDirection: 'row',
            padding: 5,
            alignItems: 'center',
            backgroundColor: '#FDF0E3',
            borderWidth: 1,
            borderColor: '#EA7804',
            justifyContent: 'space-between',
            minWidth: normaliseDesigns(50),
            marginLeft: 5,
            borderRadius: 5,
            marginVertical: 5,
          }}>
          <Text style={{marginLeft: 5}}>{label}</Text>
          <TouchableOpacity style={{marginLeft: 7}}>
            <Icon name="cross_icon" width={10} height={10} />
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
);

export default MultiSelectDropdown;
