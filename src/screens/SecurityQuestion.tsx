import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {MainStackParamList} from '../navigation/MainStack';
import StatusBar from '../components/StatusBar';
import colors from '../config/colors';
import Icon from '../components/Icon';
import Text from '../components/Text';
import LabelDropdown, {dropdownObject} from '../components/LabeledDropdown';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import Layout from '../components/Layout';

type SecurityQuestionNavigationProp = StackNavigationProp<
  MainStackParamList,
  'SecurityQuestion'
>;
type SecurityQuestionRouteProp = RouteProp<
  MainStackParamList,
  'SecurityQuestion'
>;

interface SecurityQuestionScreenProps {
  navigation: SecurityQuestionNavigationProp;
  route: SecurityQuestionRouteProp;
}

type RenderQuestionAndAnswerTypes = {
  questions: string[];
  selectedQuestionAndAnswer: dropdownObject[] | undefined;
  setSelectedQuestionAndAnswer: Dispatch<
    SetStateAction<dropdownObject[] | undefined>
  >;
  answerVariable: string;
  selectedQuestion: string;
};

const RenderQuestionAndAnswer: FC<RenderQuestionAndAnswerTypes> = ({
  questions,
  selectedQuestionAndAnswer,
  selectedQuestion,
  answerVariable,
}) => {
  return (
    <View>
      <Text>1.Select a security question*</Text>
      <LabelDropdown
        options={[]}
        // setSelectedItem={setAnswerVariable}
        onChangeItem={() => {}}
        defaultValue={selectedQuestion}
      />
      <TextInput value={''} />
    </View>
  );
};
const SecurityQuestion: FC<SecurityQuestionScreenProps> = ({
  navigation,
  route,
}) => {
  // const [answerVariable,setAnswerVariable]=useState<dropdownObject|undefined>({label:'',value:''});
  // const [selectedQuestion,setSelectedQuestion]=useState<string>('');
  const [selectedQuestionAndAnswer, setSelectedQuestionAndAnswer] = useState<
    dropdownObject[] | undefined
  >([
    {label: `What's your pet's name ?`, value: ''},
    {label: `What's your pet's name ?`, value: ''},
    {label: `What's your pet's name ?`, value: ''},
  ]);
  //   useEffect(() => {
  //     setTimeout(async () => {
  //       try {
  //       navigation.navigate('Login')
  //       } catch (error) {
  //         console.log('Error checking user data: ', error);
  //       }
  //     }, 2000);
  //   }, []);

  return (
    <Layout overridePaddingHorizontal overridePaddingVertical>
      <StatusBar backgroundColor={'#FEF8EC'} />
      <View
        style={{
          height: '15%',
          width: '100%',
          backgroundColor: '#FEF8EC',
        }}>
        <Icon
          name="security_question"
          style={{alignSelf: 'flex-end', justifyContent: 'flex-start'}}
        />
      </View>
      <View style={{paddingHorizontal: 20, marginTop: '10%'}}>
        <Text size="body5" fontVariant="bold">
          Security Questions
        </Text>
        <Text size="small3" style={{marginTop: 5}}>
          Answer the security questions to reset the password.
        </Text>
        <View style={{marginVertical: 25}}>
          {selectedQuestionAndAnswer?.map((item, index) => (
            <RenderQuestionAndAnswer
              key={index}
              selectedQuestionAndAnswer={selectedQuestionAndAnswer}
              setSelectedQuestionAndAnswer={setSelectedQuestionAndAnswer}
              questions={[]}
              answerVariable={item.value}
              selectedQuestion={item.label}
            />
          ))}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '100%',
            marginBottom: 50,
          }}>
          <Button
            style={{width: '30%'}}
            text="Submit"
            textStyle={{color: colors.backgroundColor}}
            active={false}
            onPress={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
          <Button
            style={{width: '30%'}}
            text={''}
            active={false}
            onPress={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </View>
      </View>
    </Layout>
  );
};
export default SecurityQuestion;
