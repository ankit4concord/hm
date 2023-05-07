import { Image, PanResponder, View } from 'react-native'

import React from 'react'

const Connector = ({ x, y, size, children, onStart, onMove, onEnd }) => {
  let position = {}
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: () => true,
    onMoveShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponderCapture: () => true,

    onPanResponderGrant: () => {
      position = {
        x: 0,
        y: 0
      }
      onStart([0, 0])
    },
    onPanResponderMove: (e, gestureState) => {
      onMove([gestureState.dx - position.x, gestureState.dy - position.y])

      position = {
        x: gestureState.dx,
        y: gestureState.dy
      }
    },
    onPanResponderTerminationRequest: () => true,
    onPanResponderRelease: (e, gestureState) => {
      onEnd([gestureState.moveX, gestureState.moveY])
    },
    onPanResponderTerminate: () => {},
    onShouldBlockNativeResponder: () => {
      return true
    }
  })

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size,
        alignItem: 'center',
        justifyContent: 'center',
        padding: 5,

      }}
      {...panResponder.panHandlers}>
      {children}
    </View>
  )
}

export default Connector
