import { CircleIcon, Icon } from '@ecom/components/icons'
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import React, { useEffect, useState } from 'react'
import { editingModeChange, postImage } from '../../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import DropShadow from 'react-native-drop-shadow'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { launchCamera } from 'react-native-image-picker'
import localImages from '@ecom/utils/localImages'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'

const PhotoGallery = ({
  handleStateErrChange,
  handleGalleryClose,
  data,
  selectedImage,
  albumsData,
  handleImageSelected,
  handleCameraImageSelected,
  handleAlbumChange,
  albumName,
  totalPictures,
  updateRecent,
  setActiveEditorOption
}: any) => {
  // const [cameraImage, setcameraImage] = useState(Array.from(100))
  const handleCamera = () => {
    handleStateErrChange(true)
  }
  const dispatch = useDispatch()
  const { backgroundImageUrl, localImageUrl } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const [cameraAccess, setCameraAccess] = useState('')
  // useEffect(() => {
  //   console.log('edit mode changed')
  // }, [selectedImage])
  const handleEditImage = () => {
    setActiveEditorOption('zoom')
    handleGalleryClose()
    dispatch(editingModeChange(true))
  }

  const handleCameraIconClick = () => {
    check(PERMISSIONS.IOS.CAMERA)
      .then((result) => {
        if (
          appConfigValues?.adobe?.isAnalyticsEnabled &&
          cameraAccess &&
          result !== cameraAccess
        ) {
          setCameraAccess(result)
          ACPCore.trackAction('Camera Access', {
            ...adobeReducerState,
            'cd.cameraAccess': result
          })
        }
        switch (result) {
          case RESULTS.UNAVAILABLE:
            setCameraAccess(RESULTS.UNAVAILABLE)
            console.log(
              'This feature is not available (on this device / in this context)'
            )
            break
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.CAMERA).then((requestResult) => {
              setCameraAccess(requestResult)
              if (requestResult == 'granted') {
                launchCamera(
                  {
                    mediaType: 'photo',
                    saveToPhotos: true,
                    presentationStyle: 'fullScreen'
                  },
                  (response) => {
                    if (response?.didCancel) {
                      return
                    } else if (response?.errorCode) {
                      handleCamera()
                      return
                    } else if (response?.assets) {
                      handleGalleryClose()
                      handleCameraImageSelected(response?.assets[0])
                    }
                  }
                )
              }
            })
            break
          case RESULTS.GRANTED:
            setCameraAccess(RESULTS.GRANTED)
            launchCamera(
              {
                mediaType: 'photo',
                saveToPhotos: true,
                presentationStyle: 'fullScreen'
              },
              (response) => {
                if (response?.didCancel) {
                  // handleCamera()
                  return
                } else if (response?.errorCode) {
                  handleCamera()
                  return
                } else if (response?.assets) {
                  handleCameraImageSelected(response?.assets[0])

                  // dispatch(postImage(response?.assets[0]))
                  // dispatch(postImage(response?.assets[0], (res, res1) => {}))
                  handleAlbumChange('Recent Photos', true)
                  const item = {
                    node: {
                      image: {
                        extension: 'jpg',
                        filename: response?.assets[0].fileName,
                        uri: response?.assets[0].uri
                      },
                      type: response?.assets[0].type
                    }
                  }

                  handleImageSelected(item)
                }
              }
            )
            break
          case RESULTS.BLOCKED:
            setCameraAccess(RESULTS.BLOCKED)
            handleCamera()
            break
        }
      })
      .catch((error) => {
        console.log('handle camera', error)
      })
  }
  const truncateAlbumName = (albumName, n = 7) => {
    return albumName.length > n ? albumName.slice(0, n - 1) + '...' : albumName
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBtn}>
          <View>
            <TouchableOpacity
              style={styles.btnRecent}
              onPress={() => {
                if (data && data.length > 0) {
                  handleGalleryClose()
                  navigate(screenNames.ALBUM_MODAL, {
                    albumsData: albumsData,
                    handleAlbumChange: handleAlbumChange,
                    recentData: data,
                    totalPictures: totalPictures,
                    updateRecent: updateRecent
                  })
                }
              }}>
              <Text style={styles.btnTxt}>
                {albumName === 'Recent Photos'
                  ? 'Recent'
                  : truncateAlbumName(albumName)}
              </Text>
              <Icon
                name={'hm_ChevronDown-thick'}
                size={vw(16)}
                color={colors.blackText}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.btnCamera}
            onPress={handleCameraIconClick}>
            <CircleIcon
              name={'hm_Photo-thick'}
              circleColor={colors.cameraBackground}
              circleSize={vw(30)}
              iconSize={vw(16)}
              iconColor={colors.deliveryBottomTxt}
            />
            {/* <Icon
              name={'hm_Photo-thick'}
              size={vw(16)}
              color={colors.deliveryBottomTxt}
            /> */}
          </TouchableOpacity>
        </View>
        {(selectedImage?.localUrl || selectedImage?.node?.image?.localUrl) && (
          <TouchableOpacity style={styles.btnEdit} onPress={handleEditImage}>
            <Text style={styles.btnEditTxt}>Edit Photo</Text>
            <Icon
              name={'hm_ChevronRight-thick'}
              size={vh(15)}
              color={colors.white}
            />
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={data}
        numColumns={4}
        contentContainerStyle={{
          justifyContent: 'space-between'
        }}
        renderItem={({ item }) => {
          return (
            <>
              {selectedImage?.localUrl === item?.node?.image?.uri ||
              selectedImage?.node?.image?.localUrl ===
                item?.node?.image?.uri ? (
                <TouchableOpacity
                  style={{ padding: 6, width: '24%', position: 'relative' }}
                  onPress={() => handleImageSelected(item)}>
                  <DropShadow style={styles.selectedImageShadow}>
                    <Image
                      source={{ uri: item?.node?.image?.uri }}
                      style={{
                        aspectRatio: 1,
                        borderRadius: vw(5),
                        borderWidth: 3,
                        borderColor: colors.white
                      }}></Image>
                  </DropShadow>
                  <View style={{ position: 'absolute', right: 15, top: 15 }}>
                    <CircleIcon
                      name={'hm_Check-thick'}
                      circleColor={colors.green}
                      circleSize={vw(20)}
                      iconSize={vw(10)}
                      iconColor={colors.white}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{ padding: 6, width: '25%', position: 'relative' }}
                  onPress={() => handleImageSelected(item)}>
                  <Image
                    source={{ uri: item?.node?.image?.uri }}
                    style={{
                      aspectRatio: 1,
                      borderRadius: vw(5)
                    }}></Image>
                </TouchableOpacity>
              )}
            </>
          )
        }}
      />
    </View>
  )
}

export default PhotoGallery
const styles = StyleSheet.create({
  container: {
    padding: vw(20),
    flex: 1,
    display: 'flex'
  },
  header: {
    flexDirection: 'row',
    marginBottom: vh(30)
  },
  headerBtn: { flexDirection: 'row', flex: 1, alignItems: 'center' },
  btnRecent: {
    paddingVertical: vh(7),
    paddingHorizontal: vw(15),
    backgroundColor: '#5B398B26',
    borderRadius: vw(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    letterSpacing: -0.01,
    lineHeight: vh(18),
    marginRight: vw(6)
  },
  btnCamera: {
    marginLeft: vw(9)
  },

  btnEdit: {
    alignItems: 'center',
    paddingVertical: vh(8),
    paddingHorizontal: vw(13),
    backgroundColor: colors.hmPurple,
    justifyContent: 'center',
    flexDirection: 'row',
    borderRadius: vw(20)
  },
  btnEditTxt: {
    color: colors.white,
    alignItems: 'center',
    marginRight: vw(4),
    justifyContent: 'center',
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(18),
    letterSpacing: -0.01
  },

  arrowDownIcon: {
    width: vw(12),
    height: vh(12),
    resizeMode: 'contain'
  },

  selectedImageShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4
  }
})
