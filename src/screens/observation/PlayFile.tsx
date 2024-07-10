import React, {FC, useEffect, useState} from 'react';
import {View, Dimensions, ScrollView, StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import Pdf from 'react-native-pdf';

import Layout from '../../components/Layout';
import {ObservationStackParamList} from '../../navigation/ObservationStack';
import VideoPlayer from '../../components/VideoPlayer';
import Text from '../../components/Text';
import {useAppSelector} from '../../redux/store';
import Button from '../../components/Button';
import colors from '../../config/colors';

type PlayFileNavigationProp = StackNavigationProp<
  ObservationStackParamList,
  'PlayFile'
>;
type PlayFileRouteProp = RouteProp<ObservationStackParamList, 'PlayFile'>;

interface PlayFileScreenProps {
  navigation: PlayFileNavigationProp;
  route: PlayFileRouteProp;
}

const {height, width} = Dimensions.get('window');

type RenderFileContentTypes = {
  uri: string;
  type: string;
};

const RenderFileContent: FC<RenderFileContentTypes> = ({uri, type}) => {
  const [fileContent, setFileContent] = useState<string>('');

  useEffect(() => {
    if (type?.includes('csv') || type?.includes('txt')) {
      fetch(uri)
        .then(response => response.text())
        .then(content => setFileContent(content))
        .catch(error => console.log('Failed to load file content', error));
    }
  }, [uri, type]);

  switch (true) {
    case type?.includes('png'):
    case type?.includes('jpg'):
    case type.includes('jpeg'):
      return (
        <FastImage
          style={styles.image}
          source={{
            uri,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
          onLoadStart={() => console.log('Loading started')}
          onLoadEnd={() => console.log('Loading finished')}
          onError={() => console.log('Failed to load image')}
        />
      );
    case type?.includes('mp4'):
    case type?.includes('avi'):
    case type?.includes('mov'):
    case type?.includes('wmv'):
    case type?.includes('flv'):
      return <VideoPlayer uri={uri} />;
    case type?.includes('pdf'):
      return (
        <Pdf
          source={{uri, cache: true}}
          style={styles.pdf}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          trustAllCerts={false}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
        />
      );
    case type?.includes('csv'):
    case type?.includes('txt'):
      return (
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}>
          <Text>{fileContent}</Text>
        </ScrollView>
      );
    default:
      return null;
  }
};

const PlayFile: FC<PlayFileScreenProps> = ({navigation, route}) => {
  const {file, files, onDelete} = route.params;
  const {newObservation} = useAppSelector(state => state.observation);

  console.log('new ', newObservation);

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={
        // styles.layout,
        {
          paddingHorizontal: 15,
          height: file.type?.includes('pdf') ? height : undefined,
        }
      }
      title={file.name}
      icon="search_reports_icon">
      {file.type?.includes('mp4') ? (
        <View style={styles.videoContainer}>
          <RenderFileContent uri={file.uri} type={file.type} />
          {newObservation && (
            <View style={styles.buttonContainer}>
              <Button
                text="Delete"
                active
                halfSize
                onPress={() => {
                  const newFiles = files.filter(item => item.uri !== file.uri);
                  onDelete(newFiles);
                  navigation.navigate('CreateViewEvidenceCard');
                }}
                style={styles.deleteButton}
                textStyle={styles.buttonText}
              />
              <Button
                text="Cancel"
                active
                halfSize
                onPress={() => {
                  navigation.navigate('CreateViewEvidenceCard');
                }}
                style={styles.cancelButton}
                textStyle={{color: '#EA7804'}}
              />
            </View>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.contentContainer,
            {marginTop: file.type?.includes('pdf') ? 0 : '45%'},
          ]}>
          <RenderFileContent uri={file.uri} type={file.type} />
        </View>
      )}
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    paddingHorizontal: 15,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '55%',
  },
  buttonContainer: {
    // position: 'absolute',
    marginTop: '65%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#EA7804',
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    borderColor: '#EA7804',
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  buttonText: {
    color: '#FFFFFF',
  },
  contentContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  image: {
    width,
    height: height / 2,
  },
  pdf: {
    flex: 1,
    width,
    height: height / 2,
  },
  scrollView: {
    width,
    height: height / 2,
  },
  scrollViewContent: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlayFile;
