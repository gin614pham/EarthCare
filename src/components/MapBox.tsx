import React from 'react';
import {Text, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Config from 'react-native-config';

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN || '');

const MapBox = () => {
  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView style={{flex: 1}} />
    </View>
  );
};

export default MapBox;
