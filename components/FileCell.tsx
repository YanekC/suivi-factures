import { FontAwesome } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    onPress?: () => void;
    expenseFiles: Array<string>
    expenseId: string
};

export default function FileCell({ onPress, expenseFiles, expenseId }: Props) {
    let icon
    let color
    if (expenseFiles.length === 0) {
        icon = <FontAwesome name="file" size={18} color="#25292e" />
        color = "#D84040"
    }
    else {
        icon = <Text>{expenseFiles.length}</Text>
        color = "#00cc00"
    }
    return (
        <View
            style={[
                styles.buttonContainer
            ]}>
            <Link
                href={{
                    pathname: '/expense-config/[id]',
                    params: { id: expenseId }
                }}>
                <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
                    {icon}
                </Pressable>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
});