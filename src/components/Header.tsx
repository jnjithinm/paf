import React, {FC, useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from './Icon';
import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Images, {ImageIconNames} from '../components/Image';
import Text from './Text';

type HeaderPropsTypes = {
  title?: string;
  avoidBackButton?: boolean;
  dashboard?: boolean;
  onPressMenuIcon?: () => void;
  onPressBellIcon?: () => void;
  onPressProfileIcon?: () => void;
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

  return (
    <View style={styles.headerContainer}>
      {dashboard && (
        <View style={styles.dashboardContainer}>
          <TouchableOpacity onPress={onPressMenuIcon}>
            <Icon name="menu_icon" />
          </TouchableOpacity>
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={onPressBellIcon}>
              <Icon name="bell_icon" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressProfileIcon}>
              <Icon name="profile_icon" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.mainHeader}>
        <View
          style={[
            styles.titleContainer,
            {top: scrollTransition && !isScrolled ? 20 : 0},
          ]}>
          {!avoidBackButton && (
            <TouchableOpacity
              onPress={() => {
                onPressBackArrow ? onPressBackArrow() : navigation.goBack();
              }}
              style={styles.backButton}>
              <Icon name="back_button" />
            </TouchableOpacity>
          )}
          {((title && !scrollTransition) ||
            (title && scrollTransition && isScrolled)) && (
            <Text style={styles.title}>{title}</Text>
          )}
        </View>
        {icon && (
          <TouchableOpacity
            onPress={() => {}}
            style={scrollTransition && !isScrolled ? styles.iconScrolled : {}}>
            <Images
              name={icon}
              size={
                !scrollTransition || (scrollTransition && isScrolled) ? 0.5 : 1
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.primaryLightColor,
    height: normaliseDesigns(50),
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    right: 15,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.body3,
    fontFamily: FONT_VARIANT.bold,
    color: colors.blackColor,
    paddingRight: 20,
  },
  iconScrolled: {
    top: 35,
    right: 10,
  },
});

export default Header;
