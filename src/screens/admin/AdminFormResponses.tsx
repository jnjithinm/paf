import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
  JSX,
} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  RubricItem,
  deleteRubric,
  getAllRubrics,
} from '../../redux/features/rubricSlice';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import {
  normaliseDesigns,
  normaliseFont,
} from '../../utils/helpers/responsiveHelpers';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import Text from '../../components/Text';
import SearchFilter from '../../components/SearchFilter';
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
import {FloatingButton} from '../reports/ReportsMainPage';
import Modal from '../../components/Modal';
import {MultiSelect} from 'react-native-element-dropdown';
import MultiSelectDropdown from '../../components/MultiSelectDropdown';
import {DropdownObject} from '../../components/LabeledDropdown';

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
};

const RenderModalContent: FC<RenderModalContentTypes> = ({
  usersItems,
  userGroupsItems,
  selectedUsers,
  selectedUserGroups,
  setSelectedUsers,
  setSelectedUserGroups,
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
  </View>
);

const AdminFormResponses: FC<AdminFormResponsesScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setRubricListData] = useState<RubricItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabTypes>('Individual');
  const [individualScreen, setIndividualScreen] =
    useState<ScreenSelectiontypes>('main');
  const [questionWiseScreen, setQuestionWiseScreen] =
    useState<ScreenSelectiontypes>('main');
  const [rubricWiseScreen, setRubricWiseScreen] =
    useState<ScreenSelectiontypes>('main');

  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUserGroups, setSelectedUserGroups] = useState<string[]>([]);
  const [isAccessingResponses, setIsAccessingResponses] =
    useState<boolean>(true);

  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);

  const {allRubrics, deleteSuccess} = useAppSelector(state => state.rubric);
  const {userData} = useAppSelector(state => state.auth);
  const {GetAllUserGroupsData, GetUserGroupData} = useAppSelector(
    state => state.users,
  );
  const dispatch = useAppDispatch();

  const handleTabClick = (title: string) => {
    setSelectedTab(title as TabTypes);
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

  const onPressItem = () => {
    setScreen('detailed');
  };

  const onPressBackButton = () => {
    screen === 'main' ? navigation.goBack() : setScreen('main');
    console.log('dsffsd');
  };

  const selectScreenSwitch = (selectedTab: TabTypes): ScreenComponentType => {
    let screen: ScreenSelectiontypes = 'main';
    let renderal: JSX.Element = (
      <IndividualMainPageRenderal onPress={onPressItem} />
    );
    let setScreen: Dispatch<SetStateAction<ScreenSelectiontypes>> =
      setIndividualScreen;
    switch (selectedTab) {
      case 'Individual':
        screen = individualScreen;
        setScreen = setIndividualScreen;
        if (individualScreen === 'main') {
          renderal = <IndividualMainPageRenderal onPress={onPressItem} />;
        } else {
          renderal = <IndividualDescriptionRenderal />;
        }
        return {screen, setScreen, renderal};
      case 'Question Wise':
        screen = questionWiseScreen;
        setScreen = setQuestionWiseScreen;
        if (questionWiseScreen === 'main') {
          renderal = <QuestionWiseMainPageRenderal onPressItem={onPressItem} />;
        } else {
          renderal = (
            <QuestionWiseDescriptionRenderal onPressItem={onPressItem} />
          );
        }
        return {screen, setScreen, renderal};
      case 'Rubric Wise':
        screen = rubricWiseScreen;
        setScreen = setRubricWiseScreen;
        if (rubricWiseScreen === 'main') {
          renderal = <RubricWiseMainPageRenderal onPressItem={onPressItem} />;
        } else {
          renderal = (
            <RubricWiseDescriptionRenderal onPressItem={onPressItem} />
          );
        }
        return {screen, setScreen, renderal};
      default:
        return {screen, setScreen, renderal};
    }
  };

  const {screen, renderal, setScreen} = selectScreenSwitch(selectedTab);

  const isMainPage: boolean = Boolean(screen === 'main');

  const Renderal: JSX.Element = renderal;

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title="Teacher Evaluation Form"
        onPressBackArrow={onPressBackButton}>
        <Modal
          onProceed={() => {}}
          onClose={() => {}}
          isVisible={isVisibleModal}
          title="Assign form"
          closeButton
          content={
            <RenderModalContent
              users={GetUserGroupData}
              userGroupsItems={GetAllUserGroupsData}
              selectedUsers={selectedUsers}
              selectedUserGroups={selectedUserGroups}
              setSelectedUsers={setSelectedUsers}
              setSelectedUserGroups={setSelectedUserGroups}
            />
          }
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
              <Icon
                name="admin_response_clock"
                width={20}
                height={20}
                style={{left: 5}}
              />
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
            tabs={['Individual', 'Question Wise', 'Rubric Wise']}
            textStyle={{fontSize: normaliseFont(15)}}
            onClick={title => handleTabClick(title)}
          />
          {isMainPage && (
            <SearchFilter
              onSearch={() => {}}
              placeholder={'Search by user name'}
            />
          )}
        </View>
        {Renderal}
      </Layout>
      <>
        <FloatingButton
          icon="alarm_clock"
          onPress={() => {
            setIsVisibleModal(true);
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
