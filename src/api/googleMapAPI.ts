import axios from 'axios';
import Config from 'react-native-config';

export const getCurrentLocation = async (
  latitude: number,
  longitude: number,
) => {
  try {
    if (Config.GOOGLE_MAPS_API_KEY === '') {
      throw new Error('Google Maps API key is not set');
    }
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Config.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);
    if (response.data.status === 'ZERO_RESULTS') {
      throw new Error('No results found');
    }
    return response.data.results[0].formatted_address;
  } catch (error) {
    console.log(error);
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
    console.log(error);
  }
};

export const getPlaceDetail = async (placeId: string) => {
  try {
    console.log(placeId);
    const url = `https://places.googleapis.com/v1/places/${placeId}?fields=id,displayName,location&key=${Config.GOOGLE_MAPS_API_KEY}`;
    const response = await axios.get(url);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
