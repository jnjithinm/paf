import React, {FC, useEffect, useState} from 'react';
import { View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import RubricListModal from '../../components/RubricListModal';
import {RubricTabBarStackParamList} from '../../navigation/RubricTabStack';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  RubricItem,
  deleteRubric,
  getAllRubrics,
} from '../../redux/features/rubricSlice';
import Text from '../../components/Text';

type RubricMainPageNavigationProp = StackNavigationProp<
  RubricTabBarStackParamList,
  'RubricMainPage'
>;
type RubricMainPageRouteProp = RouteProp<
  RubricTabBarStackParamList,
  'RubricMainPage'
>;

interface RubricMainPageScreenProps {
  navigation: RubricMainPageNavigationProp;
  route: RubricMainPageRouteProp;
}

export const tabs: string[] = ['All', 'Active', 'Non-Active'];

const RubricMainPage: FC<RubricMainPageScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setRubricListData] = useState<RubricItem[]>([]);

  const {allRubrics, deleteSuccess} = useAppSelector(
    state => state.rubric,
  );
  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const deleteItem = () => {
    console.log('delete press');
  };

  const handleTabClick = (title: string) => {
    if (allRubrics?.dataList) {
      title == 'Active'
        ? setRubricListData(
            allRubrics?.dataList?.filter(item => item.status === true),
          )
        : title == 'Non-Active'
        ? setRubricListData(
            allRubrics?.dataList.filter(item => item.status === false),
          )
        : setRubricListData(allRubrics?.dataList);
    }
  };

  useEffect(() => {
    if (allRubrics) {
      setRubricListData(allRubrics.dataList);
    }
  }, [allRubrics]);

  useEffect(() => {
    dispatch(
      getAllRubrics({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  const onPressDeleteRubric = (item: RubricItem) => {
    dispatch(
      deleteRubric({ids: [item.rubricId], loggedInUserName: userData.userName}),
    );
  };

  useEffect(() => {
    if (deleteSuccess) {
      dispatch(
        getAllRubrics({
          page: 0,
          size: 15,
          type: 'all',
        }),
      );
    }
  }, [deleteSuccess]);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Evaluation Rubrics"
      icon="evaluation_icon"
      titleTransition
    >
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Evaluation Rubrics
        </Text>
      <View style={{marginVertical: 10}}>
        <Tab tabs={tabs} onClick={title => handleTabClick(title)} />

        {rubricListData.map(item => (
          <RubricListModal
            active={item.status}
            createdBy={item.createdBy}
            createdDate={moment(item.createdDate).format('DD/MM/YYYY')}
            title={item.rubricName}
            userCount={item.groupUsers}
            onDelete={() => {
              onPressDeleteRubric(item);
            }}
            key={item.rubricId}
            onPress={() => {
              navigation.navigate('RubricEvaluationIndicatorList', {
                rubric: item,
              });
            }}
          />
        ))}
      </View>
    </Layout>
  );
};
export default RubricMainPage;
