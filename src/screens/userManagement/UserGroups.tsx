import React, {FC, useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  User,
  UserGroup,
  getAllUserGroups,
} from '../../redux/features/usersSlice';
import colors from '../../config/colors';
import {styles} from '../../components/RubricListModal';
import {RenderActiveStatus} from './UsersMainPage';

type UserGroupsNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'UserGroups'
>;
type UserGroupsRouteProp = RouteProp<
  UserManagementStackParamList,
  'UserGroups'
>;

const userGroups: UserGroup[] = [
  {
    userGroupId: 1,
    groupName: 'Admin Group',
    createdBy: 'Alice',
    creationDate: '2023-01-15',
    groupUsers: 10,
    status: true,
  },
  {
    userGroupId: 2,
    groupName: 'Development Team',
    createdBy: 'Bob',
    creationDate: '2023-02-20',
    groupUsers: 15,
    status: true,
  },
  {
    userGroupId: 3,
    groupName: 'Marketing Team',
    createdBy: 'Charlie',
    creationDate: '2023-03-10',
    groupUsers: 8,
    status: false,
  },
  {
    userGroupId: 4,
    groupName: 'Sales Team',
    createdBy: 'David',
    creationDate: '2023-04-05',
    groupUsers: 12,
    status: true,
  },
];

type RenderUserGroupDetailsTypes = {
  label: string;
  value: string | number;
};

const RenderUserGroupDetails: FC<RenderUserGroupDetailsTypes> = ({
  label,
  value,
}) => (
  <View>
    <Text size="small2">{label}</Text>
    <Text size="small2">{value}</Text>
  </View>
);

interface UserGroupTileProps {
  userGroup: UserGroup;
  onPressItem: (item: UserGroup) => void;
  selectedItem: UserGroup | undefined;
}

const UserGroupTile: FC<UserGroupTileProps> = ({
  userGroup,
  onPressItem,
  selectedItem,
}) => {
  return (
    <TouchableOpacity
      style={{borderWidth: 1, borderColor: '#F4C24A',marginVertical:5,padding:10,borderRadius:10}}
      onPress={onPressItem}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size="body2" fontVariant="bold">
          {userGroup.groupName}
        </Text>
        <RenderActiveStatus isActive={userGroup.status || false} />
      </View>
      <View style={{flexDirection: 'row',justifyContent:'space-between',marginTop:5}}>
        <RenderUserGroupDetails label={'Group'} value={userGroup.userGroupId} />
        <RenderUserGroupDetails
          label={'Created By'}
          value={userGroup.createdBy}
        />
        <RenderUserGroupDetails
          label={'Created On'}
          value={moment(userGroup.creationDate).format('DD/MM/YYYY')}
        />
        <RenderUserGroupDetails
          label={'Time'}
          value={moment(userGroup.creationDate).format('hh:mm A')}
        />
      </View>
    </TouchableOpacity>
  );
};
interface UserGroupsScreenProps {
  navigation: UserGroupsNavigationProp;
  route: UserGroupsRouteProp;
}

const UserGroups: FC<UserGroupsScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<UserGroup>();

  const {allUserGroups} = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="User Groups"
      icon="user_groups_icon"
      focusedStack="UserManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        User Groups
      </Text>
      <View>
        {allUserGroups?.dataList?.map(item => (
          <UserGroupTile
            userGroup={item}
            onPressItem={user => {
              // setSelectedItem(user);
            }}
            selectedItem={selectedItem}
          />
        ))}
        {userGroups.map(item => (
          <UserGroupTile
            userGroup={item}
            onPressItem={(userGroup)=>{setSelectedItem(userGroup)}}
            selectedItem={selectedItem}
          />
        ))}
      </View>
    </Layout>
  );
};
export default UserGroups;
