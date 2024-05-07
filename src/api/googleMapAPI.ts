import axios from 'axios';
import {Alert} from 'react-native';
import Config from 'react-native-config';

export const getCurrentLocation = async (
  latitude: number,
  longitude: number,
) => {
  try {
    if (Config.GOOGLE_MAPS_API_KEY === '') {
      throw new Error('Google Maps API key is not set');
    }
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=vi&apiKey=ab197e6b8d6f4781b067992462e140eb`;
    const response = await axios.get(url);
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('No results found');
    }
    return response.data.features[0].properties.formatted;
  } catch (error) {
    Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại');
  }
};

export const getSearchResults = async (search: string) => {
  // thêm chỉ sô lấy lat long

  try {
    const url = `https://places.googleapis.com/v1/places:autocomplete?input=${search}&key=${Config.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.post(url);

    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('No results found');
    }

    return response.data.suggestions;
  } catch (error) {
    Alert.alert('Error', 'Failed to get search results');
  }
};

export const getPlaceDetail = async (placeId: string) => {
  try {
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,location&key=${Config.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    Alert.alert('Error', 'Failed to get place details');
  }
};
