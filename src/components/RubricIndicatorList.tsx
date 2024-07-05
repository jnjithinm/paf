import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import Icon from './Icon';

interface RubricIndicatorListProps {
  title: string;
  active: boolean;
  createdBy: string;
  createdDate: string;
  onDelete: () => void;
  onPress:()=>void;
}

const RubricIndicatorList: React.FC<RubricIndicatorListProps> = ({
  title,
  active,
  createdBy,
  createdDate,
  onDelete,
  onPress
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.titleContainer]}>
        <View style={{width: '68%'}}>
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
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
        </View>

          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Icon name="trash_icon" />
          </TouchableOpacity>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#F4C24A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical:8,
    marginVertical: 5,
    justifyContent:'space-evenly'
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 10,
  },
  title: {
    fontSize: FONT_SIZES.body1,
    // fontFamily: FONT_VARIANT.bold,
    color: '#1F2933',
    fontFamily: FONT_VARIANT.medium,
    fontWeight: '600',
  },
  status: {
    padding: 2,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: FONT_SIZES.small3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  active: {
    backgroundColor: 'green',
  },
  inactive: {
    backgroundColor: 'red',
  },
  detailsContainer: {
    flexDirection: 'row',
    // marginBottom: 10,
    width: '100%',
    marginTop:10
  },
  detailsInnerContainer: {
    width: '50%',
    // borderRightColor: 'red',
    // borderRightWidth:1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  heading: {
    color: '#4E565F',
    fontSize: FONT_SIZES.small2,
    fontFamily: FONT_VARIANT.regular,
  },
  subHeading: {
    color: '#1F2933',
    fontSize: FONT_SIZES.small3,
    fontFamily: FONT_VARIANT.semiBold,
  },
  deleteButton: {
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    //  backgroundColor: 'green'
  },
  deleteIcon: {
    width: 15,
    height: 15,
  },
});

export default RubricIndicatorList;
