import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { FoodItem } from '@/types';

const DAYS_BEFORE_ALERT = 2;
const CHANNEL_ID = 'expiration';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function notificationIdFor(itemId: string): string {
  return `expiration-${itemId}`;
}

export async function configureNotifications(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Validade de alimentos',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: requested } = await Notifications.requestPermissionsAsync();
  return requested === 'granted';
}

export async function cancelExpirationNotification(itemId: string): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(notificationIdFor(itemId));
}

export async function scheduleExpirationNotification(item: FoodItem): Promise<void> {
  if (Platform.OS === 'web') return;

  await cancelExpirationNotification(item.id);

  const triggerDate = new Date(item.expirationDate);
  triggerDate.setDate(triggerDate.getDate() - DAYS_BEFORE_ALERT);
  triggerDate.setHours(9, 0, 0, 0);

  if (triggerDate.getTime() <= Date.now()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: notificationIdFor(item.id),
    content: {
      title: '🍎 Alimento vencendo',
      body: `${item.name} vence em ${DAYS_BEFORE_ALERT} dias. Que tal usá-lo hoje?`,
    },
    trigger: { channelId: CHANNEL_ID, date: triggerDate },
  });
}

export async function syncExpirationNotifications(items: FoodItem[]): Promise<void> {
  if (Platform.OS === 'web') return;

  const granted = await configureNotifications();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const item of items) {
    await scheduleExpirationNotification(item);
  }
}
