import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import firestore from '@react-native-firebase/firestore';
import Geolocation from '@react-native-community/geolocation';
import ImageCropPicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/AntDesign';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Map from '../components/Map';
import MapGoogle from '../components/MapGoogle';
import {Button} from 'react-native-paper';

const AddLocationScreen = ({navigation}: any) => {
  const [locationInfo, setLocationInfo] = useState({
    address: '',
    locationType: '',
    description: '',
    image: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [locationAdd, setLocationAdd] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const handleAddLocation = async () => {
    Keyboard.dismiss();
    try {
      // Add location to Firestore
      await firestore()
        .collection('locations')
        .add({
          ...locationInfo,
          latitude: locationAdd.latitude,
          longitude: locationAdd.longitude,
        });

      Alert.alert('Success', 'Location added successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to add location' + '\n' + error);
    }
  };

  const handleChooseImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      // Set the chosen image
      setLocationInfo(prevState => ({
        ...prevState,
        image: image.path,
      }));
    });
  };

  const handleTakePhoto = () => {
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      // Set the taken photo
      setLocationInfo(prevState => ({
        ...prevState,
        image: image.path,
      }));
    });
  };

  const handleChange = (name: string, value: string) => {
    setLocationInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveLocation = () => {
    setModalVisible(false);
    const {latitude, longitude} = locationAdd;
    console.log('Location', latitude, longitude);
  };

  const setRegionAddF = (region: any) => {
    setLocationAdd(region);
  };

  return (
    <View style={loginStyles.container}>
      <View style={loginStyles.input_container}>
        <Button
          icon="map"
          mode="contained"
          onPress={() => setModalVisible(true)}>
          Choose Location
        </Button>

        <Modal visible={modalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <MapGoogle
              style={styles.map}
              setRegionAddF={(region: any) => {
                setRegionAddF(region);
              }}></MapGoogle>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                setModalVisible(false);
                handleSaveLocation();
              }}>
              <Text style={styles.buttonText}>Save Location</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <TextInput
          style={loginStyles.input}
          placeholder="Address"
          value={locationInfo.address}
          onChangeText={text => handleChange('address', text)}
        />
        <View style={loginStyles.dropdown}>
          <Picker
            selectedValue={locationInfo.locationType}
            onValueChange={itemValue =>
              handleChange('locationType', itemValue)
            }>
            <Picker.Item label="Select Location Type" value="" />
            <Picker.Item label="Recycling Center" value="Recycling Center" />
          </Picker>
        </View>
        <TextInput
          style={loginStyles.input}
          placeholder="Description"
          value={locationInfo.description}
          onChangeText={text => handleChange('description', text)}
        />
        <View style={styles.image_container}>
          <View style={styles.imagePreview}>
            {locationInfo.image ? (
              <Image
                source={{uri: locationInfo.image}}
                style={{width: 100, height: 100}}
              />
            ) : null}
          </View>
          <View style={{flexDirection: 'column'}}>
            <Button
              icon="image"
              mode="contained"
              onPress={handleChooseImage}
              style={{marginTop: 10}}>
              Choose Image
            </Button>

            <Button
              icon="camera"
              mode="contained"
              onPress={handleTakePhoto}
              style={{marginTop: 10}}>
              Take Photo
            </Button>
          </View>
        </View>
      </View>
      <TouchableOpacity style={loginStyles.button} onPress={handleAddLocation}>
        <Text style={loginStyles.button_text}>Add Location</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddLocationScreen;

const styles = StyleSheet.create({
  image_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    gap: 30,
  },
  imagePreview: {
    width: 180,
    height: 180,
    backgroundColor: '#ccc',
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },
});