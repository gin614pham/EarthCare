import React, {useEffect, useState} from 'react';
import {
  View,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  StatusBar,
} from 'react-native';
import Map from '../components/Map';

const HomeScreen = () => {
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'EarthCare needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Location Permission',
            'EarthCare needs access to your location',
          );
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
});
