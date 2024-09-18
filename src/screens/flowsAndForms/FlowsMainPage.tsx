import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/LayoutNew';
import Tab from '../../components/Tab';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {normaliseFont} from '../../utils/helpers/responsiveHelpers';
import Text from '../../components/Text';
import {
  FlowItem,
  deleteFlow,
  getAllFlows,
} from '../../redux/features/flowsSlice';
import {styles} from '../../components/RubricListModal';
import {FlowsAndFormsStackParamList} from '../../navigation/FlowsAndFormsStack';
import SearchWithFilter from '../../components/SearchWithFilter';
import {RenderEmptyPlaceholder} from '../observation/ObservationReportsMainPage';
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';
import PaginationBar from '../../components/PaginationBar';

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
  onDelete?: () => void;
  onPress: () => void;
  isAdmin?: boolean;
}

export const FlowsItem: React.FC<FlowsItemProps> = ({
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
            <Text style={styles.heading}>Responses</Text>
            <Text style={styles.subHeading}> {userCount}</Text>
          </View>
        </View>
        {/* {isAdmin && (
          <View style={styles.deleteButton}>
            <TouchableOpacity onPress={onDelete}>
              <Icon name="trash_icon" />
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
  );
};

const FlowsMainPage: FC<FlowsMainPageScreenProps> = ({navigation, route}) => {
  const [search, setSearch] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [flowsList, setFlowsList] = useState<FlowItem[]>();

  const {allFlows, ownedByMeFlows, notOwnedByMeFlows} = useAppSelector(
    state => state.flows,
  );
  const {userData, isAdmin} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setFlowsList(allFlows?.dataList);
  }, [allFlows]);

  const handleTabClick = (title: string) => {
    if (title === 'All') {
      setFlowsList(allFlows?.dataList);
    } else if (title === 'Owned by me') {
      setFlowsList(ownedByMeFlows?.dataList);
    } else {
      setFlowsList(notOwnedByMeFlows?.dataList);
    }
  };

  useEffect(() => {
    dispatch(
      getAllFlows([
        userData.userName,
        userData.id,
        {
          page: 0,
          size: 15,
          type: 'all',
        },
      ]),
    );
    dispatch(
      getAllFlows([
        userData.userName,
        userData.id,
        {
          page: 0,
          size: 15,
          type: true,
        },
      ]),
    );
    dispatch(
      getAllFlows([
        userData.userName,
        userData.id,
        {
          page: 0,
          size: 15,
          type: false,
        },
      ]),
    );
  }, []);

  const onPressDeleteFlow = (item: FlowItem) => {
    dispatch(
      deleteFlow({
        flowIds: [item.flowId],
        forceDelete: false,
        loggedInUserName: userData.userName,
      }),
    );
  };

  const filteredFlows = flowsList?.filter(item =>
    item?.flowName?.toLocaleLowerCase()?.includes(search?.toLocaleLowerCase()),
  );
  type DrawerContentTypes = {
    closeDrawer: () => void;
  };
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const onPressMenuIcon = () => {
    setIsDrawerOpen(true); // Set drawer open to true
  };

  return (
    <>
      <Drawer
      open={isDrawerOpen} // Drawer open state
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)} // Close drawer
      renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}
    >
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title="Flows"
        icon="flow_icon"
        focusedStack="FlowsAndFormsStack"
        titleTransition
        onPressMenuIcon={onPressMenuIcon} >
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Flows
        </Text>
        <View style={{marginVertical: 10}}>
          <Tab
            tabs={[
              {value: `All`, label: `All (${allFlows?.totalCount || ''})`},
              {
                value: `Owned by me`,
                label: `Owned by me (${ownedByMeFlows?.totalCount || ''})`,
              },
              {
                value: `Not owned by me`,
                label: `Not owned by me (${notOwnedByMeFlows?.totalCount || ''})`,
              },
            ]}
            textStyle={{fontSize: normaliseFont(13)}}
            onClick={title => handleTabClick(title?.value)}
          />

          <SearchWithFilter
            filterNotNeeded
            onTextChange={text => {
              setSearch(text);
            }}
            onProceed={() => {}}
          />

          {filteredFlows ? (
            filteredFlows.length > 0 ? (
              filteredFlows
                ?.filter(item =>
                  item.flowName
                    ?.toLocaleLowerCase()
                    ?.includes(search?.toLocaleLowerCase()),
                )
                ?.map(ele => (
                  <FlowsItem
                    active={ele.status}
                    createdBy={ele.createdBy}
                    createdDate={moment(ele.createdDate).format('DD/MM/YYYY')}
                    title={ele.flowName}
                    userCount={ele.responses}
                    onDelete={() => {
                      onPressDeleteFlow(ele);
                    }}
                    key={ele.flowId}
                    onPress={() => {
                      navigation.navigate('FormList', {flowItem: ele});
                    }}
                    isAdmin={isAdmin}
                  />
                ))
             
            ) : (
              <RenderEmptyPlaceholder />
            )
          ) : (
            <></>
          )}
          
          <PaginationBar
                count={(allFlows?.totalCount || 0) / 15}
                onPressPageIndex={(index) => {
                  if (allFlows) {
                    dispatch(
                      getAllFlows([
                        userData.userName,
                        userData.id,
                        {
                          page: index,
                          size: 15,
                          type: allFlows?.selectedTab || 'all',
                        },
                        search
                      ]),
                    );
                   
                 
                  }
                }}
              />
        </View>
      </Layout>
      </Drawer>
    </>
    
  );
};
export default FlowsMainPage;
