import * as Notifications from 'expo-notifications';

// First, set the handler that will cause the notification
// to show the alert
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export function displayNotifiaction() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "De nouvelles dépenses ont été importées !",
    },
    trigger: null,
  });
}

export function scheduleExpenseCheckReminder(
  intervalInSeconds: number
): Promise<string> {
  return Notifications.scheduleNotificationAsync({
    content: {
      title: "N'oubliez pas de renseigner les fichiers de vos dépenses !",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: intervalInSeconds,
      repeats: true,
    },
  });
}

export async function cancelScheduledNotification(identifier: string) {
  await Notifications.cancelScheduledNotificationAsync(identifier);
}