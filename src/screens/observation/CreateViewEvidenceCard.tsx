import React, {FC, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
import FileUpload, {FileItem} from '../../components/FileUpload';
import FooterWithButtons from '../../components/FooterWithButtons';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {
  getAllDomains,
  getIndicatorsByDomainId,
} from '../../redux/features/masterSlice';
import LabeledDropdown from '../../components/LabeledDropdown';
import {
  deleteAttachments,
  resetSaveEvidenceCardResponse,
  resetSaveObservationResponse,
  saveEvidenceCard,
  saveNewEvidenceCardList,
  saveObservation,
  saveObservationId,
} from '../../redux/features/observationSlice';
import {FileObject, ItemType} from '../../config/types';
import RatingInput from '../../components/RatingInput';
import {ObservationStackParamList} from '../../navigation/ObservationStack';
import Modal from '../../components/Modal';
import Sound from 'react-native-sound';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import Slider from '../../components/Slider';
import {setLoading} from '../../redux/features/authSlice';
import moment from 'moment';
import {convertEvidenceCardListToRequest} from './AddNewObservation';
import colors from '../../config/colors';

type CreateViewEvidenceCardNavigationProp = StackNavigationProp<
  ObservationStackParamList,
  'CreateViewEvidenceCard'
>;
type CreateViewEvidenceCardRouteProp = RouteProp<
  ObservationStackParamList,
  'CreateViewEvidenceCard'
>;
type RenderMusicPlayerModalContentTypes = {
  file: FileObject | undefined;
};

const RenderMusicPlayerModalContent: FC<RenderMusicPlayerModalContentTypes> = ({
  file,
}) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (file) {
      const soundInstance = new Sound(file.uri, '', error => {
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        setSound(soundInstance);
        setDuration(soundInstance.getDuration());
      });

      return () => {
        soundInstance.release();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [file?.uri]);

  const handlePlayPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause();
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        sound.play(success => {
          if (!success) {
            console.log('Sound playback failed');
          }
          setIsPlaying(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        });
        setIsPlaying(true);
        intervalRef.current = setInterval(() => {
          sound.getCurrentTime(time => {
            setCurrentTime(time);
          });
        }, 1000);
      }
    }
  };

  const handleSliderChange = (value: number) => {
    if (sound) {
      sound.setCurrentTime(value);
      setCurrentTime(value);
    }
  };

  const renderTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  };

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50,
      }}>
      <View style={{backgroundColor: '#FCEBC5', padding: 5, borderRadius: 10}}>
        <Icon name="music_player_icon" />
      </View>
      <Text
        size="small1"
        style={{paddingHorizontal: '20%', marginVertical: 20}}
        fontVariant="bold">
        {file?.name}
      </Text>
      <TouchableOpacity onPress={handlePlayPause}>
        <Icon name={'play_button_music_player_icon'} />
      </TouchableOpacity>
      {duration !== null && (
        <View style={{width: '80%', marginTop: 20}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text fontVariant="bold" style={{color: '#4E565F'}}>
              {renderTime(currentTime)}
            </Text>
            <Text fontVariant="bold" style={{color: '#ABB4BD'}}>
              {renderTime(duration)}
            </Text>
          </View>
          <Slider
            value={currentTime}
            onChange={handleSliderChange}
            maxValue={duration}
            minValue={0}
          />
        </View>
      )}
    </View>
  );
};

interface CreateViewEvidenceCardScreenProps {
  navigation: CreateViewEvidenceCardNavigationProp;
  route: CreateViewEvidenceCardRouteProp;
}

const CreateViewEvidenceCard: FC<CreateViewEvidenceCardScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<
    ItemType | undefined
  >(undefined);
  const [selectedDomain, setSelectedDomain] = useState<ItemType | undefined>(
    undefined,
  );
  const [rating, setRating] = useState<number>(0);
  const [selectedMusicFile, setSelectedMusicFile] = useState<FileObject>();
  const [isVisibleMusicPlayerModal, setIsVisibleMusicPlayerModal] =
    useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [zipfile, setZipFile] = useState<FileObject>();
  const [deleteAttachmentIds, setDeleteAttachmentIds] = useState<number[]>([]);

  const dispatch = useAppDispatch();

  const {allDomains, indicatorsByDomain} = useAppSelector(
    state => state.master,
  );
  const {
    saveEvidenceCardResponse,
    evidenceCardDetails,
    newObservation,
    observationId,
    observationById,
    saveObservationResponse,
    newEvidenceCardsList,
  } = useAppSelector(state => state.observation);
  const {userData} = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(getAllDomains());
  }, []);

  const resetState = () => {
    setSelectedIndicator(undefined);
    setSelectedDomain(undefined);
    setRating(0);
    setSelectedMusicFile(undefined);
    setIsVisibleMusicPlayerModal(false);
    setFiles([]);
    setZipFile(undefined);
    setDeleteAttachmentIds([]);
  };

  useEffect(() => {
    return () => {
      resetState();
    };
  }, []);

  useEffect(() => {
    if (selectedDomain?.value) {
      dispatch(getIndicatorsByDomainId(Number(selectedDomain.value)));
    }
  }, [selectedDomain?.value]);

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
      setFiles(
        evidenceCardDetails?.attachmentResponse.map((item, index) => ({
          uri: item.fileUrl,
          type: item.fileType,
          name: item.fileName,
        })),
      );
    }
  }, [evidenceCardDetails]);

  useEffect(() => {
    if (saveObservationResponse) {
      dispatch(resetSaveObservationResponse());
      dispatch(saveObservationId(saveObservationResponse.id));
      resetState();
      navigation.navigate('ObservationReport');
    }
  }, [saveObservationResponse]);

  const onPressSaveCard = () => {
    if (zipfile) {
      if (evidenceCardDetails) {
        if (deleteAttachmentIds.length !== 0) {
          dispatch(
            deleteAttachments({
              ids: deleteAttachmentIds,
              loggedInUserName: userData.userName,
            }),
          );
        }
        dispatch(
          saveEvidenceCard([
            {
              averageRating: rating,
              domainId: Number(selectedDomain?.value),
              indicatorId: Number(selectedIndicator?.value),
              loggedInUserName: userData?.userName,
            },
            zipfile,
            evidenceCardDetails.evidenceId,
          ]),
        );
      } else {
        dispatch(
          saveEvidenceCard([
            {
              averageRating: rating,
              domainId: Number(selectedDomain?.value),
              indicatorId: Number(selectedIndicator?.value),
              loggedInUserName: userData?.userName,
            },
            zipfile,
          ]),
        );
      }
    }
  };

  // useEffect(() => {
  //   if (evidenceCardDetails) {
  //     setSelectedDomain({
  //       value: evidenceCardDetails.domainId?.toString(),
  //       label: evidenceCardDetails.domainName,
  //     });
  //     setSelectedIndicator({
  //       value: evidenceCardDetails.indicatorId?.toString(),
  //       label: evidenceCardDetails.indicatorName,
  //     });
  //     setRating(evidenceCardDetails.averageRating);
  //   }
  // }, [evidenceCardDetails]);

  useEffect(() => {
    if (saveEvidenceCardResponse) {
      if (observationId && observationById) {
        dispatch(
          saveObservation([
            {
              observationDate: observationById?.observationDate,
              observationStatus: observationById.observationStatus,
              feedbackDescription: observationById.feedbackDescription,
              userGroupId: observationById.userGroupId,
              userId: observationById.userId,
              loggedInUserName: userData.userName,
              evidenceRequestList: [
                ...convertEvidenceCardListToRequest(
                  newEvidenceCardsList || [],
                  userData.userName,
                ),
                ...convertEvidenceCardListToRequest(
                  observationById.evidenceResponseList,
                  userData.userName,
                ),
              ],
            },
            observationId,
          ]),
        );
      } else {
        resetState();
        navigation.navigate('ObservationReport');
      }
    }
  }, [saveEvidenceCardResponse]);

  let isAllFieldsEntered = Boolean(
    selectedDomain?.value &&
      selectedIndicator?.value &&
      rating &&
      files.length !== 0 &&
      isChanged,
  );

  let isDisabledFields = Boolean(
    observationById !== null &&
      evidenceCardDetails  &&
      observationById?.observationStatus === 'Completed',
  );


  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15, paddingVertical: 0}}
        onPressBackArrow={() => {
          resetState();
          navigation.goBack();
        }}
        icon="reports_icon"
        title={newObservation ? 'New Observation' : 'Evidence Card'}>
        <Modal
          onProceed={function (): void {
            throw new Error('Function not implemented.');
          }}
          onClose={() => {
            setIsVisibleMusicPlayerModal(false);
          }}
          content={<RenderMusicPlayerModalContent file={selectedMusicFile} />}
          contentStyle={{width: '100%'}}
          title="Audio"
          closeButton
          isVisible={isVisibleMusicPlayerModal}
        />
        <View style={{marginVertical: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Image name="evidence_icon" />
            <Text
              style={{
                alignSelf: 'center',
                fontFamily: FONT_VARIANT.bold,
                fontSize: FONT_SIZES.body1,
                left: 5,
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
            onChangeItem={item => {
              setIsChanged(true);
            }}
            setSelectedItem={setSelectedDomain}
            defaultValue={selectedDomain?.value?.toString() || ''}
            disabled={isDisabledFields}
          />
          <LabeledDropdown
            label="Select indicator"
            placeHolder="Select indicator"
            defaultValue={selectedIndicator?.value || ''}
            onChangeItem={item => {
              setIsChanged(true);
            }}
            options={
              indicatorsByDomain?.dataList?.map(item => ({
                value: item.indicatorId?.toString(),
                label: item.indicatorName,
              })) || []
            }
            setSelectedItem={setSelectedIndicator}
            disabled={isDisabledFields}
          />

          <View style={{marginTop: 8}}>
            <RatingInput
              label="Average Rating"
              rating={rating}
              onChangeRating={setRating}
              disabled={isDisabledFields}
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
          <View>
            <FileUpload
              setZipFile={setZipFile}
              files={files}
              setFiles={setFiles}
              disabled={isDisabledFields}
              onPressDelete={item => {
                if (evidenceCardDetails) {
                  setIsChanged(true);
             
                  let idToDelete =
                    evidenceCardDetails?.attachmentResponse?.find(
                      ele => ele.fileUrl === item.uri,
                    )?.attachmentId;
                  if (idToDelete) {
                    setDeleteAttachmentIds(prev => [...prev, idToDelete]);
                  }
                }
              }}
              onSelectFile={() => {
                setIsChanged(true);
              }}
              onPressFile={file => {
                file?.uri?.includes('mp3') || file?.uri?.includes('m4a')
                  ? (setSelectedMusicFile(file),
                    setIsVisibleMusicPlayerModal(true))
                  : navigation.navigate('PlayFile', {file});
              }}
            />
          </View>
        </View>
      </Layout>
      {!isDisabledFields && (
        <FooterWithButtons
          onPressProceedButton={onPressSaveCard}
          proceedButtonText={'Save Card'}
          isActiveProceedButton={isAllFieldsEntered}
          cancelButtonText={'Cancel'}
          onPressCancelButton={() => {
            newObservation
              ? navigation.navigate('AddNewObservation')
              : navigation.navigate('ObservationReport');
          }}
          style={{}}
        />
      )}
    </KeyboardAvoidingView>
  );
};
export default CreateViewEvidenceCard;
