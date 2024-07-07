import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  UserGroup,
  getAllUserGroups,
} from '../../redux/features/usersSlice';
import {RenderActiveStatus, tabs} from './UsersMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import {ItemType} from '../../config/types';
import Tab from '../../components/Tab';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';

type UserGroupsNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'UserGroups'
>;
type UserGroupsRouteProp = RouteProp<
  UserManagementStackParamList,
  'UserGroups'
>;



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
      style={{
        borderWidth: 1,
        borderColor: '#F4C24A',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
      }}
      onPress={(userGroup)=>{}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size="body2" fontVariant="bold">
          {userGroup.groupName}
        </Text>
        <RenderActiveStatus isActive={userGroup.status || false} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
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
  const [search, setSearch] = useState<string>('');
  const [userGroupList, setUserGroupList] = useState<UserGroup[]>();

  const {allUserGroups} = useAppSelector(state => state.users);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (allUserGroups) {
      setUserGroupList(allUserGroups.dataList);
    }
  }, [allUserGroups]);

  const handleTabClick = (title: ItemType) => {
    if (allUserGroups?.dataList) {
      title.value == 'Active'
        ? setUserGroupList(
            allUserGroups?.dataList?.filter(item => item.status === true),
          )
        : title.value == 'Inactive'
        ? setUserGroupList(
            allUserGroups?.dataList?.filter(item => item.status === false),
          )
        : setUserGroupList(allUserGroups?.dataList);
    }
  };

  useEffect(() => {
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  const filteredUsers = userGroupList?.filter(item =>
    item?.groupName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

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
      <Tab tabs={tabs} onClick={title => handleTabClick(title)} />
      <SearchWithFilter
        onTextChange={text => {
          setSearch(text);
        }}
        onProceed={filter => {}}
        style={{marginVertical: 10}}
        filterNotNeeded
      />
      <View>
        {filteredUsers ? (
          filteredUsers.length > 0 ? (
            filteredUsers?.map(item => (
              <UserGroupTile
                userGroup={item}
                onPressItem={user => {
                  // setSelectedItem(user);
                }}
                selectedItem={selectedItem}
              />
            ))
          ) : (
            <RenderEmptyPlaceholder />
          )
        ) : (
          <></>
        )}
      </View>
    </Layout>
  );
};
export default UserGroups;
