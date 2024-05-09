import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
  Image,
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
import Icon from 'react-native-vector-icons/AntDesign';
import {
  CarouselItems,
  LOCATION_TYPES,
  Location,
  MAP_TYPES,
  durationAnimation,
} from '../types';
import Search from './Search';
import ChangeMapType from './ChangeMapType';
import ImageShow from './ImageShow';
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import MapViewDirections from 'react-native-maps-directions';

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
  const snapPoints = useMemo(() => ['65%'], []);
  const snapPoints2 = useMemo(() => ['30%'], []);
  const [mapType, setMapType] = useState('standard');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);
  const [destination, setDestination] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [durationToDestination, setDurationToDestination] = useState<number>(0);

  // thêm tích cho Chip
  const [selectedChip, setSelectedChip] = useState<string[]>([]);
  const [activivities, setActivities] = useState([]);

  const [distanceToDestination, setDistanceToDestination] = useState<number>(0);
  const translateX = useSharedValue<number>(0);

  const animatedMoveStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value, {
          duration: durationAnimation.DURATION_300,
        }),
      },
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

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('activities')
      .onSnapshot(snapshot => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActivities(activities as any);
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
    mapViewRef.current?.animateToRegion(newRegion, 200);
  };

  const handleMarkerPress = (location: Location) => {
    bottomSheetRef2.current?.close();
    setDestination({
      latitude: 0,
      longitude: 0,
    });
    setSelectedLocation(location);
    bottomSheetRef.current?.expand();
  };

  const handleGetDirection = () => {
    bottomSheetRef.current?.close();
    setDestination({
      latitude: selectedLocation?.latitude || 0,
      longitude: selectedLocation?.longitude || 0,
    });

    mapViewRef.current?.animateToRegion(
      {
        latitude: (region.latitude + (selectedLocation?.latitude || 0)) / 2,
        longitude: (region.longitude + (selectedLocation?.longitude || 0)) / 2,
        latitudeDelta:
          Math.abs(region.latitude - (selectedLocation?.latitude || 0)) * 2,
        longitudeDelta:
          Math.abs(region.longitude - (selectedLocation?.longitude || 0)) * 2,
      },
      1000,
    );

    // const distance = getDistance(
    //   {
    //     latitude: region.latitude,
    //     longitude: region.longitude,
    //   },
    //   {
    //     latitude: selectedLocation.latitude,
    //     longitude: selectedLocation.longitude,
    //   },
    // );
    // const duration = distance / 1000;
    // setDurationToDestination(duration);

    bottomSheetRef2.current?.expand();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current?.close();
    setSelectedLocation(null);
  };
  const handleCloseBottomSheet2 = () => {
    bottomSheetRef2.current?.close();
  };

  const handleChangeMapType = (mapType: string) => {
    setMapType(mapType);
    setVisible(false);
  };

  const carouselItems = [
    {
      id: 1,
      title: 'Vị trí bị ô nhiễm',
      icon: require('../assets/icons/danger.png'),
    },
    {
      id: 2,
      title: 'Vị trí đổ rác thải',
      icon: require('../assets/icons/trash1.png'),
    },
    {
      id: 3,
      title: 'Vị trí tái chế rác',
      icon: require('../assets/icons/recycling-center.png'),
    },
  ];

  const changeMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainMinutes = minutes % 60;
    return `${hours} giờ ${remainMinutes} phút`;
  };

  const renderCarouselItem = (item: ListRenderItemInfo<CarouselItems>) => {
    return (
      <Animated.View
        entering={SlideInRight.duration(durationAnimation.DURATION_500).delay(
          item.index * 250 + 500,
        )}>
        {/* Thêm tích cho Chip và có thể chọn nhiều Chip và xóa Chip đã chọn */}
        <Chip
          icon={({size}) => (
            <Image
              source={item.item.icon}
              style={{width: size, height: size}}
            />
          )}
          style={{
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 3,
            marginRight: 5,
          }}
          onPress={() => {
            if (selectedChip.includes(item.item.title)) {
              setSelectedChip(selectedChip.filter(x => x !== item.item.title));
            } else {
              setSelectedChip([...selectedChip, item.item.title]);
            }
          }}>
          <Text>{item.item.title}</Text>
          {selectedChip.includes(item.item.title) ? (
            <Icon
              name="check"
              size={20}
              style={{marginLeft: 5}}
              onPress={() => {
                setSelectedChip(
                  selectedChip.filter(x => x !== item.item.title),
                );
              }}
            />
          ) : (
            <View style={{width: 20, height: 20}}></View>
          )}
        </Chip>
      </Animated.View>
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
        showsCompass={false}
        region={region}
        customMapStyle={MAP_TYPES}>
        {destination.latitude && destination.longitude ? (
          <MapViewDirections
            origin={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            destination={destination}
            apikey="AIzaSyDSg64UIA8bLIMCVfGc4vB5n_lrQRZHtYQ"
            strokeWidth={4}
            strokeColor="rgb(0,139,241)"
            mode="DRIVING"
            onReady={result => {
              setDurationToDestination(result.duration);
              setDistanceToDestination(result.distance);
            }}
          />
        ) : null}
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
              // icon={
              //   require('../assets/icons/location.png')
              //   // LOCATION_TYPES.find(x => x.value === location.locationType)
              //   //   ?.image
              // }
              // style={{width: 10, height: 10}}
              onPress={() => handleMarkerPress(location)}>
              <Image
                source={
                  LOCATION_TYPES.find(x => x.value === location.locationType)
                    ?.image
                }
                style={{width: 32, height: 32}}
              />
              <Callout style={styles.callout}>
                <Text>{location.locationType}</Text>
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
        {/* {activivities.map((activity, index) =>
          activity.location &&
          activity.location.latitude &&
          activity.location.longitude ? (
            <Marker
              key={index}
              coordinate={{
                latitude: activity.location.latitude,
                longitude: activity.location.longitude,
              }}
              title={activity.name}
              description={activity.description}
              icon={require('../assets/icons/activity.png')}

                        ) : null,
        )} */}
      </MapView>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleGetCurrentLocation}>
        <LottieView
          source={require('../assets/animations/locate.json')}
          autoPlay
          loop
          style={{width: 60, height: 60}}
        />
      </TouchableOpacity>
      <Search handleGetLocation={handleGetLocation} />
      <View
        style={{
          position: 'absolute',
          top: 100,
          left: 10,
          right: 10,
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          borderRadius: 20,
          overflow: 'hidden',
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
            <View style={styles.bottomSheetButton}>
              <TouchableOpacity
                style={styles.findDirectionButton}
                onPress={handleGetDirection}>
                <Text>Đường đi </Text>
                <Icon name="right" size={15} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.findDirectionButton}>
                <Text>Nhắn tin </Text>
                <Icon name="message1" size={15} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseBottomSheet}>
                {/* <Icon name="close" size={30} /> */}
                <LottieView
                  source={require('../assets/animations/close.json')}
                  autoPlay
                  loop={true}
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>
            </View>

            <Text
              numberOfLines={3}
              ellipsizeMode="tail"
              style={styles.addressBottomSheet}>
              <Text style={styles.title}>Address: </Text>
              {selectedLocation.address}
            </Text>

            <View style={styles.divider} />

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
                  exiting={FadeOutLeft.duration(durationAnimation.DURATION_300)}
                  entering={FadeInLeft.duration(
                    durationAnimation.DURATION_300,
                  ).delay(150)}
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
                  entering={FadeInRight.duration(
                    durationAnimation.DURATION_300,
                  ).delay(150)}
                  exiting={FadeOutRight.duration(
                    durationAnimation.DURATION_300,
                  )}
                  style={{marginBottom: 10}}>
                  <ScrollView
                    contentContainerStyle={{backgroundColor: 'white'}}>
                    <View style={styles.image_view}>
                      <ImageShow images={selectedLocation.image} />
                    </View>
                  </ScrollView>
                </Animated.View>
              )}
            </View>
          </View>
        )}
      </BottomSheet>
      <BottomSheet
        ref={bottomSheetRef2}
        index={-1}
        snapPoints={snapPoints2}
        enablePanDownToClose>
        {durationToDestination !== null && (
          <View>
            <Text style={styles.title}>
              Distance: {distanceToDestination.toFixed(1) + ' km'}
            </Text>
            <Text style={styles.title}>
              Time to travel: {Math.round(durationToDestination) + ' min'}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseBottomSheet2}>
              <LottieView
                source={require('../assets/animations/close.json')}
                autoPlay
                loop={false}
                style={{width: 60, height: 60}}
              />
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>
      {/* <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 135,
          left: 20,
          borderRadius: 20,
          backgroundColor: 'white',
          padding: 10,
          display: 'flex',
          flexDirection: 'row',
          zIndex: 1,
        }}
        onPress={() => setVisible(!visible)}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
          }}>
          Gần bạn có gì?
        </Text>

        <Icon name="down" size={20} />
      </TouchableOpacity> */}
      <ChangeMapType
        mapType={mapType}
        handleChangeMapType={handleChangeMapType}
      />
      {/* <View style={{position: 'absolute', top: 60, right: 20}}></View> */}
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
    borderWidth: 3,
    borderColor: 'rgba(0, 0, 0, 0.3)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSheetContent: {
    paddingHorizontal: 15,
    paddingBottom: WINDOW_WIDTH * 0.5,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingTop: 0,
    borderRadius: 5,
    width: '50%',
    alignItems: 'center',
  },
  tabContent: {
    marginBottom: WINDOW_WIDTH * 0.25,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'gray',
  },
  moving_box: {
    width: (WINDOW_WIDTH - 40) / 2,
    height: 2,
    borderRadius: 10,
    backgroundColor: 'blue',
    marginBottom: 10,
  },
  divider: {
    marginTop: 5,
    width: WINDOW_WIDTH - 40,
    height: 1.25,
    borderRadius: 20,
    backgroundColor: 'gray',
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
  image_view: {
    paddingBottom: 100,
  },
  findDirectionButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  addressBottomSheet: {
    fontSize: 16,
    color: 'black',
    fontWeight: '400',
  },
  bottomSheetButton: {
    display: 'flex',
    flexDirection: 'row',
    height: 40,
  },
  callout: {
    width: 100,
    backgroundColor: 'white',
  },
});

export default App;
