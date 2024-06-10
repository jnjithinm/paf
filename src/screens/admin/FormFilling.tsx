import React, {FC,JSX} from 'react';
import {View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {useAppDispatch} from '../../redux/store';
import {AdminTabStackTabBarStackParamList} from '../../navigation/AdminTabStack';
import colors from '../../config/colors';
import Text from '../../components/Text';
import Icon from '../../components/Icon';

type FormFillingNavigationProp = StackNavigationProp<
  AdminTabStackTabBarStackParamList,
  'FormFilling'
>;
type FormFillingRouteProp = RouteProp<
  AdminTabStackTabBarStackParamList,
  'FormFilling'
>;

type RenderSectionTitleTypes = {
  title: string;
  description?: string;
};

const RenderSectionTitle: FC<RenderSectionTitleTypes> = ({
  title,
  description,
}) => (
  <View
    style={{
      borderRadius: 8,
      elevation: 4,
      backgroundColor: colors.backgroundColor,
      marginVertical: 5,
    }}>
    <View
      style={{
        backgroundColor: '#EA7804',
        height: '15%',
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
      }}
    />
    <View style={{paddingVertical: 10, paddingHorizontal: 5}}>
      <Text fontVariant="bold" size="body1">
        {title}
      </Text>
    </View>
    {description && <View style={{marginVertical: 5}}>{description}</View>}
  </View>
);

type RenderTaskItemTypes = {
  index: number;
  question: string;
  renderSelection: JSX.Element;
};

const RenderTaskItem: FC<RenderTaskItemTypes> = ({
  index,
  question,
  renderSelection,
}) => (
  <View
    style={{
      borderRadius: 8,
      alignItems: 'center',
      elevation: 4,
      backgroundColor: colors.backgroundColor,
      padding: 7,
      marginVertical: 5,
      marginBottom: 15,
      flexDirection: 'row',
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
      <Text style={{flex:3}}>{index}</Text>
      <View style={{flex:2}}>
      <Icon name="arrow_narrow_right" />
      </View>
    </View>
    <View style={{flex: 7}}>
      <Text size="small3">{question}</Text>
      <View>
      {renderSelection}
      </View>
    </View>
  </View>
);

interface FormFillingScreenProps {
  navigation: FormFillingNavigationProp;
  route: FormFillingRouteProp;
}

const FormFilling: FC<FormFillingScreenProps> = ({navigation, route}) => {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (deleteSuccess) {
  //     dispatch(
  //       getAllRubrics({
  //         page: 0,
  //         size: 15,
  //         type: 'all',
  //       }),
  //     );
  //   }
  // }, [deleteSuccess]);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15}}>
      <RenderSectionTitle title="Section 1" />
      <RenderTaskItem
        index={0}
        question={'How do you approach classroom management?'}
        renderSelection={undefined}
      />
    </Layout>
  );
};
export default FormFilling;
