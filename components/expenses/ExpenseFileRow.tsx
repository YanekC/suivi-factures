import { FontAwesome } from "@expo/vector-icons";
import { Button, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
    filePath: string
    deleteFile: (fileToDelete: string) => void
}
const styles = StyleSheet.create({
    buttonContainer: {
        flex: 1,
        height: 40,
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {

        borderRadius: 10,
        height: 35,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    }
});

export default function ExpenseFileRow(props: Props) {
    return (
        <View style={{ flexDirection: "row", width: '100%' }}>
            <Text style={{ flex: 1 }} key={props.filePath}>{props.filePath}</Text>
            <Pressable onPress={() => props.deleteFile(props.filePath)}>
                <View style={[styles.buttonContainer]}>
                    <View style={[styles.button, { backgroundColor: "#D84040" }]}>
                        <FontAwesome name="trash" size={18} color="#25292e" />
                    </View>
                </View>
            </Pressable>
        </View>
    )
}