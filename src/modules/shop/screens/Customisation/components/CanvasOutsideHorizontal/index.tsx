import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Image, ImageBackground, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import EditmodePhotozoneOutside from '../EditmodePhotozoneOutside'
import GreyPhotoZone from '../GreyPhotoZone'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import TextZone from '../TextZone'
import ToolTip from '@ecom/components/ToolTip'
import actionNames from '@ecom/utils/actionNames'
import { useState } from 'react'

let savedPos = [{ x: 0, y: 0 }]

export default function CanvasOutsideHorizontal({
  selectedImage,
  imageData,
  item,
  editingMode,
  handleImageEditClick,
  activeEditorOption,
  renderedImageData,
  scale,
  activeElem,
  setactiveElem,
  zoomGesture,
  changeactiveElem,
  rotate,
  rotateGesture,
  tapGesture,
  deleteItem,
  setSelectedImage,
  selectedTextInside,
  setSelectedTextInside,
  activeEditMenu,
  editTextInside,
  setActiveEditMenu,
  setCurrentSelectedImageIndex,
  allTextsArr,
  updateTextArr,
  maxLimitTextToolbar,
  setMaxLimitTextToolbar,
  insideHeight,
  insideWidth,
  isOpen,
  discardingEditing,
  setDegree,
  setzoomVal
}: any) {
  const [position, setposition] = useState([{ x: 0, y: 0 }])
  const [backupText, setBackupText] = useState(allTextsArr[0])
  const dispatch = useDispatch()
  const { customFabricObj } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )

  const photoZonesInCanvas =
    customFabricObj?.variables?.template_data?.faces[0]?.photoZones

  const textZonesInCanvas =
    customFabricObj?.variables?.template_data?.faces[0].texts

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .averageTouches(true)
    .onUpdate((e) => {
      let savedPos1 = savedPos[activeElem]
        ? savedPos[activeElem]
        : { x: 0, y: 0 }
      setposition({
        ...position,
        [activeElem]: {
          x: e.translationX + savedPos1.x,
          y: e.translationY + savedPos1.y
        }
      })
    })
    .onEnd(() => {
      savedPos = JSON.parse(JSON.stringify(position))
      dispatch({
        type: actionNames.UPDATE_PAN,
        payload: {
          pos: position,
          activeIndex: activeElem,
          sliderIndex: 0,
          multiplierX: renderedImageData?.multiplierWidth,
          multiplierY: renderedImageData?.multiplierHeight
        }
      })
    })

  return (
    <>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1,
          flex: 1,
          // height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}>
        <ImageBackground
          resizeMode="contain"
          style={{
            // aspectRatio: imageData?.aspectRatio || 1,
            // width: '100%',
            // height: '100%',
            // flex: 1,
            overflow: 'hidden',
            position: 'relative',
            zIndex: 11
          }}
          source={{
            uri: item?.backgroundUrl
          }}>
          <Image
            style={{
              aspectRatio: imageData?.aspectRatio,
              resizeMode: 'contain',
              // flex: 1,
              width: '100%',

              zIndex: 11
            }}
            source={{
              uri: item?.frameUrl
            }}
          />
          {photoZonesInCanvas &&
            photoZonesInCanvas?.map((photoItem: any, i: any) => {
              return (
                <>
                  {!editingMode && (
                    <GreyPhotoZone
                      photoZone={photoItem}
                      renderedImageData={renderedImageData}
                      selectedImage={selectedImage}
                      handleImageEditClick={handleImageEditClick}
                      changeactiveElem={changeactiveElem}
                      i={i}
                      setactiveElem={setactiveElem}
                      deleteItem={deleteItem}
                      setSelectedImage={setSelectedImage}
                      selectedTextInside={selectedTextInside}
                      setCurrentSelectedImageIndex={
                        setCurrentSelectedImageIndex
                      }
                      isOpen={isOpen}
                    />
                  )}
                  {editingMode && (
                    <EditmodePhotozoneOutside
                      zoomGesture={zoomGesture}
                      rotateGesture={rotateGesture}
                      dragGesture={dragGesture}
                      activeEditorOption={activeEditorOption}
                      i={i}
                      scale={scale}
                      position={position}
                      rotate={rotate}
                      photoItem={photoItem}
                      renderedImageData={renderedImageData}
                      tapGesture={tapGesture}
                      activeElem={activeElem}
                      setDegree={setDegree}
                      setzoomVal={setzoomVal}
                    />
                  )}
                </>
              )
            })}
          {textZonesInCanvas &&
            textZonesInCanvas.map((textItem, i) => {
              return (
                // <View
                //   style={{ zIndex: 99999999, position: 'absolute' }}
                //   key={i}>
                <TextZone
                  textZone={textItem}
                  itemKey={i}
                  renderedImageData={renderedImageData}
                  selectedTextInside={selectedTextInside}
                  setSelectedTextInside={setSelectedTextInside}
                  editTextInside={editTextInside}
                  activeEditMenu={activeEditMenu}
                  setActiveEditMenu={setActiveEditMenu}
                  editingMode={editingMode}
                  allTextsArr={allTextsArr}
                  updateTextArr={updateTextArr}
                  maxLimitTextToolbar={maxLimitTextToolbar}
                  setMaxLimitTextToolbar={setMaxLimitTextToolbar}
                  insideHeight={insideHeight}
                  insideWidth={insideWidth}
                  isOpen={isOpen}
                  discardingEditing={discardingEditing}
                  backupText={backupText}
                  setBackupText={setBackupText}
                />
                // </View>
              )
            })}
        </ImageBackground>
      </View>
    </>
  )
}
