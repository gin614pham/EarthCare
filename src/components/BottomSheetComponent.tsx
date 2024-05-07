import BottomSheet from '@gorhom/bottom-sheet';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useMemo, useCallback, useRef} from 'react';
import {Text, View} from 'react-native';
import HomeScreen from '../screens/HomeScreen';

const Tab = createMaterialTopTabNavigator();

const BottomSheetComponent = ({navigation}) => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['70%'], []);

  return (
    <BottomSheet ref={bottomSheetRef} index={0} snapPoints={snapPoints}>
      <Tab.Navigator
        initialRouteName="Description"
        screenOptions={{
          tabBarActiveTintColor: '#e91e63',
          tabBarLabelStyle: {fontSize: 12},
        }}>
        <Tab.Screen name="Description" component={Description} />
        <Tab.Screen name="Image" component={Image} />
      </Tab.Navigator>
    </BottomSheet>
  );
};

export default BottomSheetComponent;

const Description = () => {
  return (
    <Text>This component is a BottomSheet that contains a TabNavigator.</Text>
  );
};
const Image = () => {
  return (
    <Text>This component is a BottomSheet that contains a TabNavigator.</Text>
  );
};
