import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {DashboardTabBarStackParamList} from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {rubricData, } from '../rubric/RubricDashboard';
import Text from '../../components/Text';
import Icon from '../../components/Icon';
import colors from '../../config/colors';

type ReportsMainPageNavigationProp = StackNavigationProp<
  DashboardTabBarStackParamList,
  'ReportsMainPage'
>;
type ReportsMainPageRouteProp = RouteProp<
  DashboardTabBarStackParamList,
  'ReportsMainPage'
>;

interface ReportsMainPageScreenProps {
  navigation: ReportsMainPageNavigationProp;
  route: ReportsMainPageRouteProp;
}

const tabs:string[]=['All(20)','By me(60)','For me(60)']
const ReportsMainPage: FC<ReportsMainPageScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setrubricListData] = useState<any[]>([]);
  const handleTabClick = (title: string) => {
    title == 'Active'
      ? setrubricListData(rubricData.filter(item => item.active))
      : title == 'Non-Active'
      ? setrubricListData(rubricData.filter(item => item.active == false))
      : setrubricListData(rubricData);
  };

  return (
    <Layout overridePaddingVertical icon={'search_reports_icon'}>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Observation Reports
      </Text>
      <Tab tabs={tabs} onClick={title => handleTabClick(title)} />
      <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
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
              // onChangeText={text => {
              //   setSearchText(text);
              // }}
            />
            <Icon name="search_icon" />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.primaryColor,
              padding: 8,
              borderRadius: 10,
            }}>
            <Icon name="filter_icon" />
          </View>
        </View>
    </Layout>
  );
};
export default ReportsMainPage;
