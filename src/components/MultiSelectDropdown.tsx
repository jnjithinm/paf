import {FC, SetStateAction,Dispatch} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';

import Text from './Text';
import Icon from './Icon';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {MultiSelect} from 'react-native-element-dropdown';

import colors from '../config/colors';
import { ItemType } from '../config/types';

const customSearchInput = (onSearch: (arg0: string) => void) => (
  <View style={{padding: 10}}>
    <TextInput
      style={{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        color:colors.blackColor
      }}
      placeholder="Search"
      onChangeText={text => {onSearch(text)}}
    />
  </View>
);

type MultiSelectDropdownTypes = {
  label?: string;
  style?: ViewStyle;
  containerStyle?:ViewStyle;
  options: ItemType[];
  placeHolder?: string;
  selectedValues: string[];
  setSelectedValues:Dispatch<SetStateAction<string[]>>;
  onSelectItem?: () => void;
  onSearch:(text:string)=>void;
  disabled?:boolean
};

const MultiSelectDropdown: FC<MultiSelectDropdownTypes> = ({
  label,
  style,
  containerStyle,
  options,
  placeHolder='Select',
  selectedValues,
  onSelectItem,
  setSelectedValues,
  onSearch,
  disabled
}) =>{
  console.log("sdfdsaaaaaaaaaaaa",options)
  return (
  <View style={{...containerStyle, marginVertical: 5}}>
    {label && (
      <Text style={{marginBottom: 4}} size='small2' fontVariant="bold">
        {label}
      </Text>
    )}
    <MultiSelect
      data={options}
      labelField="label"
      valueField="value"
      placeholder={placeHolder}
      disable={disabled}
      style={{
        borderColor: '#CBD2D9',
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 7,

        ...style
      }}

      search
      value={selectedValues}
      onChange={(value: string[]) => {
        setSelectedValues(value);
        onSelectItem && onSelectItem();
      }}
      onChangeText={(text)=>{onSearch(text)}}
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
)};

export default MultiSelectDropdown;
