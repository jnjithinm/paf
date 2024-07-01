import {TouchableOpacity, View, ViewStyle} from 'react-native';

import colors from '../config/colors';
import Icon, {IconTypes} from './Icon';
import Text from './Text';
import {FC, useState} from 'react';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {logoutAndclearToken} from '../redux/features/authSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {navigate} from '../utils/helpers/navigationHelpers';
import {RenderProfileIcon} from '../screens/dashboard/TeacherDashboard';
import {ParentRoles, UserTypes, roleLevels} from '../config/constants';

type RenderItemTypes = {
  icon?: IconTypes;
  itemName: string;
  expandItem?: RenderItemTypes[];
  onPressItem: () => void;
  subMenuLevel?: 'one' | 'two';
  style?: ViewStyle;
};
const RenderItem: FC<RenderItemTypes> = ({
  icon,
  itemName,
  onPressItem,
  expandItem,
  subMenuLevel,
  style,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const onPress = () => {
    if (expandItem) {
      setIsExpanded(!isExpanded);
    } else {
      onPressItem();
    }
  };
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          marginVertical:
            subMenuLevel === 'one' ? -13 : subMenuLevel === 'two' ? -9 : 7,
          alignItems: 'center',
          justifyContent: 'space-between',
          ...style,
        }}
        onPress={onPress}>
        {icon ? (
          subMenuLevel ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginLeft: subMenuLevel === 'one' ? '2%' : '10%',
              }}>
              <Icon
                name={icon}
                width={subMenuLevel === 'one' ? 45 : 40}
                height={subMenuLevel === 'one' ? 45 : 40}
              />
              <Text
                size={subMenuLevel === 'one' ? 'body1' : 'small3'}
                style={{letterSpacing: -0.27}}>
                {itemName}
              </Text>
            </View>
          ) : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  backgroundColor: '#F4C24A',
                  aspectRatio: 1,
                  height: normaliseDesigns(22),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Icon name={icon} />
              </View>
              <Text fontVariant="bold" style={{marginLeft: 7}} size="body1">
                {itemName}
              </Text>
            </View>
          )
        ) : (
          <></>
        )}
        {expandItem && (
          <Icon
            name="chevron_up_black_icon"
            style={{
              transform: [{rotate: isExpanded ? '0deg' : '180deg'}],
              alignSelf: subMenuLevel ? 'flex-end' : undefined,
            }}
          />
        )}
      </TouchableOpacity>
      {isExpanded &&
        expandItem?.map((item, index) => (
          <RenderItem
            itemName={item.itemName}
            expandItem={item.expandItem}
            onPressItem={item.onPressItem}
            key={item.itemName}
            icon={item.icon}
            subMenuLevel={item.subMenuLevel}
            style={{marginBottom: index === expandItem.length - 1 ? 4 : 0}}
          />
        ))}
    </>
  );
};

export const getRoleLevel = (
  role: ParentRoles | null,
): UserTypes | undefined => {
  if (role) {
    for (const level of roleLevels) {
      if (level.roles.includes(role)) {
        return level.userType;
      }
    }
  }
  return undefined;
};

type DrawerContentTypes = {
  closeDrawer: () => void;
};

const DrawerContent: FC<DrawerContentTypes> = ({closeDrawer}) => {
  const dispatch = useAppDispatch();

  const {userData, isAdmin} = useAppSelector(state => state.auth);
  const {dashboardDetails} = useAppSelector(state => state.observation);

  const itemsArrayRegisteredUser: RenderItemTypes[] = [
    {
      icon: 'drawer_icon_home',
      itemName: 'Dashboard',
      onPressItem: () => {
        closeDrawer();
      },
    },
    {
      icon: 'drawer_icon_observation_reports',
      itemName: 'Observation Reports',
      onPressItem: () => {
        closeDrawer();
        navigate('ObservationStack');
      },
    },
    {
      icon: 'drawer_icon_teaching_aids',
      itemName: 'Teaching Aids',
      onPressItem: () => {},
      expandItem: [
        {
          itemName: 'Resources',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
      ],
    },
    {
      icon: 'drawer_icon_user_management',
      itemName: 'Teacher Evaluation',
      onPressItem: () => {},
      expandItem: [
        {
          itemName: 'Evaluation Flows',
          onPressItem: () => {
            navigate('FlowsAndFormsStack');
          },
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
      ],
    },
    {
      icon: 'drawer_icon_session_schedules',
      itemName: 'Session Schedules',
      onPressItem: () => {},
    },
    {
      icon: 'drawer_icon_analytics',
      itemName: 'Analytics',
      onPressItem: () => {},
    },
  ];

  const itemsArrayAdmin: RenderItemTypes[] = [
    {
      icon: 'drawer_icon_home',
      itemName: 'Dashboard',
      onPressItem: () => {
        closeDrawer();
      },
    },
    {
      icon: 'drawer_icon_user_management',
      itemName: 'User Management',
      onPressItem: () => {},
      expandItem: [
        {
          itemName: 'Users',
          onPressItem: () => {
            closeDrawer();
            navigate('UserManagementStack', {screen: 'UsersMainPage'});
          },
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'User Groups',
          onPressItem: () => {
            closeDrawer();
            navigate('UserManagementStack', {screen: 'UserGroups'});
          },
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'Roles & App Access',
          onPressItem: () => {
            closeDrawer();
            navigate('UserManagementStack', {screen: 'UserGroups'});
          },
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
      ],
    },
    {
      icon: 'drawer_icon_observation_reports',
      itemName: 'Location Management',
      onPressItem: () => {},
      expandItem: [
        {
          itemName: 'States',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'Districts',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'Areas',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'Schools',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
      ],
    },
    {
      icon: 'drawer_icon_user_management',
      itemName: 'Teacher Evaluation',
      onPressItem: () => {},
      expandItem: [
        {
          itemName: 'Evaluation Flows',
          onPressItem: () => {
            navigate('FlowsAndFormsStack');
          },
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'Evaluation Rubrics',
          onPressItem: () => {
            navigate('RubricStack');
          },
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
      ],
    },
    {
      icon: 'drawer_icon_session_schedules',
      itemName: 'Schedules',
      onPressItem: () => {},
    },
    {
      icon: 'drawer_icon_analytics',
      itemName: 'Analytics',
      onPressItem: () => {},
      expandItem: [
        {
          itemName: 'Usage',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
        },
        {
          itemName: 'Product',
          onPressItem: () => {},
          icon: 'extend_item_level_1_icon',
          subMenuLevel: 'one',
          expandItem: [
            {
              itemName: 'User Analytics',
              onPressItem: () => {},
              icon: 'extend_item_level_2_icon',
              subMenuLevel: 'two',
            },
            {
              itemName: 'Classroom Resources',
              onPressItem: () => {},
              icon: 'extend_item_level_2_icon',
              subMenuLevel: 'two',
            },
            {
              itemName: 'Learning Management System',
              onPressItem: () => {},
              icon: 'extend_item_level_2_icon',
              subMenuLevel: 'two',
            },
            {
              itemName: 'Teacher Evalutaion',
              onPressItem: () => {},
              icon: 'extend_item_level_2_icon',
              subMenuLevel: 'two',
            },
            {
              itemName: 'Flows',
              onPressItem: () => {},
              icon: 'extend_item_level_2_icon',
              subMenuLevel: 'two',
            },
          ],
        },
      ],
    },
  ];

  const settingsItemsUser: RenderItemTypes[] = [
    {
      icon: 'drawer_icon_give_feedback',
      itemName: 'Give Feedback',
      onPressItem: () => {},
    },
    {
      icon: 'logout_icon',
      itemName: 'Logout',
      onPressItem: () => {
        dispatch(logoutAndclearToken());
      },
    },
  ];

  const settingsItemsAdmin: RenderItemTypes[] = [
    {
      icon: 'logout_icon',
      itemName: 'Logout',
      onPressItem: () => {
        dispatch(logoutAndclearToken());
      },
    },
  ];

  const settingsItems = isAdmin ? settingsItemsAdmin : settingsItemsUser;

  const itemsArray = isAdmin ? itemsArrayAdmin : itemsArrayRegisteredUser;

  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          backgroundColor: colors.backgroundColor,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            height: 30,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FDF0E3',
            borderRadius: 7,
            alignSelf: 'flex-end',
            marginTop: 20,
          }}
          onPress={() => {
            closeDrawer();
          }}>
          <Icon name="left_arrow_orange_icon" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginTop: 30,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <RenderProfileIcon
            image={userData?.userImage}
            name={userData?.name}
            size={40}
          />
          <View style={{marginLeft: 10}}>
            <Text fontVariant="bold" size="body2">
              Hi, {isAdmin ? 'Admin' : userData.name}
            </Text>
            <Text size="small1">{dashboardDetails?.schoolName}</Text>
          </View>
        </View>
        <View
          style={{height: 1, backgroundColor: '#E4E7EB', marginVertical: 15}}
        />
        <View style={{paddingVertical: 15}}>
          {itemsArray.map(item => (
            <RenderItem
              icon={item.icon}
              itemName={item.itemName}
              onPressItem={item.onPressItem}
              key={item.itemName}
              expandItem={item.expandItem}
            />
          ))}
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: '#CBD2D9',
            height: 1.5,
            marginVertical: 5,
          }}
        />
        <View>
          {settingsItems.map(item => (
            <RenderItem
              icon={item.icon}
              itemName={item.itemName}
              onPressItem={item.onPressItem}
              key={item.itemName}
              expandItem={item.expandItem}
            />
          ))}
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#FEF8EC',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 15,
          bottom: 20,
          position: 'absolute',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#EA7804',
            width: '40%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
          }}>
          <Text color="backgroundColor" size="small1">
            Help Centre
          </Text>
        </TouchableOpacity>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity>
            <Text
              style={{color: '#ABB4BD'}}
              fontVariant="bold"
              size="verysmall1">
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 10,
              backgroundColor: '#ABB4BD',
              marginHorizontal: 10,
              width: 1,
            }}
          />
          <TouchableOpacity>
            <Text
              style={{color: '#ABB4BD'}}
              fontVariant="bold"
              size="verysmall1">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DrawerContent;
