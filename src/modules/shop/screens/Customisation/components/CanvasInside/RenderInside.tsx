import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  Image,
  ImageBackground,
  PixelRatio,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useEffect } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import Animated from 'react-native-reanimated'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import localImages from '@ecom/utils/localImages'
import { transform } from 'lodash'

export default function RenderInside({
  editingMode,
  photoItem,
  renderedImageData,
  activeEditorOption,
  zoomGesture,
  tapGesture,
  rotateGesture,
  i,
  selectedTextInside,
  deleteItem,
  changeactiveElem,
  handleImageEditClick,
  setCurrentSelectedImageIndex,
  scale,
  pos,
  sliderIndex,
  rotate,
  setactiveElem,
  savedState,
  setSavedState,
  setPos,
  activeElem,
  insideWidth,
  setSelectedImage,
  insideHeight
}) {
  const { customFabricObj } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )

  let width = photoItem?.image?.width
    ? photoItem?.image?.width * renderedImageData?.multiplierWidth
    : 200
  let height = photoItem?.image?.height
    ? photoItem?.image?.height * renderedImageData?.multiplierHeight
    : 200

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch({
      type: actionNames.UPDATE_IMAGE_SCALE,
      payload:
        sliderIndex === 2
          ? {
              faceId: sliderIndex === 2 ? 1 : sliderIndex,
              photozoneId: i,
              scale: height / width / 4,
              sliderIndex: sliderIndex,
              multiplierWidth: renderedImageData?.multiplierWidth,
              multiplierHeight: renderedImageData?.multiplierHeight,
              insideWidth:
                customFabricObj.variables.template_data.faces[1].dimensions
                  ?.width / 2
            }
          : {
              faceId: sliderIndex === 2 ? 1 : sliderIndex,
              photozoneId: i,
              scale: height / width / 4,
              multiplierWidth: renderedImageData?.multiplierWidth,
              multiplierHeight: renderedImageData?.multiplierHeight,
              sliderIndex: sliderIndex
            }
    })
  }, [photoItem.sliderIndex == sliderIndex])

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .averageTouches(true)
    .onStart(() => {
      !editingMode && setactiveElem(i)
    })
    .onUpdate((e) => {
      let savedPos = savedState[activeElem]
        ? savedState[activeElem]
        : { x: 0, y: 0 }
      pos = {
        ...pos,
        [activeElem]: {
          x: e.translationX + savedPos.x,
          y: e.translationY + savedPos.y
        }
      }
      setPos(pos)
    })
    .onEnd(() => {
      setSavedState(JSON.parse(JSON.stringify(pos)))
      dispatch({
        type: actionNames.UPDATE_PAN,
        payload: {
          pos: pos,
          activeIndex: activeElem,
          sliderIndex: sliderIndex,
          multiplierX: renderedImageData?.multiplierWidth,
          multiplierY: renderedImageData?.multiplierHeight
        }
      })
    })
  // const composed = editingMode
  //   ? // ? Gesture.Race(
  //     // dragGesture,
  //     // zoomGesture,
  //     // Gesture.Race(zoomGesture, tapGesture):
  //     activeEditorOption != 'zoom'
  //     ? Gesture.Simultaneous(zoomGesture, tapGesture)
  //     : rotateGesture
  //   : // )
  //     dragGesture
  // const composed = editingMode
  //   ? Gesture.Race(
  //       dragGesture,
  //       zoomGesture
  //       // Gesture.Race(zoomGesture, tapGesture)
  //       // activeEditorOption == 'zoom'
  //       //   ? Gesture.Simultaneous(zoomGesture, tapGesture)
  //       //   : rotateGesture
  //     )
  //   : dragGesture
  // const composed = !editingMode
  //   ? Gesture.Simultaneous(
  //       dragGesture,
  //       activeEditorOption == 'zoom'
  //         ? Gesture.Simultaneous(zoomGesture, tapGesture)
  //         : rotateGesture
  //     )
  // : dragGesture

  return (
    <>
      {/* {selectedTextInside === null && !editingMode && (
              <GestureDetector
              gesture={dragGesture}>
              <View
                style={{
                  position: 'absolute',
                  alignSelf: 'flex-start',
                  width: 200,
                  backgroundColor:'transparent',
                  left: photoItem?.left
                    ? photoItem?.left
                    : insideWidth
                    ? insideWidth / 2
                    : 0,
                  // left: sliderIndex == 2  ? :  182.33334350585938 - 100,
                  top: photoItem?.top
                    ? photoItem?.top + 30
                    : insideHeight
                    ? insideHeight / 2 -
                      (200 * photoItem?.image?.height) / photoItem?.image.width / 2
                    : 0,
                  zIndex: 9999999 + i + 2,
                  aspectRatio: width / height || 1,
                  flex: 1,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 5
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  transform: [
                    {
                      scale: !editingMode
                        ? photoItem?.image?.scaleX
                          ? photoItem?.image?.scaleX
                          : 1
                        : scale[i]
                        ? scale[i]
                        : photoItem?.image?.scaleX
                        ? photoItem?.image?.scaleX
                        : 1
                    },
                    {
                      translateX: pos[i]?.x ? pos[i]?.x : 0
                    },
                    {
                      translateY: pos[i]?.y ? pos[i]?.y : 0
                    },
                    {
                      rotate: !editingMode
                        ? photoItem?.image?.angle
                          ? `${photoItem?.image?.angle}rad`
                          : '0deg'
                        : rotate[i]
                        ? `${rotate[i]}rad`
                        : photoItem?.image?.angle
                        ? `${photoItem?.image?.angle}rad`
                        : '0deg'
                    }
                  ]   
                }}>
                  
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                      // alignItems: 'center'
                    }}>
                      <View style={
                        { backgroundColor:"green", transform:[{rotate:"0deg"}]}}>
                    <TouchableOpacity
                      style={{
                        marginTop:-35,
                        marginLeft:-20,
                        backgroundColor:"transparent",
                        transform:[{rotate:"0deg"}]
                      }}
                      onPress={() => {
                        deleteItem(i)
                      }}>
                      <CircleIcon
                        name={'hm_Delete-thin'}
                        circleColor={colors.white}
                        circleSize={vw(36)}
                        iconSize={vw(15)}
                        iconColor={colors.hmPurple}
                        iconStyle={{backgroundColor:"transparent", transform:[{
                          rotate: String(-(photoItem?.image?.angle))+"rad"
                        },
                        {scale:1.0}
                      ]}}
                        circleStyle={{ marginRight: vw(20) }}
                      />
                    </TouchableOpacity>
                    </View>
    
                    <TouchableOpacity
                      style={{
                        marginTop:-35,
                        marginRight:-20,
                        transform:[
                          {rotate:"0deg"}
                        ]
                      }}
                      onPress={() => {
                        changeactiveElem(i)
                        handleImageEditClick(i)
                        setCurrentSelectedImageIndex(i)
                        setactiveElem(i)
                        setSelectedImage({
                          ...photoItem?.image
                        })
                      }}>
                      <CircleIcon
                        key={i}
                        name={'hm_Photo-thinsvg'}
                        circleColor={colors.white}
                        circleSize={vw(36)}
                        iconSize={vw(15)}
                        iconColor={colors.hmPurple}
                        circleStyle={{ marginRight: vw(10) }}
                        iconStyle={{backgroundColor:"transparent", transform:[{
                          rotate: String(-(photoItem?.image?.angle))+"rad"
                        },
                        {scale:1.0}
                      ]}}
                      />
                    </TouchableOpacity>
                  </View>
                  </View>
            </GestureDetector>
            )}  */}

      {photoItem?.image && !photoItem.deleted && (
        <GestureDetector
          gesture={Gesture.Simultaneous(
            Gesture.Simultaneous(zoomGesture, rotateGesture),
            dragGesture
          )}>
          <ImageBackground
            resizeMode="contain"
            source={{
              uri: photoItem?.image?.localUrl
            }}
            style={{
              position: 'absolute',
              alignSelf: 'flex-start',
              width: 200,
              left: photoItem?.left
                ? photoItem?.left
                : insideWidth
                ? insideWidth / 2
                : 0,
              // left: sliderIndex == 2  ? :  182.33334350585938 - 100,
              top: photoItem?.top
                ? photoItem?.top
                : insideHeight
                ? insideHeight / 2 -
                  (200 * photoItem?.image?.height) / photoItem?.image.width / 2
                : 0,
              zIndex: 8999999 + i,
              aspectRatio: width / height || 1,
              flex: 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              transform: [
                {
                  scale: !editingMode
                    ? photoItem?.image?.scaleX
                      ? photoItem?.image?.scaleX
                      : 1
                    : scale[i]
                    ? scale[i]
                    : photoItem?.image?.scaleX
                    ? photoItem?.image?.scaleX
                    : 1
                },
                {
                  translateX: pos[i]?.x ? pos[i]?.x : 0
                },
                {
                  translateY: pos[i]?.y ? pos[i]?.y : 0
                },
                {
                  rotate: !editingMode
                    ? photoItem?.image?.angle
                      ? `${photoItem?.image?.angle}rad`
                      : '0deg'
                    : rotate[i]
                    ? `${rotate[i]}rad`
                    : photoItem?.image?.angle
                    ? `${photoItem?.image?.angle}rad`
                    : '0deg'
                }
              ]
            }}>
            {selectedTextInside === null && !editingMode && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                <TouchableOpacity
                  style={{
                    // marginTop:
                    //   photoItem?.image?.scaleX &&
                    //   photoItem?.image?.scaleX > 1 &&
                    //   photoItem?.image?.scaleX <= 2
                    //     ? -10
                    //     : 30,
                    // marginTop: vh(-35),
                    // marginLeft: vw(0),
                    marginTop: vh(-35),
                    // marginLeft: 10,
                    marginRight: vw(-10),
                    transform: [
                      {
                        scale:
                          photoItem?.image?.scaleX > 1
                            ? 0.7
                            : photoItem?.image?.scaleX >= 0.2 &&
                              photoItem?.image?.scaleX <= 0.5
                            ? 2.0
                            : photoItem?.image?.scaleX <= 0.2
                            ? 4.0
                            : 1
                      },
                      {
                        rotate: String(-photoItem?.image?.angle) + 'rad'
                      }
                    ]
                  }}
                  onPress={() => {
                    deleteItem(i)
                  }}>
                  <CircleIcon
                    name={'hm_Delete-thin'}
                    circleColor={colors.white}
                    circleSize={vw(36)}
                    iconSize={vw(15)}
                    iconColor={colors.hmPurple}
                    circleStyle={{ marginRight: vw(20) }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    // marginTop:
                    //   photoItem?.image?.scaleX &&
                    //   photoItem?.image?.scaleX > 1 &&
                    //   photoItem?.image?.scaleX <= 2
                    //     ? -10
                    //     : 30,
                    // marginLeft:
                    //   photoItem?.image?.scaleX &&
                    //   photoItem?.image?.scaleX > 1 &&
                    //   photoItem?.image?.scaleX <= 2
                    //     ? -30
                    //     : -20,
                    // marginTop: vh(-35),
                    // marginLeft: vw(-20),
                    marginTop: vh(-35),
                    // marginLeft: 10,
                    marginRight: vw(-10),
                    transform: [
                      {
                        scale:
                          photoItem?.image?.scaleX > 1
                            ? 0.7
                            : photoItem?.image?.scaleX >= 0.2 &&
                              photoItem?.image?.scaleX <= 0.5
                            ? 2.0
                            : photoItem?.image?.scaleX <= 0.2
                            ? 4.0
                            : 1
                      },
                      {
                        rotate: String(-photoItem?.image?.angle) + 'rad'
                      }
                    ]
                  }}
                  onPress={() => {
                    changeactiveElem(i)
                    handleImageEditClick(i)
                    setCurrentSelectedImageIndex(i)
                    setactiveElem(i)
                    setSelectedImage({
                      ...photoItem?.image
                    })
                  }}>
                  <CircleIcon
                    key={i}
                    name={'hm_Photo-thick'}
                    circleColor={colors.white}
                    circleSize={vw(36)}
                    iconSize={vw(16)}
                    iconColor={colors.hmPurple}
                    circleStyle={{ marginRight: vw(10) }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </ImageBackground>
        </GestureDetector>
      )}
    </>
  )
}
