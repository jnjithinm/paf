import React, {FC, useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {RubricItem, getAllRubrics} from '../../redux/features/rubricSlice';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import {normaliseFont} from '../../utils/helpers/responsiveHelpers';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';

type AdminFormListNavigationProp = StackNavigationProp<
  AdminTabStackTabBarStackParamList,
  'AdminFormList'
>;
type AdminFormListRouteProp = RouteProp<
  AdminTabStackTabBarStackParamList,
  'AdminFormList'
>;

type RenderFormItemTypes = {
  title: string;
  onPressItem: () => void;
};

const RenderFormItem: FC<RenderFormItemTypes> = ({title, onPressItem}) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
    }}
    onPress={onPressItem}>
    <Icon name="form_list" />
    <Text style={{marginLeft: 10}} fontVariant="bold">
      {title}
    </Text>
  </TouchableOpacity>
);

interface AdminFormListScreenProps {
  navigation: AdminFormListNavigationProp;
  route: AdminFormListRouteProp;
}

const AdminFormList: FC<AdminFormListScreenProps> = ({navigation, route}) => {
  const [rubricListData, setRubricListData] = useState<RubricItem[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const {allRubrics, deleteSuccess} = useAppSelector(state => state.rubric);
  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const deleteItem = () => {
    console.log('delete press');
  };

  const handleTabClick = (title: string) => {
    if (allRubrics?.dataList) {
      title == 'Active'
        ? setRubricListData(
            allRubrics?.dataList?.filter(item => item.status === true),
          )
        : title == 'Non-Active'
        ? setRubricListData(
            allRubrics?.dataList.filter(item => item.status === false),
          )
        : setRubricListData(allRubrics?.dataList);
    }
  };

  useEffect(() => {
    if (allRubrics) {
      setRubricListData(allRubrics?.dataList);
    }
  }, [allRubrics]);

  useEffect(() => {
    dispatch(
      getAllRubrics({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(
        getAllRubrics({
          page: 0,
          size: 15,
          type: 'all',
        }),
      );
    }
  }, [deleteSuccess]);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Evaluation Rubrics">
      <View style={{marginVertical: 10}}>
        <Tab
          tabs={['Form list', 'Responses']}
          textStyle={{fontSize: normaliseFont(12)}}
          onClick={title => handleTabClick(title)}
        />

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginVertical: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '85%',
              backgroundColor: '#F5F7FA',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <TextInput
              style={{flex: 1, color: colors.blackColor, paddingVertical: 5}}
              placeholder="Search"
              placeholderTextColor={colors.darkGrey}
            />
            <Icon name="search_icon" />
          </View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: colors.primaryColor,
              padding: 8,
              borderRadius: 10,
            }}
            onPress={() => {
              setIsFilterOpen(true);
            }}>
            <Icon name="filter_icon" />
          </TouchableOpacity>
        </View>
        <RenderFormItem
          title="Teacher Observation 1"
          onPressItem={() => {
            navigation.navigate('AdminFormResponses');
          }}
        />
      </View>
    </Layout>
  );
};
export default AdminFormList;
