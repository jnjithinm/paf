import React, {FC, useEffect, useState} from 'react';
import {TextInput, StyleSheet, View, ViewStyle, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import SearchFilter from '../../components/SearchFilter';
import Image from '../../components/Image';
import RubricIndicatorList from '../../components/RubricIndicatorList';
import Text from '../../components/Text';
import { RubricTabBarStackParamList } from '../../navigation/RubricStack';

type RubricBMCTeacherEvaluationNavigationProp = StackNavigationProp<
RubricTabBarStackParamList,
  'RubricBMCTeacherEvaluationIndicatorList'
>;
type RubricBMCTeacherEvaluationRouteProp = RouteProp<
RubricTabBarStackParamList,
  'RubricBMCTeacherEvaluationIndicatorList'
>;

interface RubricBMCTeacherEvaluationScreenProps {
  navigation: RubricBMCTeacherEvaluationNavigationProp;
  route: RubricBMCTeacherEvaluationRouteProp;
}
const RubricBMCTeacherEvaluation: FC<RubricBMCTeacherEvaluationScreenProps> = ({
  navigation,
  route,
}) => {
  const {title}=route.params;
  const tabs: string[] = ['All', 'Active', 'Non-Active'];
  const rubricData = [
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Ability to manage classroom discipline',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
      key: '1',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Professional Development',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
      key: '2',
    },
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Accountable for their performance',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
      key: '3',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Decision making evaluation',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
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
      title={title}
      icon='evaluation_icon'
      >
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image name={'list_icon'} />
          <Text fontVariant="bold" size="body2" style={{marginLeft: 10}}>
            Indicator list
          </Text>
          <Text style={{marginLeft:3}} size="verysmall3">(Last update: 23/01/2024 by Admin)</Text>
        </View>
        <SearchFilter placeholder="Search domain" />

        <FlatList
          data={rubricListData}
          extraData={rubricListData}
          style={{marginTop: 20}}
          renderItem={({item}) => (
            <RubricIndicatorList
              active={item.active}
              createdBy={item.createdBy}
              createdDate={item.createdDate}
              title={item.title}
              userCount={item.userCount}
              onDelete={item.onDelete}
              key={item.key}
              onPress={()=>{navigation.navigate('RubricBMCTeacherEvaluationIndicatorListDescription',{title:title,description:item.title})}}
            />
          )}
        />
      </View>
    </Layout>
  );
};
export default RubricBMCTeacherEvaluation;

const styles = StyleSheet.create({});
