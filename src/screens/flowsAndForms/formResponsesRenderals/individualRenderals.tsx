import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';

import moment from 'moment';
import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image';
import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
import colors from '../../../config/colors';
import {
  IndicatorIndividualResponse,
  IndividualResponse,
  resetDeleteFormResponse,
} from '../../../redux/features/formsSlice';
import RatingInput from '../../../components/RatingInput';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {deleteForm} from '../../../redux/features/formsSlice';
import {FlowDetailItem} from '../../../redux/features/flowsSlice';
import {RenderEmptyPlaceholder} from '../../observation/ObservationReportsMainPage';

type IndividualTileTypes = {
  flowDetailItem: FlowDetailItem;
  id: number;
  rating: number;
  name: string;
  image: string;
  creationDate: string;
  questionsAnswered: string;
  onPress: () => void;
  onPressDelete: () => void;
  style?: ViewStyle;
};

const IndividualTile: FC<IndividualTileTypes> = ({
  flowDetailItem,
  id,
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
  const dispatch = useAppDispatch();
  const {userData} = useAppSelector(state => state.auth);
  const {deleteFormResponse} = useAppSelector(state => state.forms);

  const onPressDeleteFormResponse = () => {
    dispatch(
      deleteForm([
        flowDetailItem.flowId,
        0,
        {
          ids: [id],
          loggedInUserName: userData.userName,
        },
      ]),
    );
  };

  useEffect(() => {
    if (deleteFormResponse) {
      dispatch(resetDeleteFormResponse());
    }
  }, [deleteFormResponse]);

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
      key={name}
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
            marginTop: 7,
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
          {/* <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={onPressDelete}>
            <Icon name="trash_icon" />
          </TouchableOpacity> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

type IndividualMainPageRenderalTypes = {
  onPress: (item: IndividualResponse) => void;
  individualResponse: IndividualResponse[] | undefined;
  flowDetailItem: FlowDetailItem;
  totalQuestion: number;
};

//IndividualMainScreen Renderals
export const IndividualMainPageRenderal: FC<
  IndividualMainPageRenderalTypes
> = ({onPress, individualResponse, flowDetailItem, totalQuestion}) => {
  return (
    <View>
      {individualResponse ? (
        individualResponse.length > 0 ? (
          individualResponse.map(item => (
            <IndividualTile
              rating={item.questionAvgRating || 0}
              creationDate={moment(item.responses[0].responseDate).format(
                'DD/MM/YYYY',
              )}
              onPress={() => {
                onPress(item);
                // navigation.navigate('AdminFormList');
              }}
              flowDetailItem={flowDetailItem}
              id={item.userId}
              key={item.userId}
              name={item.name}
              image={''}
              questionsAnswered={`${item.responses.length}/${totalQuestion}`}
              onPressDelete={() => {}}
            />
          ))
        ) : (
          <RenderEmptyPlaceholder />
        )
      ) : (
        <></>
      )}
    </View>
  );
};

type RenderQuestionAndAnswerTypes = {
  index: number;
  question: string;
  answer: string;
  rating: number;
  indicators?: IndicatorIndividualResponse[];
};

const RenderQuestionAndAnswer: FC<RenderQuestionAndAnswerTypes> = ({
  index,
  question,
  answer,
  rating,
  indicators,
}) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: '#CBD2D9',
      paddingVertical: 10,
    }}>
    <View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 2}}>{index}.</Text>
        <Text style={{flex: 17}} size="body1">
          {question}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Icon name="arrow_narrow_right" />
        </View>
        <Text style={{color: '#4E565F', flex: 17}} size="body1">
          {answer}
        </Text>
      </View>
      {rating && (
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
            {rating?.toFixed(1)}
          </Text>
          <Icon name="rating_star_display" width={15} height={15} />
        </View>
      )}
    </View>
    {indicators &&
      indicators.map((item, index) => (
        <View>
          <Text size="small2">{item.indicatorName}</Text>
          <RatingInput
            disabled
            rating={item.avgRating || 0}
            label={''}
            size={15}
            style={{marginTop: 4}}
            key={index}
            onChangeRating={() => {}}
          />
        </View>
      ))}
  </View>
);

type IndividualDescriptionRenderalTypes = {
  individualResponse: IndividualResponse | null;
  totalQuestion: number;
};

//IndividualDescription Renderal
export const IndividualDescriptionRenderal: FC<
  IndividualDescriptionRenderalTypes
> = ({individualResponse, totalQuestion}) => (
  <View>
    {individualResponse ? (
      <>
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
            <Text fontVariant="bold">{individualResponse?.name}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <RatingInput
                rating={individualResponse?.questionAvgRating || 0}
                label={''}
                size={15}
                onChangeRating={() => {}}
                showRating={false}
              />
              <Text style={{paddingLeft:5}}>
                {`${individualResponse?.questionAvgRating?.toFixed(1)||0} / 5`}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: '#FEF8EC',
                padding: 10,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text fontVariant="bold">
                {individualResponse?.responses?.length}/{totalQuestion}{' '}
              </Text>
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
        {individualResponse?.responses.map((item, index) => (
          <RenderQuestionAndAnswer
            index={index+1}
            question={item.questionText}
            answer={item.responseValues}
            rating={item.avgRating}
            indicators={item.indicators}
            key={index}
          />
        ))}
      </>
    ) : (
      <RenderEmptyPlaceholder />
    )}
  </View>
);
