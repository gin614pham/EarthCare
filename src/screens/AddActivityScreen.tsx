import React, {useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {getCurrentLocation} from '../api/googleMapAPI';
import DateTimePicker from '@react-native-community/datetimepicker';
import Geolocation from '@react-native-community/geolocation';
import {ActivityIndicator} from 'react-native-paper';
import ImageCropPicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';
const AddActivityScreen = ({navigation}: any) => {
  const [activityInfo, setActivityInfo] = useState({
    name: '',
    address: '',
    startDate: '',
    endDate: '',
    hour: 0,
    description: '',
    image: [],
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showPickerDateStart, setShowPickerDateStart] = useState(false);
  const [showPickerDateEnd, setShowPickerDateEnd] = useState(false);
  const [showPickerTime, setShowPickerTime] = useState(false);

  useEffect(() => {
    console.log(activityInfo);
  }, [activityInfo]);

  // const handlePressAddImage = () => {
  //   navigation.navigate('ImagePicker', {
  //     setActivityInfo: setActivityInfo,
  //     activityInfo: activityInfo,
  //   });
  // };

  const handleAddActivity = () => {
    console.log(activityInfo);
  };

  const getCurrentPosition = async () => {
    Geolocation.getCurrentPosition(async position => {
      setActivityInfo({
        ...activityInfo,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      const currentLocation = await getCurrentLocation(
        position.coords.latitude,
        position.coords.longitude,
      );
      setActivityInfo({
        ...activityInfo,
        address: currentLocation,
      });
    });
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    const dayOfWeek = newDate.getDay();
    const dayOfWeekString = [
      'Chủ Nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];
    return `${dayOfWeekString[dayOfWeek]}, ${day}/${month}/${year}`;
  };

  const handleChooseImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      setActivityInfo(prevState => ({
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
          setActivityInfo(prevState => ({
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
    ImageCropPicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      setActivityInfo(prevState => ({
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
          setActivityInfo(prevState => ({
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên hoạt động"
          value={activityInfo.name}
          onChangeText={text => setActivityInfo({...activityInfo, name: text})}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ"
          value={activityInfo.address}
          onChangeText={text =>
            setActivityInfo({...activityInfo, address: text})
          }
        />
        <TouchableOpacity onPress={getCurrentPosition}>
          <Image
            source={require('../assets/icons/location.png')}
            style={styles.locationIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        {showPickerDateStart && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerDateStart(false);
              if (selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  startDate: selectedDate,
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Ngày bắt đầu"
          value={
            activityInfo.startDate ? formatDate(activityInfo.startDate) : ''
          }
          onFocus={() => setShowPickerDateStart(true)}
        />
      </View>

      <View style={styles.inputContainer}>
        {showPickerTime && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerTime(false);
              if (selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  startDate: selectedDate,
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Chọn giờ"
          value={
            activityInfo.startDate
              ? `${activityInfo.startDate.getHours()}:${activityInfo.startDate.getMinutes()}`
              : ''
          }
          onFocus={() => setShowPickerTime(true)}
        />
      </View>

      <View style={styles.inputContainer}>
        {showPickerDateEnd && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerDateEnd(false);
              if (selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  endDate: selectedDate,
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Ngày kết thúc"
          value={activityInfo.endDate ? formatDate(activityInfo.endDate) : ''}
          onFocus={() => setShowPickerDateEnd(true)}
        />
      </View>

      <View>
        <TextInput
          style={styles.multilineInput}
          placeholder="Description"
          multiline
          numberOfLines={4}
          value={activityInfo.description}
          onChangeText={text =>
            setActivityInfo({...activityInfo, description: text})
          }
        />
      </View>
      <View style={styles.image_container}>
        <ScrollView horizontal={true} style={{padding: 5}}>
          {activityInfo.image.length > 0 ? (
            <>
              {activityInfo.image.map((image, index) => (
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
              {activityInfo.image.length < 5 && (
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
      <TouchableOpacity style={styles.button} onPress={handleAddActivity}>
        <Text style={styles.buttonText}>Add Activity</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 50,
    borderRadius: 10,
    backgroundColor: 'white',
    padding: 10,
    marginVertical: 10,
  },
  locationIcon: {
    width: 30,
    height: 30,
  },
  multilineInput: {
    marginVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
  image_container: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 5,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
  },
});

export default AddActivityScreen;
