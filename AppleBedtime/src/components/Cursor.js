import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import Animated, {cos, multiply, sin} from 'react-native-reanimated';
import {atan2} from './Math';

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    ...StyleSheet.absoluteFillObject,
  },
});

const Cursor = ({radius, angle}) => {
  const alpha = new Animated.Value(0);
  const translationX = new Animated.Value(0);
  const translationY = new Animated.Value(0);
  const state = new Animated.Value(State.UNDETERMINED);
  const onGestureEvent = Animated.event([
    {
      nativeEvent: {
        translationX,
        translationY,
        state,
      },
    },
  ]);
  const offsetX = new Animated.Value(0);
  const offsetY = new Animated.Value(0);
  const x = new Animated.Value(0);
  const y = new Animated.Value(0);
  const translateX = new Animated.Value(0);
  const translateY = new Animated.Value(0);

  return (
    <>
      <Animated.Code>
        {() =>
          Animated.block([
            Animated.cond(Animated.eq(state, State.ACTIVE), [
              Animated.set(x, Animated.add(offsetX, translationX)),
              Animated.set(y, Animated.add(offsetY, translationY)),
            ]),
            Animated.cond(Animated.eq(state, State.END), [
              Animated.set(offsetX, x),
              Animated.set(offsetY, y),
            ]),
            Animated.set(
              alpha,
              atan2(
                Animated.sub(Animated.multiply(y, -1), radius),
                Animated.sub(x, radius),
              ),
            ),
            Animated.set(angle, alpha),
            Animated.set(
              translateX,
              Animated.add(multiply(radius, cos(alpha)), radius),
            ),
            Animated.set(
              translateY,
              Animated.add(multiply(-1 * radius, sin(alpha)), radius),
            ),
          ])
        }
      </Animated.Code>
      <PanGestureHandler
        {...{onGestureEvent}}
        onHandlerStateChange={onGestureEvent}>
        <Animated.View
          style={[
            styles.container,
            {
              transform: [{translateX}, {translateY}],
            },
          ]}
        />
      </PanGestureHandler>
    </>
  );
};

export default Cursor;
