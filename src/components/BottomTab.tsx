import React, {FC} from 'react';
import {Platform, TouchableOpacity, View} from 'react-native';

import Icon, {IconTypes} from './Icon';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';
import {useAppSelector} from '../redux/store';
import {ScreenNames, navigate} from '../utils/helpers/navigationHelpers';

interface StackItem {
  stack: ScreenNames;
  icon: IconTypes;
  disabled?: boolean;
}

const adminStack: StackItem[] = [
  {stack: 'AdminDashboard', icon: 'tabbar_icon_home'},
  {stack: 'UserManagementStack', icon: 'user_management_tabbar_icon'},
  {stack: 'RubricStack', icon: 'tabbar_icon_observation'},
  {stack: 'FlowsAndFormsStack', icon: 'tabbar_icon_graph'},
];

const registeredUserStack: StackItem[] = [
  {stack: 'TeacherDashboard', icon: 'tabbar_icon_home'},
  {stack: 'ReportsStack', icon: 'tabbar_icon_observation'},
  {stack: 'RubricStack', icon: 'tabbar_icon_rubric'},
  {stack: 'FlowsAndFormsStack', icon: 'tabbar_icon_graph'},
];

type BottomTabTypes = {
  focusedStack: ScreenNames;
};

const BottomTab: FC<BottomTabTypes> = ({focusedStack}) => {
  const {isAdmin} = useAppSelector(state => state.auth);

  const onTabPress = (stack: ScreenNames) => {
    navigate(stack);
  };

  // const selectedTabStack = isAdmin ? adminStack : registeredUserStack;


  const selectedTabStack =  adminStack;
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
          android: {
            elevation: 10,
          },
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
                  }
                : {
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'center',
                  }
            }
            onPress={() => onTabPress(item.stack)}
            key={index}
            disabled={focused || item.disabled}>
            <Icon
              name={item.icon}
              stroke={focused ? colors.blackColor : '#ABB4BD'}
              strokeWidth={2}
              width={size}
              height={size}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTab;
