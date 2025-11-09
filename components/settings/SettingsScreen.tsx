import { configureReminderNotification, scheduleExpenseCheckReminder } from "@/helpers/Notification";
import { NOTIFICATION_INTERVAL, retrieveInsecure, saveInsecure } from "@/helpers/StorageHelper";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

export default function SettingsScreen() {
    const [getNotificationDelay, setNotificationDelay] = useState(0);

    useEffect(() => {
        // Load the notification delay from storage when the component mounts
        retrieveInsecure(NOTIFICATION_INTERVAL).then((value) => {
            if (value !== null) {
                setNotificationDelay(value);
            }
        });
    }, []);

    function handleSetNotificationDelay(value: number) {
        saveInsecure(NOTIFICATION_INTERVAL, value).then(() => {
            setNotificationDelay(value);
            configureReminderNotification();
        });
    }

    return (
        <>
            <Text style={styles.header}>Délais entre les rappels</Text>
            <Picker
                style={styles.input}
                itemStyle={styles.input}
                selectedValue={getNotificationDelay}
                onValueChange={handleSetNotificationDelay}
            >
                <Picker.Item label="1 jour" value="86400" />
                <Picker.Item label="3 jours" value="259200" />
                <Picker.Item label="1 semaine" value="604800" />
                <Picker.Item label="2 semaines" value="1209600" />
                <Picker.Item label="1 mois" value="2592000" />
            </Picker>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "lavender",
    },
    innerContainer: {
        rowGap: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: "#F5F5F5",
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    },
});
