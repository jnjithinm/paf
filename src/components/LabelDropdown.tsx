import React, { Dispatch, SetStateAction, FC, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// import colors from 'config/Colors';
// import useFontNormalise from 'hooks/useFontNormalise';
// import Icon from 'components/Icon';


import colors from '../config/colors';
import {FONT_VARIANT, FONT_SIZES} from '../config/themes';

import {Dropdown} from 'react-native-element-dropdown';
import {normaliseFont} from '../utils/helpers/responsiveHelpers';
import Image from '../components/Image'


interface DropdownItem {
  label: string | number;
  value: string | number;
  // Add any other fields you need here
  schemeCode?: string;
  schemeName?: string;
  branchName?: string;
  branchCode?: string;
  branchId?: number,
  tenure?: string,
  roi?: number,
  dealerName?: string,
  dealerCode?: string;
  subDealerName?: string;
  subDealerCode?: string
  // ...
}

interface DropdownProps {
  label: string;
  options: DropdownItem[] | string[];
  setSelectedOption?: Dispatch<SetStateAction<string>>;
  setSelectedItem?: Dispatch<SetStateAction<DropdownItem>>;
  halfSize?: boolean;
  disabled?: boolean;
  oneThird?: boolean;
  bottom?: boolean;
  defaultValue: string;
  isChange?: Dispatch<SetStateAction<boolean>>;
  leftLabeled?: boolean;
  upper?: boolean;
  mandatory?: boolean;
  number?: boolean;
  placeHolder?: string;

}

const LabelDropdown: FC<DropdownProps> = ({
  label,
  options,
  setSelectedOption,
  setSelectedItem,
  halfSize,
  disabled,
  oneThird,
  bottom,
  defaultValue,
  isChange,
  leftLabeled,
  upper = false,
  mandatory,
  number = false,
  placeHolder
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleDropdownChange = (item: any) => {
    
    setSelectedOption && setSelectedOption(item.value);
    setSelectedItem && setSelectedItem(item)
    isChange && isChange(true);
  };

  function isDropdownItem(item: any): item is DropdownItem {
    return typeof item === 'object' && item !== null;
  }
  let modifiedOptions: any;
  if (Array.isArray(options) && isDropdownItem(options[0])) {
    modifiedOptions = options;
  } else {
    modifiedOptions = options.map((item: any) => ({ label: item, value: item }));
  }



 
  return (
    <View
      style={[
        styles.container,
        {
          width: oneThird ? '30%' : halfSize ? '42%' : '90%',
          flexDirection: leftLabeled ? 'row' : 'column',
        },
      ]}>
      <View style={{ flexDirection: 'row' }}>
        <Text
          style={[
            styles.label,
            leftLabeled && { alignSelf: 'center' },
            isFocused && { color: colors.blackColor },
          ]}>
          {`${label}${leftLabeled ? '\b:\b' : ''}`}{' '}
        </Text>
        {/* {mandatory && <Icon name="pointed-star" />} */}
      </View>
      <Dropdown
        data={modifiedOptions}
        placeholder={`${placeHolder}`}
        value={defaultValue}
        onChange={handleDropdownChange}
        showsVerticalScrollIndicator={false}
        dropdownPosition={bottom || upper ? 'bottom' : 'top'}
        onFocus={() => {
          setIsFocused(true);
        }}
      //   renderLeftIcon={() => ( // Custom render function for left icon
      //   <Image name="search_icon" />
      // )}
        searchPlaceholder='Search'
        activeColor={colors.primaryLightColor}
        iconColor={colors.blackColor}
        search
        onBlur={() => {
          setIsFocused(false);
        }}
        // onChangeText={(text) => (
        //   // console.log("ttttt",text),
        //   // console.log("iiirrr",modifiedOptions)

        // )}
        style={[
          styles.Container,
          { paddingHorizontal: oneThird ? 7 : 10, },
          { borderColor: '#CBD2D9' },
          { borderBottomStartRadius: isFocused ? 0 : 10, borderBottomEndRadius: isFocused ? 0 : 10, }
        ]}
        selectedTextStyle={[
          styles.selectedTextStyle,
          {
            fontSize: oneThird ? 13 : 15,
            // textTransform: label === 'Status' ? 'none' : 'capitalize',
          },
        ]}
        labelField={'label'}
        itemTextStyle={[
          styles.dropdownText,
          {
            fontSize: oneThird ? 9 : 13,
            // textTransform: label === 'Status' ? 'none' : 'capitalize',
          },
        ]}
        valueField={'label'}
        inputSearchStyle={{
          borderColor: 'gray',
          padding: 2,
          borderRadius: 9,
          height: 40
        }}
        containerStyle={[
          {
            // bottom: bottom ? '30%' : upper ? '100%' : 0,
            marginVertical: bottom ? -1.5 : 0,
            // elevation: 2,
            marginLeft: .8,
            borderColor: '#CBD2D9',
            borderTopWidth: 0,
            borderBottomEndRadius: 9,
            borderBottomStartRadius: 9,
            borderWidth: .8,
            maxHeight: 250,
           
          },
        ]}
        
        placeholderStyle={{ color: colors.borderColor }}
        disable={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: 'center',
  },
  label: {
    color: colors.blackColor,
    fontFamily: FONT_VARIANT.medium,
    fontSize: FONT_SIZES.body2,
  },
  Container: {
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
    height: 'auto',
    paddingVertical: 6,
    backgroundColor: 'transparent',

  },

  selectedTextStyle: {
    fontSize: normaliseFont(15),
    justifyContent: 'center',
    paddingHorizontal: 5,
    color: 'black',
  },

  dropdownText: {
    fontSize: normaliseFont(16),
    color: 'black',
  },
  dropdownTextHighlight: {
    fontWeight: 'bold',
    color: 'black',
  },
});

export default LabelDropdown;
