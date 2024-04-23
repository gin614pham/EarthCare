import React from 'react';
import {View, Text, Button, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';

const HomeScreen = () => {
  const signOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => auth().signOut()},
    ]);
  };
  return (
    <View>
      <Text>Home</Text>
      <Text>Screen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default HomeScreen;
