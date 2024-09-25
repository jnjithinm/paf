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
    height:normaliseDesigns(14),
    width: normaliseDesigns(14),
    borderRadius: 4,
    backgroundColor: colors.blackColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deselected: {
    height:normaliseDesigns(14),
    width: normaliseDesigns(14),
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ABB4BD',
  },
});
