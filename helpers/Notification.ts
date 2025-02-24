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
            title: "Certaines opérations n'ont pas de fichiers associés"
        },
        trigger: null,
    });
}