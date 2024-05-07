import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import Icon, {IconTypes} from './Icon';
import Text from './Text';
import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';


const DashboardTabBar = ({state, navigation}: BottomTabBarProps) => {
  const onTabPress = (routeName: string, _routeIndex: number) => {
    navigation.navigate(routeName);
  };

  const screenOptions = (route: {name: string}) => {
    let iconName: IconTypes;
    let comingSoon: boolean = false;
    let screenName: string = '';

    switch (route.name) {
      case 'TeacherDashboard':
        iconName = 'home_icon_tabbar';
        screenName = 'Dashboard';
        break;
      case 'Listing':
        iconName = 'listing';
        screenName = 'Listing';
        break;
      case 'Reports':
        iconName = 'reports';
        screenName = 'Reports';
        break;
      case 'Product':
        iconName = 'loan_product';
        screenName = 'Product';
        break;
    }
    return {iconName, screenName, comingSoon};
  };

  return (
    <View
      style={{
        width: '100%',
        height:
          Platform.OS === 'android'
            ? normaliseDesigns(50)
            : normaliseDesigns(65),
        flexDirection: 'row',
        backgroundColor: colors.backgroundColor,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        ...Platform.select({
          ios: {
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 10,
          },
        }),
      }}>
      {state.routes.map((route, index) => {
        const focused = index === state.index ? true : false;
        const {iconName, screenName, comingSoon} = screenOptions(route);
        const size = focused ? 20 : 15;
        const color = focused ? 'secondaryColor' : 'blackColor';
        const opacity = focused ? '1' : '0.50';
        return (
          <TouchableOpacity
            style={{alignItems: 'center'}}
            onPress={() => onTabPress(route.name, index)}
            key={index}
            disabled={focused || comingSoon}>
            <Icon
              name={focused ? `${iconName}_selected` : iconName}
              // name={iconName}
              // stroke={colors.secondaryColor}
              width={size}
              height={size}
              opacity={comingSoon ? 0.1 : undefined}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DashboardTabBar;
