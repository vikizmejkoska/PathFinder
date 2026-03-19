import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

export async function loadActivities() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (error) {
    console.log('loadActivities error:', error);
    return [];
  }
}

export async function saveActivities(activities) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.ACTIVITIES,
      JSON.stringify(activities)
    );
    return true;
  } catch (error) {
    console.log('saveActivities error:', error);
    return false;
  }
}

export async function clearActivities() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    return true;
  } catch (error) {
    console.log('clearActivities error:', error);
    return false;
  }
}