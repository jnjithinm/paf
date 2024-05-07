import React, {FC, useState} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';

import Text from './Text';
import Icon from './Icon';

import {useFocusEffect} from '@react-navigation/native';
import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {navigate} from '../utils/helpers/navigationHelpers';

type HeaderPropsTypes = {
  title: string;
  avoidBackButton?: boolean;
  dashboard?: boolean;
  onPressBackArrow?: () => void;
  onPressLogoutButton?: () => void;
};

const Header: FC<HeaderPropsTypes> = ({
  title,
  avoidBackButton,
  dashboard,
  onPressBackArrow,
  onPressLogoutButton,
}) => {
  const [isOpenTooltip, setIsOpenTooltip] = useState<boolean>(false);
  useFocusEffect(
    React.useCallback(() => {
      setIsOpenTooltip(false);
    }, []),
  );

  const onPressLogout = () => {
    setIsOpenTooltip(false);
    onPressLogoutButton && onPressLogoutButton();
  };
  return (
    <View
      style={{
        justifyContent: 'flex-end',
        // justifyContent: 'center',
        // paddingLeft: 10,
        width: '100%',
        // flexDirection:'row',
        paddingBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: colors.primaryLightColor,
        height: normaliseDesigns(45),
      }}>
      {dashboard && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems:'center',
            // alignItems:'flex-end',
            width: '100%',

          }}>
          <TouchableOpacity
            onPress={() => {

            }}
            // style={{marginRight:20}}
            >
            <Icon name="menu_icon" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row',alignItems:'center'}}>
            <TouchableOpacity
              onPress={() => {

              }}>
              <Icon name="bell_icon" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {

              }}>
              <Icon name="profile_icon" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* <View style={{position: 'absolute', left: 20}}>
        {!avoidBackButton && (
          <TouchableOpacity>
            <Icon name="back_button" />
          </TouchableOpacity>
        )}
      </View> */}
    </View>
  );
};

export default Header;
