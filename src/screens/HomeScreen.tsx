import React, {useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
<<<<<<< HEAD
import Map from '../components/Map';
=======
import MapBox from '../components/MapBox';
>>>>>>> 0c6e4454209202f48d70c093fb71e94e616580c8

const HomeScreen = () => {
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ];

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      for (const permission in granted) {
        if (granted[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
          handlePermissionDenied(permission);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handlePermissionDenied = permission => {
    let message = '';
    switch (permission) {
      case PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION:
        message = 'Location permission is required to use this feature.';
        break;
      case PermissionsAndroid.PERMISSIONS.CAMERA:
        message = 'Camera permission is required to use this feature.';
        break;
      case PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES:
        message = 'Media permission is required to use this feature.';
        break;
      default:
        message = 'Unknown permission is required to use this feature.';
    }

    Alert.alert(
      'Permission Denied',
      message,
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  };

  const handlePresentModalOpen = () => {
    bottomSheetRef.current?.expand();
  };
  const handlePresentModalClose = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <View style={styles.container}>
<<<<<<< HEAD
      {/* <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
=======
      <MapBox />
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
>>>>>>> 0c6e4454209202f48d70c093fb71e94e616580c8
        <View style={styles.contentContainerStyle}>
          <Text>Awesome 🎉</Text>
          <Text>Áds</Text>
          <Text>Waka wake ê ê</Text>
          <Text>ccccccccccccc</Text>
        </View>
      </BottomSheet> */}
      <Map />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
});
