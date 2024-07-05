import React, {FC, useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
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
import {
  RenderAssignFormModalContent,
  RenderSuccessModalContent,
} from './FormResponses';
import Modal from '../../components/Modal';
import {
  FloatingButton,
  RenderEmptyPlaceholder,
} from '../observation/ObservationReportsMainPage';
import SearchWithFilter from '../../components/SearchWithFilter';

type FormListNavigationProp = StackNavigationProp<
  FlowsAndFormsStackParamList,
  'FormList'
>;
type FormListRouteProp = RouteProp<FlowsAndFormsStackParamList, 'FormList'>;

type RenderFormItemTypes = {
  title: string;
  onPressItem: () => void;
};

const RenderFormItem: FC<RenderFormItemTypes> = ({title, onPressItem}) => (
  <TouchableOpacity
    style={{
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
    }}
    onPress={onPressItem}>
    <Icon name="form_list" />
    <Text style={{marginLeft: 10}} fontVariant="bold">
      {title}
    </Text>
  </TouchableOpacity>
);

interface FormListScreenProps {
  navigation: FormListNavigationProp;
  route: FormListRouteProp;
}

const FormList: FC<FormListScreenProps> = ({navigation, route}) => {
  const {flowItem} = route.params;

  const [isAssignFlowModalVisible, setIsAssignFlowModalVisible] =
    useState<boolean>(false);
  const [isVisibleAssignFormSuccessModal, setIsVisibleAssignFormSuccessModal] =
    useState<boolean>(false);

  const [search, setSearch] = useState<string>('');
  const {flowById, assignFlowResponse} = useAppSelector(state => state.flows);
  const {userData, isAdmin} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    
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
  }, []);

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
        formId: flowItem.flowId,
      }),
    );
  };

  const filteredFlows = flowById?.dataList?.filter(item =>
    item?.flowName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title={flowItem.flowName}>
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsAssignFlowModalVisible(false);
          }}
          isVisible={isAssignFlowModalVisible}
          title="Assign flow"
          closeButton
          contentStyle={{width: '100%'}}
          content={
            <RenderAssignFormModalContent onPressAssign={onPressAssignFlow} />
          }
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsVisibleAssignFormSuccessModal(false);
            dispatch(resetAssignFlowResponse());
          }}
          closeButton
          content={
            <RenderSuccessModalContent
              icon="flow_icon"
              highlightText="Success!"
              descriptionText="Flow assigned to selected user and user groups."
            />
          }
          isVisible={isVisibleAssignFormSuccessModal}
          containerStyle={{justifyContent: 'center'}}
          contentStyle={{width: '70%'}}
        />

        <SearchWithFilter
          onTextChange={text => {
            setSearch(text);
          }}
          onProceed={() => {}}
          filterNotNeeded
        />
        <View>
          {filteredFlows ?  filteredFlows.length > 0 ? (
            filteredFlows?.map((item, index) => (
              <RenderFormItem
                title={item.formName}
                onPressItem={() => {
                  isAdmin
                    ? navigation.navigate('FormResponses', {
                        flowDetailItem: item,
                      })
                    : navigation.navigate('EvaluationForm', {
                        flowDetailItem: item,
                        flowItem,
                      });
                }}
                key={index}
              />
            ))
          ) : (
            <RenderEmptyPlaceholder />
          ):<></>}
        </View>
      </Layout>
      {isAdmin && (
        <FloatingButton
          icon="user_and_usergroup_icon"
          onPress={() => {
            setIsAssignFlowModalVisible(true);
          }}
          iconSize={20}
        />
      )}
    </>
  );
};
export default FormList;
