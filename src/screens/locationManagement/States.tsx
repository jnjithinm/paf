import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {LocationManagementStackParamList} from '../../navigation/LocationManagementStack';
import {State, getStates} from '../../redux/features/masterSlice';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import Tab from '../../components/Tab';
import { tabs } from '../userManagement/UsersMainPage';
import { ItemType } from '../../config/types';

type StatesNavigationProp = StackNavigationProp<
  LocationManagementStackParamList,
  'States'
>;
type StatesRouteProp = RouteProp<LocationManagementStackParamList, 'States'>;

interface StatesScreenProps {
  navigation: StatesNavigationProp;
  route: StatesRouteProp;
}

type StateTileTypes = {
  state: State;
};
const StateTile: FC<StateTileTypes> = ({state}) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <View style={{padding: 5, backgroundColor: '#FCEBC5', borderRadius: 5}}>
      <Text size="small3" fontVariant="bold">
        {state.stateCode}
      </Text>
    </View>
    <Text style={{marginLeft: 10}} fontVariant="bold">
      {state.stateName}
    </Text>
  </View>
);

const States: FC<StatesScreenProps> = ({navigation, route}) => {
  const [selectedItem, setSelectedItem] = useState<State>();
  const [statesList, setStatesList] = useState<State[]>();
  const [search, setSearch] = useState<string>('');

  const {states} = useAppSelector(state => state.master);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (states) {
      setStatesList(states?.dataList);
    }
  }, [states]);

  useEffect(() => {
    dispatch(
      getStates({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);




  const filteredStates = states?.dataList?.filter(item =>
    item?.stateName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="States"
      icon="states_icon"
      focusedStack='LocationManagementStack'
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        States
      </Text>
      <SearchWithFilter
        onTextChange={text => {
          setSearch(text);
        }}
        onProceed={filter => {}}
        style={{marginVertical: 10}}
        filterNotNeeded
      />
      <View style={{marginBottom:15}}>
        {filteredStates ? (
          filteredStates.length > 0 ? (
            filteredStates.map(item => (
              <StateTile state={item} key={item.stateId} />
            ))
          ) : (
            <RenderEmptyPlaceholder />
          )
        ) : (
          <></>
        )}
      </View>
    </Layout>
  );
};
export default States;
