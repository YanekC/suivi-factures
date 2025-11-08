import { StyleSheet } from "react-native";

export default function SettingsScreen() {
  return <></>;
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
