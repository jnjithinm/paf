import React, {FC, useEffect, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ProgressBarAndroid,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Image from '../../components/Image';
import FileUpload from '../../components/FileUpload';
import Icon from '../../components/Icon';
import FooterWithButtons from '../../components/FooterWithButtons';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  getAllDomains,
  getIndicatorsByDomainId,
} from '../../redux/features/masterSlice';
import LabeledDropdown, {
  DropdownObject,
} from '../../components/LabeledDropdown';
import {saveEvidenceCard} from '../../redux/features/observationSlice';
import {FileObject} from '../../config/types';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';

type AddNewEvidenceCardNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'AddNewEvidenceCard'
>;
type AddNewEvidenceCardRouteProp = RouteProp<
  ReportsTabBarStackParamList,
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
  size?: number;
  disabled?: boolean;
};

export const RatingInput: FC<RatingInputTypes> = ({
  label,
  rating,
  onChangeRating,
  size = 20,
  disabled,
}) => {
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
      {label && (
        <Text fontVariant="bold" size="body1">
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 5,
          width: '35%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {Array.from({length: 5}, (_, index) => {
          if (index < filledStars) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                disabled={disabled}>
                <Icon key={index} name="star_icon" width={size} height={size} />
              </TouchableOpacity>
            );
          } else if (index === filledStars && hasHalfStar) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name="star_half_filled_icon"
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name="star_unfilled_icon"
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          }
        })}
        <View style={{height: 15, width: 1, backgroundColor: '#E4E7EB'}} />
        <Text style={{left: 5}}>( {rating} ) </Text>
      </View>
    </View>
  );
};

const AddNewEvidenceCard: FC<AddNewEvidenceCardScreenProps> = ({
  navigation,
  route,
}) => {
  const {observationStatus, evidenceCardDetails} = route.params;
  const [selectedIndicator, setSelectedIndicator] = useState<
    DropdownObject | undefined
  >(undefined);
  const [selectedDomain, setSelectedDomain] = useState<
    DropdownObject | undefined
  >(undefined);
  const [rating, setRating] = useState<number>(0);
  const [imageFiles, setImageFiles] = useState<FileObject[]>([]);

  const dispatch = useAppDispatch();

  const {allDomains, indicatorsByDomain} = useAppSelector(
    state => state.master,
  );
  const {saveEvidenceCardResponse} = useAppSelector(state => state.observation);
  const {userData} = useAppSelector(state => state.auth);

  function mergeArrays(...arrays: FileObject[][]): FileObject[] {
    return arrays.reduce((acc, curr) => [...acc, ...curr], []);
  }

  const handleFilesPicked = (files: FileObject[]) => {
    const mergedArray: FileObject[] = mergeArrays(imageFiles, files);
    console.log(':fd', imageFiles, files);
    setImageFiles(mergedArray);
  };

  useEffect(() => {
    dispatch(getAllDomains());
  }, []);

  useEffect(() => {
    if (selectedDomain?.value) {
      dispatch(getIndicatorsByDomainId(Number(selectedDomain.value)));
    }
  }, [selectedDomain?.value]);

  const onPressSaveCard = () => {
    dispatch(
      saveEvidenceCard([
        {
          averageRating: rating,
          domainId: Number(selectedDomain?.value),
          indicatorId: Number(selectedIndicator?.value),
          loggedInUserName: userData?.name,
        },
        imageFiles,
      ]),
    );
  };

  useEffect(() => {
    if (evidenceCardDetails) {
      setSelectedDomain({
        value: evidenceCardDetails.domainId?.toString(),
        label: evidenceCardDetails.domainName,
      });
      setSelectedIndicator({
        value: evidenceCardDetails.indicatorId?.toString(),
        label: evidenceCardDetails.indicatorName,
      });
      setRating(evidenceCardDetails.averageRating);
      // setImageFiles(
      //  ,
      // );
    }
  }, [evidenceCardDetails]);

  useEffect(() => {
    if (saveEvidenceCardResponse) {
      navigation.navigate('ViewEvidenceCard');
    }
  }, [saveEvidenceCardResponse]);

  let isAllFieldsEntered = Boolean(
    selectedDomain?.value && selectedIndicator?.value && rating,
  );

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15, paddingVertical: 0}}
        icon="reports_icon"
        title="New Observation">
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Image name="evidence_icon" />
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: FONT_VARIANT.bold,
                fontSize: FONT_SIZES.body1,
              }}>
              {'Add new evidence cards'}
            </Text>
          </View>

          <LabeledDropdown
            label="Select domain"
            placeHolder="Select domain"
            options={
              allDomains?.payload?.map(item => ({
                value: item.domainId?.toString(),
                label: item.domainName,
              })) || []
            }
            setSelectedItem={setSelectedDomain}
            defaultValue={selectedDomain?.value?.toString() || ''}
            disabled={observationStatus === 'Completed'}
          />
          <LabeledDropdown
            label="Select indicator"
            placeHolder="Select indicator"
            defaultValue={selectedIndicator?.value || ''}
            options={
              indicatorsByDomain?.dataList?.map(item => ({
                value: item.indicatorId?.toString(),
                label: item.indicatorName,
              })) || []
            }
            setSelectedItem={setSelectedIndicator}
            disabled={observationStatus === 'Completed'}
          />

          <View style={{marginTop: 8}}>
            <RatingInput
              label="Average Rating"
              rating={rating}
              onChangeRating={setRating}
              disabled={observationStatus === 'Completed'}
            />
          </View>

          <Text
            style={{
              fontFamily: FONT_VARIANT.bold,
              fontSize: FONT_SIZES.body1,
              marginVertical: 20,
            }}>
            {'Upload Files'}
          </Text>
          <FileUpload
            onFilesPicked={handleFilesPicked}
            filesArray={
              evidenceCardDetails
                ? evidenceCardDetails.attachmentResponse.map(item => ({
                    uri: item.fileUrl,
                    name: item.fileName,
                    type: item.fileType,
                  }))
                : []
            }
            disabled={observationStatus === 'Completed'}
            onPressFile={item => {
              navigation.navigate('PlayFile', {file: item});
            }}
          />
        </View>
      </Layout>
      <FooterWithButtons
        onPressProceedButton={onPressSaveCard}
        proceedButtonText={'Save Card'}
        isActiveProceedButton={
          isAllFieldsEntered && observationStatus === 'New'
        }
        cancelButtonText={'Cancel'}
        onPressCancelButton={() => {
          navigation.navigate('ReportsMainPage');
        }}
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
    flexDirection: 'row',
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
  video: {
    width: '100%',
    height: 200,
  },
  dropZoneText: {
    fontSize: FONT_SIZES.body1,
    fontFamily: FONT_VARIANT.semiBold,
    color: '#1F2933',
    marginLeft: 4,
  },
  supportedTypes: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});
