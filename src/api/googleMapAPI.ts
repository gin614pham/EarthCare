import axios from 'axios';
import Config from 'react-native-config';

export const getCurrentLocation = async (
  latitude: number,
  longitude: number,
) => {
  try {
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
