import Carousel, { Pagination } from 'react-native-snap-carousel'
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  PixelRatio,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, {
  createRef,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import {
  cropImage,
  initialiseTemplate,
  loadTemplate,
  postImage,
  updateCustomisationState
} from '../../action'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import ActionSheet from 'react-native-actions-sheet'
import CanvasInside from './components/CanvasInside'
import CanvasInside2 from './components/CanvasInside2'
import CanvasInsideHorizontal from './components/CanvasInsideHorizontal'
import CanvasOutside from './components/CanvasOutside'
import CanvasOutsideHorizontal from './components/CanvasOutsideHorizontal'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import CustomizationDisclaimer from './CustomizationDisclaimer'
import DropShadow from 'react-native-drop-shadow'
import EditHeader from './components/EditHeader'
import FooterInsiderPanel from './FooterInsiderPanel'
import { Icon } from '@ecom/components/icons'
import ImageEditor from './components/ImageEditor'
import ImagePicker from 'react-native-image-crop-picker'
import LeavingDisclaimer from './LeavingDisclaimer'
import LoadPreview from './components/PreviewComponent'
import Loader from '@ecom/components/Loader'
import Lottie from 'lottie-react-native'
import NotificationCard from '@ecom/components/NotifyModal'
import PhotoGallery from './PhotoGallery'
import { PhotoLibrary } from '@ecom/assets/svg'
import PreviewHeader from './components/PreviewHeader'
import { RootReducerModal } from '@ecom/modals'
import RotateSlider from './components/RotateSlider'
import Slider from './Slider'
import TextEditOptionsInsideFooter from './components/TextEditOptionsInsideFooter'
import ToolTip from '@ecom/components/ToolTip'
import UnityView from 'react-native-unity-view'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import { showToastMessage } from '@ecom/utils/constant'
import useEnhancer from './Enhancer'

// export interface UnityProps {
//   unityViewRef: React.RefObject<UnityView>
// }

function LoadTemplate(props: any) {
  const dispatch = useDispatch()

  const {
    zoomGesture,
    rotateGesture,
    zoomObj,
    handleThirdIcon,
    customisationTemplateData,
    editingMode,
    selectedImage,
    handleBackFromCustomisation,
    photosGallery,
    GallerySheetRef,
    handleGalleryClose,
    handleImageSelected,
    handleCameraImageSelected,
    sliderIndex,
    setSliderIndex,
    updatePreOffsetValue,
    handleAddImage,
    currentSelectedImageIndex,
    handleImageEditClick,
    sheetErr,
    customFabricObj,
    setSheetErr,
    albumsData,
    insideWidth,
    handleAlbumChange,
    isOpen,
    activeElem,
    setactiveElem,
    changeactiveElem,
    tapGesture,
    zoomVal,
    totalPictures,
    albumName,
    setzoomVal,
    keepEditing,
    handleBack,
    BSheetRef,
    deleteItem,
    setSelectedImage,
    updateRecent,
    rotateNew,
    degree,
    setDegree,
    handleAddText,
    deleteInsideText,
    editTextInside,
    selectedTextInside,
    setSelectedTextInside,
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
    discardingEditing,
    renderedImageData,
    setRenderedImageData
  } = useEnhancer(props)
  const { pdpDetail } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )

  let offset = 0
  let enableFooter = 0

  if (sliderIndex > 0) {
    enableFooter = 1
  }
  const [sliderWidth, setSliderWidth] = useState(screenWidth - 40)
  const [itemWidth, setItemWidth] = useState(screenWidth - 40)
  const corosalRef = createRef()
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageData, setImageData] = useState<any>({})
  const [carsouleDataDisplay, setCarsouleDataDisplay] = useState<any>([])
  const [isClickedOnText, setIsClickedOnText] = useState(false)
  const [showBoxExceedToolbar, setShowBoxExceedToolbar] = useState(false)
  const { productLoading, customisationLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { isCustomised } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const [activeEditorOption, setActiveEditorOption] = useState('zoom')
  const animationRef = useRef<Lottie>(null)
  // const templateData = customisationTemplateData?.variables?.template_data
  const templateData = customFabricObj?.variables?.template_data
  const [cardFormat, setCardFormat] = useState(templateData?.cardFormat)
  useEffect(() => {
    if (props?.route?.params.editing == 'true') {
      dispatch(loadTemplate(props?.route?.params.project_id))
    } else {
      dispatch(
        initialiseTemplate({
          product_id: props?.route?.params?.product_id,
          product_type_code: 'P',
          trackAction: props?.route?.params?.trackAction,
          productType: props?.route?.params?.productType,
          productString: props?.route?.params?.productString,
          source: 'LoadTemplate'
        })
      )
    }
  }, [])

  useEffect(() => {
    if (activeHeaderOption == 'EDITOR') {
      enableFooter = 0
      setActiveIndex(0)
      setSliderIndex(0)
    }
  }, [activeHeaderOption])
  useEffect(() => {
    if (isCustomised && editingMode) {
      animationRef.current?.play()
      setTimeout(() => {
        dispatch(updateCustomisationState())
      }, 3000)
    }
  }, [editingMode, isCustomised])

  useEffect(() => {
    if (activeEditorOption == 'crop') {
      ImagePicker.openCropper({
        path: selectedImage?.localUrl || selectedImage?.node?.image?.localUrl,
        avoidEmptySpaceAroundImage: false,
        // freeStyleCropEnabled: true,
        compressImageQuality: 1,
        height: selectedImage?.node?.image?.height || selectedImage?.height,
        width: selectedImage?.node?.image?.width || selectedImage?.width,
        cropperCircleOverlay: false,
        cropping: true,
        mediaType: 'photo',
        cropperRotateButtonsHidden: true,
        includeExif: true,
        forceJpg: true
        // showCropGuidelines: false,
        // hideBottomControls: true
      })
        .then((image) => {
          console.log(
            'object after crop',
            image,
            image.path.substring(
              image.path.lastIndexOf('/') + 1,
              image.path.length
            )
          )
          let fname = image.path.substring(
            image.path.lastIndexOf('/') + 1,
            image.path.length
          )
          // Object.assign(zoomObj, { [activeElem]: 1 })
          zoomObj.value = { ...zoomObj, [activeElem]: 1 }
          setzoomVal(1)
          // constant.switchLoader(dispatch, 'customisation', true)
          // dispatch(
          //   postImage(
          //     { fileName: fname, uri: image.path, type: image.mime },
          //     (imageId, photoTrayId, imageUrl) => {
          //       if (!imageId) {
          //         handleGalleryClose()
          //         showToastMessage(
          //           'Unable to upload an Image. Please try other image',
          //           'invalid'
          //         )
          //       } else {
          //         dispatch({
          //           type: actionNames.UPDATE_IMAGE,
          //           payload: {
          //             faceId: sliderIndex == 0 ? 0 : 1,
          //             photozoneId: currentSelectedImageIndex,
          //             imageData: {
          //               ...image,
          //               uri: imageUrl,
          //               localUrl: image.path
          //             },
          //             imageDimensions: { left: 0 },
          //             imageId: imageId,
          //             photoTrayId: photoTrayId,
          //             sliderIndex: sliderIndex,
          //             multiplierX: renderedImageData?.multiplierWidth,
          //             multiplierY: renderedImageData?.multiplierHeight
          //           }
          //         })
          //       }
          //     }
          //   )
          // )
          const imageId =
            customFabricObj.variables.template_data.faces[
              sliderIndex == 0 ? 0 : 1
            ].photoZones[currentSelectedImageIndex]?.image?.photoTrayId
          const sourceVersionId =
            customFabricObj.variables.template_data.faces[
              sliderIndex == 0 ? 0 : 1
            ].photoZones[currentSelectedImageIndex]?.image?.sourceVersionId

          dispatch(
            cropImage(
              imageId,
              image.cropRect?.x,
              image.cropRect?.y,
              image.cropRect?.width,
              image.cropRect?.height,
              0,
              sourceVersionId,
              (cropRes) => {
                console.log(
                  'this is cropRes',
                  cropRes,
                  cropRes?.image_url,
                  cropRes?.version_id
                )
                dispatch({
                  type: actionNames.UPDATE_IMAGE_CROP,
                  payload: {
                    faceId: sliderIndex == 0 ? 0 : 1,
                    photozoneId: currentSelectedImageIndex,
                    image_url: cropRes?.image_url,
                    localUrl: '',
                    sourceVersionId: cropRes?.version_id,
                    sliderIndex: sliderIndex
                  }
                })
              }
            )
          )
          setActiveEditorOption('zoom')
        })
        .catch((err) => {
          console.log('openCamera Error: ' + err.message)
          setActiveEditorOption('zoom')
        })
    }
  }, [activeEditorOption])

  useEffect(() => {
    if (templateData?.faces[0]?.frameUrl) {
      Image.getSize(
        templateData?.faces[0]?.frameUrl ?? templateData?.faces[0]?.frameUrl,
        (width, height) => {
          const aspectRatio = width / height
          const pixelRatio = PixelRatio.get()
          setImageData({
            width:
              (templateData?.faces[0]?.dimensions?.width * aspectRatio) /
              pixelRatio,
            height:
              (templateData?.faces[0]?.dimensions?.height * aspectRatio) /
              pixelRatio,
            aspectRatio,
            pixelRatio
          })
        }
      )

      let newData = templateData?.faces.filter((node: any) => node.faceId !== 3)
      if (templateData?.cardFormat == 'portrait') {
        let extendedData = templateData?.faces.filter(
          (node: any) => node.faceId == 2
        )
        extendedData[0] = { ...extendedData[0], FaceId: 3 }
        newData.push({ ...extendedData[0] })
      }
      setCarsouleDataDisplay(newData)
      setCardFormat(templateData?.cardFormat)
    }
  }, [templateData])

  const _openAppSetting = useCallback(async () => {
    await Linking.openSettings()
  }, [])

  const handleStateErrChange = (value: boolean) => {
    setSheetErr(value)
  }

  useEffect(() => {
    let allFabricTexts =
      customFabricObj?.variables?.template_data?.faces[1].texts

    if (
      insideWidth > 0 &&
      allFabricTexts?.length &&
      allFabricTexts[0]?.sliderIndex === undefined
    ) {
      dispatch({
        // to add slider index to each text object to identify the position
        type: actionNames.ADD_SLIDER_INDEXES,
        payload: {
          allTexts: allFabricTexts,
          screenWidth: insideWidth,
          mutiplierWidth: renderedImageData?.multiplierWidth,
          faceID: 1
        }
      })
    }
  }, [productLoading, currentSlide])

  const handleLayoutChange = (layoutData: any) => {
    let { width = 10, height = 10 } = layoutData?.nativeEvent.layout
    let { width: tWidth = 10, height: tHeight = 10 } =
      templateData?.faces[0]?.dimensions
    const scalingRation = width / height

    setRenderedImageData({
      multiplierWidth: width / tWidth,
      multiplierHeight: height / tHeight
    })
  }

  return (
    <>
      {productLoading && (
        <SafeAreaView style={styles.loaderContainer}>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{ paddingHorizontal: vw(20) }}>
            <CircleIcon
              name={'hm_ArrowBack-thick'}
              circleColor={colors.white}
              circleSize={vw(36)}
              iconSize={vw(18)}
              circleStyle={{ borderWidth: 1, borderColor: colors.graylight }}
            />
          </TouchableOpacity>
          <View style={styles.loader}>
            <Text style={styles.loaderTxt}>One moment...</Text>
            <Text style={styles.loaderTxt}> Preparing your card</Text>
            <Image
              source={localImages.loaderCustomization}
              style={styles.loaderImg}
            />
          </View>
        </SafeAreaView>
      )}
      {customisationLoading && <Loader />}
      {!productLoading && (
        <SafeAreaView style={styles.container}>
          <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={-150}
            style={{
              flex: 1
              // alignItems: 'center'
            }}>
            {!editingMode && !isOpen && selectedTextInside === null ? (
              <PreviewHeader
                {...{
                  handleBackFromCustomisation,
                  handleThirdIcon,
                  activeHeaderOption,
                  handleEditorClicked
                }}
              />
            ) : (
              <EditHeader
                selectedTextInside={selectedTextInside}
                title={
                  isOpen && !editingMode
                    ? 'Choose a Photo'
                    : selectedTextInside === null
                    ? 'Edit Photo'
                    : 'Edit Text'
                }
                {...{
                  handleBackFromCustomisation,
                  handleThirdIcon,
                  saveTextChanges,
                  discardTextEditing
                }}
              />
            )}
            {showBoxExceedToolbar && (
              <View
                style={{
                  width: insideWidth,
                  zIndex: 9999999,
                  alignSelf: 'center',
                  bottom: vh(138)
                  // position: 'absolute'
                }}>
                <ToolTip
                  message={
                    'Please be aware, your text field is falling of the page.'
                  }
                  setShowBoxExceedToolbar={setShowBoxExceedToolbar}
                  type="exceedPage"
                />
              </View>
            )}

            {activeHeaderOption === 'EDITOR' ? (
              <>
                {imageData?.aspectRatio && (
                  <View style={styles.backImgContainer}>
                    {editingMode && (
                      <Lottie
                        ref={animationRef}
                        source={localImages.rotateGif}
                        style={{
                          width: vw(120),
                          position: 'absolute',
                          zIndex: 1
                        }}
                        loop={false}
                      />
                    )}
                    <View
                      style={{
                        flex: 1,
                        position: 'relative'
                        // borderWidth: 2,
                        // width: '100%'
                      }}>
                      {carsouleDataDisplay &&
                        carsouleDataDisplay?.length > 0 && (
                          <>
                            {cardFormat === 'portrait' ? (
                              <Carousel
                                ref={corosalRef}
                                data={carsouleDataDisplay}
                                scrollEnabled={
                                  !editingMode &&
                                  selectedTextInside === null &&
                                  !isOpen
                                }
                                onBeforeSnapToItem={setSliderIndex}
                                containerCustomStyle={{
                                  flex: 1,
                                  margin: vh(10),
                                  height: '100%'
                                }}
                                contentContainerStyle={{
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                                inactiveSlideScale={1}
                                inactiveSlideOpacity={1}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                onSnapToItem={(index) => {
                                  // resetting the values
                                  // Object.assign(zoomObj, {})
                                  zoomObj.value = {}
                                  rotateNew.value = {}
                                  // setRotationNew({})
                                  setDegree(0)
                                  setzoomVal(1)
                                  setMaxLimitTextToolbar(false)
                                  setShowBoxExceedToolbar(false)
                                  // changeactiveElem(0)
                                  if (index >= 1) {
                                    setSliderWidth(screenWidth)
                                    setItemWidth(screenWidth)
                                  }
                                  setActiveIndex(index)
                                }}
                                renderItem={({ item, index }: any) => {
                                  return (
                                    <DropShadow style={styles.shadowImg}>
                                      {index == 0 && (
                                        <View onLayout={handleLayoutChange}>
                                          <CanvasOutside
                                            selectedImage={selectedImage}
                                            GallerySheetRef={GallerySheetRef}
                                            imageData={imageData}
                                            item={item}
                                            offset={offset}
                                            sliderIndex={sliderIndex}
                                            editingMode={editingMode}
                                            handleImageEditClick={
                                              handleImageEditClick
                                            }
                                            activeEditorOption={
                                              activeEditorOption
                                            }
                                            renderedImageData={
                                              renderedImageData
                                            }
                                            scale={zoomObj.value}
                                            activeElem={activeElem}
                                            setactiveElem={setactiveElem}
                                            zoomGesture={zoomGesture}
                                            changeactiveElem={changeactiveElem}
                                            rotate={rotateNew.value}
                                            rotateGesture={rotateGesture}
                                            tapGesture={tapGesture}
                                            deleteItem={deleteItem}
                                            setSelectedImage={setSelectedImage}
                                            selectedTextInside={
                                              selectedTextInside
                                            }
                                            setSelectedTextInside={
                                              setSelectedTextInside
                                            }
                                            activeEditMenu={activeEditMenu}
                                            setActiveEditMenu={
                                              setActiveEditMenu
                                            }
                                            editTextInside={editTextInside}
                                            setCurrentSelectedImageIndex={
                                              setCurrentSelectedImageIndex
                                            }
                                            allTextsArr={allTextsArr}
                                            updateTextArr={updateTextArr}
                                            maxLimitTextToolbar={
                                              maxLimitTextToolbar
                                            }
                                            setMaxLimitTextToolbar={
                                              setMaxLimitTextToolbar
                                            }
                                            insideHeight={insideHeight}
                                            insideWidth={insideWidth}
                                            isOpen={isOpen}
                                            discardingEditing={
                                              discardingEditing
                                            }
                                            setDegree={setDegree}
                                            setzoomVal={setzoomVal}
                                          />
                                        </View>
                                      )}

                                      {index == 1 && (
                                        <View
                                          onLayout={updatePreOffsetValue}
                                          style={{
                                            zIndex: 1,
                                            position: 'relative',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                          }}>
                                          <CanvasInside
                                            selectedImage={selectedImage}
                                            GallerySheetRef={GallerySheetRef}
                                            imageData={imageData}
                                            item={item}
                                            // offset={offset}
                                            sliderIndex={sliderIndex}
                                            editingMode={editingMode}
                                            handleImageEditClick={
                                              handleImageEditClick
                                            }
                                            activeEditorOption={
                                              activeEditorOption
                                            }
                                            renderedImageData={
                                              renderedImageData
                                            }
                                            scale={zoomObj.value}
                                            activeElem={activeElem}
                                            setactiveElem={setactiveElem}
                                            zoomGesture={zoomGesture}
                                            changeactiveElem={changeactiveElem}
                                            rotate={rotateNew.value}
                                            rotateGesture={rotateGesture}
                                            insideWidth={insideWidth}
                                            tapGesture={tapGesture}
                                            deleteItem={deleteItem}
                                            setSelectedImage={setSelectedImage}
                                            deleteInsideText={deleteInsideText}
                                            selectedTextInside={
                                              selectedTextInside
                                            }
                                            setSelectedTextInside={
                                              setSelectedTextInside
                                            }
                                            editTextInside={editTextInside}
                                            activeEditMenu={activeEditMenu}
                                            allTexts={allTexts}
                                            customFabricObj={customFabricObj}
                                            setActiveEditMenu={
                                              setActiveEditMenu
                                            }
                                            currentSlide={currentSlide}
                                            insideHeight={insideHeight}
                                            updateTextPosition={
                                              updateTextPosition
                                            }
                                            setCurrentSelectedImageIndex={
                                              setCurrentSelectedImageIndex
                                            }
                                            pos={pos}
                                            setPos={setPos}
                                            savedState={savedState}
                                            setSavedState={setSavedState}
                                            setHeightWidthTextBox={
                                              setHeightWidthTextBox
                                            }
                                            allTextsArr={allTextsArr}
                                            updateTextArr={updateTextArr}
                                            maxLimitTextToolbar={
                                              maxLimitTextToolbar
                                            }
                                            setMaxLimitTextToolbar={
                                              setMaxLimitTextToolbar
                                            }
                                            isClickedOnText={isClickedOnText}
                                            setShowBoxExceedToolbar={
                                              setShowBoxExceedToolbar
                                            }
                                            showBoxExceedToolbar={
                                              showBoxExceedToolbar
                                            }
                                            isOpen={isOpen}
                                          />
                                        </View>
                                      )}
                                      {index == 2 && (
                                        <View
                                          onLayout={updatePreOffsetValue}
                                          style={{
                                            zIndex: 99,
                                            overflow: 'hidden',
                                            position: 'relative',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                          }}>
                                          <CanvasInside2
                                            selectedImage={selectedImage}
                                            GallerySheetRef={GallerySheetRef}
                                            imageData={imageData}
                                            item={item}
                                            // offset={offset}
                                            sliderIndex={sliderIndex}
                                            editingMode={editingMode}
                                            handleImageEditClick={
                                              handleImageEditClick
                                            }
                                            activeEditorOption={
                                              activeEditorOption
                                            }
                                            renderedImageData={
                                              renderedImageData
                                            }
                                            scale={zoomObj.value}
                                            activeElem={activeElem}
                                            setactiveElem={setactiveElem}
                                            zoomGesture={zoomGesture}
                                            changeactiveElem={changeactiveElem}
                                            rotate={rotateNew.value}
                                            rotateGesture={rotateGesture}
                                            insideWidth={insideWidth}
                                            tapGesture={tapGesture}
                                            deleteItem={deleteItem}
                                            setSelectedImage={setSelectedImage}
                                            deleteInsideText={deleteInsideText}
                                            selectedTextInside={
                                              selectedTextInside
                                            }
                                            setSelectedTextInside={
                                              setSelectedTextInside
                                            }
                                            editTextInside={editTextInside}
                                            activeEditMenu={activeEditMenu}
                                            allTexts={allTexts}
                                            customFabricObj={customFabricObj}
                                            setActiveEditMenu={
                                              setActiveEditMenu
                                            }
                                            currentSlide={currentSlide}
                                            insideHeight={insideHeight}
                                            updateTextPosition={
                                              updateTextPosition
                                            }
                                            setCurrentSelectedImageIndex={
                                              setCurrentSelectedImageIndex
                                            }
                                            pos={pos}
                                            setPos={setPos}
                                            savedState={savedState}
                                            setSavedState={setSavedState}
                                            setHeightWidthTextBox={
                                              setHeightWidthTextBox
                                            }
                                            allTextsArr={allTextsArr}
                                            updateTextArr={updateTextArr}
                                            maxLimitTextToolbar={
                                              maxLimitTextToolbar
                                            }
                                            setMaxLimitTextToolbar={
                                              setMaxLimitTextToolbar
                                            }
                                            isClickedOnText={isClickedOnText}
                                            setShowBoxExceedToolbar={
                                              setShowBoxExceedToolbar
                                            }
                                            showBoxExceedToolbar={
                                              showBoxExceedToolbar
                                            }
                                            isOpen={isOpen}
                                          />
                                        </View>
                                      )}
                                    </DropShadow>
                                  )
                                }}
                              />
                            ) : (
                              <Carousel
                                ref={corosalRef}
                                data={carsouleDataDisplay}
                                scrollEnabled={
                                  !editingMode &&
                                  selectedTextInside === null &&
                                  !isOpen
                                }
                                onBeforeSnapToItem={setSliderIndex}
                                containerCustomStyle={{
                                  flex: 1,
                                  width: '100%',
                                  height: '100%'
                                }}
                                contentContainerStyle={{
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                                inactiveSlideScale={0}
                                inactiveSlideOpacity={1}
                                sliderWidth={sliderWidth}
                                itemWidth={itemWidth}
                                onSnapToItem={(index) => {
                                  zoomObj.value = {}
                                  rotateNew.value = {}
                                  setDegree(0)
                                  setzoomVal(1)
                                  setActiveIndex(index)
                                }}
                                renderItem={({ item, index }: any) => {
                                  return (
                                    <DropShadow style={styles.shadowImg}>
                                      {index == 0 && (
                                        <View onLayout={handleLayoutChange}>
                                          <CanvasOutsideHorizontal
                                            selectedImage={selectedImage}
                                            GallerySheetRef={GallerySheetRef}
                                            imageData={imageData}
                                            item={item}
                                            offset={offset}
                                            sliderIndex={sliderIndex}
                                            editingMode={editingMode}
                                            handleImageEditClick={
                                              handleImageEditClick
                                            }
                                            activeEditorOption={
                                              activeEditorOption
                                            }
                                            renderedImageData={
                                              renderedImageData
                                            }
                                            scale={zoomObj.value}
                                            activeElem={activeElem}
                                            setactiveElem={setactiveElem}
                                            zoomGesture={zoomGesture}
                                            changeactiveElem={changeactiveElem}
                                            rotate={rotateNew.value}
                                            rotateGesture={rotateGesture}
                                            tapGesture={tapGesture}
                                            deleteItem={deleteItem}
                                            setSelectedImage={setSelectedImage}
                                            selectedTextInside={
                                              selectedTextInside
                                            }
                                            setSelectedTextInside={
                                              setSelectedTextInside
                                            }
                                            activeEditMenu={activeEditMenu}
                                            setActiveEditMenu={
                                              setActiveEditMenu
                                            }
                                            editTextInside={editTextInside}
                                            setCurrentSelectedImageIndex={
                                              setCurrentSelectedImageIndex
                                            }
                                            allTextsArr={allTextsArr}
                                            updateTextArr={updateTextArr}
                                            maxLimitTextToolbar={
                                              maxLimitTextToolbar
                                            }
                                            setMaxLimitTextToolbar={
                                              setMaxLimitTextToolbar
                                            }
                                            insideHeight={insideHeight}
                                            insideWidth={insideWidth}
                                            isOpen={isOpen}
                                            discardingEditing={
                                              discardingEditing
                                            }
                                            setDegree={setDegree}
                                            setzoomVal={setzoomVal}
                                          />
                                        </View>
                                      )}

                                      {index == 1 && (
                                        <View
                                          onLayout={updatePreOffsetValue}
                                          style={{
                                            zIndex: 1,
                                            position: 'relative',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                          }}>
                                          <CanvasInsideHorizontal
                                            selectedImage={selectedImage}
                                            GallerySheetRef={GallerySheetRef}
                                            imageData={imageData}
                                            item={item}
                                            // offset={offset}
                                            sliderIndex={sliderIndex}
                                            editingMode={editingMode}
                                            handleImageEditClick={
                                              handleImageEditClick
                                            }
                                            activeEditorOption={
                                              activeEditorOption
                                            }
                                            renderedImageData={
                                              renderedImageData
                                            }
                                            scale={zoomObj.value}
                                            activeElem={activeElem}
                                            setactiveElem={setactiveElem}
                                            zoomGesture={zoomGesture}
                                            changeactiveElem={changeactiveElem}
                                            rotate={rotateNew.value}
                                            rotateGesture={rotateGesture}
                                            insideWidth={insideWidth}
                                            tapGesture={tapGesture}
                                            deleteItem={deleteItem}
                                            setSelectedImage={setSelectedImage}
                                            deleteInsideText={deleteInsideText}
                                            selectedTextInside={
                                              selectedTextInside
                                            }
                                            setSelectedTextInside={
                                              setSelectedTextInside
                                            }
                                            editTextInside={editTextInside}
                                            activeEditMenu={activeEditMenu}
                                            allTexts={allTexts}
                                            customFabricObj={customFabricObj}
                                            setActiveEditMenu={
                                              setActiveEditMenu
                                            }
                                            currentSlide={currentSlide}
                                            insideHeight={insideHeight}
                                            updateTextPosition={
                                              updateTextPosition
                                            }
                                            setCurrentSelectedImageIndex={
                                              setCurrentSelectedImageIndex
                                            }
                                            pos={pos}
                                            setPos={setPos}
                                            savedState={savedState}
                                            setSavedState={setSavedState}
                                            setHeightWidthTextBox={
                                              setHeightWidthTextBox
                                            }
                                            allTextsArr={allTextsArr}
                                            updateTextArr={updateTextArr}
                                            maxLimitTextToolbar={
                                              maxLimitTextToolbar
                                            }
                                            setMaxLimitTextToolbar={
                                              setMaxLimitTextToolbar
                                            }
                                            isClickedOnText={isClickedOnText}
                                            setShowBoxExceedToolbar={
                                              setShowBoxExceedToolbar
                                            }
                                            showBoxExceedToolbar={
                                              showBoxExceedToolbar
                                            }
                                            isOpen={isOpen}
                                          />
                                        </View>
                                      )}
                                    </DropShadow>
                                  )
                                }}
                              />
                            )}
                          </>
                        )}
                    </View>
                    {carsouleDataDisplay &&
                    carsouleDataDisplay?.length > 0 &&
                    !editingMode &&
                    selectedTextInside === null &&
                    cardFormat === 'portrait' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          position: 'relative'
                        }}>
                        <Pagination
                          dotsLength={carsouleDataDisplay?.length}
                          activeDotIndex={activeIndex}
                          dotStyle={styles.dotstyle}
                          inactiveDotStyle={styles.inactiveDot}
                          inactiveDotOpacity={1}
                          inactiveDotScale={1}
                        />
                        {activeIndex == 0
                          ? !editingMode && (
                              <View style={{ position: 'absolute', right: 0 }}>
                                <TouchableOpacity
                                  style={styles.footerContainer}
                                  onPress={() => {
                                    corosalRef.current.snapToItem(2)
                                    // corosalRef.current.snapToNext()
                                  }}>
                                  <Text style={styles.fotterTxt}>Inside</Text>
                                  <Icon
                                    name={'hm_ChevronRight-thick'}
                                    size={vh(12)}
                                    color={colors.hmPurple}
                                  />
                                </TouchableOpacity>
                              </View>
                            )
                          : !editingMode && (
                              <>
                                <View
                                  style={{ position: 'absolute', left: 15 }}>
                                  <TouchableOpacity
                                    style={{
                                      display: 'flex',
                                      alignSelf: 'flex-start',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginHorizontal: vw(20),
                                      marginVertical: vh(20)
                                    }}
                                    onPress={() => {
                                      corosalRef.current.snapToPrev()
                                    }}>
                                    <Icon
                                      name={'hm_ChevronLeft-thick'}
                                      size={vh(12)}
                                      color={colors.hmPurple}
                                    />
                                    <Text style={styles.fotterTxt}>
                                      {activeIndex == 1 ? 'Cover' : 'Left page'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                {activeIndex == 1 && (
                                  <View
                                    style={{ position: 'absolute', right: 0 }}>
                                    <TouchableOpacity
                                      style={{
                                        display: 'flex',
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: vw(20),
                                        marginVertical: vh(20)
                                      }}
                                      onPress={() => {
                                        corosalRef.current.snapToNext()
                                      }}>
                                      <Text style={styles.fotterTxt}>
                                        Right page
                                      </Text>
                                      <Icon
                                        name={'hm_ChevronRight-thick'}
                                        size={vh(12)}
                                        color={colors.hmPurple}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </>
                            )}
                      </View>
                    ) : (
                      <></>
                    )}

                    {carsouleDataDisplay &&
                    carsouleDataDisplay?.length > 0 &&
                    !editingMode &&
                    selectedTextInside === null &&
                    cardFormat === 'landscape' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          // backgroundColor: 'red',
                          position: 'relative',
                          flex: 0.1
                        }}>
                        <Pagination
                          dotsLength={carsouleDataDisplay?.length - 1}
                          activeDotIndex={activeIndex}
                          dotStyle={styles.dotstyle}
                          inactiveDotStyle={styles.inactiveDot}
                          inactiveDotOpacity={1}
                          inactiveDotScale={1}
                        />
                        {activeIndex == 0
                          ? !editingMode && (
                              <View style={{ position: 'absolute', right: 0 }}>
                                <TouchableOpacity
                                  style={styles.footerContainer}
                                  onPress={() => {
                                    corosalRef.current.snapToItem(2)
                                    // corosalRef.current.snapToNext()
                                  }}>
                                  <Text style={styles.fotterTxt}>Inside</Text>
                                  <Icon
                                    name={'hm_ChevronRight-thick'}
                                    size={vh(12)}
                                    color={colors.hmPurple}
                                  />
                                </TouchableOpacity>
                              </View>
                            )
                          : !editingMode && (
                              <>
                                <View
                                  style={{ position: 'absolute', left: 15 }}>
                                  <TouchableOpacity
                                    style={{
                                      display: 'flex',
                                      alignSelf: 'flex-start',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginHorizontal: vw(20),
                                      marginVertical: vh(20)
                                    }}
                                    onPress={() => {
                                      corosalRef.current.snapToPrev()
                                    }}>
                                    <Icon
                                      name={'hm_ChevronLeft-thick'}
                                      size={vh(12)}
                                      color={colors.hmPurple}
                                    />
                                    <Text style={styles.fotterTxt}>
                                      {activeIndex == 1 ? 'Cover' : 'Left page'}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                                {/* {activeIndex == 1 && (
                                  <View
                                    style={{ position: 'absolute', right: 0 }}>
                                    <TouchableOpacity
                                      style={{
                                        display: 'flex',
                                        alignSelf: 'flex-start',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginHorizontal: vw(20),
                                        marginVertical: vh(20)
                                      }}
                                      onPress={() => {
                                        corosalRef.current.snapToNext()
                                      }}>
                                      <Text style={styles.fotterTxt}>
                                        Right page
                                      </Text>
                                    
                                    </TouchableOpacity>
                                  </View>
                                )} */}
                              </>
                            )}
                      </View>
                    ) : (
                      <></>
                    )}

                    {editingMode && (
                      <View
                        style={{
                          position: 'relative',
                          height: vh(150),
                          width: screenWidth,
                          overflow: 'hidden'
                        }}>
                        {activeEditorOption === 'zoom' ? (
                          <View
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                            <Slider
                              zoomLevel={Math.round(
                                zoomVal >= 0 ? zoomVal * 100 : 100
                              )}
                              value={zoomVal ? zoomVal : 1}
                              minimumTrackTintColor={colors.pageBackground}
                              maximumTrackTintColor={colors.pageBackground}
                              maximumValue={2}
                              tapGestureSlider={tapGestureSlider}
                              onValueChange={(value: any) => {
                                // updateScale()
                                // Object.assign(zoomObj, {
                                //   [activeElem]: value < 0.1 ? 0.1 : value
                                // })
                                zoomObj.value = {
                                  ...zoomObj,
                                  [activeElem]: value < 0.1 ? 0.1 : value
                                }
                                setzoomVal(value)
                              }}
                              // style={{position:"absolute", width:"100%", zIndex:9}}
                              thumbStyle={{
                                width: vw(8),
                                height: vw(8)
                              }}
                            />
                          </View>
                        ) : activeEditorOption === 'rotate' ? (
                          <RotateSlider
                            {...{
                              // rotationInAngle,
                              // opacityHandler,
                              degree,
                              setDegree
                            }}
                          />
                        ) : (
                          <View style={{ height: vh(120) }}></View>
                        )}
                      </View>
                    )}

                    {!editingMode && selectedTextInside === null && (
                      <View
                        pointerEvents={sliderIndex == 0 ? 'none' : 'auto'}
                        style={{
                          opacity: enableFooter
                        }}>
                        <FooterInsiderPanel
                          {...props}
                          handleAddImage={handleAddImage}
                          handleAddText={handleAddText}
                        />
                      </View>
                    )}

                    {/* For the first slider if there is any active edit item available */}
                    {/* {!enableFooter && selectedTextInside !== null && (
                    <TextEditOptionsInsideFooter
                      allTexts={allTexts}
                      editTextInside={editTextInside}
                      activeEditMenu={activeEditMenu}
                      setActiveEditMenu={setActiveEditMenu}
                      editOptions={editOptions}
                      selectedTextInside={selectedTextInside}
                    />
                  )} */}
                  </View>
                )}
                {editingMode ? (
                  <View
                    style={{
                      flex: 0.1,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    <ImageEditor
                      {...{ setActiveEditorOption, activeEditorOption }}
                    />
                  </View>
                ) : selectedTextInside !== null ? (
                  <View
                    style={{
                      height: '22%',
                      width: screenWidth,
                      marginLeft: 10,
                      overflow: 'hidden',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                    {!allTexts[selectedTextInside].isFixed && (
                      <TextEditOptionsInsideFooter
                        allTexts={allTexts}
                        editTextInside={editTextInside}
                        activeEditMenu={activeEditMenu}
                        setActiveEditMenu={setActiveEditMenu}
                        editOptions={editOptions}
                        selectedTextInside={selectedTextInside}
                        setIsClickedOnText={setIsClickedOnText}
                      />
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      height: '10%',
                      width: screenWidth,
                      overflow: 'hidden'
                    }}
                  />
                )}
              </>
            ) : (
              <LoadPreview />
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      )}
      <LeavingDisclaimer
        BSheetRef={BSheetRef}
        keepEditing={keepEditing}
        handleBack={handleBack}
      />

      <CustomizationDisclaimer
        CustomizationDisclaimerRef={CustomizationDisclaimerRef}
        goToPreview={goToPreview}
      />
      {!sheetErr ? (
        <ActionSheet
          ref={GallerySheetRef}
          backgroundInteractionEnabled={true}
          isModal={true}
          snapPoints={[30, 80]}
          initialSnapIndex={0}
          gestureEnabled={true}>
          <View style={{ height: '100%' }}>
            <View style={styles.photoGallery}>
              <PhotoGallery
                currentSelectedImageIndex={currentSelectedImageIndex}
                data={photosGallery}
                handleGalleryClose={handleGalleryClose}
                handleStateErrChange={handleStateErrChange}
                selectedImage={selectedImage}
                handleImageSelected={handleImageSelected}
                albumsData={albumsData}
                handleAlbumChange={handleAlbumChange}
                handleCameraImageSelected={handleCameraImageSelected}
                totalPictures={totalPictures}
                albumName={albumName}
                updateRecent={updateRecent}
                setActiveEditorOption={setActiveEditorOption}
              />
            </View>
          </View>
        </ActionSheet>
      ) : (
        <ActionSheet
          ref={GallerySheetRef}
          backgroundInteractionEnabled={true}
          isModal={true}
          // snapPoints={[30, 80]}
          // initialSnapIndex={0}
        >
          <View style={{ height: vh(350) }}>
            <NotificationCard
              title="Share your photo library"
              subtitle="Then you can upload and add photos, plus save them to your photo library."
              buttonLabel="Enable library access"
              onOkClick={_openAppSetting}
              isShowCancel={false}
              Icon={
                <PhotoLibrary
                  height={vh(100)}
                  width={vw(109)}
                  style={styles.permissionImg}
                />
              }
            />
          </View>
        </ActionSheet>
      )}
    </>
  )
}

export default LoadTemplate
const styles = StyleSheet.create({
  fotterTxt: {
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: vw(14),
    lineHeight: vh(17),
    fontFamily: fonts.MEDIUM,
    color: colors.hmPurple,
    marginRight: vw(4),
    marginLeft: vw(4)
  },
  footerContainer: {
    display: 'flex',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: vw(20),
    marginVertical: vh(20)
  },
  editTxtImg: {
    width: vw(50),
    height: vw(50),
    resizeMode: 'contain',
    justifyContent: 'center',
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 11111111
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: colors.white
  },
  container: {
    flex: 1,
    backgroundColor: colors.pageBackground,
    paddingVertical: vh(20),
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelBtn: {
    borderRadius: vw(36),
    paddingHorizontal: vw(12),
    paddingVertical: vh(10),
    width: 'auto',
    height: 'auto',
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginBottom: vh(30),
    marginHorizontal: 20
  },
  cancelBtnTxt: {
    color: colors.txtBtnCancel,
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(17)
  },
  backImgContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },

  shadowImg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
    // paddingVertical: 5
  },
  editphoto: {
    width: vw(60),
    height: vw(60),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignSelf: 'center',
    flex: 1
  },
  loaderImg: {
    width: vw(168.32),
    height: vh(201.21),
    resizeMode: 'contain',
    marginTop: vh(39)
  },
  permissionImg: {
    marginTop: vh(35),
    marginBottom: vh(28)
  },
  loaderTxt: {
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(17),
    color: colors.loaderPageTxt
  },
  loader: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  imgCarousel: {
    width: '95%',
    height: '100%',
    resizeMode: 'contain'
  },
  dotstyle: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    marginHorizontal: vw(-10),
    backgroundColor: colors.hmPurple
  },
  inactiveDot: {
    width: vw(10),
    height: vw(10),
    borderRadius: vw(5),
    backgroundColor: colors.hmPurplelight
  },

  photoGallery: {
    flex: 1,
    width: '100%'
  }
})
