import {TouchableOpacity, View, ViewStyle} from 'react-native';
import moment from 'moment';

import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import {FC, useEffect, useState} from 'react';
import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
import colors from '../../../config/colors';
import LabelDropdown from '../../../components/LabeledDropdown';
import {
  RubricWiseResponse,
  UserWiseResponse,
  getQuestionRatingByIndicatorId,
} from '../../../redux/features/formsSlice';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {RenderEmptyPlaceholder} from '../../observation/ObservationReportsMainPage';

type RubricWiseResponseTileTypes = {
  rating: number;
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
          {/* <View>
            <Text size="verysmall3" opacity="0.50">
              Questions Answered
            </Text>
            <Text size="small3"> {questionsAnswered}</Text>
          </View> */}
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
                {rating?.toFixed(1)}
              </Text>
              <Icon
                style={{marginLeft: 5}}
                name="rating_star_display"
                width={10}
              />
            </View>
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

type RubricWiseMainPageRenderalTypes = {
  onPressItem: (item: RubricWiseResponse) => void;
  indicatorsList?: RubricWiseResponse[];
};

//IndividualMainScreenRenderals
export const RubricWiseMainPageRenderal: FC<
  RubricWiseMainPageRenderalTypes
> = ({indicatorsList = [], onPressItem}) => (
  <View>
    {indicatorsList?.length > 0 ? (
      indicatorsList?.map((item, index) => (
        <RubricWiseResponseTile
          rating={item.avgRating}
          creationDate={moment(new Date(item.responseDate)).format(
            'DD/MM/YYYY',
          )}
          onPress={() => {
            onPressItem(item);
            // navigation.navigate('AdminFormList');
          }}
          title={item.indicatorName}
          image={''}
          questionsAnswered={'10/10'}
          onPressDelete={() => {}}
        />
      ))
    ) : (
      <RenderEmptyPlaceholder />
    )}
  </View>
);

type RubricWiseTileTypes = {
  title: string;
  isSelected: boolean;
  index: number;
  userWiseResponse: UserWiseResponse[];
  onSelect: (index: number) => void;
};
const RubricWiseTile: FC<RubricWiseTileTypes> = ({
  title,
  isSelected,
  userWiseResponse,
  onSelect,
  index,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(index);
      }}
      style={{
        borderWidth: 1,
        borderColor: '#F4C24A',
        marginVertical: 8,
        borderRadius: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isSelected ? '#FCEBC5' : colors.backgroundColor,
          width: '100%',
          borderRadius: 10,
          justifyContent: 'space-between',
          padding: 8,
          paddingHorizontal: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '15%',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text>{index + 1}.</Text>
            <Icon name="arrow_narrow_right" style={{marginHorizontal: 4}} />
          </View>
        </View>
        <Text size="body1" style={{width: '80%'}}>
          {title}
        </Text>
        <Icon
          name="chevron_up_black_icon"
          style={{
            transform: [{rotate: isSelected ? '0deg' : '180deg'}],
            //   alignSelf: isSelected ? 'flex-end' : undefined,
          }}
        />
      </View>
      {isSelected && (
        <View style={{padding: 8}}>
          {userWiseResponse.map(item => (
            <View>
              <Text>{item.responseValues}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

type RubricWiseDescriptionRenderalTypes = {
  selectedRubricWise: RubricWiseResponse | null;
  formId: number;
  flowId: number;
};

//IndividualMainScreenRenderals
export const RubricWiseDescriptionRenderal: FC<
  RubricWiseDescriptionRenderalTypes
> = ({selectedRubricWise, flowId, formId}) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState<number>();

  const {questionRatingByIndicatorId} = useAppSelector(state => state.forms);

  useEffect(() => {
    if (selectedRubricWise) {
      dispatch(
        getQuestionRatingByIndicatorId([
          selectedRubricWise?.indicatorId,
          formId,
          flowId,
        ]),
      );
    }
  }, [selectedRubricWise?.indicatorId]);

  return (
    <View key={selectedRubricWise?.indicatorId}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text size="body1" fontVariant="bold">
          {selectedRubricWise?.indicatorName}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text size="body1" fontVariant="bold">
            ( {selectedRubricWise?.avgRating?.toFixed(1)}
          </Text>
          <Icon
            style={{marginLeft: 5}}
            name="rating_star_display"
            width={15}
            height={15}
          />
          <Text size="body1" fontVariant="bold">
            )
          </Text>
        </View>
      </View>
      <View style={{marginVertical:8}}>
      {questionRatingByIndicatorId?.dataList?.questionWiseResponses?.map(
        (item, index) => (
          <RubricWiseTile
            title={item.questionText}
            isSelected={selected === index}
            index={index}
            key={index}
            userWiseResponse={item.userWiseResponses}
            onSelect={index => {
              setSelected(index);
            }}
          />
        ),
      )}
      </View>
    </View>
  );
};
