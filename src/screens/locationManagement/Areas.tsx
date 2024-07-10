import React, { FC, useEffect, useState, useCallback } from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import colors from '../../config/colors';
import { LocationManagementStackParamList } from '../../navigation/LocationManagementStack';
import { Area, getAreas } from '../../redux/features/masterSlice';
import Tab from '../../components/Tab';
import SearchWithFilter from '../../components/SearchWithFilter';
import { ItemType } from '../../config/types';
import { RenderEmptyPlaceholder } from '../observation/ObservationReportsMainPage';
import PaginationBar from '../../components/PaginationBar';

type AreasNavigationProp = StackNavigationProp<
  LocationManagementStackParamList,
  'Areas'
>;
type AreasRouteProp = RouteProp<LocationManagementStackParamList, 'Areas'>;

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
      style={{ color: isActive ? '#749E35' : '#D62828', marginLeft: 5 }}
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
  <View style={{ marginVertical: 3, flexShrink: 1, flexGrow: 0, ...style }}>
    <Text style={{ color: '#4E565F' }} size="small1">
      {label}
    </Text>
    <Text size="small2">{value}</Text>
  </View>
);
type AreaTileTypes = {
  area: Area;
  onPressItem: (item: Area) => void;
  selectedItem: Area | undefined;
};

const AreaTile: FC<AreaTileTypes> = ({ area, selectedItem, onPressItem }) => (
  <TouchableOpacity
    style={{
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
      backgroundColor: area.area === selectedItem?.area ? '#FCEBC5' : undefined,
    }}
    onPress={() => {
      onPressItem(area);
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
        {area.area}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '25%',
        }}>
        <RenderActiveStatus isActive={area.status} />
        <Icon
          name="chevron_up_black_icon"
          style={{
            transform: [
              {
                rotate: area.area === selectedItem?.area ? '0deg' : '180deg',
              },
            ],
          }}
        />
      </View>
    </View>
    {area.area === selectedItem?.area && (
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
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <RenderLabelAndValue label={'Pincode'} value={area.pinCode} />
          <RenderLabelAndValue label={'District'} value={area.districtName} />
          <RenderLabelAndValue label={'States'} value={area.stateName} />
          <RenderLabelAndValue label={'School'} value={area.schools} />
          <RenderLabelAndValue label={'Users'} value={area.users} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <RenderLabelAndValue label={'Created By'} value={area.createdBy} />
          <RenderLabelAndValue
            label={'Created On'}
            value={moment(area.creationDate).format('DD/MM/YYY')}
          />
          <RenderLabelAndValue
            label={'Time'}
            value={moment(area.creationDate).format('hh:mm A')}
          />
        </View>
      </View>
    )}
  </TouchableOpacity>
);

type AreasList = {
  areasList: Area[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};

interface AreasScreenProps {
  navigation: AreasNavigationProp;
  route: AreasRouteProp;
}

const Areas: FC<AreasScreenProps> = ({ navigation, route }) => {
  const [selectedItem, setSelectedItem] = useState<Area>();
  const [areaList, setAreaList] = useState<AreasList>({
    areasList: [],
    count: 0,
    selectedTab: 'all',
  });
  const [search, setSearch] = useState<string>('');

  const dispatch = useAppDispatch();
  const { allAreas, activeAreas, inactiveAreas } = useAppSelector(
    (state) => state.master
  );

  const tabs: ItemType[] = [
    { label: `All (${allAreas?.totalCount || ''})`, value: 'all' },
    { label: `Active (${activeAreas?.totalCount || ''})`, value: 'active' },
    {
      label: `Inactive (${inactiveAreas?.totalCount || ''})`,
      value: 'inactive',
    },
  ];

  useEffect(() => {
    dispatch(
      getAreas([
        {
          page: 0,
          size: 15,
          type: 'all',
        },
      ])
    );
    dispatch(
      getAreas([
        {
          page: 0,
          size: 15,
          type: true,
        },
      ])
    );
    dispatch(
      getAreas([
        {
          page: 0,
          size: 15,
          type: false,
        },
      ])
    );
  }, []);

  useEffect(() => {
    if (allAreas) {
      setAreaList((prev) => ({
        ...prev,
        areasList: allAreas.dataList,
        count: allAreas.totalCount,
        selectedTab: 'all',
      }));
    }
  }, [allAreas]);

  useEffect(() => {
    if (activeAreas && areaList.selectedTab === true) {
      setAreaList((prev) => ({
        ...prev,
        areasList: activeAreas.dataList,
        count: activeAreas.totalCount,
      }));
    }
  }, [activeAreas]);

  useEffect(() => {
    if (inactiveAreas && areaList.selectedTab === false) {
      setAreaList((prev) => ({
        ...prev,
        areasList: inactiveAreas.dataList,
        count: inactiveAreas.totalCount,
      }));
    }
  }, [inactiveAreas]);

  const handleTabClick = useCallback(
    (title: ItemType) => {
      if (title.value === 'all') {
        setAreaList({
          areasList: allAreas?.dataList,
          count: allAreas?.totalCount,
          selectedTab: 'all',
        });
      } else if (title.value === 'active') {
        setAreaList({
          areasList: activeAreas?.dataList,
          count: activeAreas?.totalCount,
          selectedTab: true,
        });
      } else {
        setAreaList({
          areasList: inactiveAreas?.dataList,
          count: inactiveAreas?.totalCount,
          selectedTab: false,
        });
      }
    },
    [allAreas, activeAreas, inactiveAreas]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      dispatch(
        getAreas([
          {
            page: 0,
            size: 15,
            type: areaList.selectedTab,
          },
          search,
        ])
      );
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [search, areaList.selectedTab]);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{ paddingHorizontal: 15 }}
      title="Areas"
      icon="areas_icon"
      focusedStack="LocationManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{ marginVertical: 10 }}>
        Areas
      </Text>
      <Tab tabs={tabs} onClick={handleTabClick} />
      <SearchWithFilter
        onTextChange={(text) => {
          setSearch(text);
        }}
        onProceed={(filter) => {}}
        style={{ marginVertical: 10 }}
        filterNotNeeded
      />

      <View style={{ marginVertical: 10 }}>
        {areaList?.areasList ? (
          areaList?.areasList.length > 0 ? (
            <View>
              {areaList?.areasList?.map((item) => (
                <AreaTile
                  key={item.area}
                  area={item}
                  onPressItem={(school) => {
                    setSelectedItem(school);
                  }}
                  selectedItem={selectedItem}
                />
              ))}
              <PaginationBar
                count={(areaList?.count || 0) / 15}
                onPressPageIndex={(index) => {
                  if (areaList) {
                    dispatch(
                      getAreas([
                        {
                          page: index,
                          size: 15,
                          type: areaList?.selectedTab || 'all',
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
  );
};
export default Areas;
