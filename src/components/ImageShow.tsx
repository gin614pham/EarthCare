import React from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Animated from 'react-native-reanimated';
import transition from './ImageSharedTransition';

interface Props {
  images: string[];
}

const ImageShow = ({images}: Props) => {
  const nav = useNavigation();

  const handlePress = (image: string) => {
    nav.navigate('ImageDetailScreen', {image});
  };

  return (
    <View style={style.container}>
      {images[0] && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress(images[0])}
          style={[style.image_container, style.image_1]}>
          <Animated.Image
            sharedTransitionTag={`image_detail_${images[0]}`}
            sharedTransitionStyle={transition}
            source={{uri: images[0]}}
            style={style.image}></Animated.Image>
        </TouchableOpacity>
      )}
      <View>
        {images[1] && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handlePress(images[1])}
            style={[style.image_container, style.image_2]}>
            <Animated.Image
              sharedTransitionTag={`image_detail_${images[1]}`}
              sharedTransitionStyle={transition}
              source={{uri: images[1]}}
              style={style.image}></Animated.Image>
          </TouchableOpacity>
        )}
        {images[2] && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handlePress(images[2])}
            style={[style.image_container, style.image_3]}>
            <Animated.Image
              sharedTransitionTag={`image_detail_${images[2]}`}
              sharedTransitionStyle={transition}
              source={{uri: images[2]}}
              style={style.image}></Animated.Image>
          </TouchableOpacity>
        )}
      </View>
      {images[3] && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress(images[3])}
          style={[style.image_container, style.image_4]}>
          <Animated.Image
            sharedTransitionTag={`image_detail_${images[3]}`}
            sharedTransitionStyle={transition}
            source={{uri: images[3]}}
            style={style.image}></Animated.Image>
        </TouchableOpacity>
      )}
      {images[4] && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => handlePress(images[4])}
          style={[style.image_container, style.image_5]}>
          <Animated.Image
            sharedTransitionTag={`image_detail_${images[4]}`}
            sharedTransitionStyle={transition}
            source={{uri: images[4]}}
            style={style.image}></Animated.Image>
        </TouchableOpacity>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  image_container: {
    backgroundColor: '#d7d5d5ee',
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image_1: {
    width: 220,
    height: 220,
  },
  image_2: {
    width: 105,
    height: 105,
  },
  image_3: {
    width: 105,
    height: 105,
  },
  image_4: {
    width: 162.5,
    height: 162.5,
  },
  image_5: {
    width: 162.5,
    height: 162.5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export default ImageShow;
