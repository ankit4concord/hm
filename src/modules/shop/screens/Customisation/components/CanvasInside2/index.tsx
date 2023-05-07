import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import DropShadow from 'react-native-drop-shadow'
import EditmodePhotozoneInside from '../EditmodePhotozoneInside'
import GreyPhotoZone from '../GreyPhotoZone'
import LinearGradient from 'react-native-linear-gradient'
import LoadFrameURL from '../LoadFrameURL'
import React from 'react'
import RenderInside from '../CanvasInside/RenderInside'
import RenderPhotoZoneInside from '../RenderPhotoZoneInside'
import { RootReducerModal } from '@ecom/modals'
import RotateSlider from '../RotateSlider'
import TextZone from '../TextZoneInside'
import TextZoneInside from '../TextZoneInside'
import ToolTip from '@ecom/components/ToolTip'
import ZoomSlider from '../ZoomSlider'
import actionNames from '@ecom/utils/actionNames'
import localImages from '@ecom/utils/localImages'

let savedPos = [{ x: 0, y: 0 }]
let panCoordinates = [{ x: 0, y: 0 }]
let start = [{ x: 0, y: 0 }]

export default function CanvasInside2({
  GallerySheetRef,
  selectedImage,
  imageData,
  item,
  // offset,
  sliderIndex,
  insideWidth,
  editingMode,
  handleImageEditClick,
  activeEditorOption,
  // sendZoomObject,
  scale,
  activeElem,
  setactiveElem,
  zoomGesture,
  rotate,
  rotateGesture,
  renderedImageData,
  changeactiveElem,
  tapGesture,
  deleteItem,
  setSelectedImage,
  deleteInsideText,
  selectedTextInside,
  setSelectedTextInside,
  editTextInside,
  activeEditMenu,
  allTexts,
  customFabricObj,
  setActiveEditMenu,
  currentSlide,
  insideHeight,
  updateTextPosition,
  setCurrentSelectedImageIndex,
  pos,
  setPos,
  savedState,
  setSavedState,
  setHeightWidthTextBox,
  allTextsArr,
  updateTextArr,
  maxLimitTextToolbar,
  setMaxLimitTextToolbar,
  isClickedOnText,
  setShowBoxExceedToolbar,
  showBoxExceedToolbar,
  isOpen
}: any) {
  // const [scale, setScale] = useState({})
  const [position, setPosition] = useState([{ x: 0, y: 0 }])
  const dispatch = useDispatch()
  // const [rotate, setRotation] = useState({})
  // const [activeElem, setactiveElem] = useState(0)
  // const { customFabricObj } = useSelector(
  //   (state: RootReducerModal) => state.customisationReducer
  // )
  // const changeactiveElem = (i: any) => {
  //   setactiveElem(i)
  // }
  // let currentSlide = sliderIndex
  // if (sliderIndex > 1) currentSlide = 1

  // let allTexts =
  //   customFabricObj?.variables?.template_data?.faces[currentSlide].texts
  let photoZonesInCanvas =
    customFabricObj?.variables?.template_data?.faces[1]?.photoZones
  // let newWidth = insideWidth - offset
  // photoZonesInCanvas = photoZonesInCanvas?.filter((item) => {
  //   if (sliderIndex == 1) {
  //     return item.left < newWidth
  //   }
  //   if (sliderIndex == 2) {
  //     return item.left > newWidth
  //   }
  //   return true
  // })

  // const dragGesture = Gesture.Pan()
  // .averageTouches(true)
  // .onStart((e) => {
  //   console.log("e", e)
  // })
  // .onUpdate((e) => {
  //   console.log(activeElem)
  //   let savedPos = start[activeElem] ? start[activeElem] : { x: 0, y: 0 }
  //   panCoordinates = {
  //     ...panCoordinates,
  //     [activeElem]: {
  //       x: e.translationX + savedPos.x,
  //       y: e.translationY + savedPos.y
  //     }
  //   }

  //   setPosition(panCoordinates)
  // })
  // .onEnd(() => {
  //   start = JSON.parse(JSON.stringify(panCoordinates))
  //   dispatch({
  //     type: actionNames.UPDATE_PAN,
  //     payload: {
  //       pos: panCoordinates,
  //       activeIndex: activeElem,
  //       sliderIndex: sliderIndex
  //     }
  //   })
  // })

  return (
    <>
      <View
        // resizeMode="contain"
        style={{
          width: '200%',
          // transform: [{ translateX: -insideWidth }],
          aspectRatio: imageData?.aspectRatio,
          flex: 1,
          zIndex: 1,
          position: 'relative'
          // justifyContent: 'center'
          // justifyContent: 'center'
          // overflow: 'hidden'
        }}>
        <Image
          resizeMode="contain"
          source={{
            uri: item?.backgroundUrl
          }}
          style={{
            transform: [{ translateX: -insideWidth }],
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: '200%',
            // height:500,
            aspectRatio: imageData?.aspectRatio
          }}></Image>
        {/* {sliderIndex === 2 && (
          <View
            style={{
              // borderRightWidth: 1,
              borderRightColor: 'rgba(0,0,0,0.4)',
              height: '100%',
              zIndex: 11,
              position: 'relative'
            }}>
            <LinearGradient
              style={{
                width: vw(0),
                right: -12.7,
                height: '100%',
                zIndex: 1,
                position: 'absolute'
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['rgba(233, 233, 233, 1)', 'rgba(255, 255, 255, 1)']}
              pointerEvents={'none'}
            />
            <LinearGradient
              style={{
                width: vw(0),
                height: '100%',
                zIndex: 1,
                right: 0,
                position: 'absolute'
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['rgba(255, 255, 255, 1)', 'rgba(233, 233, 233, 1)']}
              pointerEvents={'none'}
            />
          </View>
        )} */}

        {allTexts &&
          currentSlide > 0 &&
          allTexts.map((d: any, i: number) => (
            <View
              style={{
                zIndex: 9999999 + i,
                position: 'absolute',
                // alignSelf: 'center',
                height: 0,
                display: (d.sliderIndex === 1 || d.isDeleted) && 'none'
              }}
              key={i}>
              <TextZoneInside
                element={d}
                itemKey={i}
                selectedTextInside={selectedTextInside}
                setSelectedTextInside={setSelectedTextInside}
                renderedImageData={renderedImageData}
                deleteInsideText={deleteInsideText}
                editTextInside={editTextInside}
                activeEditMenu={activeEditMenu}
                setActiveEditMenu={setActiveEditMenu}
                editingMode={editingMode}
                updateTextPosition={updateTextPosition}
                setHeightWidthTextBox={setHeightWidthTextBox}
                allTextsArr={allTextsArr}
                updateTextArr={updateTextArr}
                maxLimitTextToolbar={maxLimitTextToolbar}
                setMaxLimitTextToolbar={setMaxLimitTextToolbar}
                isClickedOnText={isClickedOnText}
                insideHeight={insideHeight}
                insideWidth={insideWidth}
                setShowBoxExceedToolbar={setShowBoxExceedToolbar}
                showBoxExceedToolbar={showBoxExceedToolbar}
                isOpen={isOpen}
              />
            </View>
          ))}
      </View>
      {photoZonesInCanvas &&
        photoZonesInCanvas.map((photoItem: any, i: any) => {
          return (
            <>
              {photoItem?.image?.sliderIndex == 2 ||
              (photoItem?.left < insideWidth && !photoItem?.userDefined) ? (
                <>
                  <RenderInside
                    editingMode={editingMode}
                    photoItem={photoItem}
                    renderedImageData={renderedImageData}
                    activeEditorOption={activeEditorOption}
                    zoomGesture={zoomGesture}
                    tapGesture={tapGesture}
                    rotateGesture={rotateGesture}
                    i={i}
                    selectedTextInside={selectedTextInside}
                    deleteItem={deleteItem}
                    changeactiveElem={changeactiveElem}
                    handleImageEditClick={handleImageEditClick}
                    setCurrentSelectedImageIndex={setCurrentSelectedImageIndex}
                    scale={scale}
                    {...{
                      sliderIndex,
                      pos,
                      setPos,
                      savedState,
                      setSavedState,
                      rotate,
                      setactiveElem,
                      activeElem,
                      insideWidth,
                      insideHeight,
                      setSelectedImage
                    }}
                  />
                </>
              ) : null}
            </>
          )
        })}
    </>
  )
}
