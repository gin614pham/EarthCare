import {ImageBackground, StyleSheet, View} from 'react-native';
import React from 'react';
import Animated from 'react-native-reanimated';
import transition from '../../components/ImageSharedTransition';

const ImageDetailScreen = (route: any) => {
  const {image} = route.route.params;
  return (
    <View style={stylesImage.container}>
      <ImageBackground
        source={{uri: image}}
        style={stylesImage.image_background}
        blurRadius={90}
        resizeMode="cover">
        <Animated.Image
          sharedTransitionTag={`image_detail_${image}`}
          sharedTransitionStyle={transition}
          source={{uri: image}}
          style={stylesImage.image}
          resizeMode="contain"
        />
      </ImageBackground>
    </View>
  );
};

export default ImageDetailScreen;

const stylesImage = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  image_background: {
    width: '100%',
    height: '100%',
  },
});
