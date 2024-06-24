import {TouchableOpacity, View} from 'react-native';

import colors from '../config/colors';
import Icon, {IconTypes} from './Icon';
import Text from './Text';
import {FC, useState} from 'react';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {logoutAndclearToken} from '../redux/features/authSlice';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {navigate} from '../utils/helpers/navigationHelpers';
import {RenderProfileIcon} from '../screens/dashboard/TeacherDashboard';
import {
  ParentRoles,
  UserTypes,
  roleLevels,
} from '../config/constants';

type RenderItemTypes = {
  icon?: IconTypes;
  itemName: string;
  expandItem?: RenderItemTypes;
  onPressItem: () => void;
};
const RenderItem: FC<RenderItemTypes> = ({
  icon,
  itemName,
  onPressItem,
  expandItem,
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
          marginVertical: 8,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        onPress={onPress}>
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
            {icon && <Icon name={icon} />}
          </View>
          <Text fontVariant="bold" style={{marginLeft: 7}} size="body1">
            {itemName}
          </Text>
        </View>
        {expandItem && (
          <View>
            <Icon
              name="chevron_up_black_icon"
              style={{transform: [{rotate: isExpanded ? '0deg' : '180deg'}]}}
            />
          </View>
        )}
      </TouchableOpacity>
      {isExpanded && (
        <TouchableOpacity
          style={{marginLeft: '15%', marginVertical: 5}}
          onPress={expandItem?.onPressItem}>
          <Text fontVariant="bold" size="body1">
            {expandItem?.itemName}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};

export const getRoleLevel = (role: ParentRoles): UserTypes | undefined => {
  for (const level of roleLevels) {
    if (level.roles.includes(role)) {
      return level.userType;
    }
  }
  return undefined;
};


type DrawerContentTypes = {
  closeDrawer: () => void;
};

const DrawerContent: FC<DrawerContentTypes> = ({closeDrawer}) => {
  const dispatch = useAppDispatch();

  const {userData} = useAppSelector(state => state.auth);
  const {dashboardDetails} = useAppSelector(state => state.observation);

  const itemsArrayUser: RenderItemTypes[] = [
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
        navigate('DashboardTabStack', {screen: 'ReportsStack'});
      },
    },
    {
      icon: 'drawer_icon_teaching_aids',
      itemName: 'Teaching Aids',
      onPressItem: () => {},
      expandItem: {
        itemName: 'Resources',
        onPressItem: () => {},
      },
    },
    {
      icon: 'drawer_icon_session_schedules',
      itemName: 'Session Schedules',
      onPressItem: () => {},
    },
    {
      icon: 'drawer_icon_give_feedback',
      itemName: 'Give Feedback',
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
      icon: 'drawer_icon_observation_reports',
      itemName: 'User Management',
      onPressItem: () => {
        navigate('DashboardTabStack', {screen: 'ReportsStack'});
      },
      expandItem: {
        itemName: 'Resources',
        onPressItem: () => {},
      },
    },
    {
      icon: 'drawer_icon_observation_reports',
      itemName: 'Teacher Evaluation',
      onPressItem: () => {
        navigate('DashboardTabStack', {screen: 'ReportsStack'});
      },
      expandItem: {
        itemName: 'Resources',
        onPressItem: () => {},
      },
    },
    {
      icon: 'drawer_icon_observation_reports',
      itemName: 'Schedules',
      onPressItem: () => {
        navigate('DashboardTabStack', {screen: 'ReportsStack'});
      },
    },
    {
      icon: 'drawer_icon_observation_reports',
      itemName: 'Analytics',
      onPressItem: () => {
        navigate('DashboardTabStack', {screen: 'ReportsStack'});
      },
      expandItem: {
        itemName: 'Resources',
        onPressItem: () => {},
      },
    },
  ];

  const settingsItemsUser: RenderItemTypes[] = [
    {
      icon: 'drawer_icon_settings',
      itemName: 'Settings',
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


  const settingsItems =
    getRoleLevel(userData.roleType) === UserTypes.REGISTERED_USER
      ? settingsItemsUser
      : settingsItemsAdmin;

  const itemsArray=
  getRoleLevel(userData.roleType) === UserTypes.REGISTERED_USER
  ? itemsArrayUser
  : itemsArrayAdmin;

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
            marginTop: 40,
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
              Hi,{' '}
              {getRoleLevel(userData.roleType) === UserTypes.REGISTERED_USER
                ? userData.userName
                : 'Admin'}
            </Text>
            <Text size="small1">{dashboardDetails?.schoolName}</Text>
          </View>
        </View>
        <View
          style={{height: 1, backgroundColor: '#E4E7EB', marginVertical: 25}}
        />
        <View>
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
          height: normaliseDesigns(75),
          alignItems: 'center',
          justifyContent: 'center',
          bottom: 20,
          position:'absolute'
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#EA7804',
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
          }}>
          <Text color="backgroundColor" size="small2">
            Help Centre
          </Text>
        </TouchableOpacity>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <TouchableOpacity>
            <Text style={{color: '#ABB4BD'}} size="small2">
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 10,
              backgroundColor: '#ABB4BD',
              marginHorizontal: 5,
              width: 1,
            }}
          />
          <TouchableOpacity>
            <Text style={{color: '#ABB4BD'}} size="small2">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DrawerContent;
