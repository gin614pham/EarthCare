import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

interface Props {
  images: string[];
}

const ImageShow = ({images}: Props) => {
  return (
    <View style={style.container}>
      {images[0] && (
        <View style={[style.image_container, style.image_1]}>
          <Image source={{uri: images[0]}} style={style.image}></Image>
        </View>
      )}
      <View>
        {images[1] && (
          <View style={[style.image_container, style.image_2]}>
            <Image source={{uri: images[1]}} style={style.image}></Image>
          </View>
        )}
        {images[2] && (
          <View style={[style.image_container, style.image_3]}>
            <Image source={{uri: images[2]}} style={style.image}></Image>
          </View>
        )}
      </View>
      {images[3] && (
        <View style={[style.image_container, style.image_4]}>
          <Image source={{uri: images[3]}} style={style.image}></Image>
        </View>
      )}
      {images[4] && (
        <View style={[style.image_container, style.image_5]}>
          <Image source={{uri: images[4]}} style={style.image}></Image>
        </View>
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
    backgroundColor: 'red',
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
