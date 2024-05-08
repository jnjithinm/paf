import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { DashboardTabBarStackParamList } from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';


type SampleScreenNavigationProp = StackNavigationProp<
DashboardTabBarStackParamList,
  'SampleScreen'
>;
type SampleScreenRouteProp = RouteProp<
DashboardTabBarStackParamList,
  'SampleScreen'
>;

interface SampleScreenScreenProps {
  navigation: SampleScreenNavigationProp;
  route: SampleScreenRouteProp;
}


const SampleScreen: FC<SampleScreenScreenProps> = ({
  navigation,
  route,
}) => {


  return (
    <Layout overridePaddingHorizontal overridePaddingVertical>

    </Layout>
  );
};
export default SampleScreen;
