import React, {useState,FC} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import { FONT_VARIANT} from '../config/themes';
import colors from '../config/colors';
import { ItemType } from '../config/types';


interface TabsProps {
  tabs: ItemType[];
  onClick: (index: ItemType) => void;
  style?: ViewStyle;
  textStyle?:TextStyle
}

const Tabs: FC<TabsProps> = ({tabs, onClick, style,textStyle}) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabPress = (tabIndex: number, tabName: ItemType) => {
    setSelectedTab(tabIndex);
    onClick(tabName);
  };

  return (
    <View style={[styles.container,style]}>
      <View style={styles.tabHeader}>
        {tabs.map((title, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tabHeaderItem}
            onPress={() => {
              handleTabPress(index, title);
            }}>
            <Text
              style={[
                styles.tabHeaderText,
                selectedTab === index && styles.selectedTabHeaderText,
                textStyle
              ]}>
              {title.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.tabHighlightContainer}>
        <View
          style={[
            styles.tabHighlight,
            {
              width: `${100 / tabs.length}%`,
              left: `${selectedTab * (100 / tabs.length)}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#f0f0f0',
  },
  tabHeader: {
    flexDirection: 'row',
    borderBottomWidth: normaliseDesigns(1),
    borderBottomColor: '#ccc',
  },
  tabHeaderItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabHeaderText: {
    fontSize: 16,
    color: '#ABB4BD',
  },
  selectedTabHeaderText: {
    color: colors.blackColor,
    fontFamily: FONT_VARIANT.bold,
  },
  tabHighlightContainer: {
    position: 'relative',
  },
  tabHighlight: {
    position: 'absolute',
    bottom: -1,
    height: normaliseDesigns(3),
    backgroundColor: '#EA7804',
    borderRadius: 4,
  },
});

export default Tabs;
