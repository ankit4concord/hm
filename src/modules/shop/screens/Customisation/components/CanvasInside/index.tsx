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
import RenderInside from './RenderInside'
import RenderPhotoZoneInside from '../RenderPhotoZoneInside'
import { RootReducerModal } from '@ecom/modals'
import RotateSlider from '../RotateSlider'
import TextZone from '../TextZoneInside'
import TextZoneInside from '../TextZoneInside'
import ToolTip from '@ecom/components/ToolTip'
import ZoomSlider from '../ZoomSlider'
import actionNames from '@ecom/utils/actionNames'
import localImages from '@ecom/utils/localImages'

export default function CanvasInside({
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
  let photoZonesInCanvas =
    customFabricObj?.variables?.template_data?.faces[1]?.photoZones
  return (
    <>
      <ImageBackground
        resizeMode="contain"
        style={{
          width: '200%',
          aspectRatio: imageData?.aspectRatio,
          flex: 1,
          zIndex: 22222
        }}
        source={{
          uri: item?.backgroundUrl
        }}>
        {sliderIndex === 1 && (
          <View
            style={{
              borderRightWidth: 1,
              borderRightColor: 'rgba(0,0,0,0.4)',
              height: '100%',
              zIndex: 11,
              position: 'relative'
            }}>
            <LinearGradient
              style={{
                width: vw(20),
                right: -22.7,
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
                // width: vw(20),
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
        )}

        {allTexts &&
          currentSlide > 0 &&
          allTexts.map((d: any, i: number) => (
            <View
              style={{
                zIndex: 9999999 + i,
                position: 'absolute',
                // left: d?.left,
                // top: d?.top,
                // alignSelf: 'center',
                height: 0,
                // borderWidth: 1,
                display: (d.sliderIndex === 2 || d.isDeleted) && 'none'
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
                setShowBoxExceedToolbar={setShowBoxExceedToolbar}
                showBoxExceedToolbar={showBoxExceedToolbar}
                insideWidth={insideWidth}
                isOpen={isOpen}
              />
            </View>
            
          ))}
            
        {photoZonesInCanvas &&
          photoZonesInCanvas.map((photoItem: any, i: any) => {
            return (
              <>
                {photoItem?.image?.sliderIndex == 1 ||
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
                      setCurrentSelectedImageIndex={
                        setCurrentSelectedImageIndex
                      }
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
                        setSelectedImage,
                        insideHeight
                      }}
                    />
                  </>
                ) : null}
              </>
            )
          })}
      </ImageBackground>
    </>
  )
}
