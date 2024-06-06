import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Icon from './Icon';

interface RubricListModalProps {
  title: string;
  active: boolean;
  createdBy: string;
  createdDate: string;
  userCount: number;
  onDelete: () => void;
  onPress:()=>void;
}

const RubricListModal: React.FC<RubricListModalProps> = ({
  title,
  active,
  createdBy,
  createdDate,
  userCount,
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
        <View
          style={{
            width: '32%',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}>
          <View
            style={{
              backgroundColor: active ? '#EBF9D9' : '#FFEDED',
              borderRadius: 15,
              width: '90%',
            }}>
            <Text
              style={[styles.status, {color: active ? '#749E35' : '#D62828'}]}>
              <View
                style={[
                  styles.dot,
                  {backgroundColor: active ? '#749E35' : '#D62828'},
                ]}
              />
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
            <Text style={styles.heading}>Users</Text>
            <Text style={styles.subHeading}> {userCount}</Text>
          </View>
        </View>
        <View style={styles.deleteButton}>
          <TouchableOpacity onPress={onDelete}>
            <Icon name="trash_icon" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#F4C24A',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: FONT_SIZES.body2,
    fontFamily: FONT_VARIANT.bold,
    color: '#1F2933',
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
    marginBottom: 10,
    width: '100%',
  },
  detailsInnerContainer: {
    width: '30%',
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
    width: 18,
    height: 18,
  },
});

export default RubricListModal;
