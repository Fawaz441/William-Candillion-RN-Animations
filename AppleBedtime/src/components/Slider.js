import React from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import Animated, {concat, sub} from 'react-native-reanimated';
import SliderClock from './SliderClock';
import Cursor from './Cursor';

const {width} = Dimensions.get('window');
const size = width - 32;
const strokeWidth = 50;
const padding = 25;
const radius = (size - strokeWidth) / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Slider = () => {
  const start = new Animated.Value(0);
  const end = new Animated.Value(0);
  const delta = Animated.sub(
    Animated.cond(
      Animated.lessThan(start, end),
      end,
      Animated.add(end, Math.PI * 2),
    ),
    start,
  );
  const circumference = radius * Math.PI * 2;
  const strokeDashoffset = Animated.multiply(delta, radius);
  const rotateZ = concat(Animated.sub(Math.PI * 2, start), 'rad');
  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{rotateZ}],
        }}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
              <Stop offset="0" stopColor="#eda338" />
              <Stop offset="1" stopColor="#f5d346" />
            </LinearGradient>
          </Defs>
          <Circle
            stroke={'rgb(50,50,50)'}
            r={radius}
            cx={size / 2}
            cy={size / 2}
            {...{strokeWidth}}
          />
          <AnimatedCircle
            r={radius}
            cx={size / 2}
            cy={size / 2}
            stroke="url(#grad)"
            fill={'none'}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            {...{strokeDashoffset}}
          />
        </Svg>
      </Animated.View>
      <SliderClock size={size} padding={padding} />
      <Cursor angle={start} radius={radius} />
      <Cursor angle={end} radius={radius} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: size,
    height: size,
  },
});

export default Slider;
