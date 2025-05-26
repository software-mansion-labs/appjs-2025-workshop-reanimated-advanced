# Reorder Icons (Drag and Drop)

[reorder-icons-final.webm](https://github.com/user-attachments/assets/a6286f11-af9d-4df1-a3e8-e02bc0601eb1)

## Step 1 - Drag the icon around

[draggable-icons.webm](https://github.com/user-attachments/assets/874bb8c2-378a-4bd5-88e3-bebdbcba5e09)

<details>
<summary>
  <b>[1]</b> Use <code>Gesture.Pan</code> to make the icons draggable. Don't worry about gesture composition for now.
</summary>

```tsx
const offsetX = useSharedValue<number>(0);
const offsetY = useSharedValue<number>(0);

const pan = Gesture.Pan()
  .onChange((e) => {
    offsetX.value += e.changeX;
    offsetY.value += e.changeY;
  })
  .onFinalize(() => {
    offsetX.value = 0;
    offsetY.value = 0;
  });

const draggingStyle = useAnimatedStyle(() => {
  return {
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value }
    ],
  };
});

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={[
          {/* ... */}
          draggingStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> Adjust the <code>zIndex</code> in the animated style for currently dragged icon. Use the <code>draggingItemId</code> shared value. Make sure it's up-to-date first!
</summary>

```jsx
const pan = Gesture.Pan()
  .onBegin(() => {
    draggingItemId.value = id; // <-- here
  })
  .onChange((e) => {
    offsetX.value += e.changeX;
    offsetY.value += e.changeY;
  })
  .onFinalize(() => {
    offsetX.value = 0;
    offsetY.value = 0;
    draggingItemId.value = null; // <-- here
  });

const draggingStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    zIndex: draggingItemId.value === id ? 1 : 0, // <-- here
  };
});
```

</details>
<br />

## Step 2 - Calculate the placeholder index

## Next step

**Go to: [Dynamic Tabs](../DynamicTabs/)**
