import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {getPlaceDetail, getSearchResults} from '../api/googleMapAPI';

const Search = ({handleGetLocation}) => {
  const [search, setSearch] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const fetchPredictions = async () => {
      if (search) {
        const results = await getSearchResults(search);
        setPredictions(results);
      } else {
        setPredictions([]);
      }
    };
    fetchPredictions();
  }, [search]);

  const handleSelectPrediction = async prediction => {
    const placeId = prediction.placePrediction.placeId;
    try {
      const response = await getPlaceDetail(placeId);
      console.log(response.location);
      handleGetLocation(response.location);
      setVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const renderPrediction = ({item}) => (
    // <Text style={styles.predictionText}>{item.placePrediction.text.text}</Text>
    <TouchableOpacity onPress={() => handleSelectPrediction(item)}>
      <Text style={styles.predictionText}>
        {item.placePrediction.text.text}
      </Text>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          placeholder="Search for a location"
          value={search}
          onChangeText={text => setSearch(text)}
          style={styles.input}
        />
        {predictions?.length !== 0 && visible && (
          <FlatList
            data={predictions}
            renderItem={renderPrediction}
            keyExtractor={item => item.placePrediction.placeId}
            ItemSeparatorComponent={renderSeparator}
            style={styles.flatList}
          />
        )}
      </View>
      {predictions?.length !== 0 && visible && (
        <TouchableWithoutFeedback
          onPress={() => {
            setVisible(false);
            Keyboard.dismiss();
          }}>
          <View style={{height: 1000}} />
        </TouchableWithoutFeedback>
      )}
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
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  flatList: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingTop: 10,
  },
  predictionText: {
    fontSize: 16,
    color: 'black',
    padding: 10,
  },
  separator: {
    height: 1,

    padding: 5,
  },
});

export default Search;
