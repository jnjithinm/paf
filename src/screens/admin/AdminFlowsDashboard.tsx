import React, {FC, useEffect, useState} from 'react';
import {TextInput, View} from 'react-native';
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
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import {normaliseFont} from '../../utils/helpers/responsiveHelpers';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';

type ObservationReportNavigationProp = StackNavigationProp<
  AdminTabStackTabBarStackParamList,
  'AdminFlowsDashboard'
>;
type ObservationReportRouteProp = RouteProp<
  AdminTabStackTabBarStackParamList,
  'AdminFlowsDashboard'
>;

interface ObservationReportScreenProps {
  navigation: ObservationReportNavigationProp;
  route: ObservationReportRouteProp;
}

const AdminFlowsDashboard: FC<ObservationReportScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setrubricListData] = useState<RubricItem[]>([]);

  const {allRubrics, rubricDeletedMessage} = useAppSelector(
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
        ? setrubricListData(
            allRubrics?.dataList?.filter(item => item.status === true),
          )
        : title == 'Non-Active'
        ? setrubricListData(
            allRubrics?.dataList.filter(item => item.status === false),
          )
        : setrubricListData(allRubrics?.dataList);
    }
  };

  useEffect(() => {
    if (allRubrics) {
      setrubricListData(allRubrics.dataList);
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
    if (rubricDeletedMessage) {
      dispatch(
        getAllRubrics({
          page: 0,
          size: 15,
          type: 'all',
        }),
      );
    }
  }, [rubricDeletedMessage]);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title="Flows"
      icon="flow_icon"
      titleTransition>
      <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
        Flows
      </Text>
      <View style={{marginVertical: 10}}>
        <Tab
          tabs={['All', 'Owned by me(20)', 'Not owned by me(20)']}
          textStyle={{fontSize: normaliseFont(12)}}
          onClick={title => handleTabClick(title)}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F5F7FA',
            borderRadius: 10,
            paddingHorizontal: 10,
            marginVertical: 10,
          }}>
          <TextInput
            style={{flex: 1, color: colors.blackColor, paddingVertical: 5}}
            placeholder="Search by flow name"
            placeholderTextColor={colors.darkGrey}
          />
          <Icon name="search_icon" />
        </View>

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
              navigation.navigate('AdminFormList');
            }}
          />
        ))}
      </View>
    </Layout>
  );
};
export default AdminFlowsDashboard;
