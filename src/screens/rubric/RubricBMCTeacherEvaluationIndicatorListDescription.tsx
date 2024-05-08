import React, {FC, useEffect, useState} from 'react';
import {TextInput, StyleSheet, View, ViewStyle, FlatList} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import SearchFilter from '../../components/SearchFilter';
import Image from '../../components/Image';
import RubricIndicatorList from '../../components/RubricIndicatorList';
import Text from '../../components/Text';
import {RubricTabBarStackParamList} from '../../navigation/RubricStack';
import colors from '../../config/colors';
import Icon from '../../components/Icon';

type RubricBMCTeacherEvaluationNavigationProp = StackNavigationProp<
  RubricTabBarStackParamList,
  'RubricBMCTeacherEvaluationIndicatorListDescription'
>;
type RubricBMCTeacherEvaluationRouteProp = RouteProp<
  RubricTabBarStackParamList,
  'RubricBMCTeacherEvaluationIndicatorListDescription'
>;

interface RubricBMCTeacherEvaluationScreenProps {
  navigation: RubricBMCTeacherEvaluationNavigationProp;
  route: RubricBMCTeacherEvaluationRouteProp;
}

type RenderTagsTypes = {
  tags: string;
};
const RenderTags: FC<RenderTagsTypes> = ({tags}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#EA7804',
      backgroundColor: '#FDF0E3',
      padding: 7,
      borderRadius: 7,
      flex: 0,
      margin: 3,
    }}>
    <Text size="small2">{tags}</Text>
    <Icon style={{marginLeft: 3}} name="cross_icon" />
  </View>
);
const RubricBMCTeacherEvaluation: FC<RubricBMCTeacherEvaluationScreenProps> = ({
  navigation,
  route,
}) => {
  const {title, description} = route.params;
  const tabs: string[] = ['All', 'Active', 'Non-Active'];
  const rubricData = [
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
      key: '1',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
      key: '2',
    },
    {
      createdBy: 'admin',
      active: true,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
      userCount: 50,
      onDelete: () => {}, // You can define your delete handler here
      key: '3',
    },
    {
      createdBy: 'admin',
      active: false,
      createdDate: '12/2/2024',
      title: 'Teacher Evaluation Rubric',
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
      title={title}>
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image name={'list_icon'} />
          <Text fontVariant="bold" size="body2" style={{marginLeft: 10}}>
            Indicator list
          </Text>
          <Text style={{marginLeft: 3}} size="verysmall3">
            (Last update: 23/01/2024 by Admin)
          </Text>
        </View>
        <SearchFilter placeholder="Search domain" />

        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Domain</Text>
          <TextInput
            editable={false}
            style={{
              backgroundColor: '#FDF0E3',
              borderWidth: 1,
              borderColor: '#CBD2D9',
              borderRadius: 10,
              color: colors.blackColor,
              padding: 8,
              marginTop: 3,
              height: 40,
            }}
            value={description}
          />
        </View>
        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Tags</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {[
              'Classroom management',
              'User management',
              'Discipline',
              'English Skills',
              'Leadership',
            ].map(item => (
              <RenderTags tags={item} />
            ))}
          </View>
        </View>
        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Indicator</Text>
          <Text size='small3'>
            Lorem ipsum dolor sit amet consectetur. Odio in ipsum tincidunt
            pulvinar. Purus lacus semper interdum tincidunt
          </Text>
        </View>
      </View>
    </Layout>
  );
};
export default RubricBMCTeacherEvaluation;

const styles = StyleSheet.create({});
