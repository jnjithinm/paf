import React, {FC, useEffect, useState} from 'react';
import { TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import colors from '../../config/colors';
import {SchoolType, getSchools} from '../../redux/features/masterSlice';
import {LocationManagementStackParamList} from '../../navigation/LocationManagementStack';
import {ItemType} from '../../config/types';
import SearchWithFilter from '../../components/SearchWithFilter';
import Tab from '../../components/Tab';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import PaginationBar from '../../components/PaginationBar';

type SchoolsNavigationProp = StackNavigationProp<
  LocationManagementStackParamList,
  'Schools'
>;
type SchoolsRouteProp = RouteProp<LocationManagementStackParamList, 'Schools'>;

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
  <View style={{marginVertical: 3, flexShrink: 1, flexGrow: 0, ...style}}>
    <Text style={{color: '#4E565F'}} size="small1">
      {label}
    </Text>
    <Text color='blackColor' size="small1">{value}</Text>
  </View>
);
type SchoolTileTypes = {
  school: SchoolType;
  onPressItem: (item: SchoolType) => void;
  selectedItem: SchoolType | undefined;
};

const SchoolTile: FC<SchoolTileTypes> = ({
  school,
  selectedItem,
  onPressItem,
}) => (
  <TouchableOpacity
    style={{
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
      backgroundColor:
        school.schoolId === selectedItem?.schoolId ? '#FCEBC5' : undefined,
    }}
    onPress={() => {
      onPressItem(school);
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
        {school.schoolName}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '23%',
        }}>
        <RenderActiveStatus isActive={school.status} />
        <Icon
          name="chevron_up_black_icon"
          style={{
            transform: [
              {
                rotate:
                  school.schoolId === selectedItem?.schoolId
                    ? '0deg'
                    : '180deg',
              },
            ],
          }}
        />
      </View>
    </View>
    {school.schoolId === selectedItem?.schoolId && (
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
        <View>
          <RenderLabelAndValue label={'Area'} value={school.area} />
          <RenderLabelAndValue label={'Created By'} value={school.createdBy} />
        </View>
        <View>
          <RenderLabelAndValue label={'District'} value={school.districtName} />
          <RenderLabelAndValue
            label={'Created On'}
            value={moment(school.creationDate).format('DD/MM/YYY')}
          />
        </View>
        <View>
          <RenderLabelAndValue label={'State'} value={school.stateName} />
          <RenderLabelAndValue
            label={'Time'}
            value={moment(school.creationDate).format('hh:mm A')}
          />
        </View>

        <RenderLabelAndValue label={'Users'} value={school.users} />
      </View>
    )}
  </TouchableOpacity>
);

type schoolList = {
  schoolList : SchoolType[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};
interface SchoolsScreenProps {
  navigation: SchoolsNavigationProp;
  route: SchoolsRouteProp;
}

const School: FC<SchoolsScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<SchoolType>();
  const [schoolList, setSchoolList] = useState<schoolList>();
  const [search, setSearch] = useState<string>('');

  const dispatch = useAppDispatch();
  const {allSchools,activeSchools,inactiveSchools} = useAppSelector(state => state.master);

  const tabs: ItemType[] = [
    {label: `All (${allSchools?.totalCount||''})`, value: 'all'},
    {label: `Active (${activeSchools?.totalCount||''})`, value: 'active'},
    {label: `Inactive (${inactiveSchools?.totalCount||''})`, value: 'inactive'},
  ];

  useEffect(() => {
    if (allSchools) {
      setSchoolList({
        schoolList: allSchools?.dataList,
        count: allSchools.totalCount,
        selectedTab: 'all',
      });
    }
  }, [allSchools]);


  useEffect(() => {
    if (activeSchools) {
      setSchoolList({
        schoolList: activeSchools?.dataList,
        count: activeSchools.totalCount,
        selectedTab: 'all',
      });
    }
  }, [activeSchools]);


  useEffect(() => {
    if (inactiveSchools) {
      setSchoolList({
        schoolList: inactiveSchools?.dataList,
        count: inactiveSchools.totalCount,
        selectedTab: 'all',
      });
    }
  }, [inactiveSchools]);

  useEffect(() => {
    dispatch(
      getSchools({
        page: 0,
        size: 10,
        type: 'all',
      }),
    );
    dispatch(
      getSchools({
        page: 0,
        size: 10,
        type: true,
      }),
    );
    dispatch(
      getSchools({
        page: 0,
        size: 10,
        type: false,
      }),
    );
  }, []);

  const handleTabClick = (title: ItemType) => {
    if (title.value == 'all') {
      setSchoolList({
        schoolList: allSchools?.dataList,
        count: allSchools?.totalCount,
        selectedTab: 'all',
      });
    } else if (title.value == 'active') {
      setSchoolList({
        schoolList: activeSchools?.dataList,
        count: activeSchools?.totalCount,
        selectedTab: true,
      });
    } else {
      setSchoolList({
        schoolList: inactiveSchools?.dataList,
        count: inactiveSchools?.totalCount,
        selectedTab: false,
      });
    }
  };


  const filteredSchool = schoolList?.schoolList?.filter(item =>
    item?.districtName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Schools"
      icon="school_icon"
      focusedStack="LocationManagementStack"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Schools
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
        {filteredSchool ? (
          filteredSchool.length > 0 ? (
            <View>
            {filteredSchool?.map(item => (
              <SchoolTile
                school={item}
                onPressItem={schoolList => {
                  setSelectedItem(schoolList);
                }}
                selectedItem={selectedItem}
              />
            ))}
            <PaginationBar
                count={(schoolList?.count || 0) / 10}
                onPressPageIndex={index => {
                  dispatch(
                    getSchools({
                      page: index,
                      size: 10,
                      type: schoolList?.selectedTab || 'all',
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
export default School;
