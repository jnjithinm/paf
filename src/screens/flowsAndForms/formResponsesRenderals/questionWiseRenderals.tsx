import {TouchableOpacity, View} from 'react-native';
import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import {FC} from 'react';
import {
  Question,
  QuestionWiseResponse,
} from '../../../redux/features/formsSlice';
import moment from 'moment';

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
      marginVertical:5
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
      <Text style={{flex: 1}}>{index}.</Text>
      <View style={{flex: 0.75}}>
        <Icon name="arrow_narrow_right" />
      </View>
    </View>
    <Text style={{flex: 15}} size="body1">
      {question}
    </Text>
  </TouchableOpacity>
);

type QuestionWiseMainPageRenderalTypes = {
  onPressItem: (item: Question) => void;
  questionList: Question[];
};

//IndividualMainScreenRenderals
export const QuestionWiseMainPageRenderal: FC<
  QuestionWiseMainPageRenderalTypes
> = ({onPressItem, questionList}) => (
  <View>
    {questionList.map(item => (
      <RenderQuestions
        index={item.questionId}
        question={item.questionText}
        onPressItem={() => {
          onPressItem(item);
        }}
      />
    ))}
  </View>
);

type QuestionResponseTileTypes = {
  response: string;
  submittedBy: string;
  submittedOn: string;
  ratings: string;
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        width: '80%',
      }}>
      <View>
        <Text size="small1" style={{color: '#4E565F'}}>
          Submitted By
        </Text>
        <Text size="small3" style={{color: '#1F2933', marginTop: 2}}>
          {submittedBy}
        </Text>
      </View>
      <View>
        <Text size="small1" style={{color: '#4E565F'}}>
          Submitted On
        </Text>
        <Text size="small3" style={{color: '#1F2933', marginTop: 2}}>
          {submittedOn}
        </Text>
      </View>
      <View>
        <Text size="small1" style={{color: '#4E565F'}}>
          Ratings
        </Text>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 2}}>
          <Text size="small3" style={{color: '#1F2933'}}>
            {ratings}
          </Text>
          <Icon name="rating_star_display" />
        </View>
      </View>
    </View>
  </View>
);

type QuestionWiseDescriptionRenderalTypes = {
  question: Question | null;
  questionResponses: QuestionWiseResponse[] | undefined;
};

//IndividualMainScreenRenderals
export const QuestionWiseDescriptionRenderal: FC<
  QuestionWiseDescriptionRenderalTypes
> = ({question, questionResponses}) => (
  <View>
    <RenderQuestions
      index={question?.questionId || 0}
      question={question?.questionText || ''}
      hideBorder
    />
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text>Responses</Text>
      <Text style={{color: '#4E565F', marginLeft: 5, marginRight: 3}}>
        (4.5
      </Text>
      <Icon name="rating_star_display" />
      <Text style={{color: '#4E565F'}}>)</Text>
    </View>
    <View style={{marginTop: 20}}>
      {questionResponses?.map(item => (
        <QuestionResponseTile
          key={item.name}
          response={item.responseValues}
          submittedBy={item.name}
          submittedOn={moment(new Date(item.responseDate)).format('DD/MM/YYYY')}
          ratings={'4.5'}
        />
      ))}
    </View>
  </View>
);
