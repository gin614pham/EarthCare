import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  Image,
  StyleSheet,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import loginStyles from '../styles/loginStyle';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from '@react-native-picker/picker';
import {Location} from '../types';
import Geolocation from '@react-native-community/geolocation';
import {getCurrentLocation} from '../api/googleMapAPI';
import UserContext from '../context/UserContext';

const AddLocationScreen = ({navigation}: any) => {
  const [locationInfo, setLocationInfo] = useState<Location>({
    address: '',
    description: '',
    image: [],
    locationType: '',
    longitude: 0,
    latitude: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [locationAdd, setLocationAdd] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const {user} = useContext(UserContext);

  const getCurrentPosition = async () => {
    Geolocation.getCurrentPosition(position => {
      setLocationAdd({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
      // get current location address from lat and long
    });
    const currentLocation = await getCurrentLocation(
      locationAdd.latitude,
      locationAdd.longitude,
    );
    handleChange('address', currentLocation);
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const handleAddLocation = async () => {
    Keyboard.dismiss();
    try {
      locationInfo.latitude = locationAdd.latitude;
      locationInfo.longitude = locationAdd.longitude;
      const docRef = await firestore().collection('locations').doc(); // Tạo một ID mới
      await docRef.set({
        ...locationInfo,
        userId: user.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Location added successfully');
      navigation.navigate('BottomTabs');
    } catch (error) {
      Alert.alert('Error', 'Failed to add location' + '\n' + error);
    }
  };

  const handleChooseImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      setLocationInfo(prevState => ({
        ...prevState,
        image: [...prevState.image],
      }));
      const uploadUri =
        Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;
      const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`avatars/${filename}`);
      storageRef
        .putFile(uploadUri)
        .then(async () => {
          setIsImageLoading(true);
          const downloadUrl = await storageRef.getDownloadURL();
          setLocationInfo(prevState => ({
            ...prevState,
            image: [...prevState.image, downloadUrl],
          }));
        })
        .catch(error => {
          console.error('Error uploading image: ', error);
        });
    });
  };

  const handleTakePhoto = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      setLocationInfo(prevState => ({
        ...prevState,
        image: [...prevState.image],
      }));
      const uploadUri =
        Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;
      const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`avatars/${filename}`);
      storageRef
        .putFile(uploadUri)
        .then(async () => {
          setIsImageLoading(true);
          const downloadUrl = await storageRef.getDownloadURL();
          setLocationInfo(prevState => ({
            ...prevState,
            image: [...prevState.image, downloadUrl],
          }));
        })
        .catch(error => {
          console.error('Error uploading image: ', error);
        });
    });
  };

  const handlePressAddImage = () => {
    Alert.alert(
      'Choose Image',
      '',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Camera',
          onPress: handleTakePhoto,
        },
        {
          text: 'Gallery',
          onPress: handleChooseImage,
        },
      ],
      {cancelable: true},
    );
  };

  const handleDeleteImage = () => {
    setLocationInfo(prevState => ({
      ...prevState,
      image: [],
    }));
  };

  const handleChange = (name: string, value: string) => {
    setLocationInfo(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView fadingEdgeLength={10}>
        <Text style={styles.text_header}>Address: </Text>
        <View style={styles.input_container}>
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={locationInfo.address}
            onChangeText={text => handleChange('address', text)}
          />
          <TouchableOpacity onPress={getCurrentPosition}>
            <Image
              resizeMode="contain"
              source={require('../assets/icons/location.png')}
              style={{width: 30, height: 30}}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.text_header}>Location Type: </Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={locationInfo.locationType}
            onValueChange={itemValue =>
              handleChange('locationType', itemValue)
            }>
            <Picker.Item
              label="Select Location Type"
              value=""
              style={{
                fontSize: 15,
              }}
            />
            <Picker.Item
              label="Recycling Center"
              value="Recycling Center"
              style={{
                fontSize: 15,
              }}
            />
            <Picker.Item
              label="Garbage Dump"
              value="Garbage Dump"
              style={{
                fontSize: 15,
              }}
            />
            <Picker.Item
              label="Polluted Area"
              value="Polluted Area"
              style={{
                fontSize: 15,
              }}
            />
          </Picker>
        </View>
        <Text style={styles.text_header}>Description: </Text>
        <TextInput
          style={styles.multiline_input}
          placeholder="Description"
          multiline
          numberOfLines={4}
          value={locationInfo.description}
          onChangeText={text => handleChange('description', text)}
        />

        <Text style={styles.text_header}>Image: </Text>
        <View style={styles.image_container}>
          <ScrollView horizontal={true} style={{padding: 5}}>
            {locationInfo.image ? (
              <>
                {locationInfo.image.map((image, index) => (
                  <View style={styles.image_preview} key={index}>
                    <Image
                      source={{uri: image}}
                      style={{
                        width: 90,
                        height: 90,
                        margin: 4,
                        borderRadius: 6,
                      }}
                      resizeMethod="scale"
                      resizeMode="cover"
                      onLoadStart={() => {
                        setIsImageLoading(true);
                      }}
                      onLoadEnd={() => {
                        setIsImageLoading(false);
                      }}
                    />
                    {isImageLoading && (
                      <ActivityIndicator
                        style={styles.loader}
                        animating
                        size="small"
                        color="red"
                      />
                    )}
                  </View>
                ))}
                {locationInfo.image.length < 5 && (
                  <View style={styles.image_picker}>
                    <TouchableOpacity
                      style={styles.item_image_picker}
                      onPress={handlePressAddImage}>
                      <Image
                        source={require('../assets/icons/image.png')}
                        style={{width: 25, height: 25}}></Image>
                      <Text>Add Image</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.image_picker}>
                <TouchableOpacity
                  style={styles.item_image_picker}
                  onPress={handlePressAddImage}>
                  <Image
                    source={require('../assets/icons/image.png')}
                    style={{width: 25, height: 25}}></Image>
                  <Text>Add Image</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity
          style={loginStyles.button}
          onPress={handleAddLocation}>
          <Text style={loginStyles.button_text}>Add Location</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AddLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  image_container: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 5,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    width: '80%',
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
  input_address_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
    marginHorizontal: 20,
  },
  text_header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  multiline_input: {
    marginVertical: 5,
    borderRadius: 10,
    textAlign: 'left',
    textAlignVertical: 'top',
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  image_picker: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'black',
  },
  image_preview: {
    width: 100,
    height: 100,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
  },
  item_image_picker: {
    width: 100,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
    top: 35,
    left: 35,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
    margin: 4,
  },
  input_container: {
    width: '100%',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  dropdown: {
    height: 50,

    borderRadius: 10,
    backgroundColor: 'white',
  },
});
