import { SafeAreaView } from "react-native";
import ImportExport from "@/components/import-export/ImportExport"
import { Expense } from "@/model/Expense";

type Props = {
    expenses: Array<Expense>
}

export default function ImportExportView(props: Props) {
    return (
        <SafeAreaView
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <ImportExport />
        </SafeAreaView>
    );
}