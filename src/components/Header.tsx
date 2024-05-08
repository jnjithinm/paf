import React, {FC, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import Icon from './Icon';

import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {navigate} from '../utils/helpers/navigationHelpers';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Images, { IconNames } from '../components/Image';

type HeaderPropsTypes = {
  title?: string;
  avoidBackButton?: boolean;
  dashboard?: boolean;
  onPressMenuIcon?: () => void;
  onPressBackArrow?: () => void;
  onPressLogoutButton?: () => void;
  icon?:IconNames
};

const Header: FC<HeaderPropsTypes> = ({
  title,
  avoidBackButton,
  dashboard,
  onPressMenuIcon,
  onPressBackArrow,
  onPressLogoutButton,
  icon
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

  // console.log("tttt", title);

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
            alignItems: 'center',
            // alignItems:'flex-end',
            width: '100%',
          }}>
          <TouchableOpacity
            onPress={onPressMenuIcon}
            // style={{marginRight:20}}
          >
            <Icon name="menu_icon" />
          </TouchableOpacity>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {}}>
              <Icon name="bell_icon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {}}>
              <Icon name="profile_icon" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {title && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // alignItems:'flex-end',
            width: '100%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {}} style={{marginRight: 20}}>
              <Icon name="back_button" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: FONT_SIZES.body3,
                fontFamily: FONT_VARIANT.bold,
                color:colors.blackColor
              }}
              >
              {title}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => {}}>
              <Images name={icon||"Evaluation_icon"} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* <View style={{}}>
        {!avoidBackButton && (
          <TouchableOpacity >
            <Icon name="back_button" />
          </TouchableOpacity>
        )}
      </View> */}
    </View>
  );
};

export default Header;
