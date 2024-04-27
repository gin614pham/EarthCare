import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const EditProfileScreen = ({navigation}: any) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const userData = await firestore()
          .collection('users')
          .doc(user.uid)
          .get();
        if (userData.exists) {
          const {name, avatar} = userData.data();
          setName(name);
          setAvatar(avatar);
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleSave = async () => {
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore().collection('users').doc(user.uid).update({
          name: name,
          avatar: avatar,
        });
        navigation.goBack();
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile');
      }
    }
  };

  const selectImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(async image => {
      setAvatar();
      const uploadUri =
        Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path;
      const filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`avatars/${filename}`);
      storageRef
        .putFile(uploadUri)
        .then(async snapshot => {
          const downloadUrl = await storageRef.getDownloadURL();
          setAvatar(downloadUrl);
        })
        .catch(error => {
          console.error('Error uploading image: ', error);
        });
    });
  };

  return (
    <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.header}>Edit Profile</Text>
        <TouchableOpacity onPress={selectImage}>
          {avatar === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 100, width: 100, borderRadius: 50}} />
            </SkeletonPlaceholder>
          ) : (
            <View
              style={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
              }}>
              <Image
                source={
                  avatar == 'none'
                    ? require('../assets/images/avt-default.png')
                    : {uri: avatar}
                }
                style={loginStyles.avatar}
              />
              <Icon
                name="camera"
                size={20}
                color="#000"
                style={{
                  position: 'absolute',
                  backgroundColor: '#fff',
                  padding: 5,
                  borderRadius: 10,
                }}
              />
            </View>
          )}
        </TouchableOpacity>
        <View style={loginStyles.input_container}>
          <TextInput
            style={loginStyles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <TouchableOpacity style={loginStyles.button} onPress={handleSave}>
          <Text style={loginStyles.button_text}>Save</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default EditProfileScreen;
