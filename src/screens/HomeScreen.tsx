import React, {useContext, useEffect, useMemo, useRef} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';
import BottomSheet from '@gorhom/bottom-sheet';
import ShowBottomSheetContext from '../context/ShowBottomSheetContext';

const HomeScreen = () => {
  const snapPoints = useMemo(() => ['25%', '50%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const context = useContext(ShowBottomSheetContext);

  if (!context) {
    return null;
  }

  const {bottomSheetStatus} = context;
  useEffect(() => {
    if (bottomSheetStatus) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [bottomSheetStatus]);

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
    <View style={styles.container}>
      <Button title="Sign Out" onPress={signOut} />
      <BottomSheet ref={bottomSheetRef} index={1} snapPoints={snapPoints}>
        <View style={styles.contentContainerStyle}>
          <Text>Awesome 🎉</Text>
          <Text>Áds</Text>
          <Text>Waka wake ê ê</Text>
          <Text>ccccccccccccc</Text>
        </View>
      </BottomSheet>
    </View>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    alignItems: 'center',
  },
});
