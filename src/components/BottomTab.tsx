import React, {FC} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';

import Icon, {IconTypes} from './Icon';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';
import {useAppSelector} from '../redux/store';
import {ScreenNames, navigate} from '../utils/helpers/navigationHelpers';
import Text from './Text';

interface StackItem {
  stack: ScreenNames | undefined;
  icon: IconTypes;
  focusedIcon: IconTypes;
  disabled?: boolean;
}

const adminStack: StackItem[] = [
  {
    stack: 'AdminDashboard',
    icon: 'tabbar_icon_home',
    focusedIcon: 'tabbar_icon_home_focused',
  },
  {
    stack: 'UserManagementStack',
    icon: 'tabbar_icon_user_management',
    focusedIcon: 'tabbar_icon_user_management_focused',
  },
  {
    stack: 'FlowsAndFormsStack',
    icon: 'tabbar_icon_flows_and_forms',
    focusedIcon: 'tabbar_icon_flows_and_forms_focused',
  },
  {
    stack: 'AnalyticsStack',
    icon: 'tabbar_icon_graph',
    focusedIcon: 'tabbar_icon_graph_focused',
  },
];

const registeredUserStack: StackItem[] = [
  {
    stack: 'TeacherDashboard',
    icon: 'tabbar_icon_home',
    focusedIcon: 'tabbar_icon_home_focused',
  },
  {
    stack: 'ObservationStack',
    icon: 'tabbar_icon_observation',
    focusedIcon: 'tabbar_icon_observation_focused',
  },
  {
    stack: undefined,
    icon: 'tabbar_icon_rubric',
    focusedIcon: 'tabbar_icon_rubric_focused',
    disabled: true,
  },
  {
    stack: undefined,
    icon: 'tabbar_icon_graph',
    focusedIcon: 'tabbar_icon_graph_focused',
    disabled: true,
  },
];

type BottomTabTypes = {
  focusedStack: ScreenNames;
};

const BottomTab: FC<BottomTabTypes> = ({focusedStack}) => {
  const {isAdmin} = useAppSelector(state => state.auth);

  const onTabPress = (stack: ScreenNames) => {
    navigate(stack);
  };

  const selectedTabStack = isAdmin ? adminStack : registeredUserStack;

  // const selectedTabStack =  adminStack;
  return (
    <View
      style={{
        width: '100%',
        height:
          Platform.OS === 'android'
            ? normaliseDesigns(55)
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
          android:{
            elevation: 20,
            shadowColor: 'rgba(0, 0, 10, 10)',  // Dark black color with 80% opacity
            shadowOpacity: 10,  // Increase shadow opacity (1 is the maximum)
            shadowOffset: { width: 10, height: 50 },  // Offset for the shadow
          }
        }),
      }}>
      {selectedTabStack.map((item, index) => {
        const focused = item.stack === focusedStack ? true : false;

        // const {iconName} = screenOptions(item.stack);
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
                    width: 40,
                  }
                : {
                    alignItems: 'center',
                    height: 32,
                    width: 32,
                    justifyContent: 'center',
                  }
            }
            onPress={() => {
              if (item.stack) {
                onTabPress(item.stack);
              }
            }}
            key={index}
            disabled={focused || item.disabled}>
            <View style={{alignItems: 'center'}}>
              <Icon
                name={focused ? item.focusedIcon : item.icon}
                strokeWidth={2}
                width={size}
                height={size}
              />
              {item.disabled && (
                <Text size="verysmall1" style={{top: 2}} color="dangerColor">
                  Coming soon
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTab;
