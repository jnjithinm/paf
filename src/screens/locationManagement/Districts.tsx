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
import { LocationManagementStackParamList } from '../../navigation/LocationManagementStack';
import { RenderActiveStatus, tabs } from '../userManagement/UsersMainPage';
import { District, getDistricts } from '../../redux/features/masterSlice';
import { RenderEmptyPlaceholder } from '../observation/ObservationReportsMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import Tab from '../../components/Tab';
import { ItemType } from '../../config/types';


type UserGroupsNavigationProp = StackNavigationProp<
  LocationManagementStackParamList,
  'Districts'
>;
type UserGroupsRouteProp = RouteProp<
LocationManagementStackParamList,
  'Districts'
>;


type RenderUserGroupDetailsTypes = {
  label: string;
  value: string | number;
  style?:ViewStyle
};

 const RenderUserGroupDetails: FC<RenderUserGroupDetailsTypes> = ({
  label,
  value,
  style
}) => (
  <View style={{...style}}>
    <Text size="small2">{label}</Text>
    <Text size="small2">{value}</Text>
  </View>
);

interface DistrictTileProps {
  district: District;
  onPressItem: (item: District) => void;
  selectedItem: District | undefined;
}

const DistrictTile: FC<DistrictTileProps> = ({
  district,
  onPressItem,
  selectedItem,
}) => {
  return (
    <TouchableOpacity
      style={{borderWidth: 1, borderColor: '#F4C24A',marginVertical:5,padding:10,borderRadius:10}}
      onPress={()=> {onPressItem(district)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size="body2" fontVariant="bold">
          {district.districtName}
        </Text>
        <RenderActiveStatus isActive={district.status || false} />
      </View>
      <View style={{flexDirection: 'row',justifyContent:'space-between',width:'70%',marginTop:8}}>
        <RenderUserGroupDetails label={'State'} value={district.stateName} />
        <RenderUserGroupDetails
          label={'Schools'}
          value={district.schools}
        />
        <RenderUserGroupDetails
          label={'Users'}
          value={(district.users)}
        />

      </View>
    </TouchableOpacity>
  );
};
interface UserGroupsScreenProps {
  navigation: UserGroupsNavigationProp;
  route: UserGroupsRouteProp;
}

const Districts: FC<UserGroupsScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<District>();
  const [districtList,setDistrictList]=useState<District[]>();
  const [search, setSearch] = useState<string>('');

  const {districts} = useAppSelector(state => state.master);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getDistricts({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  const handleTabClick = (title: ItemType) => {
    if (districts?.dataList) {
      title.value == 'Active'
        ? setDistrictList(
          districts?.dataList?.filter(item => item.status === true),
          )
        : title.value == 'Inactive'
        ? setDistrictList(
          districts?.dataList.filter(item => item.status === false),
          )
        : setDistrictList(districts?.dataList);
    }
  };

  useEffect(()=>{
    if(districts){
      setDistrictList(districts.dataList);
    }
  },[districts])


  const filteredDistricts = districtList?.filter(item =>
    item?.districtName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

console.log("dd",districts,districtList)
  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Districts"
      icon='districts_icon'
      focusedStack='LocationManagementStack'
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Districts
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
      <View style={{marginBottom:15}}>
        {filteredDistricts ? filteredDistricts.length>0 ?filteredDistricts.map(item => (
          <DistrictTile
            district={item}
            onPressItem={district => {
              setSelectedItem(district);
            }}
            selectedItem={selectedItem}
          />
        )):<RenderEmptyPlaceholder/>:<></>}

      </View>
    </Layout>
  );
};
export default Districts;
