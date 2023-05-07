/* eslint-disable @typescript-eslint/no-unused-expressions */
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import constant from '@ecom/utils/constant'
import React, { createRef, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'
import colors from '@ecom/utils/colors'
import { Description } from '@ecom/components/typography'
import { PrimaryLargeButton } from '@ecom/components/buttons'
import LocalizedStrings from 'react-native-localization'
import { useDispatch, useSelector } from 'react-redux'
import { changePassword } from '../actions'
import { ErrorResponse } from '@ecom/modals/interfaces'
import { HMMessage } from '@ecom/components/messages/hm-message'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { StackScreenProps } from '@react-navigation/stack'
import { RootReducerModal } from '@ecom/modals'
import Loader from '@ecom/components/Loader'
import { ACPCore } from '@adobe/react-native-acpcore'

type ChangePasswordScreenProps = StackScreenProps<
  AccountStackParamList,
  'AccountChangePassword'
>

export const ChangePassword = ({ navigation }: ChangePasswordScreenProps) => {
  const { profileLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )

  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  const [curPassword, setCurPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [curPassError, setCurPassError] = useState('')
  const [curPasswordFocused, setCurPasswordFocused] = useState(false)
  const [newPassError, setNewPassError] = useState('')
  const [confirmPassError, setConfirmPassError] = useState('')
  const [saveEnabled, setSaveEnabled] = useState(false)

  const newPasswordRef = createRef<TextInput>()
  const confirmPasswordRef = createRef<TextInput>()

  const validateForm = () => {
    setCurPassError(constant.validateEmptiness(curPassword, 'Password'))
    setNewPassError(constant.validateChangePassword(curPassword, newPassword))
    setConfirmPassError(
      constant.validateConfirmPassword(newPassword, confirmPassword)
    )

    const validForm = !(curPassError || newPassError || confirmPassError)
    setSaveEnabled(validForm)
  }

  const dispatch = useDispatch()

  const updateText = (key: string, value: string) => {
    switch (key) {
      case 'curPassword':
        setCurPassword(value)
        break
      case 'newPassword':
        setNewPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
      default:
        break
    }
  }

  const submit = () => {
    clearError()
    validateForm()
    if (saveEnabled) {
      dispatch(
        changePassword(
          curPassword,
          newPassword,
          confirmPassword,
          handleResponse
        )
      )
    }
  }

  const valCurPassword = () => {
    if (curPasswordFocused) {
      setCurPassError(constant.validateEmptiness(curPassword, 'Password'))
    }
  }

  const valNewPassword = () => {
    if (newPassword?.length > 0) {
      setNewPassError(constant.validateChangePassword(curPassword, newPassword))
    }
  }

  const valConfirmPassword = () => {
    if (confirmPassword?.length > 0) {
      setConfirmPassError(
        constant.validateConfirmPassword(newPassword, confirmPassword)
      )
    }
  }

  const handleResponse = (err: ErrorResponse) => {
    if (err.code === 200) {
      handleSuccess()
    } else {
      handleError(err)
    }
  }

  const handleSuccess = () => {
    ACPCore.trackAction('Change Password Success', {
      ...adobeReducerState,
      'cd.changePasswordSuccess': '1'
    })
    constant.switchMessage(dispatch, 'ProfileChangePassword', true)
    navigation.pop()
  }

  const handleError = (err: ErrorResponse) => {
    ACPCore.trackAction('Change Password Error', {
      ...adobeReducerState,
      'cd.changePasswordError': '1'
    })
    setErrorMessage(err.message || '')
    setShowErrorMessage(true)
  }

  const clearError = () => {
    setErrorMessage('')
    setShowErrorMessage(false)
  }

  const onFocusCurPassword = () => {
    setCurPasswordFocused(true)
    setCurPassError('')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HMMessage
          type={'Error'}
          message={strings.error}
          subMessage={errorMessage}
          display={showErrorMessage}
          closeable
          containerStyle={styles.message}
          onClose={clearError}
          autoClose
        />
        <View>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              placeholder={strings.currentPassword}
              autoCapitalize={false}
              required
              fieldName={'curPassword'}
              maxLength={40}
              returnKeyType={'next'}
              onFocus={onFocusCurPassword}
              value={curPassword}
              hasError={curPassError}
              secureTextEntry
              onChangeText={updateText}
              onBlur={valCurPassword}
              onSubmitEditing={() => {
                newPasswordRef?.current?.focus()
              }}
            />
          </View>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              textInputRef={newPasswordRef}
              placeholder={strings.newPassword}
              autoCapitalize={false}
              required
              fieldName={'newPassword'}
              maxLength={40}
              returnKeyType={'next'}
              onFocus={() => setNewPassError('')}
              value={newPassword}
              hasError={newPassError}
              secureTextEntry
              onChangeText={updateText}
              onBlur={valNewPassword}
              onSubmitEditing={() => {
                confirmPasswordRef?.current?.focus()
              }}
            />
            <View style={styles.passwordRulesContainer}>
              <Description style={styles.passwordRules}>
                {'\u2022'} {strings.minLength}
              </Description>
              <Description style={styles.passwordRules}>
                {'\u2022'} {strings.cap}
              </Description>
              <Description style={styles.passwordRules}>
                {'\u2022'} {strings.num}
              </Description>
              <Description style={styles.passwordRules}>
                {'\u2022'} {strings.special}
              </Description>
            </View>
          </View>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              textInputRef={confirmPasswordRef}
              placeholder={strings.confirmPassword}
              autoCapitalize={false}
              required
              fieldName={'confirmPassword'}
              maxLength={40}
              returnKeyType={'done'}
              onFocus={() => setConfirmPassError('')}
              value={confirmPassword}
              hasError={confirmPassError}
              secureTextEntry
              onChangeText={updateText}
              onBlur={valConfirmPassword}
            />
          </View>
        </View>
        <PrimaryLargeButton onPress={submit} style={styles.button}>
          {strings.save}
        </PrimaryLargeButton>
      </View>
      {profileLoading ? <Loader /> : null}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
    minLength: 'Minimum length of 8 characters',
    cap: '1 or more uppercase characters',
    num: '1 or more numerical digits',
    special: '1 or more special characters (@!_-#)',
    save: 'Save',
    error: 'Error'
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  content: {
    marginHorizontal: vw(20),
    marginTop: vh(30),
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'space-between'
  },
  fieldContainer: {
    marginBottom: vh(20)
  },
  passwordRulesContainer: {
    marginTop: vh(10)
  },
  passwordRules: {
    color: colors.grayText
  },
  message: {
    position: 'absolute',
    top: 0
  },
  button: {
    marginBottom: vh(25)
  }
})
