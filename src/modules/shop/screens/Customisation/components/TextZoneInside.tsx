import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import React, { useEffect, useRef, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import DragResizeBlock from './Resizeable/Components/DragResizeBlock'
import ToolTip from '@ecom/components/ToolTip'
import colors from '@ecom/utils/colors'
import fontFamilies from '@ecom/utils/fontFamilies'
import localImages from '@ecom/utils/localImages'
import { useSharedValue } from 'react-native-reanimated'

let start = [{ x: 0, y: 0 }]
let rotation = [{ deg: 0, savedRadian: 0 }]
let boxPosition = []
let boxRotations = []
const TextZoneInside = (props: any) => {
  const {
    element,
    renderedImageData,
    itemKey,
    deleteInsideText,
    selectedTextInside,
    setSelectedTextInside,
    activeEditMenu,
    setActiveEditMenu,
    editingMode,
    updateTextPosition,
    insideWidth,
    setHeightWidthTextBox,
    allTextsArr: allTextsObj,
    updateTextArr,
    setMaxLimitTextToolbar,
    maxLimitTextToolbar,
    editTextInside,
    isClickedOnText,
    insideHeight,
    setShowBoxExceedToolbar,
    showBoxExceedToolbar,
    isOpen
  } = props
  let width = element?.width * renderedImageData?.multiplierWidth
  let height = element?.height * renderedImageData?.multiplierHeight
  let top = element?.top * renderedImageData?.multiplierHeight
  let left = element?.left * renderedImageData?.multiplierWidth

  const [fakePositions, setFakePositions] = useState()
  const [boxWidth, setBoxWidth] = useState(width)
  const [boxHeight, setBoxHeight] = useState(height)
  const [textHeight, setTextHeight] = useState(height - vh(20))
  const [isSelected, setisSelected] = useState(false)
  const [maxLength, setMaxLength] = useState(undefined)
  const refInput = React.useRef(null)

  let allTextsArr = allTextsObj[1] // inside texts
  const fontSizeRef = React.useRef(element?.fontSize)
  let pi = Math.PI

  useEffect(() => {
    if (activeEditMenu === 'text' && selectedTextInside === itemKey) {
      setTimeout(() => {
        refInput.current.focus()
      }, 100) // beacuse textInput initially was null it takes time to render and update ref
    }
  }, [activeEditMenu])

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .enabled(!element.isFixed)
    .onUpdate((e) => {
      let savedPos = start[itemKey] ? start[itemKey] : { x: 0, y: 0 }

      boxPosition = {
        ...boxPosition,
        [itemKey]: {
          x: e.translationX + savedPos.x,
          y: e.translationY + savedPos.y
        }
      }
      setFakePositions(boxPosition)
    })
    .onEnd(() => {
      start = JSON.parse(JSON.stringify(boxPosition))
      // left = element.sliderIndex === 1 ? left : left + insideWidth
      updateTextPosition({
        translateX: boxPosition[itemKey]?.x,
        translateY: boxPosition[itemKey]?.y,
        itemKey: itemKey
      })
    })

  useEffect(() => {
    // if (Object.keys(boxPosition).length !== allTextsArr.length) {
    // boxPosition = {
    //   ...boxPosition,
    //   [itemKey]: {
    //     x: !element.userDefined ? left - insideWidth : left,
    //     y: top
    //   }
    // }
    start = JSON.parse(JSON.stringify(boxPosition))
    // }
  }, [])

  const rotateGesture = Gesture.Rotation()
    .enabled(!element.isFixed)
    .onUpdate((e) => {
      let savedPos1 = rotation[itemKey]
        ? rotation[itemKey]
        : { deg: 0, savedRadian: 0 }

      boxRotations = {
        ...boxRotations,
        [itemKey]: {
          deg: (e.rotation + savedPos1.savedRadian) * (180 / pi),
          savedRadian: e.rotation + savedPos1.savedRadian
        }
      }
      setFakePositions(boxRotations)
    })
    .onEnd(() => {
      rotation = JSON.parse(JSON.stringify(boxRotations))
      editTextInside({
        editType: 'angle',
        value: boxRotations[itemKey].deg,
        itemKey: itemKey,
        custom: true
      })
    })

  const composed = Gesture.Simultaneous(panGesture, rotateGesture)

  const deleteBoxPosition = () => {
    delete boxPosition[itemKey]
  }

  const getFontSize = (fontSize) => {
    if (element.isMultiline) {
      return fontSize
    }
    if (allTextsArr?.length) {
      // font size = (container width / text length) * desired font size ratio
      const size =
        fontSize > ((width - vw(40)) / allTextsArr[itemKey]?.length) * 2
          ? ((width - vw(40)) / allTextsArr[itemKey]?.length) * 2
          : fontSize
      fontSizeRef.current = size
      if (size <= 8 && !maxLimitTextToolbar) {
        setMaxLength(allTextsArr[itemKey].length)
        setMaxLimitTextToolbar(true)
        setTimeout(() => {
          setMaxLimitTextToolbar(false)
        }, 10000)
      }
      return size
    }
  }

  const handleBlur = () => {
    // update fontsize to customFabObj
    if (!element.isMultiline) {
      editTextInside({
        editType: 'fontSize',
        value: fontSizeRef.current,
        itemKey: itemKey,
        custom: true
      })
    }
  }

  useEffect(() => {
    fontSizeRef.current = element.fontSize
  }, [element.fontSize])

  useEffect(() => {
    if (isClickedOnText && selectedTextInside === itemKey) {
      setTimeout(() => {
        refInput.current.focus()
      }, 100) // beacuse textInput initially was null it takes time to render and update ref
    }
  }, [isClickedOnText])

  useEffect(() => {
    if (element.isMultiline && !isSelected) {
      // for non multiline height frequently changes
      setHeightWidthTextBox({
        height: boxHeight / renderedImageData?.multiplierHeight,
        width: boxWidth / renderedImageData?.multiplierWidth,
        itemKey: selectedTextInside
      })
    }
  }, [textHeight])

  useEffect(() => {
    if (
      (height + boxPosition[itemKey]?.y > insideHeight + vh(15) ||
        width + boxPosition[itemKey]?.x > insideWidth + vw(15)) &&
      !showBoxExceedToolbar &&
      !isSelected
    ) {
      setShowBoxExceedToolbar(true)
      setTimeout(() => {
        setShowBoxExceedToolbar(false)
      }, 10000)
    }
  }, [height, top, left, width])

  return (
    <>
      <GestureDetector gesture={composed}>
        <View
          style={[
            {
              height: height || 10,
              width: width || 10,
              // borderWidth: 2,
              left: left,
              top: top,
              borderRadius: 1,
              alignSelf: 'center',
              transform: [
                {
                  rotate:
                    `${boxRotations[itemKey]?.deg}deg` || `${element?.angle}deg`
                },
                {
                  translateX: boxPosition[itemKey]?.x || 0
                },
                {
                  translateY: boxPosition[itemKey]?.y || 0
                }
              ]
            }
          ]}>
          <DragResizeBlock
            setHeightWidthTextBox={setHeightWidthTextBox}
            selectedTextInside={selectedTextInside}
            isDisabled={selectedTextInside !== itemKey}
            removeConnectors={element?.isFixed && !element?.isMultiline}
            renderedImageData={renderedImageData}
            isSelected={isSelected}
            setisSelected={setisSelected}
            boxHeight={boxHeight}
            {...{
              setBoxHeight,
              boxWidth,
              setBoxWidth,
              setTextHeight,
              textHeight
            }}>
            <View
              style={{
                bottom: top > insideHeight / 2 ? vw(190) : vw(-5),
                width: insideWidth,
                left: vw(-37)
              }}>
              {maxLimitTextToolbar && selectedTextInside === itemKey && (
                <ToolTip
                  message={
                    'The font is going to be too small to read. Try something shorter.'
                  }
                  type="tooSmallToRead"
                  from={top > insideHeight / 2 ? 'bottom' : 'top'}
                  setMaxLimitTextToolbar={setMaxLimitTextToolbar}
                />
              )}
            </View>
            <View>
              {!editingMode && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}>
                  {!element.isFixed && !isOpen && (
                    <TouchableOpacity
                      onPress={() => {
                        deleteInsideText(itemKey)
                        // deleteBoxPosition()
                      }}>
                      <View
                        style={{
                          zIndex: 99999,
                          bottom: vw(42)
                        }}>
                        <CircleIcon
                          name={'hm_Delete-thin'}
                          circleColor={colors.white}
                          circleSize={vw(30)}
                          iconSize={vw(12)}
                          iconColor={colors.hmPurple}
                          shadow={true}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                  {selectedTextInside === null && !isOpen && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTextInside(itemKey)
                        setActiveEditMenu('text')
                        setTimeout(() => {
                          refInput.current.focus()
                        }, 100) // beacuse textInput initially was null it takes time to render and update ref
                      }}>
                      <View
                        style={{
                          zIndex: 99999,
                          bottom: vw(42)
                        }}>
                        <CircleIcon
                          name={'hm_EditText-thin'}
                          circleColor={colors.white}
                          circleSize={vw(30)}
                          iconSize={vw(12)}
                          iconColor={colors.hmPurple}
                          shadow={true}
                          circleStyle={{ marginRight: 10 }}
                        />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <TextInput
                style={{
                  fontFamily: fontFamilies.find(
                    (font) => font.id === element.fontId
                  )?.postScriptKey,
                  textAlign: element.textAlign,
                  fontSize: fontSizeRef.current,
                  color: element.textColor,
                  height: textHeight
                  // zIndex: 99999999999999999
                }}
                ref={refInput}
                onBlur={handleBlur}
                returnKeyType={
                  element?.isFixed && !element?.isMultiline ? 'done' : 'default'
                }
                editable={
                  selectedTextInside === itemKey && activeEditMenu === 'text'
                }
                scrollEnabled={false}
                multiline={!element?.isFixed && element?.isMultiline}
                value={allTextsArr[itemKey]}
                maxLength={maxLength}
                onChangeText={(text) => {
                  updateTextArr(itemKey, text)
                  getFontSize(element?.fontSize)
                }}
                onContentSizeChange={(event) => {
                  if (!isSelected) {
                    setTextHeight(event.nativeEvent.contentSize.height + vh(20))
                    setBoxHeight(event.nativeEvent.contentSize.height + vh(30))
                  }
                }}
              />
            </View>
          </DragResizeBlock>
        </View>
      </GestureDetector>
    </>
  )
}

export default TextZoneInside
