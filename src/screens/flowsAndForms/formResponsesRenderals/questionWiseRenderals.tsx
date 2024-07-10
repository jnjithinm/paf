import {TouchableOpacity, View} from 'react-native';

import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import {FC} from 'react';
import {
  Question,
  QuestionWiseResponse,
} from '../../../redux/features/formsSlice';
import moment from 'moment';
import {RenderEmptyPlaceholder} from '../../observation/ObservationReportsMainPage';

type RenderQuestionsTypes = {
  index: number;
  question: string;
  onPressItem?: () => void;
  hideBorder?: boolean;
};

const RenderQuestions: FC<RenderQuestionsTypes> = ({
  index,
  question,
  onPressItem,
  hideBorder = false,
}) => (
  <TouchableOpacity
    style={{
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderWidth: hideBorder ? 0 : 1,
      borderColor: '#F4C24A',
      flexDirection: 'row',
      borderRadius: 10,
      marginVertical: 5,
    }}
    disabled={hideBorder}
    onPress={() => {
      if (onPressItem) {
        onPressItem();
      }
    }}>
    <View
      style={{
        flexDirection: 'row',
        flex: 4,
        justifyContent: 'center',
        // height: '50%',
        alignItems: 'center',
      }}>
      <Text style={{flex: 1}}>{index + 1}.</Text>
      <View style={{flex: 0.75}}>
        <Icon name="arrow_narrow_right" />
      </View>
    </View>
    <Text style={{flex: 15}} size="body1">
      {question}
    </Text>
  </TouchableOpacity>
);

export type QuestionWiseIndexAddedResponse={
  item:Question;
  index:number;
}
type QuestionWiseMainPageRenderalTypes = {
  onPressItem: (item: QuestionWiseIndexAddedResponse) => void;
  questionList: Question[] | undefined;
};

//IndividualMainScreenRenderals
export const QuestionWiseMainPageRenderal: FC<
  QuestionWiseMainPageRenderalTypes
> = ({onPressItem, questionList}) => (
  <View>
    {questionList ? (
      questionList.length > 0 ? (
        questionList.map((item, index) => (
          <RenderQuestions
            index={index}
            question={item.questionText}
            onPressItem={() => {
              onPressItem({item,index});
            }}
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

type QuestionResponseTileTypes = {
  response: string;
  submittedBy: string;
  submittedOn: string;
  ratings?: number;
};

const QuestionResponseTile: FC<QuestionResponseTileTypes> = ({
  response,
  submittedBy,
  submittedOn,
  ratings,
}) => (
  <View
    style={{
      paddingHorizontal: 10,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: '#F4C24A',
      borderRadius: 10,
      marginVertical: 5,
    }}>
    <Text size="small3" style={{color: '#4E565F'}}>
      {response}
    </Text>
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent:'space-between',
        marginTop: 10,
      }}>
      <View style={{marginHorizontal:5}}>
        <Text size="small1" style={{color: '#4E565F'}}>
          Submitted By
        </Text>
        <Text size="small3" style={{color: '#1F2933', marginTop: 2}}>
          {submittedBy}
        </Text>
      </View>
      <View style={{marginHorizontal:5}}>
        <Text size="small1" style={{color: '#4E565F'}}>
          Submitted On
        </Text>
        <Text size="small3" style={{color: '#1F2933', marginTop: 2}}>
          {submittedOn}
        </Text>
      </View>
      {ratings && (
      <View style={{marginHorizontal:5}}>
          <Text size="small1" style={{color: '#4E565F'}}>
            Ratings
          </Text>
          <View
            style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
            <Text size="small3" style={{color: '#1F2933'}}>
              {ratings.toFixed(1)}
            </Text>
            <Icon name="rating_star_display" />
          </View>
        </View>
      )}
    </View>
  </View>
);

type QuestionWiseDescriptionRenderalTypes = {
  question: Question | undefined;
  questionResponses: QuestionWiseResponse[] | null;
  index:number;
};

//IndividualMainScreenRenderals
export const QuestionWiseDescriptionRenderal: FC<
  QuestionWiseDescriptionRenderalTypes
> = ({question, questionResponses,index}) => {
  const totalAvgRating =
    questionResponses?.reduce((sum, item) => sum + (item?.avgRating || 0), 0) ||
    0;

  const averageRating = questionResponses?.length
    ? totalAvgRating / questionResponses.length
    : 0;

  return (
    <View>
      <RenderQuestions
        index={index}
        question={question?.questionText || ''}
        hideBorder
      />
      {questionResponses ? (
        questionResponses.length > 0 ? (
          <>
            {questionResponses[0]?.avgRating && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text>Responses</Text>
                <Text style={{color: '#4E565F', marginLeft: 5, marginRight: 3}}>
                  ({averageRating}
                </Text>
                <Icon name="rating_star_display" />
                <Text style={{color: '#4E565F'}}>)</Text>
              </View>
            )}
            <View style={{marginTop: 20}}>
              {questionResponses?.map((item, index) => (
                <QuestionResponseTile
                  key={item.name}
                  response={item.responseValues}
                  submittedBy={item.name}
                  submittedOn={moment(new Date(item.responseDate)).format(
                    'DD/MM/YYYY',
                  )}
                  ratings={item.avgRating}
                />
              ))}
            </View>
          </>
        ) : (
          <RenderEmptyPlaceholder />
        )
      ) : (
        <></>
      )}
    </View>
  );
};
