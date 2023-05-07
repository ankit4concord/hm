import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'

import ArcSlider from './components/ArcSlider'
import Rotate from './components/Rotate'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'

const RadialVariant = (props: any) => {
  const { degree, setDegree } = props
  return (
    <View
      style={{
        marginVertical: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: vh(5)
      }}>
      <View style={styles.percentage_wrapper}>
        <View style={styles.percentage_view}>
          <Text style={styles.percentage}>{degree}</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Image
          source={localImages.rotateIcon}
          style={{
            width: screenWidth - vw(80),
            height: vh(65),
            resizeMode: 'contain'
            // zIndex: 1
          }}></Image>
        <View
          style={{
            borderWidth: vw(2),
            height: vh(30),
            borderRadius: vw(5),
            width: 1,
            position: 'absolute',
            // left: '49.2%',
            top: vh(30)
          }}></View>
        <View style={styles.container1}>
          <ArcSlider degree={degree} onChange={setDegree} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
    // borderWidth: 1,
    marginHorizontal: vw(0),
    marginTop: vh(35)
    // paddingVertical: 0
  },
  container1: {
    // overflow: 'hidden',
    padding: vw(-100),
    // height: 150,
    position: 'absolute',
    // top: -90,
    bottom: vh(-45),
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
    // borderWidth: 1,
  },
  deg: {
    zIndex: 1
  },
  percentage_wrapper: {
    alignItems: 'center',
    flex: 1,
    paddingTop: vh(20),
    zIndex: 1
    // top: '3%'
  },
  percentage_view: {
    height: vw(43),
    width: vw(43),
    borderRadius: vw(22),
    borderWidth: 1,
    borderColor: '#0000001A',
    alignItems: 'center',
    justifyContent: 'center'
  },
  percentage: {
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM
  }
})

export default RadialVariant
