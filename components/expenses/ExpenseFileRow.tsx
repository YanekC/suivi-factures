import { Button, Text, View } from "react-native";

type Props = {
    filePath: string
    deleteFile: (fileToDelete: string) => void
}

export default function ExpenseFileRow(props: Props) {
    return (
        <View style={{ flexDirection: "row" }}>
            <Text key={props.filePath}>{props.filePath}</Text>
            <Button title="Delete file" onPress={() => props.deleteFile(props.filePath)} />
        </View>
    )
}