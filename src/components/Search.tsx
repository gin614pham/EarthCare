import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
} from 'react-native';
import {getPlaceDetail, getSearchResults} from '../api/googleMapAPI';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Search = ({handleGetLocation}) => {
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState([]);
  const animatedHeight = useSharedValue(0);
  const flatListRef = useRef(null);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOutsidePress = event => {
      setPredictions([]);
      animatedHeight.value = withTiming(0, {duration: 300});
      if (inputRef.current) {
        inputRef.current.blur();
      }
    };
    Keyboard.addListener('keyboardDidHide', handleOutsidePress);
  }, []);

  useEffect(() => {
    fetchPredictions();
  }, [search]);

  const fetchPredictions = useCallback(async () => {
    if (search) {
      const results = await getSearchResults(search);
      setPredictions(results);
      animatedHeight.value = withTiming(results.length * 50 + 0, {
        duration: 300,
      });
    } else {
      setPredictions([]);
      animatedHeight.value = withTiming(0, {duration: 300});
    }
  }, [search]);

  const handleSelectPrediction = async prediction => {
    const placeId = prediction.placePrediction.placeId;
    try {
      const response = await getPlaceDetail(placeId);
      handleGetLocation(response.location);
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', 'Failed to get place details');
    }
  };

  const renderPrediction = ({item}) => (
    <TouchableOpacity
      onPress={() => handleSelectPrediction(item)}
      style={styles.predictionContainer}>
      <Ionicons name="location-outline" size={20} color="grey" />
      <Text style={styles.predictionText}>
        {item.placePrediction.text.text}
      </Text>
    </TouchableOpacity>
  );

  const animatedStyles = useAnimatedStyle(() => ({
    height: animatedHeight.value,
  }));

  return (
    <View ref={containerRef} style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons
          name="search"
          size={24}
          color="grey"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search for a location"
          value={search}
          onChangeText={setSearch}
          ref={inputRef}
          style={styles.input}
        />
      </View>
      <Animated.View style={[styles.predictionsContainer, animatedStyles]}>
        <FlatList
          ref={flatListRef}
          data={predictions}
          renderItem={renderPrediction}
          keyExtractor={item => item.placePrediction.placeId}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 100,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  predictionsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  predictionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  predictionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
});

export default Search;
