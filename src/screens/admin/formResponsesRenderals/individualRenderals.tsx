import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';

import moment from 'moment';
import Text from '../../../components/Text';
import {RatingInput} from '../../reports/AddNewEvidenceCard';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image';
import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
import colors from '../../../config/colors';

type AdminIndividualTileTypes = {
  rating: string;
  name: string;
  image: string;
  creationDate: string;
  questionsAnswered: string;
  onPress: () => void;
  onPressDelete: () => void;
  style?: ViewStyle;
};

 const AdminIndividualTile: FC<AdminIndividualTileTypes> = ({
  rating,
  name,
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
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          backgroundColor: '#EAF1FE',
          borderRadius: 10,
          alignSelf: 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
          width: '13%',
        }}>
        <Text size="small1" fontVariant="bold">
          {rating}
        </Text>
        <Icon style={{marginLeft: 5}} name="star_icon" width={10} />
      </View>
      <View style={{width: '85%', paddingRight: 10, paddingLeft: 10}}>
        <Text fontVariant="bold" size="body1">
          {name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
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

type IndividualMainPageRenderalTypes = {
  onPress: () => void;
};

//IndividualMainScreen Renderals
 export const IndividualMainPageRenderal: FC<IndividualMainPageRenderalTypes> = ({onPress}) => (
  <View>
    <AdminIndividualTile
      rating={'4.2'}
      creationDate={moment(new Date('12-04-2024')).format('DD/MM/YYYY')}
      onPress={() => {
        onPress();
        // navigation.navigate('AdminFormList');
      }}
      name={'Rahul Mahajan'}
      image={''}
      questionsAnswered={'10/10'}
      onPressDelete={() => {}}
    />
    <AdminIndividualTile
      rating={'4.2'}
      creationDate={moment(new Date('12-04-2024')).format('DD/MM/YYYY')}
      onPress={() => {
        onPress();
        // navigation.navigate('AdminFormList');
      }}
      name={'Rahul Mahajan'}
      image={''}
      questionsAnswered={'10/10'}
      onPressDelete={() => {}}
    />
  </View>
);

type RenderQuestionAndAnswerTypes = {
  index: number;
  question: string;
  answer: string;
  rating: string;
};

const RenderQuestionAndAnswer: FC<RenderQuestionAndAnswerTypes> = ({
  index,
  question,
  answer,
  rating,
}) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: '#CBD2D9',
      paddingVertical: 7,
    }}>
    <View style={{flexDirection: 'row'}}>
      <Text style={{flex: 1}}>{index}.</Text>
      <Text style={{flex: 17}} size="body1">
        {question}
      </Text>
    </View>
    <View style={{flexDirection: 'row', marginTop: 5}}>
      <View style={{flex: 1}}>
        <Icon name="arrow_narrow_right" />
      </View>
      <Text style={{color: '#4E565F', flex: 17}} size="body1">
        {answer}
      </Text>
    </View>
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
      }}>
      <Text style={{color: '#4E565F', right: 10}} size="small1">
        Rating
      </Text>
      <Text
        style={{color: '#4E565F', right: 2.5}}
        size="small3"
        fontVariant="bold">
        {rating}
      </Text>
      <Icon name="rating_star_display" width={15} height={15} />
    </View>
  </View>
);

type IndividualDescriptionRenderalTypes = {};

//IndividualDescription Renderal
export const IndividualDescriptionRenderal: FC<IndividualDescriptionRenderalTypes> = ({}) => (
  <View>
    <View
      style={{
        backgroundColor: '#FCEBC5',
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        width: '100%',
        height: normaliseDesigns(105),
        marginTop: 5,
        marginBottom: 10,
      }}>
      <View style={{justifyContent: 'space-between'}}>
        <Text fontVariant="bold">Rahul Mahajan</Text>
        <RatingInput
          rating={3.4}
          label={''}
          size={15}
          onChangeRating={() => {}}
        />
        <View
          style={{
            backgroundColor: '#FEF8EC',
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}>
          <Text fontVariant="bold">10/10 </Text>
          <Text size="small3" style={{marginLeft: 5, color: '#1F2933'}}>
            Questions answered
          </Text>
        </View>
      </View>
      <Image
        name="response_card_icon"
        size={0.9}
        style={{alignSelf: 'flex-end'}}
      />
    </View>
    <RenderQuestionAndAnswer
      index={1}
      question={'How do you approach classroom management?'}
      answer={'Ability to manage classroom discipline with students.'}
      rating={'3.5'}
    />
  </View>
);
