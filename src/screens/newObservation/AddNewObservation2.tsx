import React, {FC, useState} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import LabelDropdown from '../../components/LabelDropdown';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import Text from '../../components/Text';
import Button from '../../components/Button';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import DateTimePickerComponent from '../../components/DateTimePickerComponent';
import Icon from '../../components/Icon';
import {navigate} from '../../utils/helpers/navigationHelpers';
import {NewObservationStackParamList} from '../../navigation/NewObservationStack';
import {FooterWithButtons} from './AddNewObservation';

type AddNewObservation2NavigationProp = StackNavigationProp<
  NewObservationStackParamList,
  'AddNewObservation2'
>;
type AddNewObservation2RouteProp = RouteProp<
  NewObservationStackParamList,
  'AddNewObservation2'
>;

interface AddNewObservation2ScreenProps {
  navigation: AddNewObservation2NavigationProp;
  route: AddNewObservation2RouteProp;
}

type RatingInputTypes = {
  label: string;
  rating: number;
  onChangeRating: (rating: number) => void;
};

const RatingInput: FC<RatingInputTypes> = ({label, rating, onChangeRating}) => {
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleStarPress = (index: number) => {
    const newRating = index + 1;
    setSelectedRating(newRating);
    onChangeRating(newRating);
  };

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5; 
  return (
    <View>
      <Text fontVariant="bold" size="small3">
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          width: '35%',
          justifyContent: 'space-between',
          alignItems:'center'
        }}>
        {Array.from({length: 5}, (_, index) => {
          if (index < filledStars) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}>
                <Icon key={index} name="star_icon" />
              </TouchableOpacity>
            );
          } else if (index === filledStars && hasHalfStar) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}>
                <Icon key={index} name="star_half_filled_icon" />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}>
                <Icon key={index} name="star_unfilled_icon" />
              </TouchableOpacity>
            );
          }
        })}
        <View style={{height:15,width:1,backgroundColor:'#E4E7EB'}}/>
        <Text style={{left: 5}}>( {rating} ) </Text>
      </View>
    </View>
  );
};
const AddNewObservation2: FC<AddNewObservation2ScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15, paddingVertical: 0}}
      icon="reports_icon"
      title="New Observation">
      <View style={{marginVertical: 20}}>
        <LabelDropdown
          label="Select domain"
          placeHolder="Select domain"
          options={['']}
          setSelectedOption={setSelectedDomain}
          defaultValue={selectedDomain}
          bottom
        />
        <LabelDropdown
          label="Select indicator"
          placeHolder="Select indicator"
          defaultValue={selectedIndicator}
          options={['']}
          setSelectedOption={setSelectedIndicator}
          bottom
        />
        <RatingInput
          label="Average Rating"
          rating={rating}
          onChangeRating={setRating}
        />

        <FooterWithButtons
          onPressProceedButton={() => {
            navigate('NewObservationStack', {screen: ''});
          }}
          onPressCancelButton={() => {}}
          style={{marginTop: '75%'}}
        />
      </View>
    </Layout>
  );
};
export default AddNewObservation2;

const styles = StyleSheet.create({});
