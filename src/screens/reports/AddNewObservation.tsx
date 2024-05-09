import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { DashboardTabBarStackParamList } from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';
import Image from '../../components/Image';
// import LabelDropdown, { dropdownObject } from '../../components/LabeledDropdown';
import LabelDropdown, { } from '../../components/LabelDropdown';

import { RubricTabBarStackParamList } from '../../navigation/RubricStack';

type ObservationReportNavigationProp = StackNavigationProp<
  RubricTabBarStackParamList,
  'AddNewObservation'
>;
type ObservationReportRouteProp = RouteProp<
  RubricTabBarStackParamList,
  'AddNewObservation'
>;

interface ObservationReportScreenProps {
  navigation: ObservationReportNavigationProp;
  route: ObservationReportRouteProp;


}

export const tabs: string[] = ['All', 'Active', 'Non-Active'];
export const dropdownData = 
  [
    {label: `What's your pet's name ?`, value: ''},
    {label: `What's your name ?`, value: ''},
    {label: `What's your pet's ?`, value: ''},
  ]
const AddNewObservation: FC<ObservationReportScreenProps> = ({
  navigation,
  route,
}) => {


  const [rubricListData, setrubricListData] = useState<any[]>([]);
  const [userGroup, setUserGroup] = useState<string>('');
  const [user, setUser] = useState<string>('');
  const [data, setDate] = useState<string>('');


  const deleteItem = () => {
    console.log('delete press');
  };

  
  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{ paddingHorizontal: 15 }}
      icon='reports_icon'
      title="New Observation">
      <View style={{ marginVertical: 10 }}>

        <LabelDropdown
          label='Select user group'
          placeHolder='Select user group'
          options={dropdownData}
          setSelectedOption={setUserGroup}
          defaultValue={userGroup}
          bottom
        />
        <LabelDropdown
          label='Select user'
          placeHolder='Select user'
          defaultValue={user}
          options={dropdownData}
          setSelectedOption={setUser}
          bottom
        />
        {/* <FlatList
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
        /> */}
      </View>
    </Layout>
  );
};
export default AddNewObservation;

const styles = StyleSheet.create({

});
