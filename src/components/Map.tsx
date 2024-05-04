import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ListRenderItemInfo,
} from 'react-native';
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import firestore from '@react-native-firebase/firestore';
import BottomSheet, {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {Chip} from 'react-native-paper';
import {CarouselItems, Location} from '../types';
import Search from './Search';
import ChangeMapType from './ChangeMapType';
import ImageShow from './ImageShow';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const App = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const mapViewRef = useRef<MapView>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState('description');
  const [visible, setVisible] = useState(false);
  const snapPoints = useMemo(() => ['70%'], []);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef<BottomSheet>(null);

  const translateX = useSharedValue<number>(0);
  const durationAnimation = 300;

  const animatedMoveStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: withTiming(translateX.value, {duration: durationAnimation})},
    ],
  }));

  useEffect(() => {
    Geolocation.getCurrentPosition(position => {
      setRegion({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      });
    });
  }, []);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('locations')
      .onSnapshot(snapshot => {
        const locations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocations(locations as any);
      });

    return () => unsubscribe();
  }, []);

  const handleGetCurrentLocation = () => {
    Geolocation.getCurrentPosition(position => {
      const newRegion = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        latitudeDelta: 0.015,
        longitudeDelta: 0.0121,
      };
      setRegion(newRegion);
      mapViewRef.current?.animateToRegion(newRegion, 1000);
    });
  };

  const handleGetLocation = async (region: any) => {
    const {latitude, longitude} = region;
    const newRegion = {
      latitude,
      longitude,
      latitudeDelta: 0.015,
      longitudeDelta: 0.0121,
    };
    setRegion(newRegion);
    mapViewRef.current?.animateToRegion(newRegion, 1000);
  };

  const handleMarkerPress = (location: Location) => {
    setSelectedLocation(location);
    bottomSheetRef.current?.expand();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
    setSelectedLocation(null);
  };

  const handleChangeMapType = (mapType: string) => {
    setMapType(mapType);
    setVisible(false);
  };

  const carouselItems = [
    {title: 'Vị trí bị ô nhiễm', icon: 'map-marker'},
    {title: 'Vị trí đổ rác thải', icon: 'map-marker'},
    {title: 'Vị trí tái chế rác', icon: 'map-marker'},
  ];

  const renderCarouselItem = (item: ListRenderItemInfo<CarouselItems>) => {
    return (
      <Chip
        icon={item.item.icon}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 3,
          marginRight: 5,
        }}>
        {item.item.title}
      </Chip>
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        region={region}>
        {locations.map((location, index) =>
          location.latitude && location.longitude ? (
            <Marker
              key={index}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.address}
              description={location.description}
              icon={require('../assets/icons/trash1.png')}
              onPress={() => handleMarkerPress(location)}>
              <Callout tooltip>
                <Text>hi</Text>
              </Callout>
            </Marker>
          ) : null,
        )}
        <Circle
          center={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          radius={1000}
          fillColor="rgba(0, 0, 255, 0.1)"
          strokeColor="rgba(0, 0, 255, 0.5)"
          strokeWidth={2}
        />
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleGetCurrentLocation}>
        <Image
          source={require('../assets/icons/focus.png')}
          style={{width: 40, height: 40}}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Search handleGetLocation={handleGetLocation} />
      <View
        style={{
          position: 'absolute',
          top: 100,
          left: 20,
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
        }}>
        <FlatList
          horizontal
          data={carouselItems}
          renderItem={renderCarouselItem}
          keyExtractor={item => item.title}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={selectedLocation ? 0 : -1}
        snapPoints={snapPoints}
        enablePanDownToClose>
        {selectedLocation && (
          <View style={styles.bottomSheetContent}>
            <Text style={styles.title}>
              Address: {selectedLocation.address}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseBottomSheet}>
              <Text>Close</Text>
            </TouchableOpacity>

            <View style={styles.tabContainer}>
              <TouchableOpacity
                activeOpacity={1}
                style={[styles.tabButton]}
                onPress={() => {
                  setActiveTab('description');
                  translateX.value = 0;
                }}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'description' && {color: 'blue'},
                  ]}>
                  Description
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={1}
                style={styles.tabButton}
                onPress={() => {
                  setActiveTab('image');
                  translateX.value = (WINDOW_WIDTH - 40) / 2;
                }}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === 'image' && {color: 'blue'},
                  ]}>
                  Image
                </Text>
              </TouchableOpacity>
            </View>

            <Animated.View style={[styles.moving_box, animatedMoveStyle]} />

            <View style={styles.tabContent}>
              {activeTab === 'description' && (
                <Animated.View
                  exiting={FadeOutLeft.duration(durationAnimation)}
                  entering={FadeInLeft.duration(durationAnimation).delay(150)}
                  style={{marginBottom: 10}}>
                  <ScrollView
                    contentContainerStyle={{backgroundColor: 'white'}}>
                    <Text style={styles.description}>
                      {selectedLocation.description}
                    </Text>
                  </ScrollView>
                </Animated.View>
              )}
              {activeTab === 'image' && (
                <Animated.View
                  entering={FadeInRight.duration(durationAnimation).delay(150)}
                  exiting={FadeOutRight.duration(durationAnimation)}
                  style={{marginBottom: 10}}>
                  <ScrollView style={styles.image_scroll_view}>
                    <ImageShow images={selectedLocation.image} />
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          </View>
        )}
      </BottomSheet>
      <ChangeMapType
        mapType={mapType}
        handleChangeMapType={handleChangeMapType}
      />
      <View style={{position: 'absolute', top: 60, right: 20}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    width: windowWidth,
    height: windowHeight,
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    borderRadius: 20,
    padding: 10,
    width: windowWidth - 20,
  },
  locationButton: {
    position: 'absolute',
    top: windowHeight * 0.7 + 60,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheetContent: {
    padding: 20,
    paddingBottom: 200,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  tabContent: {},
  tabText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'gray',
  },
  image_scroll_view: {
    marginBottom: 75,
  },
  moving_box: {
    width: (WINDOW_WIDTH - 40) / 2,
    height: 2,
    borderRadius: 10,
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  description: {
    paddingBottom: 100,
    fontSize: 16,
    color: 'black',
  },
});

export default App;
