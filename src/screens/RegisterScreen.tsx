import React from 'react';
import {Text, View} from 'react-native';

const RegisterScreen = ({navigation}: any) => {
  return (
    <View>
      <Text>Register</Text>
      <Text>Screen</Text>
      <Text onPress={() => navigation.navigate('Home', {name: 'Home'})}>
        Go to Home
      </Text>
    </View>
  );
};

export default RegisterScreen;
