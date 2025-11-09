import * as Notifications from "expo-notifications";
import { NOTIFICATION_INTERVAL, retrieveInsecure, saveInsecure, SCHEDULED_NOTIFICATION_ID } from "./StorageHelper";

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

export function scheduleExpenseCheckReminder(intervalInSeconds: number): Promise<string> {
    console.log("Scheduling notification every ", intervalInSeconds, " seconds");
    return Notifications.scheduleNotificationAsync({
        content: {
            title: "N'oubliez pas de renseigner les fichiers de vos dépenses !",
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: intervalInSeconds,
        },
    });
}

export async function cancelScheduledNotification(identifier: string) {
    await Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function configureReminderNotification() {
    retrieveInsecure(NOTIFICATION_INTERVAL).then((retrievedInterval) => {
        let interval = Number(retrievedInterval);
        if (retrievedInterval === null) {
            //Default to 1 week
            interval = 604800;
            saveInsecure(NOTIFICATION_INTERVAL, interval);
        }
        retrieveInsecure(SCHEDULED_NOTIFICATION_ID)
            .then((identifier) => {
                if (identifier !== null) {
                    console.log("Canceling scheduled notification with id ", identifier);
                    cancelScheduledNotification(identifier);
                }
            })
            .then(() => {
                scheduleExpenseCheckReminder(interval).then((identifier) => {
                    saveInsecure(SCHEDULED_NOTIFICATION_ID, identifier);
                });
            });
    });
}
