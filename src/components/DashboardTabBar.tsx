import React from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';

import Icon, {IconTypes} from './Icon';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';

const DashboardTabBar = ({state, navigation}: BottomTabBarProps) => {
  const onTabPress = (routeName: string, _routeIndex: number) => {
    navigation.navigate(routeName);
  };

  const screenOptions = (route: {name: string}) => {
    let iconName: IconTypes;
    // let comingSoon: boolean = false;
    let screenName: string = '';

    switch (route.name) {
      case 'TeacherDashboard':
        iconName = 'tabbar_icon_home';

        break;
      case 'ReportsStack':
        iconName = 'tabbar_icon_observation';

        break;
      case 'RubricStack':
        iconName = 'tabbar_icon_rubric';

        break;
      case 'AdminStack':
        iconName = 'tabbar_icon_graph';

        break;
    }
    return {iconName};
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
        const {iconName, screenName} = screenOptions(route);
        const size = 22;
        const color = focused ? 'secondaryColor' : 'blackColor';
        const opacity = focused ? '1' : '0.50';
        return (
          <TouchableOpacity
            style={
              focused
                ? {
                    alignItems: 'center',
                    height: 40,
                    aspectRatio: 1,
                    backgroundColor: '#F4C24A',
                    justifyContent: 'center',
                    borderRadius: 8,
                  }
                : {alignItems: 'center'}
            }
            onPress={() => onTabPress(route.name, index)}
            key={index}
            disabled={focused}>
            <Icon
              name={focused ? `${iconName}_focused` : iconName}
              // stroke={colors.blackColor}
              // name={iconName}
              // stroke={colors.secondaryColor}
              width={size}
              height={size}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default DashboardTabBar;
