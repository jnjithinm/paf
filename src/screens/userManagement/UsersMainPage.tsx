import React, {FC, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/LayoutNew';
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
import PaginationBar from '../../components/PaginationBar';
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';

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
  <View style={{marginVertical: 3, ...style}}>
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

// const UserTile: FC<UserTileTypes> = ({user, selectedItem, onPressItem}) => (
//   <TouchableOpacity
//     style={{
//       borderWidth: 1,
//       borderColor: '#F4C24A',
//       borderRadius: 10,
//       marginVertical: 5,
//       backgroundColor:
//         user.userId === selectedItem?.userId ? '#FCEBC5' : undefined,
//     }}
//     onPress={() => {
//       onPressItem(user);
//     }}
//     disabled={selectedItem === user}>
//     <View
//       style={{
//         flexDirection: 'row',
//         width: '100%',
//         justifyContent: 'space-between',
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//       }}>
//       <Text size="body1" fontVariant="bold">
//         {user.name}
//       </Text>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           width: '25%',
//         }}>
//         <RenderActiveStatus isActive={user.status} />
//         <Icon
//           name="chevron_up_black_icon"
//           style={{
//             transform: [
//               {
//                 rotate:
//                   user.userId === selectedItem?.userId ? '0deg' : '180deg',
//               },
//             ],
//           }}
//         />
//       </View>
//     </View>
//     {user?.userId === selectedItem?.userId && (
//       <View
//         style={{
//           flexDirection: 'row',
//           width: '100%',
//           backgroundColor: colors.backgroundColor,
//           paddingHorizontal: 15,
//           paddingVertical: 10,
//           borderBottomRightRadius: 10,
//           borderBottomLeftRadius: 10,
//           // flexWrap: 'wrap',
//           justifyContent: 'space-between',
//         }}>
//         <View>
//           <RenderLabelAndValue label={'Email'} value={user.email} />
//           <RenderLabelAndValue label={'State'} value={user.state} />
//           <RenderLabelAndValue label={'School'} value={user.school} />
//         </View>
//         <View>
//           <RenderLabelAndValue label={'Phone'} value={user.contactNumber} />
//           <RenderLabelAndValue label={'District'} value={user.district} />
//         </View>

//         <View>
//           <RenderLabelAndValue label={'Role'} value={user.role} />
//           <RenderLabelAndValue label={'Area'} value={user.area} />
//         </View>
//       </View>
//     )}
//   </TouchableOpacity>
// );

const UserTile: FC<UserTileTypes> = ({ user, selectedItem, onPressItem }) => {
  const isSelected = user.userId === selectedItem?.userId;

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: '#F4C24A',
        borderRadius: 10,
        marginVertical: 5,
        backgroundColor: isSelected ? '#FCEBC5' : undefined,
      }}
      onPress={() => {
        // Toggle between selecting and deselecting the item
        onPressItem(isSelected ? null : user);
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
          <TouchableOpacity
            onPress={() => {
              // Toggle between selecting and deselecting the item
              onPressItem(isSelected ? null : user);
            }}>
            <Icon
              name="chevron_up_black_icon"
              style={{
                transform: [
                  {
                    rotate: isSelected ? '0deg' : '180deg',
                  },
                ],
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isSelected && (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            backgroundColor: colors.backgroundColor,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
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
};


interface UsersMainPageScreenProps {
  navigation: UsersMainPageNavigationProp;
  route: UsersMainPageRouteProp;
}

type UsersList = {
  usersList: User[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};
// const UsersMainPage: FC<UsersMainPageScreenProps> = ({navigation, route}) => {
//   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
//   const [selectedItem, setSelectedItem] = useState<User>();
//   const [search, setSearch] = useState<string>('');
//   const [usersList, setUsersList] = useState<UsersList>({
//     usersList: [],
//     count: 0,
//     selectedTab: 'all',
//   });

//   const dispatch = useAppDispatch();
//   const {allUsers, activeUsers, inactiveUsers} = useAppSelector(
//     state => state.users,
//   );

//   const tabs: ItemType[] = [
//     {label: `All (${allUsers?.totalCount || ''})`, value: 'all'},
//     {label: `Active (${activeUsers?.totalCount || ''})`, value: 'active'},
//     {label: `Inactive (${inactiveUsers?.totalCount || ''})`, value: 'inactive'},
//   ];

//   useEffect(() => {
//     dispatch(
//       getAllUsers([
//         {
//           page: 0,
//           size: 15,
//           type: 'all',
//         },
//       ]),
//     );
//     dispatch(
//       getAllUsers([
//         {
//           page: 0,
//           size: 15,
//           type: true,
//         },
//       ]),
//     );
//     dispatch(
//       getAllUsers([
//         {
//           page: 0,
//           size: 15,
//           type: false,
//         },
//       ]),
//     );
//   }, []);

//   useEffect(() => {
//     if (allUsers && usersList.selectedTab === 'all') {
//       setUsersList(prev => ({
//         ...prev,
//         usersList: allUsers.dataList,
//         count: allUsers.totalCount,
//       }));
//     }
//   }, [allUsers]);

//   useEffect(() => {
//     if (activeUsers && usersList?.selectedTab === true) {
//       setUsersList(prev => ({
//         ...prev,
//         usersList: activeUsers.dataList,
//         count: activeUsers.totalCount,
//       }));
//     }
//   }, [activeUsers]);

//   useEffect(() => {
//     if (inactiveUsers && usersList?.selectedTab === false) {
//       setUsersList(prev => ({
//         ...prev,
//         usersList: inactiveUsers.dataList,
//         count: inactiveUsers.totalCount,
//       }));
//     }
//   }, [inactiveUsers]);

//   const handleTabClick = useCallback(
//     (title: ItemType) => {
//       if (title.value == 'all') {
//         setUsersList({
//           usersList: allUsers?.dataList,
//           count: allUsers?.totalCount,
//           selectedTab: 'all',
//         });
//       } else if (title.value == 'active') {
//         console.log('cccc');
//         setUsersList({
//           usersList: activeUsers?.dataList,
//           count: activeUsers?.totalCount,
//           selectedTab: true,
//         });
//       } else {
//         setUsersList({
//           usersList: inactiveUsers?.dataList,
//           count: inactiveUsers?.totalCount,
//           selectedTab: false,
//         });
//       }
//     },
//     [activeUsers, activeUsers, inactiveUsers],
//   );
//   const closeDrawer = () => {
//     setIsDrawerOpen(false);
//   };
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       dispatch(
//         getAllUsers([
//           {
//             page: 0,
//             size: 15,
//             type: usersList.selectedTab,
//           },
//           search,
//         ]),
//       );
//     }, 200);

//     return () => clearTimeout(delayDebounceFn);
//   }, [search, usersList.selectedTab]);

//   console.log('active', activeUsers?.dataList);

//   return (
//     <Drawer
//     open={isDrawerOpen}
//     onOpen={() => setIsDrawerOpen(true)}
//     onClose={() => setIsDrawerOpen(false)}
//     renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}>
//     <Layout
//       overridePaddingHorizontal
//       overridePaddingVertical
//       style={{paddingHorizontal: 15}}
//       title="Users"
//       icon="users_icon"
//       focusedStack="UserManagementStack"
//       titleTransition
//       >
//       <Text
//         style={{
//           fontFamily: 'Lato', 
//           fontWeight: '700', 
//           fontSize: 24, 
//           lineHeight: 28, 
//           marginVertical: 10,
//         }}>
//         Users
//       </Text>
//       <Tab tabs={tabs} onClick={title => handleTabClick(title)} />
//       <SearchWithFilter
//         onTextChange={text => {
//           setSearch(text);
//         }}
//         onProceed={filter => {}}
//         style={{gap: 16}}
//         filterNotNeeded
//       />
//       <View style={{}}>
//         {usersList?.usersList ? (
//           usersList?.usersList?.length > 0 ? (
//             <View>
//               {usersList?.usersList.map(item => (
//                 <UserTile
//                   user={item}
//                   onPressItem={user => {
//                     setSelectedItem(user);
//                   }}
//                   selectedItem={selectedItem}
//                 />
//               ))}
//               <PaginationBar
//                 count={(usersList?.count || 0) / 15}
//                 onPressPageIndex={index => {
//                   if (usersList) {
//                     dispatch(
//                       getAllUsers([
//                         {
//                           page: index,
//                           size: 15,
//                           type: usersList?.selectedTab,
//                         },
//                       ]),
//                     );
//                   }
//                 }}
//               />
//             </View>
//           ) : (
//             <RenderEmptyPlaceholder />
//           )
//         ) : (
//           <></>
//         )}
//       </View>
//     </Layout>
//     </Drawer>
//   );
// };
const UsersMainPage: FC<UsersMainPageScreenProps> = ({ navigation, route }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false); // Manages drawer state
  const [selectedItem, setSelectedItem] = useState<User>();
  const [search, setSearch] = useState<string>('');
  const [usersList, setUsersList] = useState<UsersList>({
    usersList: [],
    count: 0,
    selectedTab: 'all',
  });

  const dispatch = useAppDispatch();
  const { allUsers, activeUsers, inactiveUsers } = useAppSelector(
    (state) => state.users
  );

  const tabs: ItemType[] = [
    { label: `All (${allUsers?.totalCount || ''})`, value: 'all' },
    { label: `Active (${activeUsers?.totalCount || ''})`, value: 'active' },
    { label: `Inactive (${inactiveUsers?.totalCount || ''})`, value: 'inactive' },
  ];

  useEffect(() => {
    dispatch(
      getAllUsers([
        {
          page: 0,
          size: 15,
          type: 'all',
        },
      ])
    );
    dispatch(
      getAllUsers([
        {
          page: 0,
          size: 15,
          type: true,
        },
      ])
    );
    dispatch(
      getAllUsers([
        {
          page: 0,
          size: 15,
          type: false,
        },
      ])
    );
  }, []);

  useEffect(() => {
    if (allUsers && usersList.selectedTab === 'all') {
      setUsersList((prev) => ({
        ...prev,
        usersList: allUsers.dataList,
        count: allUsers.totalCount,
      }));
    }
  }, [allUsers]);

  useEffect(() => {
    if (activeUsers && usersList?.selectedTab === true) {
      setUsersList((prev) => ({
        ...prev,
        usersList: activeUsers.dataList,
        count: activeUsers.totalCount,
      }));
    }
  }, [activeUsers]);

  useEffect(() => {
    if (inactiveUsers && usersList?.selectedTab === false) {
      setUsersList((prev) => ({
        ...prev,
        usersList: inactiveUsers.dataList,
        count: inactiveUsers.totalCount,
      }));
    }
  }, [inactiveUsers]);

  const handleTabClick = useCallback(
    (title: ItemType) => {
      if (title.value == 'all') {
        setUsersList({
          usersList: allUsers?.dataList,
          count: allUsers?.totalCount,
          selectedTab: 'all',
        });
      } else if (title.value == 'active') {
        setUsersList({
          usersList: activeUsers?.dataList,
          count: activeUsers?.totalCount,
          selectedTab: true,
        });
      } else {
        setUsersList({
          usersList: inactiveUsers?.dataList,
          count: inactiveUsers?.totalCount,
          selectedTab: false,
        });
      }
    },
    [activeUsers, inactiveUsers]
  );

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Ensure the drawer opens when the menu icon is clicked
  const onPressMenuIcon = () => {
    setIsDrawerOpen(true); // Set drawer open to true
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(
        getAllUsers([
          {
            page: 0,
            size: 15,
            type: usersList.selectedTab,
          },
          search,
        ])
      );
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [search, usersList.selectedTab]);

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
        style={{ paddingHorizontal: 15 }}
        title="Users"
        icon="users_icon"
        focusedStack="UserManagementStack"
        titleTransition
        onPressMenuIcon={onPressMenuIcon} // Pass the function to Layout/Header
      >
        <Text
          style={{
            fontFamily: 'Lato',
            fontWeight: '700',
            fontSize: 24,
            lineHeight: 28,
            marginVertical: 10,
          }}
        >
          Users
        </Text>
        <Tab tabs={tabs} onClick={(title) => handleTabClick(title)} />
        <SearchWithFilter
          onTextChange={(text) => {
            setSearch(text);
          }}
          onProceed={(filter) => {}}
          style={{ gap: 16 }}
          filterNotNeeded
        />
        <View>
          {usersList?.usersList ? (
            usersList?.usersList?.length > 0 ? (
              <View>
                {usersList?.usersList.map((item) => (
                  <UserTile
                    user={item}
                    onPressItem={(user) => {
                      setSelectedItem(user);
                    }}
                    selectedItem={selectedItem}
                  />
                ))}
                <PaginationBar
                  count={(usersList?.count || 0) / 15}
                  onPressPageIndex={(index) => {
                    if (usersList) {
                      dispatch(
                        getAllUsers([
                          {
                            page: index,
                            size: 15,
                            type: usersList?.selectedTab || 'all',
                          },
                        ])
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

export default UsersMainPage;


