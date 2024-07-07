import React, {FC, useEffect, useState} from 'react';
import {View, Dimensions, ScrollView} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';
import Pdf from 'react-native-pdf';

import Layout from '../../components/Layout';
import {ObservationStackParamList} from '../../navigation/ObservationStack';
import VideoPlayer from '../../components/VideoPlayer'
import Text from '../../components/Text';

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
          style={{
            width,
            height: height / 2,
          }}
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
          style={{
            flex: 1,
            width,
            height: height / 2,
          }}
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
          contentContainerStyle={{
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          style={{
            width,
            height: height / 2,
          }}>
          <Text>{fileContent}</Text>
        </ScrollView>
      );
    default:
      return null;
  }
};

const PlayFile: FC<PlayFileScreenProps> = ({navigation, route}) => {
  const {file} = route.params;

  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{
        paddingHorizontal: 15,
        height: file.type?.includes('pdf') ? height : undefined,
      }}
      title={file.name}
      icon="search_reports_icon">
      {file.type?.includes('pdf') ? (
        <RenderFileContent uri={file.uri} type={file.type} />
      ) : (
        <View
          style={{
            alignItems: 'center',
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: '45%',
          }}>
          <RenderFileContent uri={file.uri} type={file.type} />
        </View>
      )}
    </Layout>
  );
};

export default PlayFile;
