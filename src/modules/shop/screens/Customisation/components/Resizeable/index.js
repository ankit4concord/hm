import {
  Animated,
  SafeAreaView,
  Text
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import React, { useState } from 'react'

import DragResizeBlock from './Components/DragResizeBlock'

const Resizeable = () => {
  const [isDisabled] = useState(false)
  const [positionX, setpositionX] = useState(0)
  const [positionY, setpositionY] = useState(0)
  const panGesture = Gesture.Pan().onUpdate((e) => {
    setpositionX(e.translationX)
    setpositionY(e.translationY)
  })
  return (
    <SafeAreaView style={{ marginTop: 130 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={{
            transform: [{ translateX: positionX }, { translateY: positionY }]
          }}>
          <DragResizeBlock isDisabled={isDisabled}>
            <Text>Tap to add your own text</Text>
          </DragResizeBlock>
        </Animated.View>
      </GestureDetector>
    </SafeAreaView>
  )
}

export default Resizeable
