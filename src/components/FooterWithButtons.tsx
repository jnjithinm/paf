import React, { FC } from 'react';
import { View, Platform, ViewStyle } from 'react-native';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import Button from '../components/Button';
import colors from '../config/colors';
import Images, {ImageIconNames} from '../components/Image';
import { IconTypes } from './Icon';

interface FooterWithButtonsProps {
  onPressProceedButton: () => void;
  onPressCancelButton: () => void;
  proceedButtonText: string;
  cancelButtonText?: string;
  isActiveProceedButton?: boolean;
  isActiveCancelButton?:boolean;
  style?: ViewStyle;
  image?: ImageIconNames;
  icon?:IconTypes;
}

const FooterWithButtons: FC<FooterWithButtonsProps> = ({
  onPressProceedButton,
  onPressCancelButton,
  isActiveProceedButton = false,
  isActiveCancelButton=true,
  proceedButtonText,
  cancelButtonText='Cancel',
  style,
  image,
  icon
}) => (
  <View
    style={{
      width: '100%', 
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      paddingBottom: 30,
      padding:15,
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 25,
        // backgroundColor: "red",
        },
      }),
      ...style,
    }}>
        
    <Button
      onPress={onPressProceedButton}
      icon={icon}
      text={proceedButtonText}
      active={isActiveProceedButton}
      textStyle={{ color: isActiveProceedButton? '#FFFFFF' : colors.blackColor}}
      style={{ backgroundColor: '#EA7804', height: normaliseDesigns(33) }}
      halfSize
    />

    <Button
      onPress={onPressCancelButton}
      style={{
        borderWidth: 2,
        borderColor: '#EA7804',
        backgroundColor: colors.backgroundColor,
        height: normaliseDesigns(33),
      }}
      active={isActiveCancelButton}
      text={cancelButtonText}
      textStyle={{ color: '#EA7804' }}
      halfSize
    />
  </View>
);

export default FooterWithButtons;
