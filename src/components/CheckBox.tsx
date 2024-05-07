import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';

import Icon from './Icon';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';



type CheckBoxPropsTypes = {
  isActive: boolean;
  onPress: () => void;
  style?:ViewStyle
  size?:number
};

const CheckBox: FC<CheckBoxPropsTypes> = ({isActive,style,size, onPress}) => {
  return (
    <TouchableOpacity
      style={isActive ? {...styles.selected,...style} : {...styles.deselected,...style}}
      onPress={onPress}>
      {isActive && <Icon name="checkbox" width={size} height={size} />}
    </TouchableOpacity>
  );
};
export default CheckBox;

const styles = StyleSheet.create({
  selected: {
    height:normaliseDesigns(20),
    width: normaliseDesigns(20),
    borderRadius: 5,
    backgroundColor: colors.blackColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deselected: {
    height:normaliseDesigns(20),
    width: normaliseDesigns(20),
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ABB4BD',
  },
});
