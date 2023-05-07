import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Image, ImageBackground, View } from 'react-native'

import Animated from 'react-native-reanimated'
import React from 'react'
import { isEmpty } from 'lodash'

const EditmodePhotozone = (props: any) => {
  let {
    zoomGesture,
    rotateGesture,
    dragGesture,
    activeEditorOption,
    i,
    scale,
    position,
    rotate,
    photoItem,
    renderedImageData,
    tapGesture,
    activeElem,
    setDegree,
    setzoomVal
  } = props
  let width = (photoItem?.width + 17.7165) * renderedImageData?.multiplierWidth
  let height =
    (photoItem?.height + 17.7165) * renderedImageData?.multiplierHeight
  let top = (photoItem?.top + 17.7165) * renderedImageData?.multiplierHeight
  let left = (photoItem?.left + 17.7165) * renderedImageData?.multiplierWidth
  const composed = Gesture.Race(
    dragGesture,
    Gesture.Simultaneous(rotateGesture, zoomGesture)
  )
  if (isEmpty(rotate)) {
    rotate = { ...rotate, [i]: photoItem?.image?.angle }

    setDegree(photoItem?.image?.angle * (180 / Math.PI))
  }

  if (isEmpty(scale)) {
    scale = { ...scale, [i]: photoItem?.image?.scaleX }
    setzoomVal(photoItem?.image?.scaleX)
  }
  return (
    <>
      <Animated.View
        style={{
          position: 'absolute',
          width: width || 10,
          height: height || 10,
          justifyContent: 'center',
          alignItems: 'center',
          top: top || 10,
          left: left || 10,
          transform: [
            {
              rotate: `${photoItem?.angle}deg`
            }
          ],
          backgroundColor: 'grey',
          overflow: 'hidden'
        }}>
        <Image
          source={{
            uri: photoItem?.image?.localUrl
          }}
          resizeMode="cover"
          style={{
            position: 'absolute',
            // width: width || 10,
            // height: height || 10,
            alignSelf: 'center',
            aspectRatio: width
              ? width > height
                ? width / height
                : height / width
              : 1,
            // flex: 1,
            // width: width,
            height: height || 0,

            // height: '100%',
            // width: '100%',
            // aspectRatio: width / height || 1,
            // left: 0,
            // right: 0,
            // // borderWidth: 1,

            transform: [
              {
                scale:
                  scale[i] >= 0
                    ? scale[i]
                    : photoItem?.image?.scaleX
                    ? photoItem?.image?.scaleX
                    : 1
              },
              { translateX: position[i] ? position[i].x : 0 },
              { translateY: position[i] ? position[i].y : 0 },
              {
                rotate: rotate[i] ? `${rotate[i]}rad` : '0rad'
              }
            ]
          }}
        />
      </Animated.View>
      <GestureDetector gesture={composed}>
        <Animated.View
          style={{
            top: top || 10,
            left: left || 10,
            overflow: 'hidden',
            position: 'absolute',
            width: width || 10,
            height: height || 10,
            zIndex: 999999999 + i,
            backgroundColor: 'transparent',
            opacity: 1,
            transform: [
              {
                scale: scale[i] >= 0 ? scale[i] : 1
              },
              { translateX: position[i] ? position[i].x : 0 },
              { translateY: position[i] ? position[i].y : 0 },
              {
                rotate: rotate[i]
                  ? `${rotate[i]}rad`
                  : `${photoItem?.image?.angle}rad`
                  ? `${photoItem?.image?.angle}rad`
                  : `${photoItem?.angle}deg` || 0
              }
            ]
          }}></Animated.View>
      </GestureDetector>
    </>
  )
}

export default EditmodePhotozone
