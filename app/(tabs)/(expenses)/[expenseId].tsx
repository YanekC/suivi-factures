import ExpenseConfig from "@/components/ExpenseConfig";
import { StyleSheet, View } from "react-native";

export default function ExpenseConfigScreen() {

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
    return (
        <>
            <View style={styles.container}>
                <ExpenseConfig />
            </View>
        </>
    );
}