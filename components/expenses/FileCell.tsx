import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    expenseFiles: Array<string>;
    expenseId: string;
    noFileNeeded: boolean;
};

export default function FileCell({ expenseFiles, expenseId, noFileNeeded }: Props) {
    let icon;
    let color;
    if (expenseFiles.length !== 0) {
        icon = <Text>{expenseFiles.length}</Text>;
        color = "#00cc00";
    } else if (noFileNeeded) {
        icon = <FontAwesome name="check" size={18} color="#25292e" />;
        color = "#00cc00";
    } else {
        icon = <FontAwesome name="file" size={18} color="#25292e" />;
        color = "#D84040";
    }
    return (
        <Link
            href={{
                pathname: "/(tabs)/(expenses)/[expenseId]",
                params: { expenseId: expenseId },
            }}
            asChild
        >
            <Pressable>
                <View style={[styles.buttonContainer]}>
                    <View style={[styles.button, { backgroundColor: color }]}>{icon}</View>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
    },
});
