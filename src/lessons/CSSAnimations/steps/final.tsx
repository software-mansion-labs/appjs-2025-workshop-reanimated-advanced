import { AppIcon } from "@/components/AppIcon";
import { apps } from "@/lib/apps";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  CSSAnimationKeyframes,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const shake: CSSAnimationKeyframes = {
  from: {
    transform: [{ rotateZ: "2deg" }],
  },
  "15%": {
    transform: [{ rotateZ: "-2deg" }],
  },
  "30%": {
    transform: [{ rotateZ: "2deg" }],
  },
  "45%": {
    transform: [{ rotateZ: "-2deg" }],
  },
  "60%": {
    transform: [{ rotateZ: "2deg" }],
  },
  "75%": {
    transform: [{ rotateZ: "-2deg" }],
  },
  to: {
    transform: [{ rotateZ: "2deg" }],
  },
};

export function CSSAnimationsLesson() {
  const [isEditMode, setEditMode] = useState(false);
  const scale = useSharedValue(1);

  const longPress = Gesture.LongPress()
    .onBegin(() => {
      if (isEditMode) {
        return;
      }
      scale.value = withTiming(1.1, { duration: 500 });
    })
    .onStart(() => {
      scale.value = withTiming(1, { duration: 150 }, (finished) => {
        if (finished) {
          runOnJS(setEditMode)(true);
        }
      });
    })
    .onFinalize(() => {
      scale.value = withTiming(1, { duration: 150 });
    });

  const tap = Gesture.Tap().onStart(() => {
    runOnJS(setEditMode)(false);
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const composed = Gesture.Exclusive(longPress, tap);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={[
            isEditMode && {
              animationName: shake,
              animationDuration: 700,
              animationIterationCount: "infinite",
            },
            animatedStyle,
          ]}
        >
          <AppIcon app={apps[0]} />
        </Animated.View>
      </GestureDetector>
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
