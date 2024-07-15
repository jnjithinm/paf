import React, {FC, useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {
  assignFlowToUsersAndGroups,
  getFlowById,
  resetAssignFlowResponse,
} from '../../redux/features/flowsSlice';
import {FlowsAndFormsStackParamList} from '../../navigation/FlowsAndFormsStack';

import Modal from '../../components/Modal';
import {
  FloatingButton,
  RenderEmptyPlaceholder,
} from '../observation/ObservationReportsMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';
import {resetAssignFormResponse} from '../../redux/features/formsSlice';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {FormItemTile} from '../flowsAndForms/FormList';

type FormListNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'FormsListAnalytics'
>;
type FormListRouteProp = RouteProp<
  AnalyticsStackParamList,
  'FormsListAnalytics'
>;

interface FormListScreenProps {
  navigation: FormListNavigationProp;
  route: FormListRouteProp;
}

const FormsListAnalytics: FC<FormListScreenProps> = ({navigation, route}) => {
  const {flowItem} = route.params;

  const [isAssignFlowModalVisible, setIsAssignFlowModalVisible] =
    useState<boolean>(false);
  const [isVisibleAssignFormSuccessModal, setIsVisibleAssignFormSuccessModal] =
    useState<boolean>(false);

  const [search, setSearch] = useState<string>('');

  const {flowById, assignFlowResponse} = useAppSelector(state => state.flows);
  const {userData, isAdmin} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(
        getFlowById([
          flowItem.flowId,
          userData.id,
          {
            page: 0,
            size: 15,
            type: 'all',
          },
        ]),
      );
      dispatch(resetAssignFormResponse());
    }, []),
  );

  useEffect(() => {
    if (assignFlowResponse) {
      setIsVisibleAssignFormSuccessModal(true);
    }
  }, [assignFlowResponse]);

  const onPressAssignFlow = (
    selectedUsers: number[],
    selectedUserGroups: number[],
  ) => {
    setIsAssignFlowModalVisible(false);
    dispatch(
      assignFlowToUsersAndGroups({
        userIds: selectedUsers,
        userGroupIds: selectedUserGroups,
        loggedInUserName: userData.userName,
        flowId: flowItem.flowId,
      }),
    );
  };

  const filteredFlows = flowById?.dataList?.filter(item =>
    item?.formName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title={flowItem.flowName}
        isActive={flowItem.status ? 'Active' : 'Inactive'}>
        <SearchWithFilter
          onTextChange={text => {
            setSearch(text);
          }}
          onProceed={() => {}}
          filterNotNeeded
        />
        <View>
          {filteredFlows ? (
            filteredFlows.length > 0 ? (
              filteredFlows?.map(item => (
                <FormItemTile
                  title={item.formName}
                  onPressItem={() => {
                    navigation.navigate('FormResponsesAnalytics', {
                      flowDetailItem: item,
                    });
                  }}
                  key={item.formId}
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
export default FormsListAnalytics;
