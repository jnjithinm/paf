import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
  JSX,
} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import {
  normaliseDesigns,
  normaliseFont,
} from '../../utils/helpers/responsiveHelpers';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import FooterWithButtons from '../../components/FooterWithButtons';
import {
  IndividualDescriptionRenderal,
  IndividualMainPageRenderal,
} from './formResponsesRenderals/individualRenderals';
import {
  QuestionWiseDescriptionRenderal,
  QuestionWiseMainPageRenderal,
} from './formResponsesRenderals/questionWiseRenderals';
import {
  RubricWiseDescriptionRenderal,
  RubricWiseMainPageRenderal,
} from './formResponsesRenderals/rubricWiseRenderals';
import Modal from '../../components/Modal';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import {
  getAllUserGroups,
  getAllUsers,
  getPendingUsersListForSendReminder,
} from '../../redux/features/usersSlice';
import Button from '../../components/Button';
import Image, {ImageIconNames} from '../../components/Image';
import {
  IndividualResponse,
  Question,
  acceptingFormResponses,
  assignFormToUsersAndGroups,
  getFormById,
  resetAssignFormResponse,
} from '../../redux/features/formsSlice';
import SearchWithFilter from '../../components/SearchWithFilter';
import {FilterObject} from '../../components/Calendar';
import {
  FlowDetailItem,
  SendReminderMethods,
  resetSendReminderToAllPendingUsers,
  sendReminderToAllPendingUsers,
} from '../../redux/features/flowsSlice';
import {ItemType} from '../../config/types';

type AdminFormResponsesNavigationProp = StackNavigationProp<
  AdminTabStackTabBarStackParamList,
  'AdminFormResponses'
>;
type AdminFormResponsesRouteProp = RouteProp<
  AdminTabStackTabBarStackParamList,
  'AdminFormResponses'
>;

interface AdminFormResponsesScreenProps {
  navigation: AdminFormResponsesNavigationProp;
  route: AdminFormResponsesRouteProp;
}

type ResponseAccessToggleTypes = {
  label: 'Accepting Responses';
  isAcceptingResponses: boolean;
  setIsAcceptingResponses: Dispatch<SetStateAction<boolean>>;
  disabed?: boolean;
};

const ResponseAccessToggle: FC<ResponseAccessToggleTypes> = ({
  label,
  isAcceptingResponses,
  setIsAcceptingResponses,
  disabed = false,
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-end',
      marginTop: 7,
    }}>
    <Text style={{color: '#4E565F', right: 5}} size="small1">
      {label}
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: isAcceptingResponses ? '#EA7804' : colors.darkGrey,
        width: normaliseDesigns(32),
        height: normaliseDesigns(16),
        alignItems: 'center',
        borderRadius: 35,
        justifyContent: 'center',
        paddingHorizontal: 3,
      }}
      onPress={() => {
        if (disabed) {
          return;
        }
        setIsAcceptingResponses(!isAcceptingResponses);
      }}>
      <View
        style={{
          backgroundColor: colors.backgroundColor,
          alignSelf: isAcceptingResponses ? 'flex-end' : 'flex-start',
          width: normaliseDesigns(11),
          height: normaliseDesigns(11),
          borderRadius: 25,
        }}
      />
    </TouchableOpacity>
  </View>
);

const tabs = ['Individual', 'Question Wise', 'Rubric Wise'] as const;

type TabTypes = (typeof tabs)[number];

const screenSelection = ['main', 'detailed'] as const;

type ScreenSelectiontypes = (typeof screenSelection)[number];

type ScreenComponentType = {
  screen: ScreenSelectiontypes;
  setScreen: Dispatch<SetStateAction<ScreenSelectiontypes>>;
  renderal: JSX.Element;
};

type RenderAssignFormModalContentTypes = {
  onPressAssign: (
    selectedUsers: number[],
    selectedUserGroups: number[],
  ) => void;
};

export const RenderAssignFormModalContent: FC<
  RenderAssignFormModalContentTypes
> = ({onPressAssign}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  const {GetAllUserGroupsData, GetAllUserData} = useAppSelector(
    state => state.users,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getAllUsers({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  const handlePress = () => {
    const selectedUsersNumbers = selectedUsers.map(user => parseInt(user, 10));
    const selectedUserGroupsNumbers = selectedUserGroups.map(group =>
      parseInt(group, 10),
    );
    onPressAssign(selectedUsersNumbers, selectedUserGroupsNumbers);
  };
  return (
    <View style={{paddingHorizontal: 10}}>
      <MultiSelectDropdown
        label="Select user"
        options={
          GetAllUserData?.dataList.map(item => ({
            value: item.userId?.toString(),
            label: item.userName,
          })) || []
        }
        selectedValues={selectedUsers}
        setSelectedValues={setSelectedUsers}
      />
      <MultiSelectDropdown
        label="Select user groups"
        options={
          GetAllUserGroupsData?.dataList.map(item => ({
            value: item.userGroupId?.toString(),
            label: item.groupName,
          })) || []
        }
        selectedValues={selectedUserGroups}
        setSelectedValues={setSelectedUserGroups}
      />
      <Button
        text="Assign"
        active={selectedUsers.length !== 0 && selectedUserGroups.length !== 0}
        onPress={handlePress}
        style={{marginTop: normaliseDesigns(100)}}
      />
    </View>
  );
};

type RenderSuccessModalContentTypes = {
  icon: ImageIconNames;
  highlightText?: string;
  descriptionText: string;
};

export const RenderSuccessModalContent: FC<RenderSuccessModalContentTypes> = ({
  icon,
  highlightText = 'Success!',
  descriptionText,
}) => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    }}>
    <Image name="success_icon" />
    <Text size="body2" fontVariant="bold" style={{marginVertical: 5}}>
      {highlightText}
    </Text>
    <Text size="small2" fontVariant="bold" style={{textAlign: 'center'}}>
      {descriptionText}
    </Text>
  </View>
);

type LabeledSingleRadioButtonTypes = {
  value: ItemType;
  selectedValue: ItemType | undefined;
  onValueChange: (value: ItemType) => void;
  active?: boolean;
};

const LabeledSingleRadioButton: FC<LabeledSingleRadioButtonTypes> = ({
  value,
  selectedValue,
  onValueChange,
  active,
}) => {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
      }}>
      <Text size="small3" style={{width: '90%'}}>
        {value.label}
      </Text>
      <View>
        <TouchableOpacity
          key={value.value}
          onPress={() => onValueChange(value)}
          style={[
            {
              width: normaliseDesigns(14),
              height: normaliseDesigns(14),
              borderRadius: 20,
              borderWidth: 1,
              borderColor: '#ABB4BD',
              alignItems: 'center',
              justifyContent: 'center',
            },
            selectedValue === value && {borderColor: '#EA7804'},
          ]}>
          {selectedValue === value && (
            <View
              style={{
                width: normaliseDesigns(9),
                height: normaliseDesigns(9),
                borderRadius: 6,
                backgroundColor: '#EA7804',
              }}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

type RenderSendReminderModalTypes = {
  flowDetailItem: FlowDetailItem;
};

const RenderSendReminderModal: FC<RenderSendReminderModalTypes> = ({
  flowDetailItem,
}) => {
  const [selectedRemindMethod, setSelectedRemindMethod] = useState<ItemType>();
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);

  const dispatch = useAppDispatch();

  const {pendingUsersListForSendReminder} = useAppSelector(
    state => state.users,
  );
  const {userData} = useAppSelector(state => state.auth);

  useEffect(() => {
    if (selectedRemindMethod?.value === 'To All Pending Users') {
      setSelectedUserGroups([]);
    } else if (selectedRemindMethod?.value === 'By Date') {
    } else {
    }
  }, [selectedRemindMethod]);

  useEffect(() => {
    dispatch(getPendingUsersListForSendReminder(flowDetailItem.formId));
  }, []);

  useEffect(() => {
    dispatch(
      getAllUserGroups({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  const handleOnPressSend = () => {
    dispatch(
      sendReminderToAllPendingUsers([
        selectedRemindMethod?.value as SendReminderMethods,
        flowDetailItem.formId,
        userData.userName,
      ]),
    );
  };

  return (
    <View
      style={{
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        width: '100%',
      }}>
      <View style={{width: '100%'}}>
        <LabeledSingleRadioButton
          selectedValue={selectedRemindMethod}
          value={{
            value: 'To All Pending Users',
            label:
              '1. Send reminder to all pending users to submit their responses.',
          }}
          onValueChange={value => {
            setSelectedRemindMethod(value);
          }}
        />
        {selectedRemindMethod?.value === 'To All Pending Users' && (
          <View
            style={{
              borderWidth: 1,
              borderColor: '#F4C24A',
              width: '80%',
              borderRadius: 8,
              padding: 8,
            }}>
            <Text size="small3" fontVariant="bold">
              List of pending users
            </Text>
            <ScrollView
              style={{marginTop: 5, maxHeight: normaliseDesigns(75)}}
              showsVerticalScrollIndicator>
              {pendingUsersListForSendReminder?.dataList?.Users?.map(
                (item, index) => (
                  <View
                    style={{flexDirection: 'row', marginVertical: 2}}
                    key={index}>
                    <Text size="small2" fontVariant="semiBold">
                      {item.name}
                    </Text>
                  </View>
                ),
              )}
            </ScrollView>
          </View>
        )}
        <View style={{marginVertical: 3}}>
          <LabeledSingleRadioButton
            selectedValue={selectedRemindMethod}
            value={{value: 'By Date', label: '2. Select reminder'}}
            onValueChange={value => {
              setSelectedRemindMethod(value);
            }}
          />
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#CBD2D9',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: 7,
              width: '80%',
              paddingHorizontal: 7,
              paddingVertical: 8,
            }}
            disabled={selectedRemindMethod?.value !== 'By Date'}>
            <Text size="small3" style={{color: '#ABB4BD'}}>
              Select date
            </Text>
            <Icon name="calendar_icon" />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 3}}>
          <LabeledSingleRadioButton
            selectedValue={selectedRemindMethod}
            value={{
              value: 'By User Groups',
              label: '3. Form assignment reminder',
            }}
            onValueChange={value => {
              setSelectedRemindMethod(value);
            }}
          />
          <MultiSelectDropdown
            options={
              pendingUsersListForSendReminder?.dataList?.UserGroups?.map(
                item => ({
                  value: item.userGroupId?.toString(),
                  label: item.groupName,
                }),
              ) || []
            }
            selectedValues={selectedUserGroups}
            setSelectedValues={setSelectedUserGroups}
            style={{paddingVertical: 0, width: '80%'}}
            disabled={selectedRemindMethod?.value !== 'By User Groups'}
          />
        </View>
      </View>
      <Button
        text="Send"
        style={{marginTop: normaliseDesigns(150)}}
        active={Boolean(
          selectedRemindMethod?.value === 'To All Pending Users' ||
            (selectedRemindMethod?.value === 'By User Groups' &&
              selectedUserGroups?.length > 0),
        )}
        onPress={handleOnPressSend}
      />
    </View>
  );
};

type ShowResponseCountAndActionsTypes = {
  onPressReminder: () => void;
  onPressPrint: () => void;
  responseCount: number;
  isAcceptingResponses: boolean;
  setIsAcceptingResponses: Dispatch<SetStateAction<boolean>>;
};

const ShowResponseCountAndActions: FC<ShowResponseCountAndActionsTypes> = ({
  onPressReminder,
  onPressPrint,
  responseCount,
  isAcceptingResponses,
  setIsAcceptingResponses,
}) => (
  <View style={{marginTop: 10}}>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: '#F4C24A',
            aspectRatio: 1,
            height: normaliseDesigns(18),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 7,
          }}>
          <Icon name={'evidence_card_icon'} />
        </View>
        <Text size="body2" fontVariant="bold" style={{left: 5}}>
          Responses ({responseCount})
        </Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={onPressReminder}>
          <Icon
            name="admin_response_clock"
            width={22}
            height={22}
            style={{right: 10}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressPrint}>
          <Icon name="print_icon" width={22} height={22} />
        </TouchableOpacity>
      </View>
    </View>
    <ResponseAccessToggle
      label={'Accepting Responses'}
      isAcceptingResponses={isAcceptingResponses}
      setIsAcceptingResponses={setIsAcceptingResponses}
    />
  </View>
);

const AdminFormResponses: FC<AdminFormResponsesScreenProps> = ({
  navigation,
  route,
}) => {
  const {flowDetailItem} = route.params;
  const [selectedTab, setSelectedTab] = useState<TabTypes>('Individual');
  const [individualScreen, setIndividualScreen] =
    useState<ScreenSelectiontypes>('main');
  const [questionWiseScreen, setQuestionWiseScreen] =
    useState<ScreenSelectiontypes>('main');
  const [rubricWiseScreen, setRubricWiseScreen] =
    useState<ScreenSelectiontypes>('main');

  const [selectedIndividual, setSelectedIndividual] =
    useState<IndividualResponse | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );

  const [isAcceptingResponses, setIsAcceptingResponses] =
    useState<boolean>(true);

  const [isAssignFormModalVisible, setIsAssignFormModalVisible] =
    useState<boolean>(false);
  const [isVisibleAssignFormSuccessModal, setIsVisibleAssignFormSuccessModal] =
    useState<boolean>(false);
  const [isSendReminderModalVisible, setIsSendReminderModalVisible] =
    useState<boolean>(false);
  const [
    isVisibleSendReminderSuccessModal,
    setIsVisibleSendReminderSuccessModal,
  ] = useState<boolean>(false);

  const {formById, assignFormResponse} = useAppSelector(state => state.forms);

  const {sendReminderToAllPendingUsersResponse} = useAppSelector(
    state => state.flows,
  );
  const {userData} = useAppSelector(state => state.auth);

  const dispatch = useAppDispatch();

  const onPressItem = (item: IndividualResponse | Question) => {
    if (selectedTab === 'Individual') {
      setSelectedIndividual(item as IndividualResponse);
    } else if (selectedTab === 'Question Wise') {
      setSelectedQuestion(item as Question);
    } else {
    }
    setScreen('detailed');
  };

  useEffect(() => {
    dispatch(getFormById([flowDetailItem.formId, flowDetailItem.flowId]));
  }, []);

  useEffect(() => {
    if (sendReminderToAllPendingUsersResponse) {
      setIsSendReminderModalVisible(false);
      setIsVisibleSendReminderSuccessModal(true);
    }
  }, [sendReminderToAllPendingUsersResponse]);

  useEffect(() => {
    dispatch(
      acceptingFormResponses({
        isActive: isAcceptingResponses,
        formId: flowDetailItem.formId,
        loggedInUserName: userData.userName,
      }),
    );
  }, [isAcceptingResponses]);

  useEffect(() => {
    if (assignFormResponse) {
      setIsVisibleAssignFormSuccessModal(true);
    }
  }, [assignFormResponse]);

  const onPressAssignForm = (
    selectedUsers: number[],
    selectedUserGroups: number[],
  ) => {
    setIsAssignFormModalVisible(false);
    dispatch(
      assignFormToUsersAndGroups({
        userIds: selectedUsers,
        userGroupIds: selectedUserGroups,
        loggedInUserName: userData.userName,
        id: userData.id,
      }),
    );
  };

  const handleTabClick = (title: ItemType) => {
    setSelectedTab(title.value as TabTypes);
  };

  const onPressBackButton = () => {
    screen === 'main' ? navigation.goBack() : setScreen('main');
  };

  const selectScreenSwitch = (selectedTab: TabTypes): ScreenComponentType => {
    let screen: ScreenSelectiontypes = 'main';
    let renderal: JSX.Element = (
      <IndividualMainPageRenderal
        onPress={onPressItem}
        individualResponse={formById?.dataList.individualResponses || []}
      />
    );
    let setScreen: Dispatch<SetStateAction<ScreenSelectiontypes>> =
      setIndividualScreen;
    switch (selectedTab) {
      case 'Individual':
        screen = individualScreen;
        setScreen = setIndividualScreen;
        if (individualScreen === 'main') {
          renderal = (
            <IndividualMainPageRenderal
              key={0}
              onPress={onPressItem}
              individualResponse={formById?.dataList.individualResponses || []}
            />
          );
        } else {
          renderal = (
            <IndividualDescriptionRenderal
              individualResponse={selectedIndividual}
            />
          );
        }
        return {screen, setScreen, renderal};
      case 'Question Wise':
        screen = questionWiseScreen;
        setScreen = setQuestionWiseScreen;
        if (questionWiseScreen === 'main') {
          renderal = (
            <QuestionWiseMainPageRenderal
              key={1}
              onPressItem={onPressItem}
              questionList={formById?.dataList.questionList || []}
            />
          );
        } else {
          renderal = (
            <QuestionWiseDescriptionRenderal
              key={2}
              question={selectedQuestion}
              questionResponses={
                selectedQuestion?.questionId
                  ? formById?.dataList.questionWiseResponses[
                      selectedQuestion?.questionId
                    ]
                  : []
              }
            />
          );
        }
        return {screen, setScreen, renderal};
      case 'Rubric Wise':
        screen = rubricWiseScreen;
        setScreen = setRubricWiseScreen;
        if (rubricWiseScreen === 'main') {
          renderal = <RubricWiseMainPageRenderal onPressItem={onPressItem} />;
        } else {
          renderal = <RubricWiseDescriptionRenderal />;
        }
        return {screen, setScreen, renderal};
      default:
        return {screen, setScreen, renderal};
    }
  };

  const {renderal, screen, setScreen} = selectScreenSwitch(selectedTab);

  const isMainPage: boolean = Boolean(screen === 'main');

  const Renderal: JSX.Element = renderal;

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title={flowDetailItem?.formName}
        onPressBackArrow={onPressBackButton}>
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsAssignFormModalVisible(false);
          }}
          isVisible={isAssignFormModalVisible}
          title="Assign form"
          closeButton
          contentStyle={{width: '100%'}}
          content={
            <RenderAssignFormModalContent onPressAssign={onPressAssignForm} />
          }
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsVisibleAssignFormSuccessModal(false);
            dispatch(resetAssignFormResponse());
          }}
          closeButton
          content={
            <RenderSuccessModalContent
              icon="success_icon"
              highlightText="Success!"
              descriptionText="Form assigned to selected user and user groups."
            />
          }
          isVisible={isVisibleAssignFormSuccessModal}
          containerStyle={{justifyContent: 'center'}}
          contentStyle={{width: '70%'}}
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsVisibleSendReminderSuccessModal(false);
          }}
          closeButton
          content={
            <RenderSuccessModalContent
              icon="send_reminder_success_icon"
              highlightText="Great"
              descriptionText={
                sendReminderToAllPendingUsersResponse?.message?.toString() || ''
              }
            />
          }
          isVisible={isVisibleSendReminderSuccessModal}
          containerStyle={{justifyContent: 'center'}}
          contentStyle={{width: '70%'}}
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsSendReminderModalVisible(false);
          }}
          closeButton
          content={<RenderSendReminderModal flowDetailItem={flowDetailItem} />}
          title="Send reminder"
          isVisible={isSendReminderModalVisible}
          contentStyle={{width: '100%'}}
        />
        {isMainPage && (
          <ShowResponseCountAndActions
            onPressReminder={() => {
              setIsSendReminderModalVisible(true);
            }}
            onPressPrint={() => {}}
            responseCount={formById?.dataList?.individualResponses?.length || 0}
            isAcceptingResponses={isAcceptingResponses}
            setIsAcceptingResponses={setIsAcceptingResponses}
          />
        )}
        <View style={{marginBottom: 10}}>
          <Tab
            tabs={[
              {value: 'Individual', label: 'Individual'},
              {value: 'Question Wise', label: 'Question Wise'},
              {value: 'Rubric Wise', label: 'Rubric Wise'},
            ]}
            textStyle={{fontSize: normaliseFont(15)}}
            onClick={title => handleTabClick(title)}
          />
          {isMainPage && (
            <SearchWithFilter
              placeHolder={'Search by user name'}
              onTextChange={function (text: string): void {
                throw new Error('Function not implemented.');
              }}
              onProceed={function (filter: FilterObject): void {
                throw new Error('Function not implemented.');
              }}
            />
          )}
        </View>
        {Renderal}
      </Layout>
      <>
        {isMainPage && (
          <FooterWithButtons
            isActiveProceedButton
            onPressProceedButton={() => {
              setIsAssignFormModalVisible(true);
            }}
            onPressCancelButton={() => {}}
            proceedButtonText={'Assign form'}
            cancelButtonText={'Preview From'}
          />
        )}
      </>
    </>
  );
};
export default AdminFormResponses;
