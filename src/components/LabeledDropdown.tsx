import React, {FC, Dispatch, SetStateAction} from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';

import colors from '../config/colors';
import {FONT_VARIANT, FONT_SIZES} from '../config/themes';

import {Dropdown} from 'react-native-element-dropdown';
import {normaliseFont} from '../utils/helpers/responsiveHelpers';

export type dropdownObject = {
  value: string;
  label: string;
};

interface DropdownProps {
  label?: string;
  options: dropdownObject[];
  setSelectedValue?: Dispatch<SetStateAction<string>>;
  setSelectedItem?: Dispatch<SetStateAction<dropdownObject | undefined>>;
  setIsChanged?: Dispatch<SetStateAction<boolean>>;
  defaultValue: string;
  onChangeItem?: (object: dropdownObject) => void;
  disabled?: boolean;
  mandatory?: boolean;
  halfSize?: boolean;
  oneThird?: boolean;
  placeHolder?: string;
  zIndex?: number;
  dropDownDirection?: 'auto' | 'top' | 'bottom';
  searchable?: boolean;
  style?: ViewStyle;
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
  searchable,
  placeHolder,
  style,
}) => {

  function isDropdownItem(item: any): item is dropdownObject {
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
        <View style={{flexDirection: 'row', }}>
          <Text style={[styles.label, {color: colors.blackColor}]}>
            {label}
          </Text>
          {mandatory && <Text style={{color: colors.dangerColor}}>{'*'}</Text>}
        </View>
      )}
      {/* <> */}
      {/* {Platform.OS === 'android' ? (
          <DropDownPicker
            open={open}
            // searchable
            value={defaultValue||''}
            listMode='SCROLLVIEW'
            scrollViewProps={{
              nestedScrollEnabled: true,
              decelerationRate: 'fast',
            }}
            items={modifiedOptions}
            searchable={searchable}
            placeholder={placeHolder}
            setOpen={setDropdownOpen}
            setValue={setSelectedValue || setStateDummy}
            onSelectItem={(item: any) => {
              if (setSelectedItem) {
                setSelectedItem(item);
              }
              setIsChanged && setIsChanged(true);
            }}
            searchPlaceholder="Search"
            searchContainerStyle={{
              borderColor: 'transparent',
              padding: 2,
            }}
            searchTextInputStyle={{
              margin: 5,
            }}
            
            showTickIcon={false}
            listItemContainerStyle={{
              height: 'auto',
              paddingVertical: 5,
            }}
            selectedItemContainerStyle={
              {
                // backgroundColor: colors.veryLightGeryColor,
                // opacity:0.3
              }
            }
            dropDownContainerStyle={{
              marginVertical: dropDownDirection == 'TOP' ? 0 : 11,
              borderColor: 'gray',
              borderTopWidth: 0,
              backgroundColor: colors.backgroundColor,
            }}
            style={[
              styles.Container,
              {paddingHorizontal: oneThird ? 7 : 10},
              {borderColor: open ? colors.blackColor : colors.borderColor},
            ]}
            containerStyle={[
              {
                zIndex: zIndex,
                justifyContent: 'center',
              },
            ]}
            dropDownDirection={dropDownDirection ? dropDownDirection : 'BOTTOM'}
            textStyle={[
              styles.dropdownText,
              {opacity: disabled ? 0.3 : undefined},
            ]}
            labelStyle={styles.dropdownText}
            placeholderStyle={{color: 'white'}}
            disabled={disabled}
            onOpen={() => open}
            onClose={() => open}
          />
        ) : ( */}
      <>
        {/* <TouchableOpacity
              style={{
                borderRadius: 6,
                borderTopWidth: 1,
                borderColor: '#999999',
                borderWidth: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                minHeight: normaliseDesigns(40),
                paddingHorizontal: 10,
                marginTop: 5,
              }}
              disabled={disabled}
              onPress={() => setDropdownOpen(!open)}>
              <Text style={{color: colors.blackColor}}>{defaultValue}</Text>
              <Icon
                name="arrowleft"
                style={{transform: [{rotate: open ? '90deg' : '270deg'}]}}
                width={20}
                height={20}
              />
            </TouchableOpacity> */}
        {/* <View
          style={{
            borderColor: colors.blackColor,
            borderWidth: 1,
            borderRadius: 5,

            width: '100%',
          }}> */}
        <Dropdown
          style={[styles.Container]}
          // placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          // inputSearchStyle={styles.inputSearchStyle}
          // iconStyle={styles.iconStyle}
          dropdownPosition={dropDownDirection}
          itemTextStyle={styles.dropdownText}
          data={options}
          disable={disabled}
          search={searchable}
          maxHeight={300}
          labelField="label"
          valueField="value"
          // placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={defaultValue}
          // onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          onChange={item => {
            onChangeItem && onChangeItem(item);
            setIsChanged && setIsChanged(true);
            setSelectedItem && setSelectedItem(item);
            setSelectedValue && setSelectedValue(item.value);

            // setIsFocus(false);
          }}
          containerStyle={[
            {
              // bottom: bottom ? '30%' : upper ? '100%' : 0,
              // marginVertical: bottom ? -2 : 0,
              // elevation: 2,
              backgroundColor: 'red',
              borderColor: 'gray',
              borderTopWidth: 0,
              borderBottomEndRadius: 9,
              borderBottomStartRadius: 9,
              borderWidth: .8,
              maxHeight: 250,
              
            },
          ]}
          // renderLeftIcon={() => (
          //   <AntDesign
          //     style={styles.icon}
          //     color={isFocus ? 'blue' : 'black'}
          //     name="Safety"
          //     size={20}
          //   />
          // )}
        />
        {/* </View> */}
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
    borderColor:'#CBD2D9',
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
    fontSize: normaliseFont(14),
    justifyContent: 'center',
    // paddingHorizontal: 5,
    color: colors.blackColor,
    textTransform: 'capitalize',
    backgroundColor: 'pink'
  },

  dropdownText: {
    backgroundColor: 'red',
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
