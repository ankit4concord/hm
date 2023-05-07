import * as Progress from 'react-native-progress'

import {
  Alert,
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import {
  Body,
  Description,
  HeaderSmallTight
} from '@ecom/components/typography'
import { CareFile, ErrorResponse, RootReducerModal } from '@ecom/modals'
import DocumentPicker, { types } from 'react-native-document-picker'
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions'
import {
  PrimaryLargeButton,
  SecondaryMediumButton
} from '@ecom/components/buttons'
import React, { useEffect, useState } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'
import { useDispatch, useSelector } from 'react-redux'

import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { DeleteCircleIcon } from '@ecom/components/icons'
import { HMMessage } from '@ecom/components/messages/hm-message'
import Loader from '@ecom/components/Loader'
import LocalizedStrings from 'react-native-localization'
import { StackScreenProps } from '@react-navigation/stack'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import { launchImageLibrary } from 'react-native-image-picker'
import { uploadFiles } from '../actions'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useFocusEffect } from '@react-navigation/native'
import { ACPCore } from '@adobe/react-native-acpcore'

const MAX_UPLOAD_FILE_SIZE = 10000000

const MAX_NO_FILES = 3

type CustomerServiceFilesProps = StackScreenProps<
  AccountStackParamList,
  'AccountCustomerServiceFiles'
>

export const CustomerServiceFiles = ({
  navigation
}: CustomerServiceFilesProps) => {
  const dispatch = useDispatch()
  const care = useSelector((state: RootReducerModal) => state.careReducer)
  const [caseNumber, setCaseNumber] = useState(care.caseNumber)
  const [showSuccess, setShowSuccess] = useState(!!care.caseNumber)
  const [errorMessage, setErrorMessage] = useState('')
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const { showActionSheetWithOptions } = useActionSheet()
  const [files, setFiles] = useState<CareFile[]>(care.files)
  const [loading, setLoading] = useState(false)
  const [allSuccessful, setAllSuccessful] = useState(false)

  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setCaseNumber(care.caseNumber)
      setShowSuccess(!!care.caseNumber)
    }
    return () => {
      isMounted = false
    }
  }, [care.caseNumber])

  useEffect(() => {
    let isMounted = true
    if (isMounted) {
      setFiles(care.files)
      if (care.files.length > 0) {
        const success = care.files.every(
          (f) => f.uploadMessage && !f.uploadMessageError
        )
        setAllSuccessful(success)
      } else {
        setAllSuccessful(false)
      }
    }
    return () => {
      isMounted = false
    }
  }, [care.files])

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        dispatch({ type: actionNames.CARE_CLEAR_CASE, payload: {} })
      }
    }, [dispatch])
  )

  const onClose = () => {
    setShowSuccess(false)
  }

  const errorOnClose = () => {
    setErrorMessage('')
    setShowErrorMessage(false)
  }

  const addFile = (
    fileName?: string,
    fileSize?: number,
    type?: string,
    uri?: string
  ) => {
    const err = validateFile(fileName, fileSize, type, uri)
    if (!err && fileName && fileSize && type && uri) {
      dispatch({
        type: actionNames.CARE_FILES_UPDATE_FINISHED,
        payload: { finished: false }
      })
      const item = {
        fileName: fileName,
        fileSize: fileSize,
        type: type,
        uri: uri,
        showUploadBar: false,
        uploadProgress: 0
      }
      dispatch({ type: actionNames.CARE_ADD_FILE, payload: item })
      ACPCore.trackAction('Consumer Care Add File', {
        ...adobeReducerState,
        'cd.addFile': '1'
      })
    } else {
      setErrorMessage(err)
      setShowErrorMessage(true)
    }
  }

  const deleteUploadItem = (item: CareFile) => {
    dispatch({
      type: actionNames.CARE_FILES_UPDATE_FINISHED,
      payload: { finished: false }
    })
    dispatch({ type: actionNames.CARE_REMOVE_FILE, payload: item })
  }

  const validateFile = (
    fileName?: string,
    fileSize?: number,
    type?: string,
    uri?: string
  ): string => {
    if (!fileName || !fileSize || !type || !uri) {
      return strings.genericErrorMessage
    }

    const index = files.findIndex((f) => f.fileName === fileName)
    if (index !== -1) {
      return strings.fileAlreadySelected
    }

    if (fileSize > MAX_UPLOAD_FILE_SIZE) {
      return strings.formatString(
        strings.fileSizeError,
        MAX_UPLOAD_FILE_SIZE / 1000000
      ) as string
    }

    return ''
  }

  const onDocument = () => {
    DocumentPicker.pick({
      type: [types.pdf, types.doc, types.docx, types.xls, types.xlsx],
      mode: 'open',
      copyTo: 'cachesDirectory'
    })
      .then((response) => {
        if (Array.isArray(response) && response.length > 0) {
          const firstItem = response[0]
          addFile(
            firstItem.name || '',
            firstItem.size || 0,
            firstItem.type || '',
            firstItem.fileCopyUri || ''
          )
        } else {
          setErrorMessage(strings.genericErrorMessage)
          setShowErrorMessage(true)
        }
      })
      .catch((error) => {
        if (!DocumentPicker.isCancel(error)) {
          setErrorMessage(strings.genericErrorMessage)
          setShowErrorMessage(true)
        }
      })
  }

  const launchGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeExtra: true
      },
      (response) => {
        if (!response.didCancel) {
          if (
            response.assets &&
            !response.errorCode &&
            !response.errorMessage
          ) {
            const firstItem = response.assets[0]
            addFile(
              firstItem.fileName || '',
              firstItem.fileSize || 0,
              firstItem.type || '',
              firstItem.uri || ''
            )
          } else {
            setErrorMessage(strings.genericErrorMessage)
            setShowErrorMessage(true)
          }
        }
      }
    )
  }

  const onGallery = () => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then((result) => {
        switch (result) {
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.PHOTO_LIBRARY).then((requestResult) => {
              if (requestResult == 'granted') {
                launchGallery()
              }
            })
            break
          case RESULTS.LIMITED:
          case RESULTS.GRANTED:
            launchGallery()
            break
          case RESULTS.BLOCKED:
            Alert.alert(
              'Share your photo library',
              'We need access to your photo library to upload an image to care',
              [
                { text: 'Cancel' },
                { text: 'Enable access', onPress: Linking.openSettings }
              ]
            )
            break
          case RESULTS.UNAVAILABLE:
          default:
            Alert.alert('default')
            break
        }
      })
      .catch((error) => {})
  }

  const onPick = () => {
    const options = [strings.document, strings.photo, strings.cancel]
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
        userInterfaceStyle: 'light'
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            onDocument()
            break
          case 1:
            onGallery()
            break
          case 2:
          default:
            break
        }
      }
    )
  }

  const submit = () => {
    if (allSuccessful || files.length === 0) {
      constant.switchMessage(
        dispatch,
        'CareFileUploadSuccess',
        files.length !== 0
      )
      ACPCore.trackAction('Case Success', {
        ...adobeReducerState,
        'cd.caseSuccess': '1'
      })
      navigation.pop()
    } else {
      dispatch({
        type: actionNames.CARE_FILES_UPDATE_FINISHED,
        payload: { finished: false }
      })
      setLoading(true)
      dispatch(uploadFiles(handleResponse))
    }
  }

  const handleResponse = (err: ErrorResponse) => {
    setLoading(false)
    if (err.code === 200) {
      if (err.message === 'true') {
        ACPCore.trackAction('Case Success', {
          ...adobeReducerState,
          'cd.caseSuccess': '1'
        })
        constant.switchMessage(dispatch, 'CareFileUploadSuccess', true)
        navigation.pop()
      }
    } else {
      ACPCore.trackAction('Case Fail', {
        ...adobeReducerState,
        'cd.caseFail': '1'
      })
      setErrorMessage(err.message || '')
      setShowErrorMessage(true)
    }
  }

  const renderUploadItem = (item: CareFile, index: number) => {
    return (
      <View
        style={[styles.itemContainer, styles.shadow]}
        key={`UploadItem-${index}`}>
        <View style={styles.itemLeft}>
          <Body>{item.fileName}</Body>
          {item.showUploadBar ? (
            <Progress.Bar
              width={null}
              progress={item.uploadProgress}
              color={colors.green}
              borderWidth={0}
              unfilledColor={colors.greenUnfilled}
              style={styles.progressBar}
            />
          ) : null}
          {item.uploadMessage ? (
            <Description
              style={{
                color: item.uploadMessageError ? colors.red : colors.greenText
              }}>
              {item.uploadMessage}
            </Description>
          ) : null}
        </View>
        {!item.showUploadBar &&
        (!item.uploadMessage || item.uploadMessageError) ? (
          <Pressable onPress={() => deleteUploadItem(item)} disabled={loading}>
            <DeleteCircleIcon
              iconColor={colors.hmPurple}
              circleColor={colors.white}
              circleSize={40}
              circleStyle={styles.shadow}
            />
          </Pressable>
        ) : null}
      </View>
    )
  }

  const renderUploadButton = () => {
    return files.length < MAX_NO_FILES ? (
      <View style={styles.uploadContainer}>
        <SecondaryMediumButton
          onPress={onPick}
          style={styles.uploadButton}
          disabled={loading}>
          {strings.uploadFiles}
        </SecondaryMediumButton>
        <View style={styles.uploadTextContainer}>
          <HeaderSmallTight style={styles.uploadAccepted}>
            {strings.accepted}
          </HeaderSmallTight>
          <Description style={styles.uploadFormats}>
            {strings.formats}
          </Description>
        </View>
      </View>
    ) : null
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HMMessage
        type={'Success'}
        message={strings.messageHeader}
        subMessage={
          strings.formatString(strings.message, caseNumber || '') as string
        }
        display={showSuccess}
        closeable
        containerStyle={styles.message}
        onClose={onClose}
        autoClose
      />
      <HMMessage
        type={'Error'}
        message={strings.error}
        subMessage={errorMessage}
        display={showErrorMessage}
        closeable
        containerStyle={styles.message}
        onClose={errorOnClose}
        autoClose
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <View>
            <Body style={styles.prompt}>{strings.prompt}</Body>
            {files.map((item, index) => {
              return renderUploadItem(item, index)
            })}
            {renderUploadButton()}
          </View>
          <View style={styles.submitButton}>
            <PrimaryLargeButton onPress={submit} disabled={loading}>
              {strings.submit}
            </PrimaryLargeButton>
          </View>
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    messageHeader: 'Success! Your question has been submitted.',
    message:
      "Case number {0} was created for you. It's our goal to respond within one business day.",
    document: 'Select a document',
    photo: 'Select an image',
    cancel: 'Cancel',
    prompt:
      'To include an image or document with your question, attach files below.',
    uploadFiles: 'Upload files',
    submit: 'Submit',
    accepted: 'Accepted formats:',
    formats: 'jpg, .jpeg, .png, .pdf, .docx, .doc, .xlsx, .xls',
    error: 'Error',
    genericErrorMessage: 'Uh-oh, something went wrong. Please try again.',
    fileAlreadySelected: 'You have already chosen this file to upload',
    fileSizeError: 'The file size is too large, the limit is {0}mb.'
  }
})

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    marginHorizontal: vw(20),
    flexGrow: 1
  },
  content: {
    flex: 1,
    justifyContent: 'space-between'
  },
  message: {
    position: 'absolute',
    top: 0,
    width: screenWidth - vw(40),
    alignSelf: 'center'
  },
  itemContainer: {
    padding: vw(20),
    marginBottom: vh(20),
    borderRadius: vw(10),
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  prompt: {
    marginTop: vh(45),
    marginBottom: vh(20)
  },
  shadow: {
    shadowRadius: vw(8),
    shadowOffset: { width: 0, height: vh(2) },
    shadowOpacity: 0.1
  },
  uploadContainer: {
    borderStyle: 'dashed',
    borderWidth: 2,
    borderRadius: vw(10),
    backgroundColor: colors.inputBox,
    borderColor: '#70707080',
    paddingVertical: vh(20),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vh(20)
  },
  uploadButton: {
    paddingHorizontal: vw(10),
    marginBottom: vh(15)
  },
  uploadAccepted: {
    color: colors.grayText,
    marginBottom: vh(5)
  },
  uploadFormats: {
    color: colors.grayText,
    textAlign: 'center'
  },
  uploadTextContainer: {
    alignItems: 'center'
  },
  itemLeft: {
    width: '80%'
  },
  submitButton: {
    marginBottom: vh(20)
  },
  progressBar: {
    marginTop: vh(5)
  }
})
