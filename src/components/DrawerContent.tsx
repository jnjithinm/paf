import {TouchableOpacity, View} from 'react-native';
import colors from '../config/colors';
import Icon, {IconTypes} from './Icon';
import Text from './Text';
import {FC} from 'react';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';

type RenderItemTypes = {
  icon: IconTypes;
  itemName: string;
  onPressItem: () => void;
};
const RenderItem: FC<RenderItemTypes> = ({icon, itemName,onPressItem}) => {
  return (
    <TouchableOpacity
      style={{flexDirection: 'row', marginVertical: 8, alignItems: 'center'}} onPress={onPressItem}>
      <View
        style={{
          backgroundColor: '#F4C24A',
          aspectRatio: 1,
          height: 25,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
        }}>
        <Icon name={icon} />
      </View>
      <Text fontVariant="bold" style={{marginLeft: 7}} size="body2">
        {itemName}
      </Text>
    </TouchableOpacity>
  );
};

const itemsArray: RenderItemTypes[] = [
  {
    icon: 'drawer_icon_home',
    itemName: 'Dashboard',
    onPressItem: () => {},
  },
  {
    icon: 'drawer_icon_observation_reports',
    itemName: 'Observation Reports',
    onPressItem: () => {},
  },
  {
    icon: 'drawer_icon_teaching_aids',
    itemName: 'Teaching Aids',
    onPressItem: () => {},
  },
  {
    icon: 'drawer_icon_session_schedules',
    itemName: 'Session Schedules',
    onPressItem: () => {},
  },
  {
    icon: 'drawer_icon_give_feedback',
    itemName: 'Give Feedback',
    onPressItem: () => {},
  },
  {
    icon: 'drawer_icon_settings',
    itemName: 'Settings',
    onPressItem: () => {},
  },
];
const DrawerContent = () => {
  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          backgroundColor: colors.backgroundColor,
          paddingHorizontal: 20,
        }}>
        <TouchableOpacity
          style={{
            height: 30,
            aspectRatio: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FDF0E3',
            borderRadius: 7,
            alignSelf: 'flex-end',
            marginTop: 20,
          }}>
          <Icon name="left_arrow_orange_icon" />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 40,
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <Icon name="pro_pic_sample" width={50} height={50} />
          <View style={{marginLeft: 10, justifyContent: 'center',top:10}}>
            <Text fontVariant="bold" size="body2">
              Hi, Swaraj
            </Text>
            <Text style={{flex: 1}} size="small1">
              Nirmala Niketan High School
            </Text>
          </View>
        </View>
        <View
          style={{height: 1, backgroundColor: '#E4E7EB', marginVertical: 25}}
        />
        <View>
          {itemsArray.map(item => (
            <RenderItem
              icon={item.icon}
              itemName={item.itemName}
              onPressItem={item.onPressItem}
              key={item.itemName}
            />
          ))}
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#FEF8EC',
          width: '100%',
          height: normaliseDesigns(75),
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '40%',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#EA7804',
            width: '50%',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
          }}>
          <Text color="backgroundColor" size="small2">
            Help Centre
          </Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row',alignItems:'center',marginTop:10}}>
          <TouchableOpacity>
            <Text style={{color: '#ABB4BD'}} size="small2">
              Terms & Conditions
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 10,
              backgroundColor: '#ABB4BD',
              marginHorizontal: 5,
              width:1
            }}
          />
          <TouchableOpacity>
            <Text style={{color: '#ABB4BD'}} size="small2">
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DrawerContent;
