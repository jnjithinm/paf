import React, {FC, useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import {normaliseFont} from '../../utils/helpers/responsiveHelpers';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {getFlowById} from '../../redux/features/flowsSlice';
import {ItemType} from '../../config/types';
import {getRoleLevel} from '../../components/DrawerContent';
import {UserTypes} from '../../config/constants';

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
      marginVertical: 5,
    }}
    onPress={onPressItem}>
    <Icon name="form_list" />
    <Text style={{marginLeft: 10}} fontVariant="bold">
      {title}
    </Text>
  </TouchableOpacity>
);

type FormListResponseTypes = {
  label: string;
  creationDate: string;
  responses: string;
};
const FormListResponse: FC<FormListResponseTypes> = ({
  label,
  creationDate,
  responses,
}) => (
  <TouchableOpacity
    style={{
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }}>
    <Text></Text>
  </TouchableOpacity>
);

const tabs = ['Form list', 'Responses'] as const;
type TabTypes = (typeof tabs)[number];

interface AdminFormListScreenProps {
  navigation: AdminFormListNavigationProp;
  route: AdminFormListRouteProp;
}

const AdminFormList: FC<AdminFormListScreenProps> = ({navigation, route}) => {
  const {flowItem} = route.params;
  const [selectedTab, setSelectedTab] = useState<TabTypes>('Form list');
  const {flowById} = useAppSelector(state => state.flows);
  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleTabClick = (title: ItemType) => {
    setSelectedTab(title.value as TabTypes);
  };

  useEffect(() => {
    dispatch(
      getFlowById([
        flowItem.flowId,
        {
          page: 0,
          size: 15,
          type: 'all',
        },
      ]),
    );
  }, []);


  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title={flowItem.flowName}>
      <View style={{marginVertical: 10}}>
        <Tab
          tabs={[
            {label: 'Form list', value: 'Form list'},
            {label: 'Responses', value: 'Responses'},
          ]}
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
              // setIsFilterOpen(true);
            }}>
            <Icon name="filter_icon" />
          </TouchableOpacity>
        </View>
        {selectedTab === 'Form list' ? (
          <View>
            {flowById?.dataList.map((item, index) => (
              <RenderFormItem
                title={item.formName}
                onPressItem={() => {
                  getRoleLevel(userData?.roleType) === UserTypes.PAF_USER
                    ? 
                    navigation.navigate('AdminFormResponses', {
                        flowDetailItem: item,
                      })
                    :
                     navigation.navigate('EvaluationForm', {
                        flowDetailItem: item,
                      });
                }}
                key={index}
              />
            ))}
          </View>
        ) : (
          <></>
        )}
      </View>
    </Layout>
  );
};
export default AdminFormList;
