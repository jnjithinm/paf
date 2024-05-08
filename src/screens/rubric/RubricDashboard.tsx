import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {DashboardTabBarStackParamList} from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import RubricListModal from '../../components/RubricListModal';
import {RubricTabBarStackParamList} from '../../navigation/RubricStack';

type ObservationReportNavigationProp = StackNavigationProp<
  RubricTabBarStackParamList,
  'RubricDashboard'
>;
type ObservationReportRouteProp = RouteProp<
  RubricTabBarStackParamList,
  'RubricDashboard'
>;

interface ObservationReportScreenProps {
  navigation: ObservationReportNavigationProp;
  route: ObservationReportRouteProp;
}
const RubricDashboard: FC<ObservationReportScreenProps> = ({
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
      onDelete: () => {},
      key: '1',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => {},
      key: '2',
    },
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => {},
      key: '3',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => {},
      key: '4',
    },
    // Add more items as needed
  ];

  const [rubricListData, setrubricListData] = useState<any[]>([]);

  const deleteItem = () => {
    console.log('delete press');
  };

  const handleTabClick = (title: string) => {
    title == 'Active'
      ? setrubricListData(rubricData.filter(item => item.active))
      : title == 'Non-Active'
      ? setrubricListData(rubricData.filter(item => item.active == false))
      : setrubricListData(rubricData);
  };

  useEffect(() => {
    setrubricListData(rubricData);
  }, []);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Evaluation Rubrics">
      <View style={{marginVertical: 10}}>
        <Tab tabs={tabs} onClick={title => handleTabClick(title)} />

        <FlatList
          data={rubricListData}
          extraData={rubricListData}
          style={{marginTop: 20}}
          renderItem={({item}) => (
            <RubricListModal
              active={item.active}
              createdBy={item.createdBy}
              createdDate={item.createdDate}
              title={item.title}
              userCount={item.userCount}
              onDelete={item.onDelete}
              key={item.key}
              onPress={() => {
                navigation.navigate('RubricBMCTeacherEvaluationIndicatorList',{title:item.title})
              }}
            />
          )}
        />
      </View>
    </Layout>
  );
};
export default RubricDashboard;

const styles = StyleSheet.create({
  
});
