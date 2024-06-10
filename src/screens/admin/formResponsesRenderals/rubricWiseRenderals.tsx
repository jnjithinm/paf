import {TouchableOpacity, View, ViewStyle} from 'react-native';
import moment from 'moment';

import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import {FC, useEffect, useState} from 'react';
import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
import colors from '../../../config/colors';
import LabelDropdown from '../../../components/LabeledDropdown';

type RubricWiseResponseTileTypes = {
  rating: string;
  title: string;
  image: string;
  creationDate: string;
  questionsAnswered: string;
  onPress: () => void;
  onPressDelete: () => void;
  style?: ViewStyle;
};

const RubricWiseResponseTile: FC<RubricWiseResponseTileTypes> = ({
  rating,
  title,
  image,
  creationDate,
  questionsAnswered,
  onPress,
  onPressDelete,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    return () => {
      setIsPressed(false);
    };
  }, [isPressed]);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsPressed(true);
        onPress();
      }}
      style={{
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F4C24A',
        height: normaliseDesigns(60),
        justifyContent: 'space-between',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: isPressed ? '#FCEBC5' : colors.backgroundColor,
        ...style,
      }}>
      <View style={{paddingRight: 10, paddingLeft: 10}}>
        <Text fontVariant="regular" size="body1">
          {title}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 5,
          }}>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Creation Date
            </Text>
            <Text size="small3">{creationDate}</Text>
          </View>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Questions Answered
            </Text>
            <Text size="small3"> {questionsAnswered}</Text>
          </View>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Ratings
            </Text>
            <View
              style={{
                flexDirection: 'row',
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text size="small1" fontVariant="bold">
                {rating}
              </Text>
              <Icon
                style={{marginLeft: 5}}
                name="rating_star_display"
                width={10}
              />
            </View>
          </View>
          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={onPressDelete}>
            <Icon name="trash_icon" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type RubricWiseMainPageRenderalTypes = {
  onPressItem: () => void;
};

//IndividualMainScreenRenderals
export const RubricWiseMainPageRenderal: FC<
  RubricWiseMainPageRenderalTypes
> = ({onPressItem}) => (
  <View>
    <RubricWiseResponseTile
      rating={'4.2'}
      creationDate={moment(new Date('12-04-2024')).format('DD/MM/YYYY')}
      onPress={() => {
        onPressItem();
        // navigation.navigate('AdminFormList');
      }}
      title={'Ability to manage classroom discipline'}
      image={''}
      questionsAnswered={'10/10'}
      onPressDelete={() => {}}
    />
  </View>
);

type RubricWiseDescriptionTileTypes = {
  question: string;
  answerOptions: string[];
};

const RubricWiseDescriptionTile: FC<RubricWiseDescriptionTileTypes> = () => (
  <View>
    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>Decision making evalutation</Text>
      <View
        style={{
          flexDirection: 'row',
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text size="body1" fontVariant="bold">
          4.5
        </Text>
        <Icon
          style={{marginLeft: 5}}
          name="rating_star_display"
          width={15}
          height={15}
        />
      </View>
    </View>
    <LabelDropdown
      options={[
        {
          value:
            'Utilizing a digital or physical planner to keep track of deadlines and events.',
          label:
            'Utilizing a digital or physical planner to keep track of deadlines and events.',
        },
      ]}
      placeHolder={'How do you establish a positive classroom environment?'}
      style={{borderColor: '#F4C24A'}}
      defaultValue={''}
    />
  </View>
);

type RubricWiseDescriptionRenderalTypes = {

};

//IndividualMainScreenRenderals
export const RubricWiseDescriptionRenderal: FC<
  RubricWiseDescriptionRenderalTypes
> = ({}) => (
  <View>
    <RubricWiseDescriptionTile question={''} answerOptions={[]} />
  </View>
);
