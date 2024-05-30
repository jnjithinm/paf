import React, {FC} from 'react';
import {Image, View} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import Icon, {IconTypes} from '../../components/Icon';
import {ReportsTabBarStackParamList} from '../../navigation/ReportsTabStack';
import VideoPlayer from '../../components/VideoPlayer';

type PlayFileNavigationProp = StackNavigationProp<
  ReportsTabBarStackParamList,
  'PlayFile'
>;
type PlayFileRouteProp = RouteProp<ReportsTabBarStackParamList, 'PlayFile'>;

interface PlayFileScreenProps {
  navigation: PlayFileNavigationProp;
  route: PlayFileRouteProp;
}

const PlayFile: FC<PlayFileScreenProps> = ({navigation, route}) => {
  const {file} = route.params;
  console.log("ur",file)
  return (
    <Layout
      overridePaddingHorizontal
      overridePaddingVertical
      style={{paddingHorizontal: 15,marginTop:'50%'}}
      title={file.name}
      icon="search_reports_icon"
      >
      {file.type?.includes('png') ||
      file.type?.includes('jpg') ||
      file.type?.includes('jpeg') ? (
        <Image source={{uri:file.uri}} />
      ) : file.type?.includes('mp4') ? (
        <VideoPlayer source={file} />
      ) : (
        <></>
      )}
    </Layout>
  );
};
export default PlayFile;
