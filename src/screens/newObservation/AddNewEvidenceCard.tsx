import React, { FC, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ProgressBarAndroid,
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
import { DocumentPickerResponse } from 'react-native-document-picker';
import { color } from 'react-native-elements/dist/helpers';

type AddNewEvidenceCardNavigationProp = StackNavigationProp<
  NewObservationStackParamList,
  'AddNewEvidenceCard'
>;
type AddNewEvidenceCardRouteProp = RouteProp<
  NewObservationStackParamList,
  'AddNewEvidenceCard'
>;

interface AddNewEvidenceCardScreenProps {
  navigation: AddNewEvidenceCardNavigationProp;
  route: AddNewEvidenceCardRouteProp;
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
const AddNewEvidenceCard: FC<AddNewEvidenceCardScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
  const [imageFiles, setImageFiles] = useState<DocumentPickerResponse[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>(80);

  function mergeArrays(...arrays: DocumentPickerResponse[][]): DocumentPickerResponse[] {
    return arrays.reduce((acc, curr) => [...acc, ...curr], []);
  }

  const handleFilesPicked = (files: DocumentPickerResponse[]) => {
    console.log("Files picked in main page:", imageFiles, files);
    const mergedArray: DocumentPickerResponse[] = mergeArrays(imageFiles, files);
    console.log("mergedArray", mergedArray);
    setImageFiles(mergedArray);
  };
  const ImageItem = ({ item }) => {
    return (
      <View style={styles.progressContainer}>
        <View style={{ flexDirection: 'row', width: '95%' }}>
          <View>
            {/* Render your icons based on item.type */}
            {/* <Image name='img_upload_icon' /> */}
            {/* <Image name='mic_icon' /> */}
            {/* <Image name='attachment' /> */}
          </View>
          <View>
            <Text style={styles.dropZoneText}>{item.name}</Text>
            {/* Render upload progress if needed */}
            {/* <Text style={styles.supportedTypes}>{` ${uploadProgress}% completed`}</Text> */}
          </View>
        </View>
        <TouchableOpacity style={{ alignSelf: 'center' }} onPress={onPress}>
          {/* Render your cross icon */}
          <Image name='cross_icon' />
          {/* <Icon style={{ marginLeft: 3, backgroundColor: 'transparent' }} name="cross_icon" /> */}
        </TouchableOpacity>
        {/* Render your progress bar if needed */}
        {/* <ProgressBarAndroid styleAttr="Horizontal" color="#749E35" indeterminate={false} progress={uploadProgress / 100} style={{ width: '100%' }} /> */}
      </View>
    );
  };

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

          <View style={{ marginTop: 8 }}>
            <RatingInput
              label="Average Rating"
              rating={rating}
              onChangeRating={setRating}
            />
          </View>

          <Text style={{ fontFamily: FONT_VARIANT.bold, fontSize: FONT_SIZES.body1, marginVertical: 20 }}>{"Upload Files"}</Text>
          <FileUpload onFilesPicked={handleFilesPicked} />

          <FlatList
            data={imageFiles}
            extraData={imageFiles}
            style={{ marginVertical: 10 }}
            renderItem={({ item }) => (
            
              <View style={styles.progressContainer}>
                <View style={{ flexDirection: 'row', width: '95%', }}>
                  <View>
                    {
                      item.type == 'image'
                    }
                    {/* <Image name='img_upload_icon' /> */}
                    {/* <Image name='mic_icon' /> */}
                    {/* <Image name='attachment' /> */}

                  </View>
                  <View>
                    <Text style={styles.dropZoneText}>{item.name}</Text>
                    {/* <Text style={styles.supportedTypes}>{` ${uploadProgress}% completed`}</Text> */}
                  </View>
                </View>
                <TouchableOpacity style={{ alignSelf: 'center', }}
                  onPress={() => {
                    console.log("mjjjj");
                  }}
                >
                  <Image name='cross_icon' />
                  {/* <Icon style={{ marginLeft: 3, backgroundColor: 'transparent' }} name="cross_icon" /> */}
                </TouchableOpacity>


                {/* <ProgressBarAndroid styleAttr="Horizontal" color="#749E35" indeterminate={false} progress={uploadProgress / 100} style={{ width: '100%' }} /> */}

              </View>

            )}
          />


        </View>
      </Layout>
      <FooterWithButtons
        onPressProceedButton={() => { navigate('NewObservationStack', { screen: 'ViewEvidenceCard' }) }}
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

const styles = StyleSheet.create({
  progressContainer: {
    borderWidth: 1,
    borderColor: '#ABB4BD',
    borderRadius: 5,
    padding: 8,
    marginBottom: 20,
    flexDirection: 'row'
  },
  uploadingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ABB4BD',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,


  },
  dropZoneText: {
    fontSize: FONT_SIZES.body1,
    fontFamily: FONT_VARIANT.semiBold,
    color: '#1F2933',
    marginLeft: 4
  },
  supportedTypes: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
