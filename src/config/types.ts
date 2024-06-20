import {ViewComponent} from 'react-native';
import colors from './colors';
import {FONT_SIZES, FONT_STYLES, FONT_VARIANT, OPACITY} from './themes';
import { allLevels, allRoles, allUserTypes } from './constants';


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

export type UserCredentialTypes={
  username:string;
  password:string
}

export type FontSizeValuesTypes = keyof typeof FONT_SIZES;
export type OpacityValuesTypes = keyof typeof OPACITY;
export type FontVariantValuesTypes = keyof typeof FONT_VARIANT;
export type FontStyleValuesTypes = keyof typeof FONT_STYLES;
export type ColorTypes = keyof typeof colors;


// Defining Types
export type Role = typeof allRoles[number];
export type Level = typeof allLevels[number];
export type UserType = typeof allUserTypes[number];
