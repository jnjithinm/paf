import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {DashboardTabBarStackParamList} from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {rubricData, tabs} from '../rubric/RubricDashboard';

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
    <Layout overridePaddingHorizontal overridePaddingVertical icon={'search_reports_icon'}>
      <Tab tabs={tabs} onClick={title => handleTabClick(title)} />
    </Layout>
  );
};
export default ReportsMainPage;
