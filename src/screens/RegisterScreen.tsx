import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';

const RegisterScreen = ({navigation}: any) => {
  return (
    <LinearGradient colors={['#B4E0F9', '#FDFBFB']} style={{flex: 1}}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.header}>Register</Text>
        <View style={loginStyles.input_container}>
          <TextInput style={loginStyles.input} placeholder="Name" />
          <TextInput style={loginStyles.input} placeholder="Email" />
          <TextInput
            secureTextEntry
            style={loginStyles.input}
            placeholder="Password"
          />
          <TextInput
            secureTextEntry
            style={loginStyles.input}
            placeholder="Confirm Password"
          />
        </View>
        <TouchableOpacity style={loginStyles.button}>
          <Text style={loginStyles.button_text}>Register</Text>
        </TouchableOpacity>
        <Text style={loginStyles.text}>
          Already have an account?{' '}
          <Text
            style={loginStyles.linkText}
            onPress={() => navigation.navigate('Login', {name: 'Login'})}>
            Login here
          </Text>{' '}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default RegisterScreen;
