import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';

interface VideoPlayerProps {
  uri: string;
  isFullscreen?: boolean;
  onFullscreenChange?: (isFullscreen: boolean) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri, isFullscreen = false, onFullscreenChange }) => {
  useEffect(() => {
    if (isFullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }
  }, [isFullscreen]);

  return (
    <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
      <Video
        source={{ uri }}
        style={isFullscreen ? styles.fullscreenVideo : styles.video}
        controls={true}
        resizeMode="contain"
        onFullscreenPlayerWillPresent={() => onFullscreenChange && onFullscreenChange(true)}
        onFullscreenPlayerWillDismiss={() => onFullscreenChange && onFullscreenChange(false)}
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
    // marginTop:"20%"
  },
  video: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  fullscreenVideo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default VideoPlayer;
