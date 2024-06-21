import {ViewComponent} from 'react-native';
import colors from './colors';
import {FONT_SIZES, FONT_STYLES, FONT_VARIANT, OPACITY} from './themes';
import { ParentRoles, RoleLevelTypes, UserTypes } from './constants';


export type CustomNumericFieldRef = {
  current: ViewComponent | null;
  triggerValidation: () => void;
  triggerResetPin: () => void;
};

export type FileObject = {
  uri: string;
  type: string;
  name: string;
};

export type UserCredentialTypes = {
  username: string;
  password: string;
};

export type ErrorStatus = 'Success' | 'Failed';

export interface ErrorStatusObject {
  status: ErrorStatus;
  message: string;
}

export type FontSizeValuesTypes = keyof typeof FONT_SIZES;
export type OpacityValuesTypes = keyof typeof OPACITY;
export type FontVariantValuesTypes = keyof typeof FONT_VARIANT;
export type FontStyleValuesTypes = keyof typeof FONT_STYLES;
export type ColorTypes = keyof typeof colors;



