import { AppIcon } from "@/components/AppIcon";
import { apps } from "@/lib/apps";
import { StyleSheet, View } from "react-native";

export function CSSAnimationsLesson() {
  return (
    <View style={styles.container}>
      <AppIcon app={apps[0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    [process.env.EXPO_OS === "web"
      ? "backgroundImage"
      : "experimental_backgroundImage"]:
      "linear-gradient(180deg,rgba(125, 211, 252, 1) 0%, rgba(29, 78, 216, 1) 100%)",
  },
});
