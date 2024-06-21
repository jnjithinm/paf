import {TextInput, TouchableOpacity, View, ViewStyle} from 'react-native';
import Icon from './Icon';
import colors from '../config/colors';
import {FC, useState} from 'react';
import Calendar, {FilterObject} from './Calendar';

type RenderSearchTypes = {
  placeHolder?: string;
  onTextChange: (text: string) => void;
  onProceed: (filter: FilterObject) => void;
  style?: ViewStyle;
};

const SearchWithFilter: FC<RenderSearchTypes> = ({
  placeHolder = 'Search',
  onTextChange,
  onProceed,
  style,
}) => {
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  return (
    <>
      <Calendar
        onProceed={filter => {
          onProceed(filter);
        }}
        onClose={() => {
          setIsOpenCalendar(false);
        }}
        isVisible={isOpenCalendar}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: 20,
          ...style,
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
            onChangeText={text => {
              onTextChange(text);
            }}
          />
          <Icon name="search_icon" />
        </View>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: colors.primaryColor,
            padding: 8,
            borderRadius: 10,
          }}
          onPress={() => {
            setIsOpenCalendar(true);
          }}>
          <Icon name="filter_icon" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SearchWithFilter;
