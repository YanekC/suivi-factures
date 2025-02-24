import { ActivityIndicator, StyleSheet, View, Modal } from "react-native";
type Props = {
    loading: boolean
}

export default function LoadingScreen(props: Props) {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={props.loading}>
            <View style={styles.overlay}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
});