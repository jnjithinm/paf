import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {normaliseFont} from '../../utils/helpers/responsiveHelpers';
import Text from '../../components/Text';
import {
  FlowItem,
  deleteFlow,
  getAllFlows,
} from '../../redux/features/flowsSlice';
import {styles} from '../../components/RubricListModal';
import {FlowsAndFormsStackParamList} from '../../navigation/FlowsAndFormsStack';
import SearchWithFilter from '../../components/SearchWithFilter';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsStack';
import { FlowsItem } from '../flowsAndForms/FlowsMainPage';

type FlowsMainPageNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'FlowsListAnalytics'
>;
type FlowsMainPageRouteProp = RouteProp<
AnalyticsStackParamList,
  'FlowsListAnalytics'
>;

interface FlowsMainPageScreenProps {
  navigation: FlowsMainPageNavigationProp;
  route: FlowsMainPageRouteProp;
}


const FlowsListAnalytics: FC<FlowsMainPageScreenProps> = ({navigation, route}) => {
  const [search, setSearch] = useState<string>('');



  const {allFlows} = useAppSelector(
    state => state.flows,
  );
  const {userData, } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();



  useEffect(() => {
    dispatch(
      getAllFlows([
        userData.userName,
        userData.id,
        {
          page: 0,
          size: 15,
          type: 'all',
        },
      ]),
    );

  }, []);


  const filteredFlows = allFlows?.dataList?.filter(item =>
    item?.flowName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title="Flows"
        icon="flow_icon"
        focusedStack="FlowsAndFormsStack"
        titleTransition>
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Flows
        </Text>
        <View style={{marginVertical: 10}}>
   

          <SearchWithFilter
            filterNotNeeded
            onTextChange={text => {
              setSearch(text);
            }}
            onProceed={() => {}}
          />

          {filteredFlows ? (
            filteredFlows.length > 0 ? (
              filteredFlows
                ?.filter(item =>
                  item.flowName
                    ?.toLocaleLowerCase()
                    ?.includes(search?.toLocaleLowerCase()),
                )
                ?.map(ele => (
                  <FlowsItem
                    active={ele.status}
                    createdBy={ele.createdBy}
                    createdDate={moment(ele.createdDate).format('DD/MM/YYYY')}
                    title={ele.flowName}
                    userCount={ele.responses}
                    key={ele.flowId}
                    onPress={() => {
                      navigation.navigate('FormsListAnalytics', {flowItem: ele});
                    }}
                  />
                ))
            ) : (
              <RenderEmptyPlaceholder />
            )
          ) : (
            <></>
          )}
        </View>
      </Layout>
    </>
  );
};
export default FlowsListAnalytics;
