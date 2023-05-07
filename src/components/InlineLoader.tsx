import { Image, StyleSheet, View } from 'react-native'

import DropShadow from 'react-native-drop-shadow'
import Lottie from 'lottie-react-native'
import React from 'react'
import { vw } from '@ecom/utils/dimension'

const InlineLoader = () => {
  return (
    <DropShadow style={styles.shadowContainer}>
      <View style={styles.activityIndicatorWrapper}>
        <Lottie
          source={require('./animation.json')}
          autoPlay
          loop
          style={{ width: 116 }}
        />
      </View>
    </DropShadow>
  )
}

const styles = StyleSheet.create({
  loaderImage: {
    width: vw(110),
    resizeMode: 'contain'
  },
  activityIndicatorWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: vw(100),
    width: 66,
    height: 66
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8
  }
})

export default InlineLoader
