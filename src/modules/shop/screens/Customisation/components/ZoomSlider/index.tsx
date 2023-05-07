import { Animated, Text, View } from 'react-native'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'

import { GestureDetector } from 'react-native-gesture-handler'
import React from 'react'
import styles from './styles'

const ZoomSlider = ({
  // pointerPosition,
  panZoomSliderGesture,
  zoomLevel,
  zoomSliderLines,
  // opacityHandler,
  // defaultZoomLevel,
  imageData
}: any) => (
  <View style={{ marginVertical: 0 }}>
    <ZoomPercentage {...{ zoomLevel }} />

    <View
      style={{
        width: screenWidth - vw(120),
        marginHorizontal: vw(50),
        marginVertical: vh(50),
        position: 'relative'
      }}>
      <GestureDetector gesture={panZoomSliderGesture}>
        <Animated.View>
          <View
            style={[
              styles.box,
              {
                transform: [{ translateX: pointerPosition }]
              }
            ]}></View>
          <View style={styles.slider_lines}>
            {Array(zoomSliderLines)
              .fill()
              .map((item, i) => (
                <View
                  key={i}
                  style={[
                    styles.vertical_line,
                    {
                      height:
                        i === parseInt(zoomSliderLines / 2) ? i + 12 : i + 6,
                      left: 20 + i * 6,
                      width: i === parseInt(zoomSliderLines / 2) ? 3 : 1
                      // opacity: opacityHandler(i)
                    }
                  ]}></View>
              ))}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  </View>
)

const ZoomPercentage = ({ zoomLevel }: any) => {
  return (
    <View style={styles.percentage_wrapper}>
      <View style={styles.percentage_view}>
        <Text style={styles.percentage}>{zoomLevel || 100}%</Text>
      </View>
    </View>
  )
}

export default ZoomSlider
