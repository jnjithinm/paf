import React, {FC, useEffect, useState} from 'react';
import { TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {User, getAllUsers} from '../../redux/features/usersSlice';
import colors from '../../config/colors';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import Tab from '../../components/Tab';
import {ItemType} from '../../config/types';

type UsersMainPageNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'UsersMainPage'
>;
type UsersMainPageRouteProp = RouteProp<
  UserManagementStackParamList,
  'UsersMainPage'
>;


type RenderActiveStatusTypes = {
  isActive: boolean;
  style?: ViewStyle;
};
export const RenderActiveStatus: FC<RenderActiveStatusTypes> = ({
  isActive,
  style,
}) => (
  <View
    style={{
      ...style,
      flexDirection: 'row',
      backgroundColor: isActive ? '#EBF9D9' : '#FFEDED',
      alignItems: 'center',
      padding: 5,
      borderRadius: 8,
      justifyContent: 'space-between',
    }}>
    <View
      style={{
        aspectRatio: 1,
        height: 7,
        backgroundColor: isActive ? '#749E35' : '#D62828',
        borderRadius: 10,
      }}
    />
    <Text
      style={{color: isActive ? '#749E35' : '#D62828', marginLeft: 5}}
      size="verysmall3"
      fontVariant="bold">
      {isActive ? 'Active' : 'Inactive'}
    </Text>
  </View>
);

type RenderLabelAndValueTypes = {
  label: string;
  value: string | number;
  style?: ViewStyle;
};
export const RenderLabelAndValue: FC<RenderLabelAndValueTypes> = ({
  label,
  value,
  style,
}) => (
  <View style={{marginVertical: 3,  ...style}}>
    <Text style={{color: '#4E565F'}} size="small1">
      {label}
    </Text>
    <Text size="small1">{value}</Text>
  </View>
);
type UserTileTypes = {
  user: User;
  onPressItem: (item: User) => void;
  selectedItem: User | undefined;
};

const UserTile: FC<UserTileTypes> = ({user, selectedItem, onPressItem}) => (
  <TouchableOpacity
    style={{
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
      backgroundColor:
        user.userId === selectedItem?.userId ? '#FCEBC5' : undefined,
    }}
    onPress={() => {
      onPressItem(user);
    }}
    disabled={selectedItem === user}>
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}>
      <Text size="body1" fontVariant="bold">
        {user.name}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '25%',
        }}>
        <RenderActiveStatus isActive={user.status} />
        <Icon
          name="chevron_up_black_icon"
          style={{
            transform: [
              {
                rotate:
                  user.userId === selectedItem?.userId ? '0deg' : '180deg',
              },
            ],
          }}
        />
      </View>
    </View>
    {user?.userId === selectedItem?.userId && (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: colors.backgroundColor,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          // flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <View>
          <RenderLabelAndValue label={'Email'} value={user.email} />
          <RenderLabelAndValue label={'State'} value={user.state} />
          <RenderLabelAndValue label={'School'} value={user.school} />
        </View>
        <View>
          <RenderLabelAndValue label={'Phone'} value={user.contactNumber} />
          <RenderLabelAndValue label={'District'} value={user.district} />
        </View>

        <View>
          <RenderLabelAndValue label={'Role'} value={user.role} />
          <RenderLabelAndValue label={'Area'} value={user.area} />
        </View>
      </View>
    )}
  </TouchableOpacity>
);

export const tabs: ItemType[] = [
  {label: 'All', value: 'All'},
  {label: 'Active', value: 'Active'},
  {label: 'Inactive', value: 'Inactive'},
];

interface UsersMainPageScreenProps {
  navigation: UsersMainPageNavigationProp;
  route: UsersMainPageRouteProp;
}

const UsersMainPage: FC<UsersMainPageScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<User>();
  const [search, setSearch] = useState<string>('');
  const [usersList, setUsersList] = useState<User[]>();

  const dispatch = useAppDispatch();
  const {allUsers} = useAppSelector(state => state.users);

  useEffect(() => {
    dispatch(
      getAllUsers({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (allUsers) {
      setUsersList(allUsers.dataList);
    }
  }, [allUsers]);

  const handleTabClick = (title: ItemType) => {
    if (allUsers?.dataList) {
      title.value == 'Active'
        ? setUsersList(allUsers?.dataList?.filter(item => item.status === true))
        : title.value == 'Inactive'
        ? setUsersList(
            allUsers?.dataList?.filter(item => item.status === false),
          )
        : setUsersList(allUsers?.dataList);
    }
  };

  const filteredUsers = usersList?.filter(item =>
    item?.name?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Users"
      icon="users_icon"
      focusedStack="UserManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Users
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
      <View style={{marginVertical: 10}}>
        {filteredUsers ? (
          filteredUsers?.length > 0 ? (
            filteredUsers.map(item => (
              <UserTile
                user={item}
                onPressItem={user => {
                  setSelectedItem(user);
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
export default UsersMainPage;
