import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import ToolTip from '@ecom/components/ToolTip'
import colors from '@ecom/utils/colors'
import fontFamilies from '@ecom/utils/fontFamilies'
import localImages from '@ecom/utils/localImages'

const TextZone = (props: any) => {
  const {
    textZone,
    renderedImageData,
    selectedTextInside,
    setSelectedTextInside,
    itemKey,
    activeEditMenu,
    setActiveEditMenu,
    editingMode,
    allTextsArr: allTextsObj,
    updateTextArr,
    setMaxLimitTextToolbar,
    maxLimitTextToolbar,
    insideHeight,
    insideWidth,
    isOpen,
    discardingEditing,
    backupText,
    setBackupText
  } = props
  let width = (textZone?.width + 17.7165) * renderedImageData?.multiplierWidth
  let height =
    (textZone?.height + 17.7165) * renderedImageData?.multiplierHeight
  let top = (textZone?.top + 17.7165) * renderedImageData?.multiplierHeight
  let left = (textZone?.left + 17.7165) * renderedImageData?.multiplierWidth
  const refInput = React.useRef(null)
  const fontSizeRef = React.useRef(textZone?.fontSize)
  const [maxLength, setMaxLength] = useState(undefined)
  const [boxIncresing, setBoxIncreasing] = useState(false)

  let allTextsArr = allTextsObj[0] // front texts

  const getFontSize = (fontSize: number) => {
    if (textZone.isMultiline && !textZone.isFixed) {
      return fontSize
    } else if (
      textZone.isMultiline &&
      textZone.isFixed &&
      allTextsArr?.length &&
      fontSizeRef.current < textZone?.fontSize &&
      allTextsArr[itemKey]?.length < backupText[itemKey]?.length
    ) {
      fontSizeRef.current = fontSizeRef.current + 0.1
    } else if (!textZone.isMultiline && allTextsArr?.length) {
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
  useEffect(() => {
    if (discardingEditing) {
      fontSizeRef.current = textZone?.fontSize
    }
  }, [discardingEditing])

  const handleLayout = (sizes) => {
    if (textZone.isMultiline && textZone.isFixed && height) {
      if (fontSizeRef.current <= 8) {
        setMaxLimitTextToolbar(true)
        setMaxLength(allTextsArr[itemKey]?.length)
        setTimeout(() => {
          setMaxLimitTextToolbar(false)
        }, 10000)
        return
      }
      if (Math.floor(sizes.height) >= Math.floor(height - 3)) {
        fontSizeRef.current = fontSizeRef.current - 1
        setBoxIncreasing(!boxIncresing)
      }
    }
  }
  return (
    <>
      <View
        style={[
          selectedTextInside === itemKey && styles.activeEle,
          {
            position: 'absolute',
            justifyContent: 'center',
            width: vw(width) || 10,
            height: vh(height) || 10,
            top: top || 10,
            left: left || 10,
            zIndex: 999999999,
            transform: [
              {
                rotate: `${textZone?.angle}deg`
              }
            ]
          }
        ]}>
        <View
          style={{
            bottom: top > insideHeight / 2 ? vw(190) : vw(-60),
            left: -left - 1 || 0,
            width: insideWidth,
            zIndex: 9999999
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
          <TextInput
            style={{
              fontFamily: fontFamilies.find(
                (font) => font.id === textZone.fontId
              )?.postScriptKey,

              color: textZone.textColor,
              textAlign: textZone.textAlign,
              fontSize: vw(fontSizeRef.current),
              flexWrap: 'wrap',
              height: height || 0
            }}
            editable={
              selectedTextInside === itemKey && activeEditMenu === 'text'
            }
            scrollEnabled={false}
            returnKeyType={
              textZone?.isFixed && !textZone?.isMultiline && 'done'
            }
            value={allTextsArr[itemKey]}
            multiline={textZone?.isMultiline}
            ref={refInput}
            onChangeText={(text) => {
              setBackupText(allTextsArr)
              updateTextArr(itemKey, text)
              getFontSize(textZone.fontSize)
            }}
            onContentSizeChange={(event) => {
              handleLayout(event.nativeEvent.contentSize)
            }}
            maxLength={maxLength}
          />
        </View>

        {selectedTextInside !== itemKey && !editingMode && !isOpen && (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              flex: 1,
              position: 'absolute'
            }}
            onPress={() => {
              setSelectedTextInside(itemKey)
              setActiveEditMenu('text')
              setTimeout(() => {
                refInput.current.focus()
              }, 100) // beacuse textInput initially was null it takes time to render and update ref
            }}>
            <CircleIcon
              name={'hm_EditText-thin'}
              circleColor={colors.hmPurple}
              circleSize={vw(25)}
              iconSize={vw(8)}
              iconColor={colors.white}
              shadow={true}
            />
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  activeEle: {
    borderStyle: 'dashed',
    borderWidth: 1
  }
})

export default TextZone
