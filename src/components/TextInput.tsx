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
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
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
  onChange?: (text: any) => void;
  passwordVisibility?: boolean;
  // placeHolder?: string;
  mandatory?: boolean;
  avoidTransform?: boolean;
  style?: ViewStyle;
  isShowErrorOnButtonPress?:boolean;
  // textInputRef?: React.RefObject<CustomTextInputRef>;
  // isShowError?: boolean;
  errorMessage?: string;
  warningMessage?: string;
  dismiss?: boolean;
  textInputStyle?: TextStyle;
  manualHeight?: boolean;
  // editable?: boolean;
}

type RenderLabelTypes = {
  isTransform: boolean;
};

const TextInput: FC<TextInputPropsTypes> = ({
  value,
  setValue,
  onChange,
  passwordVisibility,
  // placeHolder,
  label,
  icon,
  mandatory,
  avoidTransform,
  style,
  // editable,
  // textInputRef,
  // isShowError,
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
  const [isShowError, setIsShowError] = useState<boolean>(false);

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
    setIsShowError(true);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleOnTextChange = (text: string) => {
    setIsShowError(false);
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
      {label && (
        <Text
          style={{alignSelf: 'flex-start', marginBottom: 3, fontWeight: '700'}}
          size='small3'>
          {label}
        </Text>
      )}
      <View
        style={{
          borderRadius: 10,
          borderColor: '#ABB4BD',
          borderWidth: 1,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          maxHeight: 40,
          ...textInputStyle,
          paddingHorizontal: icon ? 5 : 10,
          width: '100%',
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
            fontFamily: FONT_VARIANT.regular,
            fontSize: FONT_SIZES.small3,
            width: passwordVisibility ? '80%' : '100%',
            ...textInputStyle,
          }}
          placeholderTextColor={'#ABB4BD'}
          ref={ref => {
            inputRef.current = ref;
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleOnTextChange}
          value={value}
          onKeyPress={e => handleKeyPress(e)}
          secureTextEntry={passwordVisibility && !isPasswordVisible}
          {...rest}
        />
        {passwordVisibility && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            disabled={value.length === 0}>
            <Icon
              name={
                isPasswordVisible
                  ? 'eye'
                  : value.length > 0
                  ? 'eye_off'
                  : 'eye_off_disabled'
              }
              style={{alignSelf: 'flex-end', justifyContent: 'flex-end'}}
              width={20}
              height={20}
            />
          </TouchableOpacity>
        )}
      </View>

      {warningMessage && (
        <RenderWaringMessage warningMessage={warningMessage} />
      )}
      {errorMessage && isShowError && (
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
          <Icon name="warning_icon" style={{marginRight: 4}} />
          <Text size="verysmall3" color="dangerColor">
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default TextInput;
