// // import React, {FC, Dispatch, SetStateAction} from 'react';
// // import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
// // import {Dropdown} from 'react-native-element-dropdown';
// // import Icon from './Icon'; // Ensure this imports your custom Icon component

// // import colors from '../config/colors';
// // import {FONT_VARIANT, FONT_SIZES} from '../config/themes';
// // import {normaliseFont} from '../utils/helpers/responsiveHelpers';
// // import {ItemType} from '../config/types';

// // interface DropdownProps {
// //   label?: string;
// //   options: ItemType[];
// //   setSelectedValue?: Dispatch<SetStateAction<string>>;
// //   setSelectedItem?: Dispatch<SetStateAction<ItemType | undefined>>;
// //   setIsChanged?: Dispatch<SetStateAction<boolean>>;
// //   defaultValue: string;
// //   onChangeItem?: (object: ItemType) => void;
// //   disabled?: boolean;
// //   mandatory?: boolean;
// //   halfSize?: boolean;
// //   oneThird?: boolean;
// //   placeHolder?: string;
// //   placeHolderStyle?: TextStyle;
// //   dropdownStyle?: ViewStyle;
// //   disableSelection?: boolean;
// //   zIndex?: number;
// //   dropDownDirection?: 'auto' | 'top' | 'bottom';
// //   searchable?: boolean;
// //   searchIcon?: JSX.Element;
// //   style?: ViewStyle;
// //   textStyle?: TextStyle;
// // }

// // const LabeledDropdown: FC<DropdownProps> = ({
// //   label,
// //   options,
// //   setSelectedValue,
// //   setSelectedItem,
// //   defaultValue,
// //   onChangeItem,
// //   setIsChanged,
// //   disabled = false,
// //   halfSize,
// //   oneThird,
// //   mandatory,
// //   zIndex,
// //   dropDownDirection,
// //   dropdownStyle,
// //   disableSelection,
// //   searchable,
// //   searchIcon,
// //   placeHolder,
// //   style,
// //   textStyle,
// //   placeHolderStyle,
// // }) => {
// //   function isDropdownItem(item: any): item is ItemType {
// //     return typeof item === 'object' && item !== null;
// //   }

// //   let modifiedOptions: any;
// //   if (Array.isArray(options) && isDropdownItem(options[0])) {
// //     modifiedOptions = options;
// //   } else {
// //     modifiedOptions = options.map((item: any) => ({label: item, value: item}));
// //   }

// //   return (
// //     <View
// //       style={[
// //         styles.container,
// //         {
// //           width: halfSize ? '42%' : '100%',
// //           flexDirection: 'column',
// //           ...style,
// //         },
// //       ]}>
// //       {label && (
// //         <View style={{flexDirection: 'row'}}>
// //           <Text style={[styles.label, {color: colors.blackColor}]}>
// //             {label}
// //           </Text>
// //           {mandatory && <Text style={{color: colors.dangerColor}}>{'*'}</Text>}
// //         </View>
// //       )}
// //       <>
// //         <Dropdown
// //           style={[
// //             styles.Container,
// //             {
// //               backgroundColor: disabled ? '#FDF0E3' : colors.backgroundColor,
// //               borderColor: disabled ? '#CBD2D9' : '#CBD2D9',
// //               ...dropdownStyle,
// //             },
// //           ]}
// //           selectedTextStyle={[styles.selectedTextStyle, {...textStyle}]}
// //           dropdownPosition={dropDownDirection}
// //           itemTextStyle={styles.dropdownText}
// //           data={modifiedOptions}
// //           inputSearchStyle={[{color:colors.blackColor}]}
// //           disable={disabled}
// //           search={searchable && !defaultValue}
// //           searchPlaceholder="Search..."
// //           searchTextInputStyle={[styles.searchTextInput, {color: 'red'}]} // Ensure the text input color is set
// //           maxHeight={300}
// //           labelField="label"
// //           valueField="value"
// //           placeholder={placeHolder}
// //           placeholderStyle={{color: '#ABB4BD', ...placeHolderStyle}}
// //           value={defaultValue}
// //           renderLeftIcon={() =>
// //             !defaultValue ? (
// //               <Icon
// //                 name="search_icon"
// //                 style={[styles.icon, {color: colors.borderColor}]}
// //               /> // Set search icon color to borderColor
// //             ) : null
// //           }
// //           onChange={item => {
// //             if (!disableSelection) {
// //               onChangeItem && onChangeItem(item);
// //               setIsChanged && setIsChanged(true);
// //               setSelectedItem && setSelectedItem(item);
// //               setSelectedValue && setSelectedValue(item.value);
// //             }
// //           }}
// //           containerStyle={[
// //             {
// //               borderBottomEndRadius: 9,
// //               borderBottomStartRadius: 9,
// //               maxHeight: 250,
// //             },
// //           ]}
// //         />
// //       </>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     marginVertical: 10,
// //     alignSelf: 'center',
// //     width: '100%',
// //   },
// //   label: {
// //     color: colors.darkGrey,
// //     fontFamily: FONT_VARIANT.bold,
// //     fontSize: FONT_SIZES.body1,
// //     height: 20,
// //   },
// //   Container: {
// //     borderWidth: 1,
// //     borderColor: '#CBD2D9',
// //     borderRadius: 10,
// //     justifyContent: 'center',
// //     paddingHorizontal: 10,
// //     marginTop: 2,
// //     height: 'auto',
// //     paddingVertical: 5,
// //     backgroundColor: 'transparent',
// //   },
// //   selectedTextStyle: {
// //     fontSize: normaliseFont(13),
// //     justifyContent: 'center',
// //     color: colors.blackColor,
// //     textTransform: 'capitalize',
// //   },
// //   dropdownText: {
// //     fontSize: normaliseFont(12),
// //     color: colors.blackColor,
// //     paddingVertical: 2,
// //     paddingHorizontal: 5,
// //     fontFamily: FONT_VARIANT.regular,
// //     textTransform: 'capitalize',
// //   },
// //   dropdownTextHighlight: {
// //     fontWeight: 'bold',
// //     color: colors.blackColor,
// //   },
// //   searchTextInput: {
// //     fontSize: normaliseFont(13),
// //     color: colors.blackColor,
// //   },
// //   icon: {
// //     marginLeft: 'auto',
// //     marginRight: 4,
// //   },
// // });

// // export default LabeledDropdown;
// import React, { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
// import { Dropdown } from 'react-native-element-dropdown';
// import Icon from './Icon'; // Ensure this imports your custom Icon component

// import colors from '../config/colors';
// import { FONT_VARIANT, FONT_SIZES } from '../config/themes';
// import { normaliseFont } from '../utils/helpers/responsiveHelpers';
// import { ItemType } from '../config/types';

// interface DropdownProps {
//   label?: string;
//   options: ItemType[];
//   setSelectedValue?: Dispatch<SetStateAction<string>>;
//   setSelectedItem?: Dispatch<SetStateAction<ItemType | undefined>>;
//   setIsChanged?: Dispatch<SetStateAction<boolean>>;
//   defaultValue: string;
//   onChangeItem?: (object: ItemType) => void;
//   disabled?: boolean;
//   mandatory?: boolean;
//   halfSize?: boolean;
//   oneThird?: boolean;
//   placeHolder?: string;
//   placeHolderStyle?: TextStyle;
//   dropdownStyle?: ViewStyle;
//   disableSelection?: boolean;
//   zIndex?: number;
//   dropDownDirection?: 'auto' | 'top' | 'bottom';
//   searchable?: boolean;
//   searchIcon?: JSX.Element;
//   style?: ViewStyle;
//   textStyle?: TextStyle;
//   onSearchTextChange: (text: string) => void;
// }

// const LabeledDropdown: FC<DropdownProps> = ({
//   label,
//   options,
//   setSelectedValue,
//   setSelectedItem,
//   defaultValue,
//   onChangeItem,
//   setIsChanged,
//   disabled = false,
//   halfSize,
//   oneThird,
//   mandatory,
//   zIndex,
//   dropDownDirection,
//   dropdownStyle,
//   disableSelection,
//   searchable,
//   searchIcon,
//   placeHolder,
//   style,
//   textStyle,
//   placeHolderStyle,
//   onSearchTextChange,
// }) => {
//   function isDropdownItem(item: any): item is ItemType {
//     return typeof item === 'object' && item !== null;
//   }

//   let modifiedOptions: any;
//   if (Array.isArray(options) && isDropdownItem(options[0])) {
//     modifiedOptions = options;
//   } else {
//     modifiedOptions = options.map((item: any) => ({ label: item, value: item }));
//   }

//   return (
//     <View
//       style={[
//         styles.container,
//         {
//           width: halfSize ? '42%' : '100%',
//           flexDirection: 'column',
//           ...style,
//         },
//       ]}
//     >
//       {label && (
//         <View style={{ flexDirection: 'row' }}>
//           <Text style={[styles.label, { color: colors.blackColor }]}>
//             {label}
//           </Text>
//           {mandatory && <Text style={{ color: colors.dangerColor }}>{'*'}</Text>}
//         </View>
//       )}
//       <>
//         <Dropdown
//           style={[
//             styles.Container,
//             {
//               backgroundColor: disabled ? '#FDF0E3' : colors.backgroundColor,
//               borderColor: disabled ? '#CBD2D9' : '#CBD2D9',
//               ...dropdownStyle,
//             },
//           ]}
//           selectedTextStyle={[styles.selectedTextStyle, { ...textStyle }]}
//           dropdownPosition={dropDownDirection}
//           itemTextStyle={styles.dropdownText}
//           data={modifiedOptions}
//           inputSearchStyle={[{ color: colors.blackColor }]}
//           disable={disabled}
//           search={searchable}
//           searchPlaceholder="Search..."
//           searchTextInputStyle={[styles.searchTextInput, { color: colors.blackColor }]}
//           maxHeight={300}
//           labelField="label"
//           valueField="value"
//           placeholder={placeHolder}
//           placeholderStyle={{ color: '#ABB4BD', ...placeHolderStyle }}
//           value={defaultValue}
//           renderLeftIcon={() =>
//             !defaultValue && searchIcon ? (
//               <Icon
//                 name="search_icon"
//                 style={[styles.icon, { color: colors.borderColor }]}
//               />
//             ) : null
//           }
//           onChangeText={text => {
//             onSearchTextChange(text);  // Trigger API call and keep dropdown open
//           }}
//           onChange={item => {
//             if (!disableSelection) {
//               onChangeItem && onChangeItem(item);
//               setIsChanged && setIsChanged(true);
//               setSelectedItem && setSelectedItem(item);
//               setSelectedValue && setSelectedValue(item.value);
//             }
//           }}
//           containerStyle={[
//             {
//               borderBottomEndRadius: 9,
//               borderBottomStartRadius: 9,
//               maxHeight: 250,
//             },
//           ]}
//           autoScroll={false} // Keep the dropdown open
//         />
//       </>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginVertical: 10,
//     alignSelf: 'center',
//     width: '100%',
//   },
//   label: {
//     color: colors.darkGrey,
//     fontFamily: FONT_VARIANT.bold,
//     fontSize: FONT_SIZES.body1,
//     height: 20,
//   },
//   Container: {
//     borderWidth: 1,
//     borderColor: '#CBD2D9',
//     borderRadius: 10,
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//     marginTop: 2,
//     height: 'auto',
//     paddingVertical: 5,
//     backgroundColor: 'transparent',
//   },
//   selectedTextStyle: {
//     fontSize: normaliseFont(13),
//     justifyContent: 'center',
//     color: colors.blackColor,
//     textTransform: 'capitalize',
//   },
//   dropdownText: {
//     fontSize: normaliseFont(12),
//     color: colors.blackColor,
//     paddingVertical: 2,
//     paddingHorizontal: 5,
//     fontFamily: FONT_VARIANT.regular,
//     textTransform: 'capitalize',
//   },
//   searchTextInput: {
//     fontSize: normaliseFont(13),
//     color: colors.blackColor,
//   },
//   icon: {
//     marginLeft: 'auto',
//     marginRight: 4,
//   },
// });

// export default LabeledDropdown;

import React, { FC, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from './Icon'; // Ensure this imports your custom Icon component

import colors from '../config/colors';
import { FONT_VARIANT, FONT_SIZES } from '../config/themes';
import { normaliseFont } from '../utils/helpers/responsiveHelpers';
import { ItemType } from '../config/types';

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
  placeHolderStyle?: TextStyle;
  dropdownStyle?: ViewStyle;
  disableSelection?: boolean;
  zIndex?: number;
  dropDownDirection?: 'auto' | 'top' | 'bottom';
  searchable?: boolean;
  searchIcon?: JSX.Element;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onSearchTextChange: (text: string) => void;
}

const LabeledDropdown: FC<DropdownProps> = ({
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
  searchIcon,
  placeHolder,
  style,
  textStyle,
  placeHolderStyle,
  onSearchTextChange,
}) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  useEffect(() => {
    setCurrentValue(defaultValue); // Ensure the current value reflects the latest selection
  }, [defaultValue]);

  function isDropdownItem(item: any): item is ItemType {
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
          width: halfSize ? '42%' : '100%',
          flexDirection: 'column',
          ...style,
        },
      ]}
    >
      {label && (
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.label, { color: colors.blackColor }]}>
            {label}
          </Text>
          {mandatory && <Text style={{ color: colors.dangerColor }}>{'*'}</Text>}
        </View>
      )}
      <>
        <Dropdown
          style={[
            styles.Container,
            {
              backgroundColor: disabled ? '#FDF0E3' : colors.backgroundColor,
              borderColor: disabled ? '#CBD2D9' : '#CBD2D9',
              ...dropdownStyle,
            },
          ]}
          selectedTextStyle={[styles.selectedTextStyle, { ...textStyle }]}
          dropdownPosition={dropDownDirection}
          itemTextStyle={styles.dropdownText}
          data={modifiedOptions}
          inputSearchStyle={[{ color: colors.blackColor }]}
          disable={disabled}
          search={searchable}
          searchPlaceholder="Search..."
          searchTextInputStyle={[styles.searchTextInput, { color: colors.blackColor }]}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeHolder}
          placeholderStyle={{ color: '#ABB4BD', ...placeHolderStyle }}
          value={currentValue}
          renderLeftIcon={() =>
            !currentValue && searchIcon ? (
              <Icon
                name="search_icon"
                style={[styles.icon, { color: colors.borderColor }]}
              />
            ) : null
          }
          onChangeText={text => {
            onSearchTextChange(text); // Trigger search and keep dropdown open
          }}
          onChange={item => {
            if (!disableSelection) {
              setCurrentValue(item.label); // Update the displayed value in the input
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
          autoScroll={false} // Keep the dropdown open after search
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
    paddingVertical: 5,
    backgroundColor: 'transparent',
  },
  selectedTextStyle: {
    fontSize: normaliseFont(13),
    justifyContent: 'center',
    color: colors.blackColor,
    textTransform: 'capitalize',
  },
  dropdownText: {
    fontSize: normaliseFont(12),
    color: colors.blackColor,
    paddingVertical: 2,
    paddingHorizontal: 5,
    fontFamily: FONT_VARIANT.regular,
    textTransform: 'capitalize',
  },
  searchTextInput: {
    fontSize: normaliseFont(13),
    color: colors.blackColor,
  },
  icon: {
    marginLeft: 'auto',
    marginRight: 4,
  },
});

export default LabeledDropdown;
