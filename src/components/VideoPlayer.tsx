import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

interface VideoPlayerProps {
  source: {
    uri: string;
  };
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ source }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onEnterFullscreen = () => {
    setIsFullscreen(true);
    Orientation.lockToLandscape();
  };

  const onExitFullscreen = () => {
    setIsFullscreen(false);
    Orientation.lockToPortrait();
  };

  return (
    <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
      <Video
        source={source}
        style={isFullscreen ? styles.fullscreenVideo : styles.video}
        controls={true}
        resizeMode="contain"
        onFullscreenPlayerWillPresent={onEnterFullscreen}
        onFullscreenPlayerWillDismiss={onExitFullscreen}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 200,
  },
  fullscreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default VideoPlayer;
