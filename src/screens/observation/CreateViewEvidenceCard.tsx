import React, {FC, useEffect, useState} from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import {FONT_SIZES, FONT_VARIANT} from '../../config/themes';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Image from '../../components/Image';
import FileUpload from '../../components/FileUpload';
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
import RatingInput from '../../components/RatingInput';
import { navigate } from '../../utils/helpers/navigationHelpers';

type CreateViewEvidenceCardNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'CreateViewEvidenceCard'
>;
type CreateViewEvidenceCardRouteProp = RouteProp<
  ReportsTabBarStackParamList,
  'CreateViewEvidenceCard'
>;

interface CreateViewEvidenceCardScreenProps {
  navigation: CreateViewEvidenceCardNavigationProp;
  route: CreateViewEvidenceCardRouteProp;
}

const CreateViewEvidenceCard: FC<CreateViewEvidenceCardScreenProps> = ({
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
console.log("dasf",imageFiles)
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
      // navigation.navigate('ViewEvidenceCard');
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
        title={evidenceCardDetails ? 'Evidence Card' : 'New Observation'}>
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Image name="evidence_icon" />
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: FONT_VARIANT.bold,
                fontSize: FONT_SIZES.body1,
                left:5
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
          navigation.navigate('ObservationReportsMainPage')
        }}
        style={{}}
      />
    </KeyboardAvoidingView>
  );
};
export default CreateViewEvidenceCard;


