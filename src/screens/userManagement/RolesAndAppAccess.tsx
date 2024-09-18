import React, {FC, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/LayoutNew';
import {UserManagementStackParamList} from '../../navigation/UserManagementStack';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import colors from '../../config/colors';
import {RenderActiveStatus, RenderLabelAndValue} from './UsersMainPage';
import {Role, getRoles} from '../../redux/features/masterSlice';
import {ItemType} from '../../config/types';
import SearchWithFilter from '../../components/SearchWithFilter';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import moment from 'moment';
import Tab from '../../components/Tab';
import PaginationBar from '../../components/PaginationBar';
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';

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

// const RolesAndAppAccessTile: FC<RolesAndAppAccessTileTypes> = ({
//   role,
//   selectedItem,
//   onPressItem,
// }) => (
//   <TouchableOpacity
//     style={{
//       borderWidth: 1,
//       borderColor: '#F4C24A',
//       borderRadius: 10,
//       marginVertical: 5,
//       backgroundColor:
//         role.roleName === selectedItem?.roleName ? '#FCEBC5' : undefined,
//     }}
//     onPress={() => {
//       onPressItem(role);
//     }}>
//     <View
//       style={{
//         flexDirection: 'row',
//         width: '100%',
//         justifyContent: 'space-between',
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//       }}>
//       <Text size="body1" fontVariant="bold">
//         {role.roleName}
//       </Text>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           width: '25%',
//         }}>
//         <RenderActiveStatus isActive={role.status} />
//         <Icon
//           name="chevron_up_black_icon"
//           style={{
//             transform: [
//               {
//                 rotate:
//                   role.roleId === selectedItem?.roleId ? '0deg' : '180deg',
//               },
//             ],
//           }}
//         />
//       </View>
//     </View>
//     {selectedItem?.roleId === role?.roleId && (
//       // <View
//       //   style={{
//       //     flexDirection: 'row',
//       //     width: '100%',
//       //     backgroundColor: colors.backgroundColor,
//       //     paddingHorizontal: 15,
//       //     paddingVertical: 10,
//       //     borderBottomRightRadius: 10,
//       //     borderBottomLeftRadius: 10,
//       //     flexWrap: 'wrap',
//       //     justifyContent: 'space-between',
//       //     gap:5
//       //   }}>
        
//       //   <RenderLabelAndValue label={'Role Level'} value={role.roleLevel} />
//       //   <RenderLabelAndValue label={'Parent Role'} value={role.parentRole} />
//       //   <RenderLabelAndValue label={'Users'} value={role.users} />
//       //   <RenderLabelAndValue label={'Created By'} value={role.createdBy} />
//       //   <RenderLabelAndValue
//       //     label={'Created On'}
//       //     value={moment(role.createdDt).format('DD/MM/YYY')}
//       //   />
//       //   <RenderLabelAndValue
//       //     label={'Time'}
//       //     value={moment(role.createdDt).format('hh:mm A')}
//       //   />
//       // </View>
//       <View
//       style={{
//            flexDirection: 'row',
//            width: '100%',
//            backgroundColor: colors.backgroundColor,
//           paddingHorizontal: 15,
//            paddingVertical: 10,
//            borderBottomRightRadius: 10,
//           borderBottomLeftRadius: 10,
//            flexWrap: 'wrap',
//            justifyContent: 'space-between',
//       }}>
      
//       {/* First row with 3 items */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
//         <View style={{ width: '40%' }}>
//           <RenderLabelAndValue label={'Role Level'} value={role.roleLevel} />
//         </View>
//         <View style={{ width: '40%' }}>
//           <RenderLabelAndValue label={'Parent Role'} value={role.parentRole} />
//         </View>
//         <View style={{ width: '20%' }}>
//           <RenderLabelAndValue label={'Users'} value={role.users} />
//         </View>
//       </View>
    
//       {/* Second row with 3 items */}
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
//         <View style={{ width: '40%' }}>
//           <RenderLabelAndValue label={'Created By'} value={role.createdBy} />
//         </View>
//         <View style={{ width: '40%' }}>
//           <RenderLabelAndValue label={'Created On'} value={moment(role.createdDt).format('DD/MM/YYYY')} />
//         </View>
//         <View style={{ width: '20%' }}>
//           <RenderLabelAndValue label={'Time'} value={moment(role.createdDt).format('hh:mm A')} />
//         </View>
//       </View>
//     </View>
    
//     )}
//   </TouchableOpacity>
// );

// const RolesAndAppAccessTile: FC<RolesAndAppAccessTileTypes> = ({
//   role,
//   selectedItem,
//   onPressItem,
// }) => (
//   <TouchableOpacity
//     style={{
//       borderWidth: 1,
//       borderColor: '#F4C24A', // Border color to match the design
//       borderRadius: 10,
//       marginVertical: 5,
//       backgroundColor:
//         role.roleName === selectedItem?.roleName ? '#FCEBC5' : undefined, // Highlight selected item
//     }}
//     onPress={() => {
//       onPressItem(role);
//     }}>
//     <View
//       style={{
//         flexDirection: 'row',
//         width: '100%',
//         justifyContent: 'space-between',
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//       }}>
//       <Text size="body1" fontVariant="bold">
//         {role.roleName}
//       </Text>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           width: '25%',
//         }}>
//         <RenderActiveStatus isActive={role.status} />
//         <Icon
//           name="chevron_up_black_icon"
//           style={{
//             transform: [
//               {
//                 rotate:
//                   role.roleId === selectedItem?.roleId ? '0deg' : '180deg',
//               },
//             ],
//           }}
//         />
//       </View>
//     </View>

//     {selectedItem?.roleId === role?.roleId && (
//       <View
//         style={{
//           flexDirection: 'column',
//           width: '100%',
//           backgroundColor: colors.backgroundColor, // Background color for the content section
//           paddingHorizontal: 15,
//           paddingVertical: 10,
//           borderBottomRightRadius: 10,
//           borderBottomLeftRadius: 10,
//           justifyContent: 'space-between',
//         }}>
        
//         {/* First row with 3 items */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
//           <View style={{ width: '40%' }}>
//             <RenderLabelAndValue label={'Role Level'} value={role.roleLevel} />
//           </View>
//           <View style={{ width: '40%' }}>
//             <RenderLabelAndValue label={'Parent Role'} value={role.parentRole} />
//           </View>
//           <View style={{ width: '20%' }}>
//             <RenderLabelAndValue label={'Users'} value={role.users} />
//           </View>
//         </View>

//         {/* Second row with 3 items */}
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
//           <View style={{ width: '40%' }}>
//             <RenderLabelAndValue label={'Created By'} value={role.createdBy} />
//           </View>
//           <View style={{ width: '40%' }}>
//             <RenderLabelAndValue label={'Created On'} value={moment(role.createdDt).format('DD/MM/YYYY')} />
//           </View>
//           <View style={{ width: '20%' }}>
//             <RenderLabelAndValue label={'Time'} value={moment(role.createdDt).format('hh:mm A')} />
//           </View>
//         </View>
//       </View>
//     )}
//   </TouchableOpacity>
// );

const RolesAndAppAccessTile: FC<RolesAndAppAccessTileTypes> = ({
  role,
  selectedItem,
  onPressItem,
}) => {
  const isSelected = role.roleId === selectedItem?.roleId;

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
        onPressItem(isSelected ? null : role);
      }}
      disabled={selectedItem === role}>
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
          <TouchableOpacity
            onPress={() => {
              // Toggle between selecting and deselecting the item
              onPressItem(isSelected ? null : role);
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
            flexDirection: 'column',
            width: '100%',
            backgroundColor: colors.backgroundColor,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            justifyContent: 'space-between',
          }}>
          {/* First row with 3 items */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: 10,
            }}>
            <View style={{ width: '40%' }}>
              <RenderLabelAndValue label={'Role Level'} value={role.roleLevel} />
            </View>
            <View style={{ width: '40%' }}>
              <RenderLabelAndValue label={'Parent Role'} value={role.parentRole} />
            </View>
            <View style={{ width: '20%' }}>
              <RenderLabelAndValue label={'Users'} value={role.users} />
            </View>
          </View>

          {/* Second row with 3 items */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
            }}>
            <View style={{ width: '40%' }}>
              <RenderLabelAndValue label={'Created By'} value={role.createdBy} />
            </View>
            <View style={{ width: '40%' }}>
              <RenderLabelAndValue
                label={'Created On'}
                value={moment(role.createdDt).format('DD/MM/YYYY')}
              />
            </View>
            <View style={{ width: '20%' }}>
              <RenderLabelAndValue
                label={'Time'}
                value={moment(role.createdDt).format('hh:mm A')}
              />
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};



type RolesList = {
  roleList: Role[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};

const RolesAndAppAccess: FC<RolesAndAppAccessScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Role>();
  const [search, setSearch] = useState<string>('');
  const [rolesList, setRolesList] = useState<RolesList>({
    roleList: [],
    count: 0,
    selectedTab: 'all',
  });

  const dispatch = useAppDispatch();
  const {allRoles, activeRoles, inactiveRoles} = useAppSelector(
    state => state.master,
  );

  const tabs: ItemType[] = [
    {label: `All (${allRoles?.totalCount || ''})`, value: 'all'},
    {label: `Active (${activeRoles?.totalCount || ''})`, value: 'active'},
    {label: `Inactive (${inactiveRoles?.totalCount || ''})`, value: 'inactive'},
  ];


  const handleTabClick = useCallback(
    (title: ItemType) => {

      if (title.value == 'all') {
        setRolesList({
          roleList: allRoles?.dataList,
          count: allRoles?.totalCount,
          selectedTab: 'all',
        });
      } else if (title.value == 'active') {
        setRolesList({
          roleList: activeRoles?.dataList,
          count: activeRoles?.totalCount,
          selectedTab: true,
        });
      } else {
        setRolesList({
          roleList: inactiveRoles?.dataList,
          count: inactiveRoles?.totalCount,
          selectedTab: false,
        });
      }
  }, [allRoles, activeRoles, inactiveRoles])

  useEffect(() => {
    dispatch(
      getRoles([{
        page: 0,
        size: 15,
        type: 'all',
      }]),
    );
    dispatch(
      getRoles([{
        page: 0,
        size: 15,
        type: true,
      }]),
    );
    dispatch(
      getRoles([{
        page: 0,
        size: 15,
        type: false,
      }]),
    );
  }, []);

  useEffect(() => {
    if (allRoles && rolesList.selectedTab==='all') {
      setRolesList({
        roleList: allRoles.dataList,
        count: allRoles.totalCount,
        selectedTab: 'all',
      });
    }
  }, [allRoles]);

  useEffect(() => {
    if (activeRoles && rolesList?.selectedTab===true) {
      setRolesList((prev) => ({
        ...prev,
        roleList: activeRoles.dataList,
        count: activeRoles.totalCount,
      }));
    }
  }, [activeRoles]);

  useEffect(() => {
    if (inactiveRoles && rolesList?.selectedTab===false) {
      setRolesList((prev) => ({
        ...prev,
        roleList: inactiveRoles.dataList,
        count: inactiveRoles.totalCount,
      }));
    }
  }, [inactiveRoles]);
  

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
        dispatch(getRoles([{
          page: 0,
          size: 15,
          type: rolesList.selectedTab
        },search]));
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [search,rolesList.selectedTab]);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const onPressMenuIcon = () => {
    setIsDrawerOpen(true); // Set drawer open to true
  };

  // console.log("ACC",activeRoles?.dataList)
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
      title="Roles & App Access"
      icon="role_and_app_access_icon"
      focusedStack="UserManagementStack"
      titleTransition
      onPressMenuIcon={onPressMenuIcon} >
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
        {rolesList?.roleList ? (
          rolesList?.roleList?.length > 0 ? (
            <View>
              {rolesList?.roleList?.map(item => (
                <RolesAndAppAccessTile
                  role={item}
                  onPressItem={role => {
                    setSelectedItem(role);
                  }}
                  selectedItem={selectedItem}
                />
              ))}
              <PaginationBar
                count={(rolesList?.count || 0) / 15}
                onPressPageIndex={index => {
                  if(rolesList){
                  dispatch(
                    getRoles([{
                      page: index,
                      size: 15,
                      type: rolesList?.selectedTab || 'all',
                    },search]),
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
export default RolesAndAppAccess;
