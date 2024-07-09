import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {LocationManagementStackParamList} from '../../navigation/LocationManagementStack';
import {RenderActiveStatus} from '../userManagement/UsersMainPage';
import {District, getDistricts} from '../../redux/features/masterSlice';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import Tab from '../../components/Tab';
import {ItemType} from '../../config/types';
import PaginationBar from '../../components/PaginationBar';

type DistrictsNavigationProp = StackNavigationProp<
  LocationManagementStackParamList,
  'Districts'
>;
type DistrictsRouteProp = RouteProp<
  LocationManagementStackParamList,
  'Districts'
>;

type RenderDistrictsDetailsTypes = {
  label: string;
  value: string | number;
  style?: ViewStyle;
};

const RenderDistrictsDetails: FC<RenderDistrictsDetailsTypes> = ({
  label,
  value,
  style,
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
      style={{
        borderWidth: 1,
        borderColor: '#F4C24A',
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
      }}
      onPress={() => {
        onPressItem(district);
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size="body2" fontVariant="bold" style={{width:'75%'}}>
          {district.districtName}
        </Text>
        <RenderActiveStatus isActive={district.status || false} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '70%',
          marginTop: 8,
        }}>
        <RenderDistrictsDetails label={'State'} value={district.stateName} />
        <RenderDistrictsDetails label={'Schools'} value={district.schools} />
        <RenderDistrictsDetails label={'Users'} value={district.users} />
      </View>
    </TouchableOpacity>
  );
};
type DistrictsList = {
  districtsList: District[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};

interface DistrictsScreenProps {
  navigation: DistrictsNavigationProp;
  route: DistrictsRouteProp;
}

const Districts: FC<DistrictsScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<District>();
  const [districtList, setDistrictList] = useState<DistrictsList | undefined>({
    districtsList: [],
    count:0,
    selectedTab: 'all',
  });
  const [search, setSearch] = useState<string>('');

  const {allDistricts, activeDistricts, inactiveDistricts} = useAppSelector(
    state => state.master,
  );
  const dispatch = useAppDispatch();

  const tabs: ItemType[] = [
    {label: `All (${allDistricts?.totalCount || ''})`, value: 'all'},
    {label: `Active (${activeDistricts?.totalCount || ''})`, value: 'active'},
    {
      label: `Inactive (${inactiveDistricts?.totalCount || ''})`,
      value: 'inactive',
    },
  ];

  useEffect(() => {
    if (allDistricts) {
      setDistrictList({
        districtsList: allDistricts?.dataList,
        count: allDistricts.totalCount,
        selectedTab: 'all',
      });
    }
  }, [allDistricts]);

  useEffect(() => {
    if (activeDistricts && districtList?.selectedTab===true) {
      setDistrictList({
        districtsList: activeDistricts?.dataList,
        count: activeDistricts.totalCount,
        selectedTab: true,
      });
    }
  }, [activeDistricts]);

  useEffect(() => {
    if (inactiveDistricts && districtList?.selectedTab===false) {
      setDistrictList({
        districtsList: inactiveDistricts?.dataList,
        count: inactiveDistricts.totalCount,
        selectedTab: false,
      });
    }
  }, [inactiveDistricts]);

  const handleTabClick = (title: ItemType) => {
    if (title.value == 'all') {
      setDistrictList({
        districtsList: allDistricts?.dataList,
        count: allDistricts?.totalCount,
        selectedTab: 'all',
      });
    } else if (title.value == 'active') {
      setDistrictList({
        districtsList: activeDistricts?.dataList,
        count: activeDistricts?.totalCount,
        selectedTab: true,
      });
    } else {
      setDistrictList({
        districtsList: inactiveDistricts?.dataList,
        count: inactiveDistricts?.totalCount,
        selectedTab: false,
      });
    }
  };

  useEffect(() => {
    dispatch(
      getDistricts({
        page: 0,
        size: 10,
        type: 'all',
      }),
    );
    dispatch(
      getDistricts({
        page: 0,
        size: 10,
        type: true,
      }),
    );
    dispatch(
      getDistricts({
        page: 0,
        size: 10,
        type: false,
      }),
    );
  }, []);

  const filteredDistricts = districtList?.districtsList?.filter(item =>
    item?.districtName
      ?.toLocaleLowerCase()
      ?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Districts"
      icon="districts_icon"
      focusedStack="LocationManagementStack"
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
      <View style={{marginBottom: 15}}>
        {filteredDistricts ? (
          filteredDistricts.length > 0 ? (
            <View>
              {filteredDistricts.map(item => (
                <DistrictTile
                  district={item}
                  onPressItem={district => {
                    setSelectedItem(district);
                  }}
                  selectedItem={selectedItem}
                />
              ))}
              <PaginationBar
                count={(districtList?.count || 0) / 10}
                onPressPageIndex={index => {
                  dispatch(
                    getDistricts({
                      page: index,
                      size: 10,
                      type: districtList?.selectedTab || 'all',
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
export default Districts;
