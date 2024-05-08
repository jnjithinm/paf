import React, { FC, useEffect, useState } from 'react';
import { TextInput, StyleSheet, View, ViewStyle, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { DashboardTabBarStackParamList } from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import SearchFilter from '../../components/SearchFilter';
import Image from '../../components/Image';

import RubricListModal from '../../components/RubricListModal';

import Text from '../../components/Text';

type ObservationReportNavigationProp = StackNavigationProp<
  DashboardTabBarStackParamList,
  'RubricSubDashboard'
>;
type ObservationReportRouteProp = RouteProp<
  DashboardTabBarStackParamList,
  'RubricSubDashboard'
>;

interface ObservationReportScreenProps {
  navigation: ObservationReportNavigationProp;
  route: ObservationReportRouteProp;
}
const RubricSubDashboard: FC<ObservationReportScreenProps> = ({
  navigation,
  route,
}) => {

  const tabs: string[] = ['All', 'Active', 'Non-Active'];
  const rubricData = [
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => { }, // You can define your delete handler here
      key: '1',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => { }, // You can define your delete handler here
      key: '2',
    },
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => { }, // You can define your delete handler here
      key: '3',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => { }, // You can define your delete handler here
      key: '4',
    },
    // Add more items as needed
  ];


  const [rubricListData, setrubricListData] = useState<any[]>([]);



  const deleteItem = () => {
    console.log("delete press");

  }

  const handleTabClick = (title: string) => {
    title == 'Active' ?
      setrubricListData(rubricData.filter(item => item.active)) :
      title == 'Non-Active' ?
        setrubricListData(rubricData.filter(item => item.active == false)) :
        setrubricListData(rubricData)
  };

  useEffect(() => {
    setrubricListData(rubricData)
  }, [])

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{ paddingHorizontal: 15 }}
      title='Evaluation Rubrics'
    >
      <View style={{ marginVertical: 10, }}>
        
        <SearchFilter
          placeholder='Search domain'
        />

        <View style={{flexDirection: 'row'}}>
          <Image name={'list_icon'} />

        </View>

        <Tab tabs={tabs} onClick={(title) => handleTabClick(title)} />

        <FlatList
          data={rubricListData}
          extraData={rubricListData}
          style={{ marginTop: 20 }}
          renderItem={({ item }) => (

            <RubricListModal
              active={item.active}
              createdBy={item.createdBy}
              createdDate={item.createdDate}
              title={item.title}
              userCount={item.userCount}
              onDelete={item.onDelete}
              key={item.key}
            />

          )}
        />
      </View>

    </Layout>
  );
};
export default RubricSubDashboard;

const styles = StyleSheet.create({

});