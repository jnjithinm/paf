import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import colors from '../../config/colors';
import {RenderActiveStatus, RenderLabelAndValue, tabs} from './UsersMainPage';
import {Role, getRoles} from '../../redux/features/masterSlice';
import {ItemType} from '../../config/types';
import SearchWithFilter from '../../components/SearchWithFilter';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import moment from 'moment';
import Tab from '../../components/Tab';

type RolesAndAppAccessNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'RolesAndAppAccess'
>;
type RolesAndAppAccessRouteProp = RouteProp<
  UserManagementStackParamList,
  'RolesAndAppAccess'
>;

interface RolesAndAppAccessScreenProps {
  navigation: RolesAndAppAccessNavigationProp;
  route: RolesAndAppAccessRouteProp;
}


type RolesAndAppAccessTileTypes = {
  role: Role;
  onPressItem: (item: Role) => void;
  selectedItem: Role | undefined;
};

const RolesAndAppAccessTile: FC<RolesAndAppAccessTileTypes> = ({
  role,
  selectedItem,
  onPressItem,
}) => (
  <TouchableOpacity
    style={{
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
      backgroundColor: role.roleName === selectedItem?.roleName ? '#FCEBC5' : undefined,
    }}
    onPress={() => {
      onPressItem(role);
    }}>
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
      }}>
      <Text size="body1" fontVariant="bold">
        {role.roleName}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '25%',
        }}>
        <RenderActiveStatus isActive={role.status} />
        <Icon
          name="chevron_up_black_icon"
          style={{
            transform: [
              {
                rotate:
                role.roleId === selectedItem?.roleId ? '0deg' : '180deg',
              },
            ],
          }}
        />
      </View>
    </View>
    {selectedItem?.roleId === role?.roleId && (
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          backgroundColor: colors.backgroundColor,
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderBottomRightRadius: 10,
          borderBottomLeftRadius: 10,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        <RenderLabelAndValue label={'Role Level'} value={role.roleLevel} />
        <RenderLabelAndValue label={'Parent Role'} value={role.parentRole} />
        <RenderLabelAndValue label={'Users'} value={role.users} />
        <RenderLabelAndValue label={'Created By'} value={role.createdBy} />
        <RenderLabelAndValue label={'Created On'} value={moment( role.createdDt).format('DD/MM/YYY')} />
        <RenderLabelAndValue label={'Time'} value={moment( role.createdDt).format('hh:mm A')} />

      </View>
    )}
  </TouchableOpacity>
);

const RolesAndAppAccess: FC<RolesAndAppAccessScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedItem, setSelectedItem] = useState<Role>();
  const [search, setSearch] = useState<string>('');
  const [rolesList, setRolesList] = useState<Role[]>();

  const dispatch = useAppDispatch();
  const {roles} = useAppSelector(state => state.master);
  const handleTabClick = (title: ItemType) => {
    if (roles?.dataList) {
      title.value == 'Active'
        ? setRolesList(roles?.dataList?.filter(item => item.status === true))
        : title.value == 'Inactive'
        ? setRolesList(roles?.dataList?.filter(item => item.status === false))
        : setRolesList(roles?.dataList);
    }
  };

  useEffect(() => {
    dispatch(
      getRoles({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (roles) {
      setRolesList(roles.dataList);
    }
  }, [roles]);
  const filteredRoles = rolesList?.filter(item =>
    item?.roleName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Roles & App Access"
      icon="role_and_app_access_icon"
      focusedStack="UserManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Roles & App Access
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
        {filteredRoles ? (
          filteredRoles.length > 0 ? (
            filteredRoles?.map(item => (
              <RolesAndAppAccessTile
                role={item}
                onPressItem={(role)=>{setSelectedItem(role)}}
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
export default RolesAndAppAccess;
