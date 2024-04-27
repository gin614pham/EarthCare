import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icon library
import Icon2 from 'react-native-vector-icons/Entypo'; // Import FontAwesome5 icon librar
import firestore from '@react-native-firebase/firestore';
import BottomSheet from '@gorhom/bottom-sheet';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {Chip} from 'react-native-paper';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
    top: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    borderRadius: 20,
    padding: 10,
    width: windowWidth - 20,
  },
  locationButton: {
    position: 'absolute',
    top: windowHeight * 0.7 + 20,
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
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#dcdcdc',
  },
  tabText: {
    fontWeight: 'bold',
  },
});

const App = () => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const mapViewRef = useRef(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [visible, setVisible] = useState(false);
  const snapPoints = useMemo(() => ['70%'], []);
  const bottomSheetRef = useRef(null);

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
      mapViewRef.current.animateToRegion(newRegion, 1000);
    });
  };

  const handleMarkerPress = location => {
    setSelectedLocation(location);
    bottomSheetRef.current.expand();
  };

  const handleCloseBottomSheet = () => {
    bottomSheetRef.current.collapse();
    setSelectedLocation(null);
  };

  const handleChangeMapType = () => {
    const newMapType =
      mapViewRef.current.props.provider === PROVIDER_GOOGLE
        ? PROVIDER_GOOGLE
        : PROVIDER_DEFAULT;
    mapViewRef.current.setMapType(newMapType);
  };

  const carouselItems = [
    {title: 'Vị trí bị ô nhiễm', icon: 'map-marker'},
    {title: 'Vị trí đổ rác thải', icon: 'map-marker'},
    {title: 'Vị trí tái chế rác', icon: 'map-marker'},
  ];

  const renderCarouselItem = ({item}: any) => {
    return (
      <Chip
        icon={item.icon}
        style={{
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 3,
          marginRight: 5,
        }}>
        {item.title}
      </Chip>
    );
  };

  // full screen including status bar
  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType="hybrid"
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
              onPress={() => handleMarkerPress(location)}>
              <Icon2 name="trash" size={40} color="red" />
              <Callout tooltip>
                <Text>hi</Text>
              </Callout>
            </Marker>
          ) : null,
        )}

        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Your Location"
          description="You are here">
          <Icon name="map-marker" size={30} color="blue" />
        </Marker>

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
      <View style={styles.searchContainer}>
        {/* Google Places Autocomplete */}
      </View>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={handleGetCurrentLocation}>
        <Text>
          <Icon name="location-arrow" size={30} color="black" />
        </Text>
      </TouchableOpacity>
      <TextInput
        style={{
          position: 'absolute',
          top: 30,
          right: 20,
          left: 20,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 25,
          paddingHorizontal: 20,
          paddingVertical: 13,
        }}
        placeholder="Search for a location"></TextInput>
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
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Address:
              {selectedLocation.address}
            </Text>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseBottomSheet}>
              <Text>Close</Text>
            </TouchableOpacity>
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'description' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('description')}>
                <Text style={styles.tabText}>Description</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  activeTab === 'image' && styles.activeTab,
                ]}
                onPress={() => setActiveTab('image')}>
                <Text style={styles.tabText}>Image</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tabContent}>
              {activeTab === 'description' && (
                <ScrollView>
                  <Text>{selectedLocation.description}</Text>
                </ScrollView>
              )}
              {activeTab === 'image' && (
                <Image
                  source={{uri: selectedLocation.image}}
                  style={{width: '100%', height: 200}}
                />
              )}
            </View>
          </View>
        )}
      </BottomSheet>
      <View
        style={{
          position: 'absolute',
          top: 180,
          right: 20,
          backgroundColor: 'white',
          padding: 10,
          borderRadius: 50,
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
        }}>
        <TouchableOpacity
          style={{padding: 5}}
          onPress={() => {
            setVisible(!visible);
          }}>
          <Icon name="edit" size={20} color="black" />
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            top: 40,
            width: 300,
            right: 10,
            height: 300,
            borderRadius: 10,
            display: visible ? 'flex' : 'none',
            padding: 10,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Loại bản đồ</Text>
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
            <TouchableOpacity
              style={{
                backgroundColor: 'white',
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: 'black',
              }}>
              <Text>Mặc định</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={{position: 'absolute', top: 60, right: 20}}></View>
    </View>
  );
};

export default App;
