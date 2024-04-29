import {StyleSheet, View} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text} from 'react-native';

const SearchScreen = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <Text>Search Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
