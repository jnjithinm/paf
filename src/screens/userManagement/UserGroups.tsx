import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {UserGroup, getAllUserGroups} from '../../redux/features/usersSlice';
import {RenderActiveStatus} from './UsersMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import {ItemType} from '../../config/types';
import Tab from '../../components/Tab';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import PaginationBar from '../../components/PaginationBar';

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
      onPress={userGroup => {}}>
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

type UserGroupsList = {
  userGroupsList: UserGroup[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};
interface UserGroupsScreenProps {
  navigation: UserGroupsNavigationProp;
  route: UserGroupsRouteProp;
}

const UserGroups: FC<UserGroupsScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<UserGroup>();
  const [search, setSearch] = useState<string>('');
  const [userGroupList, setUserGroupList] = useState<UserGroupsList>();

  const {allUserGroups, activeUserGroups, inactiveUserGroups} = useAppSelector(
    state => state.users,
  );
  const dispatch = useAppDispatch();

  const tabs: ItemType[] = [
    {label: `All (${allUserGroups?.totalCount})`, value: 'All'},
    {label: `Active (${activeUserGroups?.totalCount})`, value: 'Active'},
    {label: `Inactive (${inactiveUserGroups?.totalCount})`, value: 'Inactive'},
  ];

  useEffect(() => {
    if (allUserGroups) {
      setUserGroupList({
        userGroupsList: allUserGroups?.dataList,
        count: allUserGroups.totalCount,
        selectedTab: 'all',
      });
    }
  }, [allUserGroups]);

  const handleTabClick = (title: ItemType) => {
    if (title.value == 'all') {
      setUserGroupList({
        userGroupsList: allUserGroups?.dataList,
        count: allUserGroups?.totalCount,
        selectedTab: 'all',
      });
    } else if (title.value == 'active') {
      setUserGroupList({
        userGroupsList: activeUserGroups?.dataList,
        count: activeUserGroups?.totalCount,
        selectedTab: true,
      });
    } else {
      setUserGroupList({
        userGroupsList: inactiveUserGroups?.dataList,
        count: inactiveUserGroups?.totalCount,
        selectedTab: false,
      });
    }
  };

  useEffect(() => {
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 10,
        type: 'all',
      }),
    );
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 10,
        type: true,
      }),
    );
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 10,
        type: false,
      }),
    );
  }, []);

  const filteredUserGroups = userGroupList?.userGroupsList?.filter(item =>
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
        {filteredUserGroups ? (
          filteredUserGroups.length > 0 ? (
            <View>
              {filteredUserGroups?.map(item => (
                <UserGroupTile
                  userGroup={item}
                  onPressItem={user => {
                    // setSelectedItem(user);
                  }}
                  selectedItem={selectedItem}
                />
              ))}
              <PaginationBar
                count={(userGroupList?.count || 0) / 10}
                onPressPageIndex={index => {
                  dispatch(
                    getAllUserGroups({
                      page: index,
                      size: 10,
                      type: userGroupList?.selectedTab || 'all',
                    }),
                  );
                }}
              />
            </View>
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
