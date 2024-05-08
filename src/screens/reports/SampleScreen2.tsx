import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import { DashboardTabBarStackParamList } from '../../navigation/DashboardTabStack';
import Layout from '../../components/Layout';


type SampleScreen2NavigationProp = StackNavigationProp<
DashboardTabBarStackParamList,
  'SampleScreen2'
>;
type SampleScreen2RouteProp = RouteProp<
DashboardTabBarStackParamList,
  'SampleScreen2'
>;

interface SampleScreen2ScreenProps {
  navigation: SampleScreen2NavigationProp;
  route: SampleScreen2RouteProp;
}


const SampleScreen: FC<SampleScreen2ScreenProps> = ({
  navigation,
  route,
}) => {


  return (
    <Layout overridePaddingHorizontal overridePaddingVertical>

    </Layout>
  );
};
export default SampleScreen;
