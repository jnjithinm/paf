import React, {FC, useEffect} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import SearchFilter from '../../components/SearchFilter';
import Image from '../../components/Image';
import Text from '../../components/Text';
import {RubricTabBarStackParamList} from '../../navigation/RubricTabStack';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {getRubric} from '../../redux/features/rubricSlice';
import RubricIndicatorList from '../../components/RubricIndicatorList';


type RubricEvaluationIndicatorListNavigationProp = StackNavigationProp<
  RubricTabBarStackParamList,
  'RubricEvaluationIndicatorList'
>;
type RubricEvaluationIndicatorListRouteProp = RouteProp<
  RubricTabBarStackParamList,
  'RubricEvaluationIndicatorList'
>;

interface RubricEvaluationIndicatorListScreenProps {
  navigation: RubricEvaluationIndicatorListNavigationProp;
  route: RubricEvaluationIndicatorListRouteProp;
}
const RubricEvaluationIndicatorList: FC<RubricEvaluationIndicatorListScreenProps> = ({
  navigation,
  route,
}) => {
  const {rubric} = route.params;

  const {rubricData} = useAppSelector(state => state.rubric);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRubric(rubric.rubricId));
  }, []);

  const onPressDeleteIndicator = () => {};

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title={rubric.rubricName}
      icon="evaluation_icon">
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
        <View style={{marginVertical:10}}>
        {rubricData?.dataList.indicators?.map(item => (
          <RubricIndicatorList
            active={item.status}
            createdBy={item.createdBy}
            createdDate={moment(item.createdDate).format('DD/MM/YYYY')}
            title={item.indicatorName}
            onDelete={() => {
              onPressDeleteIndicator();
            }}
            key={item.indicatorId}
            onPress={() => {
              navigation.navigate(
                'RubricIndicatorDescription',
                {indicator: item,title:rubric.rubricName},
              );
            }}
          />
        ))}
        </View>
      </View>
    </Layout>
  );
};
export default RubricEvaluationIndicatorList;
