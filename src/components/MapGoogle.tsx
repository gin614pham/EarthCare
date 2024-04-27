import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/FontAwesome6';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width: windowWidth,
    height: windowHeight,
  },
  locationButton: {
    position: 'absolute',
    top: windowHeight * 0.75,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  centerMarker: {},
});

const MapGoogle = ({setRegionAddF}) => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [centerMarkerCoordinate, setCenterMarkerCoordinate] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const mapViewRef = useRef(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      const initialRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      setRegion(initialRegion);
    });
  }, []);

  const handleGetCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      setRegion(newRegion);
      mapViewRef.current.animateToRegion(newRegion, 1000);
    });
  };

  const handleRegionChangeComplete = region => {
    setCenterMarkerCoordinate(region);
    setRegionAddF(region);
  };

  return (
    <View style={styles.container}>
      <View>
        <MapView
          ref={mapViewRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={handleRegionChangeComplete}>
          <Marker coordinate={centerMarkerCoordinate}>
            <Icon1
              name="location"
              size={40}
              color="blue"
              style={{
                display: 'none',
              }}
            />
          </Marker>
        </MapView>
        <Icon1
          name="location"
          size={40}
          color="blue"
          style={{
            position: 'absolute',
            top: windowHeight * 0.45,
            left: windowWidth * 0.5 - 21,
          }}
        />
      </View>

      <TouchableOpacity style={styles.locationButton}>
        <Text>
          <Icon2 name="location-crosshairs" size={50} color="blue" />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MapGoogle;
