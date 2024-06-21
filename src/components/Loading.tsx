import {View, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';



interface LoadingPropsTypes {
  size?: number;
  IsProcessingScreen?: boolean;
  timer?: number;
}
const Loading: React.FC<LoadingPropsTypes> = ({
  size = 150,
  IsProcessingScreen,
  timer,
}) => {
  return (
    <View style={[styles.loadingContainer]}>
      <View
        style={[
          styles.loadingBackground,
        ]}
      />
      <View style={[styles.loading]}>

        <LottieView
          source={require('../assets/json/Loader.json')}
          speed={2}
          autoPlay
          loop
          style={{
            width: size,
            height: size,
          }}
        />

      </View>
    </View>
  );
};
export default Loading;
const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
  },

});
