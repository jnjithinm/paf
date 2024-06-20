import React, {FC, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

import Icon from './Icon';
import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Images, {ImageIconNames} from '../components/Image';

type HeaderPropsTypes = {
  title?: string;
  avoidBackButton?: boolean;
  dashboard?: boolean;
  onPressMenuIcon?: () => void;
  onPressBellIcon?:()=>void;
  onPressProfileIcon?:()=>void;
  onPressBackArrow?: () => void;

  onPressLogoutButton?: () => void;
  icon?: ImageIconNames;
  scrollTransition?: boolean;
  isScrolled?: boolean;
};

const Header: FC<HeaderPropsTypes> = ({
  title,
  avoidBackButton,
  dashboard,
  onPressMenuIcon,
  onPressBellIcon,
  onPressProfileIcon,
  onPressBackArrow,
  onPressLogoutButton,
  icon,

  scrollTransition,
  isScrolled,
}) => {

  const navigation = useNavigation();
 
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
        height: normaliseDesigns(50),
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
            <TouchableOpacity onPress={onPressBellIcon}>
              <Icon name="bell_icon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressProfileIcon}>
              <Icon name="profile_icon" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          // alignItems:'flex-end',
          width: '100%',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-end',
          }}>
          {!avoidBackButton && (
            <TouchableOpacity
              onPress={() => {
                onPressBackArrow ? onPressBackArrow() : navigation.goBack();
              }}
              style={{marginRight: 20}}>
              <Icon name="back_button" />
            </TouchableOpacity>
          )}
          {((title && !scrollTransition) ||
            (title && scrollTransition && isScrolled)) && (
            <Text
              style={{
                fontSize: FONT_SIZES.body3,
                fontFamily: FONT_VARIANT.bold,
                color: colors.blackColor,
              }}>
              {title}
            </Text>
          )}
        </View>
        {icon && (
          <TouchableOpacity
            onPress={() => {}}
            style={
              // icon === 'search_reports_icon' &&
              scrollTransition && !isScrolled ? {top: 35, right: 10} : {}
            }>
            <Images
              name={icon}
              size={
                !scrollTransition || (scrollTransition && isScrolled) ? 0.5 : 1
              }
            />
          </TouchableOpacity>
        )}
      </View>

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
