import {Location} from '../types';
import firestore from '@react-native-firebase/firestore';

export const featchLocations = async () => {
  try {
    const locations = await firestore()
      .collection('locations')
      .where('approve', '==', true)
      .onSnapshot(snapshot => {
        const location = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        return location as Location[];
      });

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
  }

  return [] as Location[];
};
