import Animated, {
  useAnimatedStyle,
  useSharedValue
} from 'react-native-reanimated'
import {
  Gesture,
  GestureDetector,
  gestureHandlerRootHOC
} from 'react-native-gesture-handler'
import { Image, StyleSheet, View } from 'react-native'
import { useEffect, useRef } from 'react'

import React from 'react'
import { scaleLinear } from 'd3-scale'

const RotateView = ({ onChange, degree }) => {
  const rotation = useSharedValue(0)
  const savedRotation = useSharedValue(0)
  let draggingRef = useRef(false)

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${(rotation.value / Math.PI) * 180}deg` }]
  }))

  const scale = scaleLinear().domain([0, 360]).range([-180, 180])

  useEffect(() => {
    if (draggingRef.current) return

    let scaleDegree = (degree + 180) * (Math.PI / 180)
    rotation.value = scaleDegree
    savedRotation.value = scaleDegree
  }, [degree])

  const updateVal = (val) => {
    val = (val / Math.PI) * 180
    val = Math.round(scale(val % 360))
    onChange(val)
  }

  const rotationGesture = Gesture.Rotation()
    .onUpdate((e) => {
      draggingRef.current = true
      rotation.value = savedRotation.value + e.rotation
      updateVal(rotation.value)
    })
    .onEnd(() => {
      draggingRef.current = false
      savedRotation.value = rotation.value
      updateVal(savedRotation.value)
    })

  return (
    <GestureDetector gesture={rotationGesture}>
      <Animated.View style={[styles.box, animatedStyle]} useNativeDriver={true}>
        <Image
          source={{
            uri: 'https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png'
          }}
          style={{ width: 100, height: 100 }}
        />
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
    borderWidth: 1,
    marginTop: 200
  }
})
export default gestureHandlerRootHOC(RotateView)
