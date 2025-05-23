# CSS Animations Advanced

## Step 1 - Add a shake animation using CSS Animations

<details>
<summary>
  <b>[1]</b> Wrap the <code>AppIcon</code> component with an <code>Animated.View</code>
</summary>

<br/>

Make sure the <code>Animated</code> is imported from <code>react-native-reanimated</code>.

```jsx
import Animated from "react-native-reanimated";

<Animated.View>
  <AppIcon app={apps[0]} />
</Animated.View>;
```

</details>
<br />

<details>
<summary>
  <b>[2]</b> Define the shake animation using keyframes by rotating the view back and forth clockwise and counter-clockwise by +/- 2 degrees every 15% of the animation. Set the animation duration to 700 ms and make it repeat indefinitely.
</summary>

<br/>

If you want, you can define the animation object outside of the component.

```jsx
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

<Animated.View
  style={{
    animationName: shake,
    animationDuration: 700,
    animationIterationCount: "infinite",
  }}
>
  <AppIcon app={apps[0]} />
</Animated.View>;
```

</details>
<br />

## Step 2 - Long press to turn on the edit mode (shake animation), tap to cancel

## Step 3 - Scale the app icon to indicate the edit mode change

## Next step

**Go to: [Reorder Icons](../ReorderIcons/)**
