import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  View,
  Keyboard,
  ToastAndroid,
  Modal,
} from 'react-native';
import {getCurrentLocation} from '../api/googleMapAPI';
import DateTimePicker from '@react-native-community/datetimepicker';

import Animated, {
  FadeInDown,
  StretchInX,
  ZoomIn,
} from 'react-native-reanimated';
import {Activity, DayOfWeek, durationAnimation} from '../types';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import MapGoogle from '../components/MapGoogle';
import UserContext from '../context/UserContext';

const AddActivityScreen = ({navigation}: any) => {
  const [activityInfo, setActivityInfo] = useState<Activity>({
    name: '',
    startDateTime: '',
    endDateTime: '',
    hoursStart: '',
    address: '',
    description: '',
    image: [],
    location: {
      longitude: 0,
      latitude: 0,
    },
    userId: '',
  });
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [showPickerDateStart, setShowPickerDateStart] = useState(false);
  const [showPickerDateEnd, setShowPickerDateEnd] = useState(false);
  const [showPickerTime, setShowPickerTime] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const {user} = useContext(UserContext);

  useEffect(() => {
    console.log(activityInfo);
  }, [activityInfo]);

  const handlePressAddImage = async () => {
    const response: any = await launchImageLibrary({mediaType: 'photo'});
    if (!response.didCancel && response.assets) {
      setIsImageLoading(true);
      const image = response.assets[0];
      const reference = storage().ref(`activities/${image.fileName}`);
      const task = reference.putFile(image.uri);
      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(async () => {
        const url = await reference.getDownloadURL();
        setActivityInfo({
          ...activityInfo,
          image: [...activityInfo.image, url],
          userId: user.uid,
        });
        setIsImageLoading(false);
      });
    }
  };

  const handleAddActivity = async () => {
    Keyboard.dismiss();
    try {
      await firestore()
        .collection('activities')
        .add({
          ...activityInfo,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      navigation.goBack();
      ToastAndroid.show('Add activity success', ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentPosition = async () => {
    const currentLocation = await getCurrentLocation(
      activityInfo.location.latitude,
      activityInfo.location.longitude,
    );
    setActivityInfo({...activityInfo, address: currentLocation});
  };

  const formatDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.getMonth() + 1;
    const year = newDate.getFullYear();
    const dayOfWeek = newDate.getDay();
    return `${DayOfWeek.VI[dayOfWeek]}, ${day}/${month}/${year}`;
  };

  const handleMapModalClose = () => {
    setShowMapModal(false);
    getCurrentPosition();
  };

  const handleMapModalSave = (region: any) => {
    setActivityInfo({
      ...activityInfo,
      location: {
        longitude: region.longitude,
        latitude: region.latitude,
      },
      address: region.address,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300)}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Name of activity"
          value={activityInfo.name}
          onChangeText={text => setActivityInfo({...activityInfo, name: text})}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300).delay(
          durationAnimation.DELAY_1,
        )}
        style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={activityInfo.address}
          onChangeText={text =>
            setActivityInfo({...activityInfo, address: text})
          }
        />

        <Animated.View
          entering={StretchInX.duration(durationAnimation.DURATION_300).delay(
            durationAnimation.DELAY_1 + durationAnimation.DURATION_300,
          )}>
          <TouchableOpacity
            onPress={() => {
              setShowMapModal(true);
            }}>
            <Image
              source={require('../assets/icons/location.png')}
              style={styles.locationIcon}
            />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300).delay(
          durationAnimation.DELAY_2,
        )}
        style={styles.inputContainer}>
        {showPickerDateStart && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerDateStart(false);
              if (event.type === 'set' && selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  startDateTime: formatDate(selectedDate.toString()),
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Start date"
          value={activityInfo.startDateTime ? activityInfo.startDateTime : ''}
          onFocus={() => setShowPickerDateStart(true)}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300).delay(
          durationAnimation.DELAY_3,
        )}
        style={styles.inputContainer}>
        {showPickerTime && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerTime(false);
              if (event.type === 'set' && selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  hoursStart:
                    selectedDate.getHours().toString() +
                    ':' +
                    selectedDate.getMinutes().toString(),
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Start time"
          value={activityInfo.hoursStart ? activityInfo.hoursStart : ''}
          onFocus={() => setShowPickerTime(true)}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300).delay(
          durationAnimation.DELAY_4,
        )}
        style={styles.inputContainer}>
        {showPickerDateEnd && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPickerDateEnd(false);
              if (event.type === 'set' && selectedDate) {
                setActivityInfo({
                  ...activityInfo,
                  endDateTime: formatDate(selectedDate.toString()),
                });
              }
            }}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="End date"
          value={activityInfo.endDateTime ? activityInfo.endDateTime : ''}
          onFocus={() => setShowPickerDateEnd(true)}
        />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300).delay(
          durationAnimation.DELAY_5,
        )}>
        <TextInput
          style={styles.multilineInput}
          placeholder="Description"
          multiline
          numberOfLines={4}
          maxLength={2000}
          value={activityInfo.description}
          onChangeText={text =>
            setActivityInfo({...activityInfo, description: text})
          }
        />
      </Animated.View>

      {activityInfo.image.length > 0 ? (
        <View style={styles.item_image_preview}>
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
              />
            </View>
          ))}
          <Animated.View
            entering={ZoomIn.duration(durationAnimation.DURATION_300).delay(
              900,
            )}
            style={styles.image_picker}>
            <TouchableOpacity
              style={styles.item_image_picker}
              onPress={handlePressAddImage}>
              <Image
                source={require('../assets/icons/image-editing.png')}
                style={{width: 25, height: 25}}></Image>
              <Text>Change Image</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <Animated.View
          entering={ZoomIn.duration(durationAnimation.DURATION_300).delay(900)}
          style={styles.image_picker}>
          <TouchableOpacity
            style={styles.item_image_picker}
            onPress={handlePressAddImage}>
            <Image
              source={require('../assets/icons/image.png')}
              style={{width: 25, height: 25}}></Image>
            <Text>Add Image</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <Animated.View
        entering={FadeInDown.duration(durationAnimation.DURATION_300).delay(
          durationAnimation.DELAY_6,
        )}>
        <TouchableOpacity style={styles.button} onPress={handleAddActivity}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Animated.View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={showMapModal}
        onRequestClose={handleMapModalClose}>
        <MapGoogle setRegionAddF={handleMapModalSave} />
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
          }}
          onPress={handleMapModalClose}>
          <Text style={{fontSize: 20, color: 'black'}}>Lưu vị trí</Text>
        </TouchableOpacity>
      </Modal>
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
    textAlign: 'left',
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#35B6FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  item_image_picker: {
    width: 100,
    height: 100,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  item_image_preview: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default AddActivityScreen;
