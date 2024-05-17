import React, { FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FONT_SIZES, FONT_VARIANT } from '../../config/themes';
import Layout from '../../components/Layout';
import LabelDropdown from '../../components/LabelDropdown';
import { ReportsTabBarStackParamList } from '../../navigation/ReportsTabStack';
import Text from '../../components/Text';
import Image from '../../components/Image';
import colors from '../../config/colors';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';
import FileUpload from '../../components/FileUpload';
import Icon from '../../components/Icon';
import { navigate } from '../../utils/helpers/navigationHelpers';
import { NewObservationStackParamList } from '../../navigation/NewObservationStack';
import FooterWithButtons from '../../components/FooterWithButtons';
import FilterComponent from '../../components/FilterComponent';

type AddNewObservation2NavigationProp = StackNavigationProp<
  NewObservationStackParamList,
  'AddNewEvidenceCard'
>;
type AddNewObservation2RouteProp = RouteProp<
  NewObservationStackParamList,
  'AddNewEvidenceCard'
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

const RatingInput: FC<RatingInputTypes> = ({ label, rating, onChangeRating }) => {
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
      <Text fontVariant="bold" size="body1">
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          width: '35%',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
        {Array.from({ length: 5 }, (_, index) => {
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
        <View style={{ height: 15, width: 1, backgroundColor: '#E4E7EB' }} />
        <Text style={{ left: 5 }}>( {rating} ) </Text>
      </View>
    </View>
  );
};
const AddNewEvidenceCard: FC<AddNewObservation2ScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, }} // Ensure the component takes up the whole screen
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    >
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{ paddingHorizontal: 15, paddingVertical: 0 }}
        icon="reports_icon"
        title="New Observation">
        <View style={{ marginVertical: 20 }}>
          <View style={{ flexDirection: 'row' }}>
            <Image name='evidence_icon' />
            <Text style={{ alignSelf: 'center', fontFamily: FONT_VARIANT.bold, fontSize: FONT_SIZES.body1 }}>
              {"Add new evidence cards"}</Text>
          </View>

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

          <View style ={{marginTop: 8}}>
            <RatingInput
              label="Average Rating"
              rating={rating}
              onChangeRating={setRating}
            />
          </View>

          <Text style={{ fontFamily: FONT_VARIANT.bold, fontSize: FONT_SIZES.body1, marginVertical: 20 }}>{"Upload Files"}</Text>
          <FileUpload />

          <FilterComponent />


        </View>
      </Layout>
      <FooterWithButtons
        onPressProceedButton={() => { navigate('NewObservationStack', { screen: 'AddNewEvidenceCard' }) }}
        proceedButtonText={'Save Card'}
        isActiveProceedButton={true}
        cancelButtonText={'Cancel'}
        onPressCancelButton={() => { }}
        style={{}}
      />
    </KeyboardAvoidingView>
  );
};
export default AddNewEvidenceCard;

const styles = StyleSheet.create({});
