import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {User, getAllUserGroups} from '../../redux/features/usersSlice';
import colors from '../../config/colors';

type UserGroupsNavigationProp = StackNavigationProp<
  UserManagementStackParamList,
  'UserGroups'
>;
type UserGroupsRouteProp = RouteProp<
  UserManagementStackParamList,
  'UserGroups'
>;

const users: User[] = [
  {
    userId: 1,
    userName: 'john.doe',
    name: 'John Doe',
    contactNumber: '123-456-7890',
    email: 'john.doe@example.com',
    dateOfBirth: '1990-01-15',
    role: 'Teacher',
    state: 'California',
    district: 'Los Angeles',
    area: 'Downtown',
    school: 'ABC High School',
    citizenship: 'US',
    userType: 'Admin',
    status: true,
    roleId: 101,
    stateId: 1,
    districtId: 10,
    areaId: 100,
    schoolId: 1000,
    createdDate: '2023-01-01',
  },
  {
    userId: 2,
    userName: 'jane.smith',
    name: 'Jane Smith',
    contactNumber: '987-654-3210',
    email: 'jane.smith@example.com',
    dateOfBirth: '1985-05-20',
    role: 'Principal',
    state: 'New York',
    district: 'Manhattan',
    area: 'Midtown',
    school: 'XYZ Elementary School',
    citizenship: 'US',
    userType: 'Admin',
    status: true,
    roleId: 102,
    stateId: 2,
    districtId: 20,
    areaId: 200,
    schoolId: 2000,
    createdDate: '2023-02-01',
  },
  {
    userId: 3,
    userName: 'alice.jones',
    name: 'Alice Jones',
    contactNumber: '555-123-4567',
    email: 'alice.jones@example.com',
    dateOfBirth: '1995-03-10',
    role: 'Student',
    state: 'Texas',
    district: 'Houston',
    area: 'Northside',
    school: 'LMN Middle School',
    citizenship: 'US',
    userType: 'Non-Admin',
    status: true,
    roleId: 103,
    stateId: 3,
    districtId: 30,
    areaId: 300,
    schoolId: 3000,
    createdDate: '2023-03-01',
  },
  {
    userId: 4,
    userName: 'bob.brown',
    name: 'Bob Brown',
    contactNumber: '444-987-6543',
    email: 'bob.brown@example.com',
    dateOfBirth: '1980-08-25',
    role: 'Counselor',
    state: 'Florida',
    district: 'Miami',
    area: 'South Beach',
    school: 'OPQ High School',
    citizenship: 'US',
    userType: 'Non-Admin',
    status: false,
    roleId: 104,
    stateId: 4,
    districtId: 40,
    areaId: 400,
    schoolId: 4000,
    createdDate: '2023-04-01',
  },
];

type RenderActiveStatusTypes = {
  isActive: boolean;
  style?: ViewStyle;
};
const RenderActiveStatus: FC<RenderActiveStatusTypes> = ({isActive, style}) => (
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
    value: string;
    style?: ViewStyle;
  };
  const RenderLabelAndValue: FC<RenderLabelAndValueTypes> = ({
    label,
    value,
    style,
  }) =>  (
    <View style={{ marginVertical: 3, flexShrink: 1, flexGrow: 0, ...style }}>
      <Text style={{ color: '#4E565F' }} size="small1">
        {label}
      </Text>
      <Text size="small2">{value}</Text>
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
    {user.userId === selectedItem?.userId && (
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
          justifyContent: 'flex-start',
        }}>
        <RenderLabelAndValue
          label={'Email'}
          value={user.email}
          
        />
        <RenderLabelAndValue
          label={'Phone'}
          value={user.contactNumber}
          
        />
        <RenderLabelAndValue
          label={'Role'}
          value={user.role}
          
        />
        <RenderLabelAndValue
          label={'State'}
          value={user.state}
          
        />
        <RenderLabelAndValue
          label={'District'}
          value={user.district}
          
        />
        <RenderLabelAndValue
          label={'Area'}
          value={user.area}
          
        />
        <RenderLabelAndValue
          label={'School'}
          value={user.school}
          
        />
      </View>
    )}
  </TouchableOpacity>
);

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
          <UserTile
            user={item}
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
