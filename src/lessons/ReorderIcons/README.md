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

## Step 2 - Calculate the new position for the app

https://github.com/user-attachments/assets/3607283d-f302-41fc-83b9-31f7cc0ecf5b

<details>
<summary>
  <b>[1]</b> In <code>Gesture.Pan</code>'s <code>onChange</code> calculate the current column and row the app icon is currently dragged above. Do the calculations based on the absolute position of the gesture and the dimenstions of a tile.
</summary>

```tsx
  const pan = Gesture.Pan()
    // ...
    .onChange((e) => {
      if (!tileDimension) {
        return;
      }
      const column = Math.floor(
        e.absoluteX / (tileDimension.width + layout.gap)
      );
      const row = Math.floor(e.absoluteY / (tileDimension.height + layout.gap));
      // ...
    }
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> The new position index is <code>column + row * items in row</code>. Cap it to never go above max index in the items array. Update the <code>placeholderIndex</code> state variable with the newly calculated value. 
</summary>

```tsx
  const pan = Gesture.Pan()
    // ..
    .onChange((e) => {
      // ...
      const newPlaceholderIndex = Math.min(
        column + row * layout.itemsInRowCount,
        apps.length
      );

      runOnJS(setPlaceholderIndex)(newPlaceholderIndex);
    }
```

</details>
<br />

<details>
<summary>
  <b>[3]</b> Run <code>reorderItems</code> when user drops the icon. Make sure to clean-up the <code>placehoderIndex</code>.
</summary>

```tsx
const pan = Gesture.Pan()
  // ...
  .onFinalize(() => {
    // ...
    runOnJS(reorderItems)();

    runOnJS(setPlaceholderIndex)(null);
  });
```

</details>
<br />

## Step 3 - Adjust the position of the app icon by the value of the layout offset

https://github.com/user-attachments/assets/7509f55c-b1ec-4e98-bddf-964ad74e8c0d

<details>
<summary>
  <b>[1]</b> Define a new <code>currentPosition</code> shared value and make sure it holds the current <code>column</code> and <code>row</code> calculated in the previous step. You can use the <code>Position</code> interface as a type. Don't forget to clean up after the gesture end. 
</summary>

```tsx
const currentPosition = useSharedValue<Position | null>(null);

const pan = Gesture.Pan()
  .onChange((e) => {
    const column = // ...
    const row = // ...

    // ...

    currentPosition.value = { column, row };
  })
  .onFinalize(() => {
    // ...
    currentPosition.value = null;
  });
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> Based on <code>initialPosition</code>, <code>currentPosition</code> and tile dimensions calculate the gesture adjustment for both <code>offsetX</code> and <code>offsetY</code>. Wrap the calculated adjustments in <code>withTiming</code>.
</summary>

```tsx
const draggingStyle = useAnimatedStyle(() => {
  if (!tileDimension || currentPosition.value === null) {
    return {};
  }

  const adjustX = withTiming(
    (initialPosition.column - currentPosition.value.column) *
      (tileDimension.width + layout.gap)
  );

  const adjustY = withTiming(
    (initialPosition.row - currentPosition.value.row) *
      (tileDimension.height + layout.gap)
  );

  return {
    transform: [
      { translateX: offsetX.value + adjustX },
      { translateY: offsetY.value + adjustY },
      // ...
    ],
  };
});
```

</details>
<br />

## Next step

**Go to: [Dynamic Tabs](../DynamicTabs/)**
