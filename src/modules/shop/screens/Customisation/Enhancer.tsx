import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import constant, { showToastMessage } from '@ecom/utils/constant'
import {
  deleteAssetsAndPhotoTray,
  editingModeChange,
  postImage,
  savePersonalization
} from '../../action'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ACPCore } from '@adobe/react-native-acpcore'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { Gesture } from 'react-native-gesture-handler'
import { RootReducerModal } from '@ecom/modals'
import _ from 'lodash'
import actionNames from '@ecom/utils/actionNames'
import { generateCanvasJSONUtil } from '../../canvasConversion'
import { navigate } from '@ecom/utils/navigationService'
import { scaleLinear } from 'd3-scale'
import screenNames from '@ecom/utils/screenNames'
import { useSharedValue } from 'react-native-reanimated'
import { vw } from '@ecom/utils/dimension'

let savedScale = 1
let savedRotation = 0
let editDone = true
// let zoomObj = {}
const useEnhancer = (props: any) => {
  const [currentSelectedImageIndex, setCurrentSelectedImageIndex] = useState(0)
  const dispatch = useDispatch()
  const [sheetErr, setSheetErr] = useState(false)
  const [photosGallery, setPhotosGallery] = useState<any>([])
  const [selectedImage, setSelectedImage] = useState([])
  const [insideWidth, setInsideWidth] = useState(0)
  const [insideHeight, setInsideHeight] = useState(0)
  const [sliderIndex, setSliderIndex] = useState(0)
  const [albumName, setAlbumName] = useState('Recent Photos')
  const [isOpen, setIsOpen] = useState(false)
  const [albumsData, setAlbumsData] = useState([])
  const [totalPictures, setTotalPictures] = useState(0)
  const [zoomVal, setzoomVal] = useState(1)
  const [degree, setDegree] = useState(0)
  const [selectedTextInside, setSelectedTextInside] = useState(null)
  let editOptions = ['text', 'font', 'size', 'color', 'align']
  const [activeEditMenu, setActiveEditMenu] = useState('')
  const {
    customisationTemplateData,
    customFabricObjInitial,
    editingMode,
    customFabricObj,
    personalizationStart
  } = useSelector((state: RootReducerModal) => state.customisationReducer)
  const { productLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const GallerySheetRef = useRef(null)
  const [activeElem, setactiveElem] = useState(0)
  const rotateNew = useSharedValue({})
  const zoomObj = useSharedValue({})
  // const [rotateNew, setRotationNew] = useState({})
  const PI = Math.PI
  const rotateScale = scaleLinear().domain([-PI, PI]).range([-180, 180])
  let draggingRef = useRef(false)
  const [updateRecent, setUpdateRecent] = useState(false)
  const [photoAccess, setPhotoAccess] = useState('')
  const [activeHeaderOption, setActiveHeaderOption] = useState('EDITOR')
  const [backupTexts, setBackupTexts] = useState([])
  const [pos, setPos] = useState([{ x: 0, y: 0 }])
  const [savedState, setSavedState] = useState([{ x: 0, y: 0 }])
  const [allTextsArr, setAllTextArr] = useState({ 0: [], 1: [] }) // 0: front texts, 1: inside texts
  const [maxLimitTextToolbar, setMaxLimitTextToolbar] = useState(false)
  const [discardingEditing, setDiscardingEditing] = useState(false)
  const BSheetRef = useRef(null)
  const [renderedImageData, setRenderedImageData] = useState<any>({})
  const CustomizationDisclaimerRef = useRef(null)
  const { isConnected } = useSelector(
    (state: RootReducerModal) => state.internetStatusReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const zoomGesture = Gesture.Pinch()
    .runOnJS(true)
    .onUpdate((event) => {
      // zoomObj.value = { [activeElem]: savedScale * event.scale }
      zoomObj.value = {
        ...zoomObj,
        [activeElem]: savedScale * event.scale
      }
      // Object.assign(zoomObj, { [activeElem]: savedScale * event.scale })
      setzoomVal(event.scale > 2 ? 2 : event.scale)
    })
    .onEnd((event) => {
      savedScale = zoomVal
    })

  useEffect(() => {
    const faceId = sliderIndex === 2 ? 1 : sliderIndex
    generateCanvasJSONUtil.scaleDebounce({
      faceId: faceId + 1,
      type: 'image',
      objectName:
        customFabricObj?.variables?.template_data?.faces[faceId]?.photoZones[
          activeElem
        ]?.image?.name,
      objectIndex: currentSelectedImageIndex,
      scaleX: zoomVal,
      scaleY: zoomVal
    })
  }, [zoomVal])

  useEffect(() => {
    let scaleDegree = degree * (Math.PI / 180)
    console.log('object Rotateio', {
      faceId: sliderIndex + 1,
      type: 'image',
      objectName:
        customFabricObj?.variables?.template_data?.faces[
          sliderIndex === 2 ? 1 : sliderIndex
        ]?.photoZones[activeElem]?.image?.name,
      objectIndex: activeElem,
      angle: scaleDegree
    })
    generateCanvasJSONUtil.rotateDebounce({
      faceId: sliderIndex + 1,
      type: 'image',
      objectName:
        customFabricObj?.variables?.template_data?.faces[
          sliderIndex === 2 ? 1 : sliderIndex
        ]?.photoZones[activeElem]?.image?.name,
      objectIndex: activeElem,
      angle: scaleDegree
    })
    if (draggingRef.current) return
    // setRotationNew({
    //   ...rotateNew,
    //   [activeElem]: scaleDegree
    // })
    rotateNew.value = {
      ...rotateNew,
      [activeElem]: scaleDegree
    }
  }, [degree])

  const updateVal = (val) => {
    // val = (val / Math.PI) * 180
    val = Math.round(rotateScale(val))
    setDegree(val)
  }
  useEffect(() => {
    setActiveHeaderOption('EDITOR')
  }, [customFabricObj])

  const tapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      zoomObj.value = { ...zoomObj, [activeElem]: 1 }
      // Object.assign(zoomObj, { [activeElem]: 1 })
      setzoomVal(1)
    })

  let lastTap: number | null = null
  const tapGestureSlider = () => {
    const now = Date.now()
    const DOUBLE_PRESS_DELAY = 300
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      // Object.assign(zoomObj, { [activeElem]: 1 })
      zoomObj.value = { ...zoomObj, [activeElem]: 1 }
      setzoomVal(1)
    } else {
      lastTap = now
    }
  }

  const changeactiveElem = (i: any) => {
    setactiveElem(i)
  }
  const updatePreOffsetValue = (layout: any) => {
    const { width, height } = layout?.nativeEvent?.layout
    setInsideWidth(width)
    setInsideHeight(height)
  }

  const handleThirdIcon = () => {
    if (isConnected) {
      if (editingMode) {
        if (appConfigValues?.adobe?.isAnalyticsEnabled) {
          let imgEditStr = ''
          let imageObj = {
            'cd.editImage': '1',
            'cd.personalizedEditArea':
              sliderIndex === 0
                ? 'outside-front'
                : sliderIndex === 1
                ? 'inside-left'
                : 'inside-right',
            'cd.personalizedEditType':
              sliderIndex === 0 ? 'photo-zone-image' : 'userImage',
            'cd.personalizedEditValue': sliderIndex === 0 ? 'replace' : 'add'
          }
          if (rotateNew.value[activeElem]) {
            imageObj['cd.rotate'] = '1'
            const decVal = rotateNew.value[activeElem]
              .toString()
              ?.split('.')[1]
              ?.substr(0, 2)
            imgEditStr += `rotate= ${
              rotateNew.value[activeElem] < 0 ? '-' + decVal : decVal
            }`
          }
          if (zoomObj.value[activeElem]) {
            imageObj['cd.zoom'] = '1'
            if (imgEditStr) {
              imgEditStr += '|'
            }
            const decVal = zoomObj.value[activeElem]
              .toString()
              .split('.')[1]
              ?.substr(0, 2)
            imgEditStr += `zoom= ${
              zoomObj.value[activeElem] < 0 ? '-' + decVal : decVal
            }`
          }
          ACPCore.trackAction('Edit Image', {
            ...adobeReducerState,
            ...imageObj,
            'cd.personalizeApply': imgEditStr
          })
        }
        dispatch({
          type: actionNames.UPDATE_IMAGE_ROTATION,
          payload: {
            faceId: sliderIndex === 2 ? 1 : sliderIndex,
            photozoneId: currentSelectedImageIndex,
            angle: rotateNew.value[activeElem] ? rotateNew.value[activeElem] : 0
            // angle: rotationInAngle
          }
        })
        dispatch({
          type: actionNames.UPDATE_IMAGE_SCALE,
          payload: {
            faceId: sliderIndex === 2 ? 1 : sliderIndex,
            photozoneId: currentSelectedImageIndex,
            scaleX: zoomObj.value[activeElem],
            scaleY: zoomObj.value[activeElem],
            sliderIndex: sliderIndex
          }
        })
        dispatch(editingModeChange(false))
        // updatePointerPosition(defaultZoomLevel)
        // setActiveEditorOption('zoom')
      } else if (isOpen) {
        handleGalleryClose()
        setIsOpen(false)
      } else {
        // dispatch(editingModeChange(false))
        // setActiveHeaderOption('PREVIEW')
        // dispatch(savePersonalization())
        let customizationDone = false
        const faces = customFabricObj.variables.template_data.faces
        for (let i = 0; i < faces.length; i++) {
          if (faces[i].photoZones.length) {
            for (let j = 0; j < faces[i].photoZones.length; j++) {
              if (
                faces[i].photoZones[j]?.image &&
                faces[i].photoZones[j]?.image?.uri
              ) {
                customizationDone = true
                break
              }
            }
          }
          if (faces[i].texts.length) {
            for (let j = 0; j < faces[i].texts.length; j++) {
              if (
                !_.isEqual(
                  customFabricObjInitial?.variables?.template_data?.faces[i]
                    ?.texts[j],
                  customFabricObj?.variables?.template_data?.faces[i]?.texts[j]
                )
              ) {
                customizationDone = true
                break
              }
            }
          }
        }
        if (!customizationDone) {
          CustomizationDisclaimerRef.current.open()
        } else {
          dispatch(editingModeChange(false))
          setActiveHeaderOption('PREVIEW')
          dispatch(savePersonalization())
          CustomizationDisclaimerRef.current.close()
        }
      }
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }

  const goToPreview = () => {
    dispatch(editingModeChange(false))
    setActiveHeaderOption('PREVIEW')
    dispatch(savePersonalization())
    CustomizationDisclaimerRef.current.close()
  }

  const handleEditorClicked = () => {
    setActiveHeaderOption('EDITOR')
  }

  const rotateGesture = Gesture.Rotation()
    .runOnJS(true)
    .onUpdate((event) => {
      let rad = savedRotation + event.rotation
      if (rad > PI) rad = PI
      if (rad < -PI) rad = -PI
      draggingRef.current = true
      updateVal(savedRotation + event.rotation)
      // editDone = true
      // // setRotationNew({
      // //   ...rotateNew,
      // //   [activeElem]: rad
      // // })
      rotateNew.value = {
        ...rotateNew.value,
        [activeElem]: rad
      }

      // setRotationNew({
      //   ...rotateNew,
      //   [activeElem]: rad
      // })
    })
    .onEnd((event) => {
      draggingRef.current = false
      savedRotation = rotateNew.value[activeElem]
      updateVal(savedRotation)
    })

  // const setRefId = (index: any) => {
  //   setCurrentRef(index)
  // }

  const handleGalleryClose = () => {
    GallerySheetRef?.current?.hide()
    GallerySheetRef.current?.snapToIndex(0)
    setIsOpen(false)
  }

  const deleteItem = (item) => {
    dispatch(deleteAssetsAndPhotoTray(item))
    dispatch({
      type: actionNames.DELETE_IMAGE,
      payload: {
        faceId: sliderIndex == 0 ? 0 : 1,
        itemIndex: item,
        sliderIndex: sliderIndex
      }
    })
    if (isOpen) {
      handleGalleryClose()
      //   setSelectedImage([])
      //   setCurrentSelectedImageIndex(
      //     customFabricObj?.variables?.template_data?.faces[
      //       sliderIndex == 0 ? 0 : 1
      //     ]?.photoZones.length
      //   )
    }
  }

  const handleImageSelected = (item: any) => {
    if (isConnected) {
      resetZoomRotate()
      editDone = true
      // item?.node?.image.width

      let left = insideWidth / 2
      const updatedData = {
        ...item?.node?.image,
        type: item?.node?.type,
        localUrl: item?.node?.image.uri
      }

      setSelectedImage({
        ...item?.node?.image,
        type: item?.node?.type,
        localUrl: item?.node?.image.uri
      })

      let imageDimensions = {
        // angle: 0,
        // height: updatedData?.height,
        // left
        // top: 10,
        // width: updatedData?.width
        left: insideWidth ? (insideWidth - 200) / 2 : 0,
        // left: sliderIndex == 2  ? :  182.33334350585938 - 100,
        // top: insideHeight
        //   ? insideHeight / 2 -
        //     (200 * updatedData?.height) / updatedData?.width / 2
        //   : 0
        top: insideHeight
          ? (insideHeight - (200 * updatedData?.height) / updatedData?.width) /
            2
          : 0
      }
      dispatch(
        postImage(
          { fileName: item?.node?.image?.filename, ...item?.node?.image },
          (imageId, photoTrayId, imageUrl) => {
            if (!imageId) {
              handleGalleryClose()
              showToastMessage(
                'Unable to upload an Image. Please try other image',
                'invalid'
              )
            } else {
              setzoomVal(1)
              dispatch({
                type: actionNames.UPDATE_IMAGE,
                payload: {
                  faceId: sliderIndex == 0 ? 0 : 1,
                  insideWidth:
                    sliderIndex == 2
                      ? customFabricObj.variables.template_data.faces[1]
                          .dimensions?.width / 2
                      : 0,
                  photozoneId: currentSelectedImageIndex,
                  imageData: { ...updatedData, uri: imageUrl },
                  imageDimensions: imageDimensions,
                  imageId: imageId,
                  sourceVersionId: '',
                  photoTrayId: photoTrayId,
                  sliderIndex: sliderIndex,
                  multiplierX: renderedImageData?.multiplierWidth,
                  multiplierY: renderedImageData?.multiplierHeight
                }
              })
            }
          }
        )
      )
      setUpdateRecent(true)
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }

  const handleCameraImageSelected = (item: any) => {
    let left = 0
    editDone = true
    // if (sliderIndex == 2) {
    //   left = insideWidth + 80
    // }
    const updatedData = {
      ...item,
      translateX: left,
      localUrl: item.uri
    }
    setSelectedImage({
      ...item,
      translateX: left,
      localUrl: item.uri
    })

    let imageDimensions = {
      // angle: 0,
      // height: updatedData?.height,
      // left
      // top: 10,
      // width: updatedData?.width
      left: insideWidth
        ? insideWidth / 2 - (sliderIndex == 2 ? vw(100) : vw(90))
        : 0,
      // left: sliderIndex == 2  ? :  182.33334350585938 - 100,
      top: insideHeight
        ? insideHeight / 2 -
          (vw(200) * updatedData?.height) / updatedData?.width / 2
        : 0
    }

    // post here
    dispatch(
      postImage(
        { fileName: item?.filename, ...item },
        (imageId, photoTrayId, imageUrl) => {
          if (!imageId) {
            handleGalleryClose()
            showToastMessage(
              'Unable to upload an Image. Please try other image',
              'invalid'
            )
          } else {
            dispatch({
              type: actionNames.UPDATE_IMAGE,
              payload: {
                faceId: sliderIndex == 0 ? 0 : 1,
                photozoneId: currentSelectedImageIndex,
                insideWidth:
                  sliderIndex == 2
                    ? customFabricObj.variables.template_data.faces[1]
                        .dimensions?.width / 2
                    : 0,
                imageData: { ...updatedData, uri: imageUrl },
                imageDimensions: imageDimensions,
                imageId: imageId,
                photoTrayId: photoTrayId,
                sliderIndex: sliderIndex,
                multiplierX: renderedImageData?.multiplierWidth,
                multiplierY: renderedImageData?.multiplierHeight
              }
            })
          }
        }
      )
    )
  }

  const handleGalleryOpen = () => {
    GallerySheetRef?.current?.show()
    setIsOpen(true)
  }
  const handleAlbumChange = async (album: any, camera = false) => {
    // setAlbumName(album)
    launchGalleryBottomSheet(album, camera)
    // console.log('album name change', albumName)
    // launchGalleryBottomSheet()
  }

  // const customizationMade = () => {
  //   return editDone
  // }

  const keepEditing = () => {
    BSheetRef?.current?.close()
    // setisCustomizationMade(true)
  }

  let flag = false
  const handleBack = () => {
    if (selectedTextInside !== null) {
      flag = false // if text edit mode enabled
      discardTextEditing()
    }
    dispatch({
      type: actionNames.RESET_CUSTOMISATION_STATE,
      payload: {
        customisationTemplateData,
        customFabricObj,
        editingMode: false,
        personalizationStart
      }
    })

    BSheetRef.current.close()
    if (flag) {
      props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
        screen: screenNames.PLP,
        params: { from: 'customization', id: 'mobile-app-categories' }
      })
    }

    // Object.assign(zoomObj, {
    //   [activeElem]:
    //     customFabricObj?.variables?.template_data?.faces[
    //       sliderIndex >= 1 ? 1 : 0
    //     ].photoZones[activeElem]?.image?.scaleX
    // })
    zoomObj.value = {
      ...zoomObj,
      [activeElem]:
        customFabricObj?.variables?.template_data?.faces[
          sliderIndex >= 1 ? 1 : 0
        ].photoZones[activeElem]?.image?.scaleX
    }
    setzoomVal(
      customFabricObj?.variables?.template_data?.faces[sliderIndex >= 1 ? 1 : 0]
        .photoZones[activeElem]?.image?.scaleX
    )
    updateVal(
      customFabricObj?.variables?.template_data?.faces[sliderIndex >= 1 ? 1 : 0]
        .photoZones[activeElem]?.image?.angle
        ? customFabricObj?.variables?.template_data?.faces[
            sliderIndex >= 1 ? 1 : 0
          ].photoZones[activeElem]?.image?.angle
        : 0
    )
    // setRotationNew({
    //   ...rotateNew,
    //   [activeElem]:
    //     customFabricObj?.variables?.template_data?.faces[
    //       sliderIndex >= 1 ? 1 : 0
    //     ].photoZones[activeElem]?.image?.angle
    // })
    rotateNew.value = {
      ...rotateNew.value,
      [activeElem]:
        customFabricObj?.variables?.template_data?.faces[
          sliderIndex >= 1 ? 1 : 0
        ].photoZones[activeElem]?.image?.angle
    }
  }

  const handleBackFromCustomisation = () => {
    if (isOpen) {
      setIsOpen(false)
      handleGalleryClose()
    } else if (editingMode || selectedTextInside !== null) {
      handleBack()
    } else {
      BSheetRef?.current?.open()
      flag = true
    }
  }

  const resetZoomRotate = () => {
    // Object.assign(zoomObj, {})
    zoomObj.value = {}
    // setRotationNew({})
    rotateNew.value = {}
    setDegree(0)
    setzoomVal(1)
  }

  // called when we click on add photos
  const handleAddImage = () => {
    setSelectedImage([])
    resetZoomRotate()

    let currentSlide = sliderIndex
    if (sliderIndex > 1) currentSlide = 1
    const photoZones =
      customFabricObj?.variables?.template_data?.faces[currentSlide]?.photoZones
    setCurrentSelectedImageIndex(
      customFabricObj?.variables?.template_data?.faces[currentSlide]?.photoZones
        .length
    )
    const indexToSet =
      customFabricObj?.variables?.template_data?.faces[currentSlide]?.photoZones
        ?.length
    setactiveElem(indexToSet)
    handleImageEditClick(indexToSet)
  }
  const launchGalleryBottomSheet = async (
    albumName = 'Recent Photos',
    camera = false
  ) => {
    setSheetErr(false)
    const dataAlbum = await CameraRoll.getAlbums({})
    const totalPics = dataAlbum.reduce(
      (total, current) => total + current.count,
      0
    )
    setTotalPictures(totalPics)

    const albumDataAll = await Promise.all(
      dataAlbum.map(async (album) => {
        const photos = await CameraRoll.getPhotos({
          first: 1,
          assetType: 'Photos',
          groupName: album.title,
          groupTypes: 'Album'
        })

        if (photos.edges.length > 0) {
          return {
            label: album.title,
            count: album.count,
            uri: photos.edges[0].node.image.uri
          }
        }
      })
    )
    setAlbumsData(albumDataAll)
    try {
      const getGalleryRecentImages = await CameraRoll.getPhotos({
        first: 1000,
        groupName: albumName,

        assetType: 'Photos',

        groupTypes: albumName == 'Recent Photos' ? 'All' : 'Album'
      })

      setAlbumName(albumName)
      setPhotosGallery(getGalleryRecentImages.edges)
      if (camera) {
        getGalleryRecentImages.edges[0].node.image.localUrl =
          getGalleryRecentImages.edges[0].node.image.uri
        setSelectedImage(getGalleryRecentImages.edges[0])
      }
    } catch (err) {
      //Error Loading Images
    }

    if (GallerySheetRef?.current != null) {
      GallerySheetRef?.current?.show()
      setIsOpen(true)
    }
  }

  const handleImageEditClick = (index) => {
    setactiveElem(index)
    check(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then((result) => {
        if (
          appConfigValues?.adobe?.isAnalyticsEnabled &&
          photoAccess &&
          result !== photoAccess
        ) {
          setPhotoAccess(result)
          ACPCore.trackAction('Photo Access', {
            ...adobeReducerState,
            'cd.photoAccess': result
          })
        }
        switch (result) {
          case RESULTS.UNAVAILABLE:
            setPhotoAccess(RESULTS.UNAVAILABLE)
            console.log(
              'This feature is not available (on this device / in this context)'
            )
            break
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((requestResult) => {
              setPhotoAccess(requestResult)
              if (requestResult == 'granted') {
                launchGalleryBottomSheet()
              }
            })
            break
          case RESULTS.LIMITED:
            request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((requestResult) => {
              setPhotoAccess(requestResult)
              if (requestResult == 'granted') {
                launchGalleryBottomSheet()
              }
            })
          case RESULTS.GRANTED:
            setPhotoAccess(RESULTS.GRANTED)
            launchGalleryBottomSheet()
            break
          case RESULTS.BLOCKED:
            // handleCameraErr()
            setPhotoAccess(RESULTS.BLOCKED)
            setSheetErr(true)
            GallerySheetRef?.current?.show()
            setIsOpen(true)
            break
        }
      })
      .catch((error) => {
        console.log('handle camera', error)
      })
  }

  let currentSlide = sliderIndex
  if (sliderIndex > 1) currentSlide = 1

  let allTexts =
    customFabricObj?.variables?.template_data?.faces[currentSlide].texts

  useEffect(() => {
    setAllTextArr({
      ...allTextsArr,
      [currentSlide]: allTexts?.map((item) => item?.text)
    })
  }, [currentSlide, productLoading])

  const updateTextArr = (itemKey, updatedText) => {
    // Update the local text array
    let clonedArr = allTextsArr[currentSlide]
    clonedArr[itemKey] = updatedText
    setAllTextArr({ ...allTextsArr, [currentSlide]: [...clonedArr] })
  }

  const deleteInsideText = (key: number) => {
    setSelectedTextInside(null)

    //Delete Item from local array
    // let clonedArr = allTextsArr[currentSlide]
    // clonedArr.splice(key, 1)
    // setAllTextArr({ ...allTextsArr, [currentSlide]: [...clonedArr] })

    dispatch({
      type: actionNames.DELETE_INSIDE_TEXT,
      payload: {
        itemIndex: key,
        sliderIndex: currentSlide
      }
    })
  }

  const editTextInside = (editObj: any) => {
    if (isConnected) {
      dispatch({
        type: actionNames.UPDATE_INSIDE_TEXT,
        payload: {
          selectedTextInside: editObj.custom
            ? editObj?.itemKey
            : selectedTextInside,
          sliderIndex: currentSlide,
          property: editObj.editType,
          value: editObj.value
        }
      })
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }

  const updateTextPosition = (editData: any) => {
    if (isConnected) {
      dispatch({
        type: actionNames.UPDATE_TEXT_POSITION,
        payload: {
          translateX: editData.translateX,
          translateY: editData.translateY,
          itemKey: editData.itemKey,
          sliderIndex: currentSlide
        }
      })
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }

  useEffect(() => {
    if (selectedTextInside !== null && !backupTexts.length) {
      setBackupTexts(allTexts)
    }
  }, [selectedTextInside])

  const discardTextEditing = () => {
    setAllTextArr({
      ...allTextsArr,
      [currentSlide]: backupTexts?.map((item) => item?.text)
    })
    setDiscardingEditing(true)
    setTimeout(() => {
      setDiscardingEditing(false)
    }, 3000)

    setBackupTexts([])
    setSelectedTextInside(null)
    dispatch({
      type: actionNames.DISCARD_TEXT_EDITING,
      payload: {
        sliderIndex: currentSlide,
        backupTexts: backupTexts
      }
    })
  }

  const saveTextChanges = () => {
    if (isConnected) {
      if (
        appConfigValues?.adobe?.isAnalyticsEnabled &&
        allTextsArr[currentSlide]
      ) {
        let textEditStr = ''
        let textObj = {
          'cd.editText': '1',
          'cd.personalizedEditArea':
            currentSlide === 0
              ? 'outside-front'
              : currentSlide === 1
              ? 'inside-left'
              : 'inside-right',
          'cd.personalizedEditType':
            currentSlide === 0 ? 'editable-text' : 'user-text',
          'cd.personalizedEditValue': currentSlide === 0 ? 'replace' : 'add'
        }
        if (allTexts && allTexts.length) {
          textEditStr += `font= ${
            allTexts[allTexts.length - 1].fontFamily
          }|size= ${allTexts[allTexts.length - 1].fontSize}`
          textEditStr += `|color= ${
            allTexts[allTexts.length - 1].textColor
          }|alignment= ${allTexts[allTexts.length - 1].textAlign}`
        }
        ACPCore.trackAction('Edit Text', {
          ...adobeReducerState,
          ...textObj,
          'cd.personalizeApply': textEditStr
        })
      }
      dispatch({
        type: actionNames.FIT_LOCAL_TEXT_TO_FABRIC_OBJ,
        payload: {
          sliderIndex: currentSlide,
          allTextsArr: allTextsArr[currentSlide]
        }
      })
      setBackupTexts([])
      setSelectedTextInside(null)
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }

  const setHeightWidthTextBox = (editData) => {
    dispatch({
      type: actionNames.SET_HEIGHT_WIDTH_TEXTBOX,
      payload: {
        height: editData.height,
        width: editData.width,
        itemKey: editData.itemKey,
        sliderIndex: currentSlide
      }
    })
  }

  const handleAddText = () => {
    let textTitle = 'Add your text here'
    let clonedArr = allTextsArr[currentSlide]
    clonedArr.push(textTitle)
    setAllTextArr({ ...allTextsArr, [currentSlide]: [...clonedArr] })
    dispatch({
      type: actionNames.ADD_TEXT,
      payload: {
        sliderIndex: currentSlide,
        newText: {
          fontFamily: 'Just a Note',
          fontId: 125,
          fontSize: 16,
          height: 162.53471,
          isFixed: false,
          isHybrid: false,
          isMultiline: true,
          left:
            sliderIndex === 1
              ? customFabricObj?.variables?.template_data?.faces[0].dimensions
                  ?.width /
                  2 -
                450
              : insideWidth +
                (customFabricObj?.variables?.template_data?.faces[0].dimensions
                  ?.width /
                  2 -
                  800),

          angle: 0,
          text: textTitle,
          textAlign: 'left',
          textColor: '#595959',
          top:
            customFabricObj?.variables?.template_data?.faces[0].dimensions
              ?.height /
              2 -
            162,
          width: 900,
          userDefined: true,
          sliderIndex: sliderIndex === 1 ? 1 : 2
        }
      }
    })
  }

  return {
    rotateGesture,
    zoomGesture,
    selectedImage,
    setSelectedImage,
    zoomObj,
    customisationTemplateData,
    editingMode,
    handleThirdIcon,
    handleBackFromCustomisation,
    photosGallery,
    handleImageSelected,
    GallerySheetRef,
    handleGalleryClose,
    setSliderIndex,
    sliderIndex,
    updatePreOffsetValue,
    handleAddImage,
    currentSelectedImageIndex,
    handleImageEditClick,
    sheetErr,
    setSheetErr,
    customFabricObj,
    albumsData,
    handleAlbumChange,
    insideWidth,
    isOpen,
    activeElem,
    setactiveElem,
    changeactiveElem,
    tapGesture,
    zoomVal,
    handleCameraImageSelected,
    setzoomVal,
    totalPictures,
    albumName,
    keepEditing,
    handleBack,
    BSheetRef,
    deleteItem,
    updateRecent,
    rotateNew,
    degree,
    setDegree,
    handleAddText,
    deleteInsideText,
    selectedTextInside,
    setSelectedTextInside,
    editTextInside,
    activeEditMenu,
    setActiveEditMenu,
    editOptions,
    allTexts,
    currentSlide,
    activeHeaderOption,
    handleEditorClicked,
    discardTextEditing,
    saveTextChanges,
    tapGestureSlider,
    insideHeight,
    updateTextPosition,
    setCurrentSelectedImageIndex,
    // setRotationNew,
    pos,
    setPos,
    savedState,
    setSavedState,
    setHeightWidthTextBox,
    allTextsArr,
    updateTextArr,
    maxLimitTextToolbar,
    setMaxLimitTextToolbar,
    CustomizationDisclaimerRef,
    goToPreview,
    editDone,
    discardingEditing,
    renderedImageData,
    setRenderedImageData
  }
}
export default useEnhancer
