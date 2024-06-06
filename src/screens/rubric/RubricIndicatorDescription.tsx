import React, {FC} from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment';

import Layout from '../../components/Layout';
import SearchFilter from '../../components/SearchFilter';
import Image from '../../components/Image';
import Text from '../../components/Text';
import {RubricTabBarStackParamList} from '../../navigation/RubricTabStack';
import colors from '../../config/colors';
import Icon from '../../components/Icon';

type RubricIndicatorDescriptionNavigationProp = StackNavigationProp<
  RubricTabBarStackParamList,
  'RubricIndicatorDescription'
>;
type RubricIndicatorDescriptionRouteProp = RouteProp<
  RubricTabBarStackParamList,
  'RubricIndicatorDescription'
>;

interface RubricIndicatorDescriptionScreenProps {
  navigation: RubricIndicatorDescriptionNavigationProp;
  route: RubricIndicatorDescriptionRouteProp;
}

type RenderTagsTypes = {
  tags: string;
};
const RenderTags: FC<RenderTagsTypes> = ({tags}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#EA7804',
      backgroundColor: '#FDF0E3',
      padding: 7,
      borderRadius: 7,
      flex: 0,
      margin: 3,
    }}>
    <Text size="small2">{tags}</Text>
    <Icon style={{marginLeft: 3}} name="cross_icon" />
  </View>
);
const RubricIndicatorDescription: FC<RubricIndicatorDescriptionScreenProps> = ({
  navigation,
  route,
}) => {

  const {indicator, title} = route.params;

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}
      title={title}
      icon="evaluation_icon">
      <View style={{marginVertical: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image name={'list_icon'} />
          <Text fontVariant="bold" size="body2" style={{marginLeft: 10}}>
            Indicator list
          </Text>
          <Text style={{marginLeft: 3}} size="verysmall3">
            (Last update: {moment(indicator.createdDate).format('DD/MM/YYYY')}{' '}
            by Admin)
          </Text>
        </View>
        <SearchFilter placeholder="Search domain" onSearch={()=>{}}  />

        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Domain</Text>
          <TextInput
            editable={false}
            style={{
              backgroundColor: '#FDF0E3',
              borderWidth: 1,
              borderColor: '#CBD2D9',
              borderRadius: 10,
              color: colors.blackColor,
              padding: 8,
              marginTop: 4,
              height: 40,
            }}
            value={indicator.domainName}
          />
        </View>
        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Tags</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {indicator.tags.map(item => (
              <RenderTags tags={item.tagName} />
            ))}
          </View>
        </View>
        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Indicator</Text>
          <TextInput
            editable={false}
            style={{
              backgroundColor: '#FDF0E3',
              borderWidth: 1,
              borderColor: '#CBD2D9',
              borderRadius: 10,
              color: colors.blackColor,
              padding: 8,
              marginTop: 4,
              height: 40,
            }}
            value={indicator.indicatorName}
          />
        </View>
        <View style={{marginVertical: 5}}>
          <Text fontVariant="bold">Indicator</Text>
          <Text size="small3" style={{marginTop: 4}}>
            {indicator.indicatorDescription}
          </Text>
        </View>
      </View>
    </Layout>
  );
};
export default RubricIndicatorDescription;
