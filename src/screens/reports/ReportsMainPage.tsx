import React, {FC, useState} from 'react';
import {Platform, TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Tab from '../../components/Tab';
import {rubricData} from '../rubric/RubricDashboard';
import Text from '../../components/Text';
import Icon, {IconTypes} from '../../components/Icon';
import colors from '../../config/colors';
import {ObservationsTile} from '../dashboard/TeacherDashboard';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';
import { navigate } from '../../utils/helpers/navigationHelpers';

type ReportsMainPageNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'ReportsMainPage'
>;
type ReportsMainPageRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'ReportsMainPage'
>;

interface ReportsMainPageScreenProps {
  navigation: ReportsMainPageNavigationProp;
  route: ReportsMainPageRouteProp;
}

type FloatingButtonTypes = {
  text?: string;
  icon?: IconTypes;
  iconSize?:number;
  onPress: () => void;
  style?:ViewStyle
};

const FloatingButton: FC<FloatingButtonTypes> = ({text, icon, onPress,style,iconSize=20}) => {
  return (
    <TouchableOpacity
      style={{
        padding: 13,
        // aspectRatio: 1,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-between',
        bottom: 30,
        right: 20,
        flexDirection:"row",
        backgroundColor: '#EA7804',
        borderRadius: 10,
        zIndex: 1,
        ...Platform.select({
          ios: {
            shadowColor: colors.blackColor,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          android: {
            elevation: 5,
          },
        }),
        ...style,
      }}
      onPress={onPress}>
      {icon && <Icon name={icon} width={iconSize} height={iconSize} />}
      {text && <Text style={{color: 'white'}}>{text}</Text>}
    </TouchableOpacity>
  );
};

const tabs: string[] = ['All (20)', 'By me (60)', 'For me (60)'];
const ReportsMainPage: FC<ReportsMainPageScreenProps> = ({
  navigation,
  route,
}) => {
  const [rubricListData, setrubricListData] = useState<any[]>([]);
  const [isAddButtonPressed, setIsAddButtonPressed] = useState<boolean>(false);
  const handleTabClick = (title: string) => {
    title == 'Active'
      ? setrubricListData(rubricData.filter(item => item.active))
      : title == 'Non-Active'
      ? setrubricListData(rubricData.filter(item => item.active == false))
      : setrubricListData(rubricData);
  };

  return (
    <>
      <Layout
        overridePaddingVertical
        icon={'search_reports_icon'}
        title={'Observation Reports'}
        titleTransition>
        <Text size="body3" fontVariant="bold" style={{marginVertical: 10}}>
          Observation Reports
        </Text>
        <Tab tabs={tabs} onClick={title => handleTabClick(title)} />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: '85%',
              backgroundColor: '#F5F7FA',
              borderRadius: 10,
              paddingHorizontal: 10,
            }}>
            <TextInput
              style={{flex: 1, color: colors.blackColor, paddingVertical: 5}}
              placeholder="Search"
              placeholderTextColor={colors.darkGrey}
              // onChangeText={text => {
              //   setSearchText(text);
              // }}
            />
            <Icon name="search_icon" />
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: colors.primaryColor,
              padding: 8,
              borderRadius: 10,
            }}>
            <Icon name="filter_icon" />
          </View>
        </View>
        <View style={{marginTop: 10}}>
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />
          <ObservationsTile
            rating={'4.0'}
            userAssisted={'Mannar Mathai'}
            image={''}
            reportedBy={'Rishyasrinka'}
            onPress={() => {
              navigation.navigate('ReportsEvidenceCard', {
                userAccessed: 'Mannar Mathai',
              });
            }}
          />

          {/* <Fab icon={'add'}/> */}
        </View>
      </Layout>
      {!isAddButtonPressed && (
        <FloatingButton
          icon="plus_icon"
          onPress={() => {
            setIsAddButtonPressed(true);
          }}
          iconSize={20}
        />
      )}
      {isAddButtonPressed && (
        <View>
          <FloatingButton
            icon="plus_icon"
            text="New observation"
            iconSize={15}
            onPress={() => {navigate('NewObservationStack',{screen:'AddNNewObservation'})}}
            style={{bottom:normaliseDesigns(70),width:normaliseDesigns(145)}}
          />
          <FloatingButton
            icon="cross_icon_white"
            iconSize={10}
            onPress={() => {
              setIsAddButtonPressed(false);
            }}

          />
        </View>
      )}
      {/* <FAB
          title="Create"
          style={{position: 'absolute', bottom: 5, right: 5, zIndex: 100}}
        /> */}
    </>
  );
};
export default ReportsMainPage;
