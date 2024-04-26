import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Config from 'react-native-config';
import Geolocation from '@react-native-community/geolocation';

MapboxGL.setAccessToken(Config.MAPBOX_ACCESS_TOKEN || '');

type CompassViewMargins = {
  x: number /* FIX ME NO DESCRIPTION */;
  y: number /* FIX ME NO DESCRIPTION */;
};

const MapBox = () => {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);

  return (
    <View style={{flex: 1}}>
      <MapboxGL.MapView
        preferredFramesPerSecond={144}
        pitchEnabled={false}
        compassEnabled={true}
        compassFadeWhenNorth={true}
        compassViewPosition={3}
        compassViewMargins={{x: 10, y: 200}}
        style={{flex: 1}}>
        <MapboxGL.UserLocation
          visible
          onUpdate={location => {
            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }}
        />
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[location.longitude, location.latitude]}
          animationMode="flyTo"
          animationDuration={1000}
        />
      </MapboxGL.MapView>
    </View>
  );
};

export default MapBox;
