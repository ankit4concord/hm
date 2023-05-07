import React from 'react'
import Lottie from 'lottie-react-native'

export const NonModalLoader = () => {
  return (
    <Lottie
      source={require('./animation.json')}
      autoPlay
      loop
      style={{ width: 116 }}
    />
  )
}
