import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";

export default function ExpenseConfig() {
    const glob = useGlobalSearchParams();
    const local = useLocalSearchParams();

    console.log("Local:", local.user, "Global:", glob.user);
    return (<></>)
}