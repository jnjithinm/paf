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
import {User, UserGroup, getAllUserGroups} from '../../redux/features/usersSlice';
import colors from '../../config/colors';
import { styles } from '../../components/RubricListModal';

type UserGroupsNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'UserGroups'
>;
type UserGroupsRouteProp = RouteProp<
  UserManagementStackParamList,
  'UserGroups'
>;


interface UserGroupTileProps {
userGroup:UserGroup;
onPressItem: (item: UserGroup) => void;
selectedItem: User | undefined;
  }
  
  const UserGroupTile: React.FC<UserGroupTileProps> = ({
    userGroup,
    onPressItem,
    selectedItem
  }) => {
    return (
      <TouchableOpacity style={styles.container} onPress={onPressItem}>
        <View style={[styles.titleContainer]}>
          <View style={{width: '68%'}}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          </View>
          <View
            style={{
              width: '32%',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}>
            <View
              style={{
                backgroundColor: active ? '#EBF9D9' : '#FFEDED',
                borderRadius: 7,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 3,
                paddingHorizontal: 7,
              }}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: active ? '#749E35' : '#D62828'},
                ]}
              />
              <Text style={{color: active ? '#749E35' : '#D62828'}} size="small2">
                {active ? ' Active' : ' Inactive'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <View style={{flexDirection: 'row', width: '80%'}}>
            <View style={styles.detailsInnerContainer}>
              <Text style={styles.heading}>Created by</Text>
              <Text style={styles.subHeading}>{createdBy}</Text>
            </View>
            <View style={[styles.detailsInnerContainer, {width: '40%'}]}>
              <Text style={styles.heading}>Creation Date</Text>
              <Text style={styles.subHeading}> {createdDate}</Text>
            </View>
            <View style={styles.detailsInnerContainer}>
              <Text style={styles.heading}>Users</Text>
              <Text style={styles.subHeading}> {userCount}</Text>
            </View>
          </View>
          {isAdmin && (
            <View style={styles.deleteButton}>
              <TouchableOpacity onPress={onDelete}>
                <Icon name="trash_icon" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
interface UserGroupsScreenProps {
  navigation: UserGroupsNavigationProp;
  route: UserGroupsRouteProp;
}

const UserGroups: FC<UserGroupsScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<User>();

  const {allUserGroups}=useAppSelector(state=>state.users)
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
      icon='user_groups_icon'
      focusedStack="UserManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Users
      </Text>
      <View>
        {allUserGroups?.dataList.map(item => (
          <UserGroupTile
            userGroup={item}
            onPressItem={user => {
              setSelectedItem(user);
            }}
            selectedItem={selectedItem}
          />
        ))}
      </View>
    </Layout>
  );
};
export default UserGroups;
