import React, {useState} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  ToastAndroid,
  FlatList,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useFocusEffect} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import UserContext from '../context/UserContext';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';

interface ProfileInfoType {
  name: string;
  email: string;
  avatar: string;
}

const ProfileScreen2 = ({navigation}: any) => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfoType>({
    name: '',
    email: '',
    avatar: '',
  });
  const {setUser} = React.useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const userData = await firestore()
          .collection('users')
          .doc(auth().currentUser?.uid)
          .get();
        if (userData.exists) {
          const {name, email, avatar} = userData.data() as ProfileInfoType;
          setProfileInfo({name, email, avatar});
        }
      };

      fetchData();
    }, []),
  );

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleLogout = async () => {
    try {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            auth().signOut();
            setUser(null);
            navigation.navigate('Login');
            ToastAndroid.show('Logged out successfully', ToastAndroid.SHORT);
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const listButtons = [
    {
      name: 'Edit Profile',
      icon: 'edit',
      onPress: handleEditProfile,
    },
    {
      name: 'Change Password',
      icon: 'key',
      onPress: () => {
        return null;
      },
    },
    {
      name: 'About',
      icon: 'info-circle',
      onPress: () => {
        return null;
      },
    },
    {
      name: 'Logout',
      icon: 'sign-out',
      onPress: handleLogout,
    },
  ];

  const renderListButtons = ({item, index}: any) => {
    return (
      <>
        <View style={styles.divider} />
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={item.onPress}>
          <Text style={styles.buttonText}>{item.name} </Text>
          <Icon name={item.icon} size={20} color="#35B6FF" />
        </TouchableOpacity>
        {index !== listButtons.length - 1 ? null : (
          <View style={styles.divider} />
        )}
      </>
    );
  };

  return (
    <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
      <View style={loginStyles.container}>
        <View style={loginStyles.input_container}>
          {profileInfo.avatar === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 100, width: 100, borderRadius: 50}} />
            </SkeletonPlaceholder>
          ) : (
            <Image
              source={
                profileInfo.avatar == 'none'
                  ? require('../assets/images/avt-default.png')
                  : {uri: profileInfo.avatar}
              }
              style={loginStyles.avatar}
            />
          )}
          {profileInfo.name === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 20, width: 200, borderRadius: 4}} />
            </SkeletonPlaceholder>
          ) : (
            <Text style={loginStyles.text}>{profileInfo.name}</Text>
          )}
          {profileInfo.email === '' ? (
            <SkeletonPlaceholder>
              <View style={{height: 20, width: 200, borderRadius: 4}} />
            </SkeletonPlaceholder>
          ) : (
            <Text style={loginStyles.text}>{profileInfo.email}</Text>
          )}
        </View>

        <FlatList
          style={styles.list_button_container}
          data={listButtons}
          renderItem={({item, index}: any) => renderListButtons({item, index})}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list_button_container: {
    flexDirection: 'row',
    width: '100%',
    // height: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    width: WINDOW_WIDTH,
    gap: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: '#35B6FF',
    marginVertical: 5,
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default ProfileScreen2;
