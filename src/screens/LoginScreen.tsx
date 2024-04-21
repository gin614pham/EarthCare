import React from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import loginStyles from '../styles/loginStyle';

const LoginScreen = ({navigation}: any) => {
  return (
    <LinearGradient
      colors={['#FDFBFB', '#B4E0F9']}
      style={loginStyles.background_container}>
      <View style={loginStyles.container}>
        <Text style={loginStyles.header}>Login</Text>
        <View style={loginStyles.input_container}>
          <TextInput style={loginStyles.input} placeholder="Email" />
          <TextInput
            secureTextEntry
            style={loginStyles.input}
            placeholder="Password"
          />
          <View style={loginStyles.link}>
            <Text style={loginStyles.linkText}>Forgot Password?</Text>
          </View>
        </View>
        <TouchableOpacity style={loginStyles.button}>
          <Text style={loginStyles.button_text}>Login</Text>
        </TouchableOpacity>
        <Text style={loginStyles.text}>
          Don't have an account?{' '}
          <Text
            style={loginStyles.linkText}
            onPress={() => navigation.navigate('Register', {name: 'Register'})}>
            Register here
          </Text>{' '}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;
