import { AppIcon } from "@/components/AppIcon";
import { apps } from "@/lib/apps";
import { layout } from "@/lib/theme";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  CSSAnimationKeyframes,
  LinearTransition,
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
  const currentPosition = useSharedValue<Position | null>(null);

  const pressed = useSharedValue(false);
  const scale = useSharedValue(1);
  const offsetX = useSharedValue<number>(0);
  const offsetY = useSharedValue<number>(0);

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

  const pan = Gesture.Pan()
    .onBegin(() => {
      pressed.value = true;
      activeItemId.value = id;
    })
    .onChange((e) => {
      if (!isEditMode) {
        return;
      }
      const column = Math.floor(
        e.absoluteX / (tileDimension?.width + layout.gap)
      );
      const row = Math.floor(
        e.absoluteY / (tileDimension?.height + layout.gap)
      );

      const newPlaceholderIndex = Math.min(
        column + row * layout.itemsInRowCount,
        apps.length
      );

      runOnJS(setPlaceholderIndex)(newPlaceholderIndex);

      offsetX.value += e.changeX;
      offsetY.value += e.changeY;

      currentPosition.value = {
        column,
        row,
      };
    })
    .onFinalize(() => {
      runOnJS(reorderItems)();

      // Cleanup
      pressed.value = false;
      offsetX.value = 0;
      offsetY.value = 0;
      activeItemId.value = null;
      runOnJS(setPlaceholderIndex)(null);
      currentPosition.value = null;
    });

  const animatedStyle = useAnimatedStyle(() => {
    const adjustX = withTiming(
      currentPosition.value
        ? (initialPosition.column - currentPosition.value.column) *
            tileDimension?.width
        : 0
    );
    const adjustY = withTiming(
      currentPosition.value
        ? (initialPosition.row - currentPosition.value.row) *
            tileDimension?.height
        : 0
    );

    return {
      transform: [
        { scale: scale.value },
        { translateX: offsetX.value + adjustX },
        { translateY: offsetY.value + adjustY },
      ],
      zIndex: pressed.value ? 1 : 0,
    };
  });

  const composed = Gesture.Exclusive(longPress, tap, pan);

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
        layout={LinearTransition}
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
