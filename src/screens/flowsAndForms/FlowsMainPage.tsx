import React, {FC, useEffect, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  RubricItem,
  deleteRubric,
  getAllRubrics,
} from '../../redux/features/rubricSlice';

import {normaliseFont} from '../../utils/helpers/responsiveHelpers';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import {
  assignFlowToUsersAndGroups,
  getAllFlows,
  resetAssignFlowResponse,
} from '../../redux/features/flowsSlice';
import {styles} from '../../components/RubricListModal';
import {FloatingButton} from '../observation/ObservationReportsMainPage';
import Modal from '../../components/Modal';
import {
  RenderAssignFormModalContent,
  RenderSuccessModalContent,
} from './FormResponses';
import {FlowsAndFormsStackParamList} from '../../navigation/FlowsAndFormsStack';

type FlowsMainPageNavigationProp = StackNavigationProp<
  FlowsAndFormsStackParamList,
  'FlowsMainPage'
>;
type FlowsMainPageRouteProp = RouteProp<
  FlowsAndFormsStackParamList,
  'FlowsMainPage'
>;

interface FlowsMainPageScreenProps {
  navigation: FlowsMainPageNavigationProp;
  route: FlowsMainPageRouteProp;
}

interface FlowsItemProps {
  title: string;
  active: boolean;
  createdBy: string;
  createdDate: string;
  userCount: number;
  onDelete: () => void;
  onPress: () => void;
  isAdmin: boolean;
}

const FlowsItem: React.FC<FlowsItemProps> = ({
  title,
  active,
  createdBy,
  createdDate,
  userCount,
  onDelete,
  onPress,
  isAdmin,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.titleContainer]}>
        <View style={{width: '68%'}}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        </View>
        <View
          style={{
            width: '32%',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: active ? '#EBF9D9' : '#FFEDED',
              borderRadius: 7,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 3,
              paddingHorizontal: 7,
            }}>
            <View
              style={[
                styles.dot,
                {backgroundColor: active ? '#749E35' : '#D62828'},
              ]}
            />
            <Text style={{color: active ? '#749E35' : '#D62828'}} size="small2">
              {active ? ' Active' : ' Inactive'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <View style={{flexDirection: 'row', width: '80%'}}>
          <View style={styles.detailsInnerContainer}>
            <Text style={styles.heading}>Created by</Text>
            <Text style={styles.subHeading}>{createdBy}</Text>
          </View>
          <View style={[styles.detailsInnerContainer, {width: '40%'}]}>
            <Text style={styles.heading}>Creation Date</Text>
            <Text style={styles.subHeading}> {createdDate}</Text>
          </View>
          <View style={styles.detailsInnerContainer}>
            <Text style={styles.heading}>Users</Text>
            <Text style={styles.subHeading}> {userCount}</Text>
          </View>
        </View>
        {isAdmin && (
          <View style={styles.deleteButton}>
            <TouchableOpacity onPress={onDelete}>
              <Icon name="trash_icon" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const FlowsMainPage: FC<FlowsMainPageScreenProps> = ({navigation, route}) => {
  const [isAssignFlowModalVisible, setIsAssignFlowModalVisible] =
    useState<boolean>(false);
  const [isVisibleAssignFormSuccessModal, setIsVisibleAssignFormSuccessModal] =
    useState<boolean>(false);
  const {allFlows, assignFlowResponse} = useAppSelector(state => state.flows);
  const {userData, isAdmin} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const handleTabClick = (title: string) => {};

  useEffect(() => {
    dispatch(
      getAllFlows([
        userData.userName,
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

  const onPressDeleteRubric = (item: RubricItem) => {
    dispatch(
      deleteRubric({ids: [item.rubricId], loggedInUserName: userData.userName}),
    );
  };

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
        id: userData.id,
      }),
    );
  };

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
              descriptionText="Form assigned to selected user and user groups."
            />
          }
          isVisible={isVisibleAssignFormSuccessModal}
          containerStyle={{justifyContent: 'center'}}
          contentStyle={{width: '70%'}}
        />
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Flows
        </Text>
        <View style={{marginVertical: 10}}>
          <Tab
            tabs={[
              {value: 'All', label: 'All'},
              {value: 'Owned by me(20)', label: 'Owned by me(20'},
              {value: 'Not owned by me(20)', label: 'Not owned by me(20)'},
            ]}
            textStyle={{fontSize: normaliseFont(12)}}
            onClick={title => handleTabClick(title?.value)}
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

          {allFlows?.dataList?.map(item => (
            <FlowsItem
              active={item.status}
              createdBy={item.createdBy}
              createdDate={moment(item.createdDate).format('DD/MM/YYYY')}
              title={item.flowName}
              userCount={55}
              onDelete={() => {
                // onPressDeleteRubric(item);
              }}
              key={item.flowId}
              onPress={() => {
                navigation.navigate('FormListAndResponses', {flowItem: item});
              }}
              isAdmin={isAdmin}
            />
          ))}
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
export default FlowsMainPage;
