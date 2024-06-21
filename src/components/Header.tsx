import React, {FC, useEffect} from 'react';
import {TouchableOpacity, View, StyleSheet, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from './Icon';
import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Images, {ImageIconNames} from '../components/Image';
import {useAppDispatch, useAppSelector} from '../redux/store';
import Text from './Text';
import { ErrorStatusObject} from '../config/types';
import {setShowMessage} from '../redux/features/authSlice';

export interface ShowMessageTypes extends ErrorStatusObject {
  style?: ViewStyle;
}

export const ShowMessage: FC<ShowMessageTypes> = ({
  status,
  message,
  style,
}) => {
  const dispatch = useAppDispatch();

  const closeShowMessage=()=>{
    dispatch(setShowMessage(null));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        closeShowMessage();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [message]); 

  if (!message) {
    return null;
  }


  return (
    <View
      style={[
        styles.showMessage,
        {
          backgroundColor: status === 'Failed' ? '#F58484' : '#EBF9D9',
          borderColor: status === 'Failed' ? '#C41B1B' : '#749E35',
          ...style,
        },
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '95%',
        }}>
        <View style={styles.iconContainer}>
          <Icon name="cross_icon" />
        </View>
        <Text color="blackColor" style={{width: '90%'}} size="small3">
          {message}
        </Text>
      </View>
      <TouchableOpacity
        style={{
          width: '15%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
        onPress={closeShowMessage}>
        <Icon
          name={status === 'Failed' ? 'cross_icon' : 'checkbox'}
          width={15}
          height={15}
        />
      </TouchableOpacity>
    </View>
  );
};

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
  const {showMessage} = useAppSelector(state => state.auth);

  useEffect(() => {
    setTimeout(() => {
      setShowMessage(null);
    }, 1000);
  }, [showMessage]);

  console.log('sefse', showMessage);
  return (
    <View style={styles.headerContainer}>
      {showMessage && (
        <ShowMessage
          message={showMessage?.message}
          status={showMessage?.status}
        />
      )}
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
        <View style={styles.titleContainer}>
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
  showMessage: {
    position: 'absolute',
    top: normaliseDesigns(15),
    marginHorizontal: '4%',
    // transform: [{ translateX: -0.5 * normaliseDesigns(250) }, { translateY: -0.5 * 45 }],
    flexDirection: 'row',
    borderWidth: 1.5,
    zIndex: 2,
    width: '100%',
    minHeight: normaliseDesigns(40),
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    paddingHorizontal: 10,
    // flex:1
  },
  iconContainer: {
    padding: 9,
    backgroundColor: '#C41B1B',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 7,
  },
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
    alignSelf: 'flex-end',
  },
  backButton: {
    marginRight: 20,
  },
  title: {
    fontSize: FONT_SIZES.body3,
    fontFamily: FONT_VARIANT.bold,
    color: colors.blackColor,
  },
  iconScrolled: {
    top: 35,
    right: 10,
  },
});

export default Header;
