import React, { FC, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Icon from './Icon';
import colors from '../config/colors';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import { FONT_SIZES, FONT_VARIANT } from '../config/themes';
import Image, { ImageIconNames } from './Image';
import Text from './Text';
import { RenderActiveStatus } from '../screens/userManagement/UsersMainPage';
import { database } from '../utils/firebase';
import { onValue, ref } from '@react-native-firebase/database';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { allUserNotification } from '../redux/features/masterSlice';

type HeaderPropsTypes = {
  title?: string;
  avoidBackButton?: boolean;
  dashboard?: boolean;
  onPressMenuIcon?: () => void;
  onPressBellIcon?: () => void;
  onPressBackArrow?: () => void;
  onPressLogoutButton?: () => void;
  icon?: ImageIconNames;
  scrollTransition?: boolean;
  isScrolled?: boolean;
  isActive?: 'Active' | 'Inactive';
};

const Header: FC<HeaderPropsTypes> = ({
  title,
  avoidBackButton,
  dashboard,
  onPressMenuIcon,
  icon,
  scrollTransition,
  isScrolled,
  isActive,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {dashboard && (
        <View style={styles.dashboardContainer}>
          {/* Menu Icon for Dashboard */}
          <TouchableOpacity
            onPress={onPressMenuIcon} // Opens the drawer on press
            style={{
              height: '70%',
              justifyContent: 'flex-end',
              width: '20%',
              right: 5,
            }}
          >
            <Icon name="menu_icon" />
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.mainHeader}>
        <View
          style={[
            styles.titleContainer,
            { top: scrollTransition && !isScrolled ? 20 : 0 },
          ]}
        >
          {/* Display Menu Icon if it's a dashboard or back arrow otherwise */}
          {!avoidBackButton && !dashboard && (
            <TouchableOpacity
              onPress={onPressMenuIcon}
              style={styles.backButton}
            >
              <Icon name="menu_icon" />
            </TouchableOpacity>
          )}
          {((title && !scrollTransition) ||
            (title && scrollTransition && isScrolled)) && (
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.title}>{title}</Text>
              {isActive && (
                <RenderActiveStatus
                  style={{ left: 5 }}
                  isActive={isActive === 'Active'}
                />
              )}
            </View>
          )}
        </View>
        {icon && (
          <TouchableOpacity
            onPress={() => {}}
            style={
              scrollTransition && !isScrolled
                ? { ...styles.iconScrolled, ...styles.iconContainer }
                : styles.iconContainer
            }
          >
            <Image
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
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryLightColor,
    height: normaliseDesigns(50),
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
  },
  iconRow: {
    flexDirection: 'row',
    width: '20%',
    height: '70%',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
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
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
    width: normaliseDesigns(30),
    right: 15,
  },
  title: {
    fontSize: FONT_SIZES.body3,
    fontFamily: FONT_VARIANT.bold,
    color: colors.blackColor,
    textAlign: 'left',
  },
  iconScrolled: {
    top: 35,
  },
  iconContainer: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -3,
    right: 15,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});

export default Header;
