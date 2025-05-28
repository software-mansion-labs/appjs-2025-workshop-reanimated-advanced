import { Container } from "@/components/Container";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("screen");
const _duration = 500;
const _spacing = 16;
const _closedSize = 64;
const _openedSize = width - _spacing * 2;
const _closeIconSize = _closedSize * 0.4;
const _openIconSize = _closedSize * 0.5;

export function AdvancedLayoutAnimationsLesson() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <View
        style={[
          {
            width: isOpen ? _openedSize : _closedSize,
            height: isOpen ? "auto" : _closedSize,
          },
          styles.fabButton,
        ]}>
        <View style={styles.rowBetween}>
          {isOpen && <Text style={styles.heading}>App.js Workshop</Text>}
          <Pressable onPress={() => setIsOpen((isOpen) => !isOpen)}>
            {isOpen ? (
              <Entypo
                key='close'
                name='cross'
                size={_closeIconSize}
                color='#fff'
              />
            ) : (
              <Entypo
                key='open'
                name='plus'
                size={_openIconSize}
                color='#fff'
              />
            )}
          </Pressable>
        </View>
        {isOpen && (
          <View style={styles.content}>
            <Text style={styles.body}>
              This is a start of your journey to become an animation expert in
              React Native. We're going to dive deep into more advanced
              Reanimated concepts.
            </Text>
            <Text style={styles.body}>
              You'll learn how to deal with discrete and continuous style
              properties, deeply understand the Reanimated threading model,
              master scroll-based interactions, gestures, layout measurements,
              and more.
            </Text>
            <TextInput
              style={styles.input}
              placeholder='Your feedback means a lot to us.'
              placeholderTextColor='rgba(255,255,255,0.3)'
            />
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 14,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.8)",
  },
  heading: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  body: { color: "#aaa" },
  content: { flex: 1, marginTop: _spacing, gap: _spacing },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fabButton: {
    borderRadius: _closedSize / 2,
    padding: _spacing,
    backgroundColor: "#111",
    position: "absolute",
    bottom: 80,
    overflow: "hidden",
  },
});
