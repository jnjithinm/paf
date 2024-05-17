import React, {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
import {
  Animated,
  Keyboard,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import colors from '../config/colors';
import Icon, {IconTypes} from './Icon';
import Text from './Text';
import {FONT_VARIANT} from '../config/themes';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';

type RenderWarningMessageTypes = {
  warningMessage: string;
  style?: ViewStyle;
};

export const RenderWaringMessage: FC<RenderWarningMessageTypes> = ({
  warningMessage,
  style,
}) => (
  <View style={{flexDirection: 'row', width: '100%', marginTop: 3, ...style}}>
    <View
      style={{
        height: normaliseDesigns(15),
        width: normaliseDesigns(15),
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.secondaryColor,
      }}>
      <Text color="backgroundColor" size="small1">
        !
      </Text>
    </View>
    <Text style={{left: 2}} size="small1" color="primaryColor">
      {warningMessage}
    </Text>
  </View>
);

export interface TextInputPropsTypes extends TextInputProps {
  value: string;
  label?: string;
  setValue?: Dispatch<SetStateAction<string>>;
  icon?: IconTypes;
  onChange?: (text) => void;
  // placeHolder?: string;
  mandatory?: boolean;
  avoidTransform?: boolean;
  style?: ViewStyle;
  // textInputRef?: React.RefObject<CustomTextInputRef>;
  isShowError?: boolean;
  passwordVisibility?: boolean;
  errorMessage?: string;
  warningMessage?: string;
  dismiss?: boolean;
  textInputStyle?: TextStyle;
  manualHeight?: boolean;
  editable?: boolean;
}

type RenderLabelTypes = {
  isTransform: boolean;
};

const TextInput: FC<TextInputPropsTypes> = ({
  value,
  setValue,
  onChange,
  // placeHolder,
  label,
  icon,
  mandatory,
  avoidTransform,
  style,
  editable,
  // textInputRef,
  isShowError,
  passwordVisibility,
  errorMessage,
  warningMessage,
  dismiss,
  textInputStyle,
  manualHeight,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<RNTextInput | null>(null);
  const labelPosition = new Animated.Value(value ? -15 : 0);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(labelPosition, {
      toValue: -15,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  // const RenderLabel: FC<RenderLabelTypes> = ({isTransform}) => (
  //   <TouchableOpacity
  //     onPress={() => inputRef?.current?.focus()}
  //     style={{
  //       flexDirection: 'row',
  //       width: '100%',
  //       left: isTransform || icon ? null : 10,
  //       alignSelf: manualHeight && !isTransform ? 'flex-start' : undefined,
  //       top: manualHeight && !isTransform ? 10 : undefined,
  //     }}
  //     disabled={rest.editable == false}>
  //     <Text size='body1' fontVariant="regular">
  //       {placeHolder || label}
  //     </Text>
  //     {mandatory && <Text style={{color: colors.dangerColor}}>{'*'}</Text>}
  //   </TouchableOpacity>
  // );

  const handleOnTextChange = (text: string) => {
    if (setValue) {
      setValue(text);
    }
    if (onChange) {
      onChange(text);
    }
    dismiss && rest.maxLength === text.length && Keyboard.dismiss();
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key === '.') {
      event.preventDefault();
    }
  };

  return (
    <View style={{...style, minHeight: 65, width: '100%'}}>
      {label &&
      <Text
        style={{alignSelf: 'flex-start', marginBottom: 3, fontWeight: '700'}}
        size="body1">
        {label}
      </Text>
}
      <View
        style={{
          borderRadius: 10,
          borderTopWidth: 1,
          borderColor: '#ABB4BD',
          borderWidth: 1,
          alignItems: 'center',
          flexDirection: 'row',
          minHeight: 50,
          ...textInputStyle,
          // ...style,
        }}>

        {icon && (
          <Icon
            name={icon}
            style={{marginHorizontal: 10}}
            stroke={colors.secondaryColor}
            strokeWidth={0.2}
            scale={0.3}
          />
        )}

        <RNTextInput
          style={{
            color: colors.blackColor,
            opacity: rest.editable !== false ? undefined : 0.3,
            paddingLeft: icon ? 5 : 15,
            fontFamily: FONT_VARIANT.medium,
            // flex: 1,
            width: '100%',
            ...textInputStyle,
          }}
          placeholderTextColor={'#ABB4BD'}
          ref={ref => {
            inputRef.current = ref;
          }}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleOnTextChange}
          value={value}
          onKeyPress={e => handleKeyPress(e)}
          secureTextEntry={
            (passwordVisibility && !isPasswordVisible) || rest.secureTextEntry
          }
          {...rest}
        />
        {((passwordVisibility && !isPasswordVisible) ||
          rest.secureTextEntry) && <Icon name="eye_off" />}
      </View>

      {warningMessage && (
        <RenderWaringMessage warningMessage={warningMessage} />
      )}
      {errorMessage && isShowError && (
        <Text size="verysmall3" color="dangerColor">
          {errorMessage}
        </Text>
      )}
    </View>
  );
};

export default TextInput;
