import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@food_waste_app:onboarding_seen';

export async function hasSeenOnboarding(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(KEY)) === 'true';
  } catch {
    return true;
  }
}

export async function setOnboardingSeen(): Promise<void> {
  await AsyncStorage.setItem(KEY, 'true');
}
