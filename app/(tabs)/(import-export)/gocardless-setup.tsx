
import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import GoCardLessSetup from "@/components/import-export/go-card-less/Setup";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        width: '100%',
        backgroundColor: 'lavender',
    },
});
export default function GoCardLessSetupScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Configuration GoCardLess' }} />
            <View style={styles.container}>
                <GoCardLessSetup />
            </View>
        </>
    );
}

