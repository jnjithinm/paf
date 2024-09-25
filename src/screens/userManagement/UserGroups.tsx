import React, {FC, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/LayoutNew';
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
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';

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
    <Text size="small2" style={{color:'#4E565F'}}>{label}</Text>
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
      disabled
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
        <RenderUserGroupDetails label={'Group'} value={userGroup.userGroupId}/>
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
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<UserGroup>();
  const [search, setSearch] = useState<string>('');
  const [userGroupList, setUserGroupList] = useState<UserGroupsList>({
    userGroupsList: [],
    count: 0,
    selectedTab: 'all',
  });

  const {allUserGroups, activeUserGroups, inactiveUserGroups} = useAppSelector(
    state => state.users,
  );
  const dispatch = useAppDispatch();

  const tabs: ItemType[] = [
    {label: `All (${allUserGroups?.totalCount || ''})`, value: 'all'},
    {label: `Active (${activeUserGroups?.totalCount || ''})`, value: 'active'},
    {
      label: `Inactive (${inactiveUserGroups?.totalCount || ''})`,
      value: 'inactive',
    },
  ];

  useEffect(() => {
    if (allUserGroups && userGroupList.selectedTab === 'all') {
      setUserGroupList({
        userGroupsList: allUserGroups?.dataList,
        count: allUserGroups.totalCount,
        selectedTab: 'all',
      });
    }
  }, [allUserGroups]);

  useEffect(() => {
    if (activeUserGroups && userGroupList?.selectedTab === true) {
      setUserGroupList({
        userGroupsList: activeUserGroups?.dataList,
        count: activeUserGroups.totalCount,
        selectedTab: true,
      });
    }
  }, [activeUserGroups]);

  useEffect(() => {
    if (inactiveUserGroups && userGroupList?.selectedTab === false) {
      setUserGroupList({
        userGroupsList: inactiveUserGroups?.dataList,
        count: inactiveUserGroups.totalCount,
        selectedTab: false,
      });
    }
  }, [inactiveUserGroups]);

  useEffect(() => {
    dispatch(
      getAllUserGroups([
        {
          page: 0,
          size: 15,
          type: 'all',
        },
      ]),
    );
    dispatch(
      getAllUserGroups([
        {
          page: 0,
          size: 15,
          type: true,
        },
      ]),
    );
    dispatch(
      getAllUserGroups([
        {
          page: 0,
          size: 15,
          type: false,
        },
      ]),
    );
  }, []);
  const handleTabClick = useCallback(
    (title: ItemType) => {
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
    },
    [allUserGroups, activeUserGroups, inactiveUserGroups],
  );
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const onPressMenuIcon = () => {
    setIsDrawerOpen(true); // Set drawer open to true
  };
  

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(
        getAllUserGroups([
          {
            page: 0,
            size: 15,
            type: userGroupList.selectedTab,
          },
          search,
        ]),
      );
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [search, userGroupList.selectedTab]);

  return (
    <Drawer
    open={isDrawerOpen} // Drawer open state
    onOpen={() => setIsDrawerOpen(true)}
    onClose={() => setIsDrawerOpen(false)} // Close drawer
    renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}
  >
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="User Groups"
      icon="user_groups_icon"
      focusedStack="UserManagementStack"
      titleTransition
      onPressMenuIcon={onPressMenuIcon}
      >
      <Text
        style={{
          fontFamily: 'Lato', // Ensure Lato is installed and linked correctly
          fontWeight: '700', // Weight 700 (bold)
          fontSize: 24, // 24px font size
          lineHeight: 28, // Line height of 28px
          marginVertical: 16, // Your existing vertical margin
          //color: '#000', // Set the color if necessary
        }}>
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
        {userGroupList?.userGroupsList ? (
          userGroupList?.userGroupsList.length > 0 ? (
            <View>
              {userGroupList?.userGroupsList?.map(item => (
                <UserGroupTile
                  userGroup={item}
                  onPressItem={user => {
                    // setSelectedItem(user);
                  }}
                  selectedItem={selectedItem}
                />
              ))}
              <PaginationBar
                count={(userGroupList?.count || 0) / 15}
                onPressPageIndex={index => {
                  if (userGroupList) {
                    dispatch(
                      getAllUserGroups([
                        {
                          page: index,
                          size: 15,
                          type: userGroupList?.selectedTab || 'all',
                        },
                        search,
                      ]),
                    );
                  }
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
    </Drawer>
  );
};
export default UserGroups;
