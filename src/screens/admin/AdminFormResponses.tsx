import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
  JSX,
} from 'react';
import {TouchableOpacity, View} from 'react-native';
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
import {FloatingButton} from '../observation/ObservationReportsMainPage';
import Modal from '../../components/Modal';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import {DropdownObject} from '../../components/LabeledDropdown';
import {getAllUsers} from '../../redux/features/usersSlice';
import Button from '../../components/Button';
import Image from '../../components/Image';
import {
  IndividualResponse,
  Question,
  getFormById,
} from '../../redux/features/formsSlice';
import SearchWithFilter from '../../components/SearchWithFilter';
import {FilterObject} from '../../components/Calendar';

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
  isAccessingResponses: boolean;
  setIsAccessingResponses: Dispatch<SetStateAction<boolean>>;
  disabed?: boolean;
};

const ResponseAccessToggle: FC<ResponseAccessToggleTypes> = ({
  label,
  isAccessingResponses,
  setIsAccessingResponses,
  disabed = false,
}) => (
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <Text style={{color: '#4E565F', right: 5}} size="small1">
      {label}
    </Text>
    <TouchableOpacity
      style={{
        backgroundColor: isAccessingResponses ? '#EA7804' : colors.darkGrey,
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
        setIsAccessingResponses(!isAccessingResponses);
        // selected === 'Re-Investment'
        //   ? setSelected('Withdraw')
        //   : setSelected('Re-Investment');
      }}>
      <View
        style={{
          backgroundColor: colors.backgroundColor,
          alignSelf: isAccessingResponses ? 'flex-end' : 'flex-start',
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

type RenderModalContentTypes = {
  usersItems: DropdownObject[];
  userGroupsItems: DropdownObject[];
  selectedUsers: string[];
  selectedUserGroups: string[];
  setSelectedUsers: Dispatch<SetStateAction<string[]>>;
  setSelectedUserGroups: Dispatch<SetStateAction<string[]>>;
  onPressAssign: () => void;
};

const RenderModalContent: FC<RenderModalContentTypes> = ({
  usersItems,
  userGroupsItems,
  selectedUsers,
  selectedUserGroups,
  setSelectedUsers,
  setSelectedUserGroups,
  onPressAssign,
}) => (
  <View>
    <MultiSelectDropdown
      label="Select user"
      options={usersItems}
      selectedValues={selectedUsers}
      setSelectedValues={setSelectedUsers}
    />
    <MultiSelectDropdown
      label="Select user groups"
      options={userGroupsItems}
      selectedValues={selectedUserGroups}
      setSelectedValues={setSelectedUserGroups}
    />
    <Button
      text="Assign"
      active={selectedUsers.length !== 0 && selectedUserGroups.length !== 0}
      onPress={onPressAssign}
      style={{marginTop: normaliseDesigns(100)}}
    />
  </View>
);

const RenderSuccessModalContent: FC = () => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    }}>
    <Image name="success_icon" />
    <Text size="body2" fontVariant="bold" style={{marginVertical: 5}}>
      Success!
    </Text>
    <Text size="small2" fontVariant="bold" style={{textAlign: 'center'}}>
      Form assigned to selected user and user groups.
    </Text>
  </View>
);

const RenderSendReminderSuccessModalContent: FC = () => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 30,
    }}>
    <Image name="send_reminder_success_icon" />
    <Text size="body2" fontVariant="bold" style={{marginVertical: 5}}>
      Success!
    </Text>
    <Text size="small2" fontVariant="bold" style={{textAlign: 'center'}}>
      Reminder sent successfully to all pending users.
    </Text>
  </View>
);

type LabeledSingleRadioButtonTypes = {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
};

const LabeledSingleRadioButton: FC<LabeledSingleRadioButtonTypes> = ({
  label,
  selectedValue,
  onValueChange,
}) => {
  return (
    <View
      style={{
        justifyContent: 'space-between',
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text style={{flex: 7}} size="small3">
        {label}
      </Text>
      <View style={{flex: 1}}>
        <TouchableOpacity
          key={label}
          onPress={() => onValueChange(label)}
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
            selectedValue === label && {borderColor: '#EA7804'},
          ]}>
          {selectedValue === label && (
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
  listOfPendingUsers: string[];
  scheduleReminderDate: string;
  formAssignmentReminder: string;
  userGroups: DropdownObject[];
  selectedUserGroupsAssignmentReminder: string[];
  setSelectedUserGroupsAssignmentReminder: Dispatch<SetStateAction<string[]>>;
  onPressSendButton: () => void;
};

const RenderSendReminderModal: FC<RenderSendReminderModalTypes> = ({
  userGroups,
  selectedUserGroupsAssignmentReminder,
  setSelectedUserGroupsAssignmentReminder,
  onPressSendButton,
}) => {
  const [selectedValue1, setSelectedValue1] = useState('');

  return (
    <View style={{justifyContent: 'space-between'}}>
      <View>
        <LabeledSingleRadioButton
          selectedValue={selectedValue1}
          label="1. Send reminder to all pending users to submit their responses."
          onValueChange={value => {
            setSelectedValue1(value);
          }}
        />
        <View>
          <LabeledSingleRadioButton
            selectedValue={selectedValue1}
            label="2. Select reminder"
            onValueChange={value => {
              setSelectedValue1(value);
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
            }}>
            <Text size="small3" style={{color: '#ABB4BD'}}>
              Select date
            </Text>
            <Icon name="calendar_icon" />
          </TouchableOpacity>
        </View>
        <View>
          <LabeledSingleRadioButton
            selectedValue={selectedValue1}
            label="3. Form assignment reminder"
            onValueChange={value => {
              setSelectedValue1(value);
            }}
          />
          <MultiSelectDropdown
            options={userGroups}
            selectedValues={selectedUserGroupsAssignmentReminder}
            setSelectedValues={setSelectedUserGroupsAssignmentReminder}
            style={{paddingVertical: 0, width: '80%'}}
          />
        </View>
      </View>
      <Button
        text="Send"
        style={{marginTop: normaliseDesigns(150)}}
        active={false}
        onPress={onPressSendButton}
      />
    </View>
  );
};

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

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  const [isAccessingResponses, setIsAccessingResponses] =
    useState<boolean>(true);

  const [
    selectedUserGroupsAssignmentReminder,
    setSelectedUserGroupsAssignmentReminder,
  ] = useState<string[]>([]);

  const [isAssignFormModalVisible, setIsAssignFormModalVisible] =
    useState<boolean>(false);
  const [isVisibleSuccessModal, setIsVisibleSuccessModal] =
    useState<boolean>(false);
  const [isSendReminderModalVisible, setIsSendReminderModalVisible] =
    useState<boolean>(false);
  const [
    isVisibleSendReminderSuccessModal,
    setIsVisibleSendReminderSuccessModal,
  ] = useState<boolean>(false);

  const {formById} = useAppSelector(state => state.forms);
  const {GetAllUserGroupsData, GetAllUserData} = useAppSelector(
    state => state.users,
  );

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
    dispatch(getFormById(56));
    dispatch(
      getAllUsers({
        page: 0,
        size: 15,
        type: 'all',
      }),
    );
  }, []);

  const handleTabClick = (title: DropdownObject) => {
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
              onPressItem={onPressItem}
              questionList={formById?.dataList.questionList || []}
            />
          );
        } else {
          renderal = (
            <QuestionWiseDescriptionRenderal
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
          // style={{marginTop:normaliseDesigns(150)}}
          content={
            <RenderModalContent
              usersItems={
                GetAllUserData?.dataList.map(item => ({
                  value: item.userId?.toString(),
                  label: item.userName,
                })) || []
              }
              userGroupsItems={
                GetAllUserGroupsData?.dataList.map(item => ({
                  value: item.userGroupId?.toString(),
                  label: item.groupName,
                })) || []
              }
              selectedUsers={selectedUsers}
              selectedUserGroups={selectedUserGroups}
              setSelectedUsers={setSelectedUsers}
              setSelectedUserGroups={setSelectedUserGroups}
              onPressAssign={() => {
                setIsAssignFormModalVisible(false);
                setIsVisibleSuccessModal(true);
              }}
            />
          }
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsVisibleSuccessModal(false);
          }}
          closeButton
          content={<RenderSuccessModalContent />}
          isVisible={isVisibleSuccessModal}
          containerStyle={{justifyContent: 'center'}}
          contentStyle={{width: '70%'}}
        />
        <Modal
          onProceed={() => {}}
          onClose={() => {
            setIsVisibleSendReminderSuccessModal(false);
          }}
          closeButton
          content={<RenderSendReminderSuccessModalContent />}
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
          content={
            <RenderSendReminderModal
              listOfPendingUsers={[]}
              scheduleReminderDate={''}
              formAssignmentReminder={''}
              userGroups={
                GetAllUserData?.dataList.map(item => ({
                  value: item.userId?.toString(),
                  label: item.userName,
                })) || []
              }
              selectedUserGroupsAssignmentReminder={
                selectedUserGroupsAssignmentReminder
              }
              setSelectedUserGroupsAssignmentReminder={
                setSelectedUserGroupsAssignmentReminder
              }
              onPressSendButton={function (): void {
                throw new Error('Function not implemented.');
              }}
            />
          }
          title="Send reminder"
          isVisible={isSendReminderModalVisible}
          contentStyle={{width: '100%'}}
        />
        {isMainPage && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 5,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                size="body2"
                fontVariant="bold"
                style={{marginVertical: 10}}>
                12/100 Responses
              </Text>
              <TouchableOpacity>
                <Icon
                  name="admin_response_clock"
                  width={20}
                  height={20}
                  style={{left: 5}}
                />
              </TouchableOpacity>
            </View>
            <ResponseAccessToggle
              label={'Accepting Responses'}
              isAccessingResponses={isAccessingResponses}
              setIsAccessingResponses={setIsAccessingResponses}
            />
          </View>
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
        <FloatingButton
          icon="alarm_clock"
          onPress={() => {
            setIsAssignFormModalVisible(true);
            // setIsAddButtonPressed(true);
          }}
          iconSize={20}
        />

        {isMainPage && (
          <FooterWithButtons
            isActiveProceedButton
            onPressProceedButton={() => {}}
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
