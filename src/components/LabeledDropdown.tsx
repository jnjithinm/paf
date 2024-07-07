import React, {FC, Dispatch, SetStateAction} from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

import colors from '../config/colors';
import {FONT_VARIANT, FONT_SIZES} from '../config/themes';
import {normaliseFont} from '../utils/helpers/responsiveHelpers';
import {ItemType} from '../config/types';

interface DropdownProps {
  label?: string;
  options: ItemType[];
  setSelectedValue?: Dispatch<SetStateAction<string>>;
  setSelectedItem?: Dispatch<SetStateAction<ItemType | undefined>>;
  setIsChanged?: Dispatch<SetStateAction<boolean>>;
  defaultValue: string;
  onChangeItem?: (object: ItemType) => void;
  disabled?: boolean;
  mandatory?: boolean;
  halfSize?: boolean;
  oneThird?: boolean;
  placeHolder?: string;
  placeHolderStyle?:TextStyle;
  dropdownStyle?:ViewStyle;
  disableSelection?:boolean
  zIndex?: number;
  dropDownDirection?: 'auto' | 'top' | 'bottom';
  searchable?: boolean;
  style?: ViewStyle;
  textStyle?:TextStyle
}

const LabelDropdown: FC<DropdownProps> = ({
  label,
  options,
  setSelectedValue,
  setSelectedItem,
  defaultValue,
  onChangeItem,
  setIsChanged,
  disabled = false,
  halfSize,
  oneThird,
  mandatory,
  zIndex,
  dropDownDirection,
  dropdownStyle,
  disableSelection,
  searchable,
  placeHolder,
  style,
  textStyle,
  placeHolderStyle
}) => {
  function isDropdownItem(item: any): item is ItemType {
    return typeof item === 'object' && item !== null;
  }

  let modifiedOptions: any;
  if (Array.isArray(options) && isDropdownItem(options[0])) {
    modifiedOptions = options;
  } else {
    modifiedOptions = options.map((item: any) => ({label: item, value: item}));
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: halfSize ? '42%' : '100%',
          flexDirection: 'column',
          ...style,
        },
      ]}>
      {label && (
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.label, {color: colors.blackColor}]}>
            {label}
          </Text>
          {mandatory && <Text style={{color: colors.dangerColor}}>{'*'}</Text>}
        </View>
      )}
      <>
        <Dropdown
          style={[
            styles.Container,
            {
              backgroundColor: disabled ? '#FDF0E3' : colors.backgroundColor,
              borderColor: disabled ? '#CBD2D9' : '#CBD2D9',
              ...dropdownStyle
            },
          ]}
          selectedTextStyle={[styles.selectedTextStyle,{...textStyle}]}
          dropdownPosition={dropDownDirection}
          itemTextStyle={styles.dropdownText}
          data={options}
          disable={disabled}
          search={searchable}

          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeHolder}
          placeholderStyle={{color:'#ABB4BD',...placeHolderStyle}}
          searchPlaceholder="Search..."
          value={defaultValue}
          onChange={item => {
            if(!disableSelection){
            onChangeItem && onChangeItem(item);
            setIsChanged && setIsChanged(true);
            setSelectedItem && setSelectedItem(item);
            setSelectedValue && setSelectedValue(item.value);
            }
          }}
          containerStyle={[
            {
              borderBottomEndRadius: 9,
              borderBottomStartRadius: 9,
              maxHeight: 250,
            },
          ]}
        />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: 'center',
    width: '100%',
  },
  label: {
    color: colors.darkGrey,
    fontFamily: FONT_VARIANT.bold,
    fontSize: FONT_SIZES.body1,
    // padding: 15,
    // backgroundColor: 'red',
    height: 20,
  },
  Container: {
    borderWidth: 1,
    borderColor: '#CBD2D9',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 2,
    height: 'auto',
    paddingVertical: 7,
    backgroundColor: 'transparent',
  },

  dropdownContainerStyle: {
    borderRadius: 5,
    justifyContent: 'center',
    height: 'auto',
  },
  selectedTextStyle: {
    fontSize: normaliseFont(15),
    justifyContent: 'center',
    color: colors.blackColor,
    textTransform: 'capitalize',
  },

  dropdownText: {
    // backgroundColor: 'red',
    fontSize: normaliseFont(14),
    color: colors.blackColor,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontFamily: FONT_VARIANT.regular,
    textTransform: 'capitalize',
  },
  dropdownTextHighlight: {
    fontWeight: 'bold',
    color: colors.blackColor,
  },
});

export default LabelDropdown;
