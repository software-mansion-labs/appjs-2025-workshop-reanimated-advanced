import { layout } from "@/lib/theme";
import {
  Image,
  ImageSourcePropType,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface AppIconProps {
  app: {
    id: string;
    name: string;
    icon: ImageSourcePropType;
  };
  onLayout?: (event: any) => void;
}

export function AppIcon({ app, onLayout }: AppIconProps) {
  return (
    <View style={styles.appContainer} onLayout={onLayout}>
      <Image source={app.icon} style={styles.appIcon} />
      <Text style={styles.appName} numberOfLines={1}>
        {app.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  appIcon: {
    width: layout.tileSize,
    height: layout.tileSize,
    aspectRatio: 1,
    borderRadius: Platform.OS === "android" ? layout.tileSize : 20,
    borderCurve: "continuous",
    marginBottom: 4,
  },
  appName: {
    fontSize: 13,
    color: "#fff",
    width: layout.tileSize,
    textAlign: "center",
  },
});
