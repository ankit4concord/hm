import { Image, ImageBackground, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import localImages from '@ecom/utils/localImages'
import { useDispatch } from 'react-redux'

const GreyPhotoZone = (props: any) => {
  const {
    photoZone,
    renderedImageData,
    handleImageEditClick,
    deleteItem,
    changeactiveElem,
    i,
    setSelectedImage,
    selectedTextInside,
    setCurrentSelectedImageIndex,
    isOpen
  } = props

  let width = (photoZone?.width + 17.7165) * renderedImageData?.multiplierWidth
  let height =
    (photoZone?.height + 17.7165) * renderedImageData?.multiplierHeight
  let top = (photoZone?.top + 17.7165) * renderedImageData?.multiplierHeight
  let left = (photoZone?.left + 17.7165) * renderedImageData?.multiplierWidth
  const dispatch = useDispatch()
  let scaleX = 1
  let scaleY = 1
  let imageWidth = photoZone?.image?.width * renderedImageData?.multiplierWidth
  let imageHeight =
    photoZone?.image?.height * renderedImageData?.multiplierHeight
  let photoZoneHeight = photoZone?.height * renderedImageData?.multiplierHeight
  let photoZoneWidth = photoZone?.width * renderedImageData?.multiplierWidth
  let leftOfImage = 0
  let topOfImage = 0
  if (imageWidth * scaleX > imageHeight * scaleY) {
    const scale = photoZoneHeight / (imageHeight * scaleY)
    scaleX = scaleY = scaleX * scale
  }
  if (imageWidth * scaleX < imageHeight * scaleY) {
    const scale = photoZoneWidth / (imageWidth * scaleX)
    scaleX = scaleY = scaleX * scale
  }
  if (imageWidth * scaleX < photoZoneWidth) {
    const scale = photoZoneWidth / (imageWidth * scaleX)
    scaleX = scaleY = scaleX * scale
  }
  if (imageHeight * scaleY < photoZoneHeight) {
    const scale = photoZoneHeight / (imageHeight * scaleY)
    scaleX = scaleY = scaleX * scale
  }
  if (imageWidth * scaleX > photoZoneWidth) {
    leftOfImage = leftOfImage - (imageWidth * scaleX - photoZoneWidth) / 2
    topOfImage = topOfImage - (imageHeight * scaleY - photoZoneHeight) / 2
  } else {
    topOfImage = topOfImage - (imageHeight * scaleY - photoZoneHeight) / 2
    leftOfImage = leftOfImage - (imageWidth * scaleX - photoZoneWidth) / 2
  }
  useEffect(() => {
    dispatch({
      type: actionNames.UPDATE_IMAGE_SCALE,
      payload: {
        faceId: 0,
        photozoneId: i,
        multiplierWidth: vw(renderedImageData?.multiplierWidth),
        multiplierHeight: vh(renderedImageData?.multiplierHeight),
        // scale: height / width / 2,
        sliderIndex: 1
      }
    })
  }, [photoZone?.image?.uri])

  return (
    <>
      <View
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
              rotate: `${photoZone?.angle}deg`
            }
          ],
          backgroundColor: '#838684',
          overflow: 'hidden'
        }}
      />
      <View
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
              rotate: `${photoZone?.angle}deg`
            }
          ],
          backgroundColor: 'transparent',
          overflow: 'hidden',
          zIndex: 2 + i,
          flex: 1
        }}>
        {photoZone?.image?.localUrl && !photoZone.deleted ? (
          <Image
            // resizeMode="cover"
            source={{
              uri: photoZone?.image?.localUrl
            }}
            style={{
              alignSelf: 'center',
              height: '100%',
              width: '100%',
              // height: height || 0,
              // aspectRatio: width
              //   ? width > height
              //     ? width / height
              //     : height / width
              //   : 1,

              transform: [
                {
                  rotate: `${photoZone?.image?.angle}rad`
                },
                {
                  translateX: photoZone?.image?.left || 0
                },
                {
                  translateY: photoZone?.image?.top || 0
                },
                {
                  scale: photoZone?.image?.scaleX ? photoZone?.image?.scaleX : 1
                }
              ]
            }}
          />
        ) : (
          <></>
        )}
      </View>

      {photoZone?.image?.localUrl ? (
        <View
          style={{
            position: 'absolute',
            width: width || 10,
            height: height || 10,
            justifyContent: 'flex-start',
            alignItems: 'flex-end',
            top: top || 10,
            left: left || 10,
            transform: [
              {
                rotate: `${photoZone?.angle}deg`
              }
            ],
            backgroundColor: 'transparent',
            overflow: 'hidden',

            zIndex: 999999 + i
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            {selectedTextInside === null && (
              <>
                <TouchableOpacity
                  style={{
                    zIndex: 999999 + i,
                    top: 20,
                    right: 30
                  }}
                  onPress={() => {
                    deleteItem(i)
                  }}>
                  <CircleIcon
                    key={i}
                    name={'hm_Delete-thick'}
                    circleColor={colors.white}
                    circleSize={vw(25)}
                    iconSize={vw(12)}
                    iconColor={colors.hmPurple}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    zIndex: 999999 + i,
                    top: 20,
                    right: 20
                  }}
                  onPress={() => {
                    changeactiveElem(i)
                    setCurrentSelectedImageIndex(i)
                    handleImageEditClick(i)
                    setSelectedImage({
                      ...photoZone?.image
                    })
                  }}>
                  <CircleIcon
                    key={i}
                    name={'hm_Photo-thick'}
                    circleColor={colors.white}
                    circleSize={vw(25)}
                    iconSize={vw(13)}
                    iconColor={colors.hmPurple}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      ) : (
        <View
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
                rotate: `${photoZone?.angle}deg`
              }
            ],
            backgroundColor: 'transparent',
            overflow: 'hidden',
            zIndex: 999999 + i
          }}>
          {selectedTextInside === null && (
            <TouchableOpacity
              style={{
                justifyContent: 'flex-start',
                alignSelf: 'flex-end',
                flex: 1,
                top: 20,
                right: 20
                // position: 'absolute'
              }}
              onPress={() => {
                handleImageEditClick(i)
                changeactiveElem(i)
                setCurrentSelectedImageIndex(i)
                setSelectedImage([])
              }}>
              <CircleIcon
                name={'hm_Photo-thick'}
                circleColor={colors.hmPurple}
                circleSize={vw(40)}
                iconSize={vw(19)}
                iconColor={colors.white}
                shadow={true}
              />
              {/* <Image
                source={localImages.editPhoto}
                style={{
                  width: vw(50),
                  height: vw(50),
                  resizeMode: 'contain'
                }}
              /> */}
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  )
}

export default GreyPhotoZone
