import { AppIcon } from "@/components/AppIcon";
import { apps } from "@/lib/apps";
import { layout } from "@/lib/theme";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  CSSAnimationKeyframes,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export function ReorderIconsLesson() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(apps);
  const activeItemId = useSharedValue<string | null>(null);
  const [placeholderIndex, setPlaceholderIndex] = useState<number | null>(null);
  const [isEditMode, setEditMode] = useState(false);

  const reorderItems = () => {
    if (placeholderIndex === null || activeItemId.value === null) {
      return;
    }
    const currentItem = items.find((item) => item.id === activeItemId.value);
    if (!currentItem) {
      return;
    }

    const newItems = [...items];

    const activeIndex = newItems.findIndex(
      (item) => item.id === activeItemId.value
    );
    newItems.splice(activeIndex, 1);
    newItems.splice(placeholderIndex, 0, currentItem);

    setItems(newItems);
  };

  useEffect(() => {
    reorderItems();
  }, [placeholderIndex]);

  return (
    <View style={[styles.background, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        {items.map((app, index) => (
          <Draggable
            key={app.id}
            id={app.id}
            activeItemId={activeItemId}
            setPlaceholderIndex={setPlaceholderIndex}
            reorderItems={reorderItems}
            initialPosition={{
              column: index % layout.itemsInRowCount,
              row: Math.floor(index / layout.itemsInRowCount),
            }}
            isEditMode={isEditMode}
            setEditMode={setEditMode}
          >
            <AppIcon app={app} />
          </Draggable>
        ))}
      </View>
    </View>
  );
}

interface Position {
  column: number;
  row: number;
}

interface DraggableProps {
  children: React.ReactNode;
  id: string;
  setPlaceholderIndex: (index: number | null) => void;
  reorderItems: () => void;
  activeItemId: SharedValue<string | null>;
  initialPosition: Position;
  isEditMode: boolean;
  setEditMode: (edit: boolean) => void;
}

function Draggable({
  children,
  id,
  setPlaceholderIndex,
  reorderItems,
  activeItemId,
  initialPosition,
  isEditMode,
  setEditMode,
}: DraggableProps) {
  const [tileDimension, setTileDimensions] = useState<any>();

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
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          isEditMode && {
            animationName: shake,
            animationDuration: 700,
            animationIterationCount: "infinite",
            animationDelay: Math.random() * 300,
          },
          animatedStyle,
        ]}
        onLayout={(e) => setTileDimensions(e.nativeEvent.layout)}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    [process.env.EXPO_OS === "web"
      ? "backgroundImage"
      : "experimental_backgroundImage"]:
      "linear-gradient(180deg,rgba(125, 211, 252, 1) 0%, rgba(29, 78, 216, 1) 100%)",
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: layout.gap,
    paddingLeft: layout.gap,
  },
});
