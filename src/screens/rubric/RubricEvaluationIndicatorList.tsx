import React, {FC, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import Image from '../../components/Image';
import Text from '../../components/Text';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  RubricIndicatorItem,
  getRubric,
  updateRubric,
} from '../../redux/features/rubricSlice';
import RubricIndicatorList from '../../components/RubricIndicatorList';
import SearchWithFilter from '../../components/SearchWithFilter';
import {RubricStackParamList} from '../../navigation/RubricStack';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';

type RubricEvaluationIndicatorListNavigationProp = StackNavigationProp<
  RubricStackParamList,
  'RubricEvaluationIndicatorList'
>;
type RubricEvaluationIndicatorListRouteProp = RouteProp<
  RubricStackParamList,
  'RubricEvaluationIndicatorList'
>;

interface RubricEvaluationIndicatorListScreenProps {
  navigation: RubricEvaluationIndicatorListNavigationProp;
  route: RubricEvaluationIndicatorListRouteProp;
}
const RubricEvaluationIndicatorList: FC<
  RubricEvaluationIndicatorListScreenProps
> = ({navigation, route}) => {
  const {rubricItem} = route.params;
  const [search, setSearch] = useState<string>('');
  const {rubric,updateRubricResponse} = useAppSelector(state => state.rubric);
  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRubric(rubricItem.rubricId));
  }, [updateRubricResponse]);

  const onPressDeleteIndicator = (RubricIndicatorItem: RubricIndicatorItem) => {
    dispatch(
      updateRubric([rubricItem.rubricId,{
        rubricName: rubricItem.rubricName,
        indicatorRequestList:
          rubric?.dataList?.indicators
            ?.filter(
              indicator =>
                indicator.indicatorId !== RubricIndicatorItem.indicatorId,
            )
            .map(item => ({
              indicatorName: item.indicatorName,
              indicatorDescription: item.indicatorDescription,
              indicatorId: item.indicatorId,
              domainId: item.domainId,
              loggedInUserName: userData.userName,
              tagIds: item.tags.map(ele => ele.tagId),
            })) || [],
        loggedInUserName: userData.userName,
      }]),
    );
  };

  const filteredIndicatorList = rubric?.dataList?.indicators?.filter(item =>
    item?.domainName
      ?.toLocaleLowerCase()
      ?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title={rubricItem.rubricName}
      icon="evaluation_icon"
      focusedStack="RubricStack">
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image name={'list_icon'} />
          <Text fontVariant="bold" size="body2" style={{marginLeft: 10}}>
            Indicator list
          </Text>
          <Text style={{marginLeft: 3}} size="verysmall3">
            (Last update:{' '}
            {moment(rubric?.dataList?.createdDate).format('DD/MM/YYYY')} by
            {rubric?.dataList?.createdBy})
          </Text>
        </View>
        <SearchWithFilter
          placeHolder="Search domain"
          onTextChange={(text) => {setSearch(text)}}
          onProceed={() => {}}
          filterNotNeeded
        />
        <View style={{marginBottom: 15}}>
          {filteredIndicatorList ? (
            filteredIndicatorList?.length > 0 ? (
              filteredIndicatorList?.map(item => (
                <RubricIndicatorList
                  active={item.status}
                  createdBy={item.createdBy}
                  createdDate={moment(item.createdDate).format('DD/MM/YYYY')}
                  title={item.indicatorName}
                  onDelete={() => {
                    onPressDeleteIndicator(item);
                  }}
                  key={item.indicatorId}
                  onPress={() => {
                    navigation.navigate('RubricIndicatorDescription', {
                      indicator: item,
                      title: rubricItem.rubricName,
                    });
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
      </View>
    </Layout>
  );
};
export default RubricEvaluationIndicatorList;
