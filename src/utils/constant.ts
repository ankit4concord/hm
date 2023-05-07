import { Dimensions, Linking, Platform } from 'react-native'
import { vh, vw } from './dimension'

import actionNames from './actionNames'
import fonts from './fonts'
import { showMessage } from '@ecom/components/FlashMessage'

/**
 * constant variables used throughout app
 */
const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const nameRegex = /[^a-zA-Z0-9 ]/
// const nameRegex = /^[a-z][a-z\s&'-]*$/
const numberRegex = /^\d+$/
// const passwordRegex=/^[a-zA-Z0-9]+$/
const passRegexRepeat = /.*(.)\1\1/
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,64}$/
const birthMonthRegex = /0[1-9]|1[0-2]/
const birthDateRegex = /^(0[1-9]|[12][0-9]|3[01])$/
const birthDate31DaysRegex = /^(0[1-9]|[12][0-9]|3[0])$/
const birthDateFebRegex = /^(0[1-9]|[12][0-9]|2[09])$/

type MessageScope =
  | 'CareFileUploadSuccess'
  | 'ProfileSignOut'
  | 'ProfileChangePassword'
  | 'ProfileEditDetails'
  | 'ProfileDeleteAccount'
  | 'PaymentDeleteError'
  | 'PaymentDeleteSuccess'

function switchLoader(dispatch: Function, scope: string, isLoading: boolean) {
  dispatch({
    type: actionNames.LOADING,
    payload: { scope: scope, isLoading: isLoading }
  })
}

function switchMessage(
  dispatch: Function,
  scope: MessageScope,
  messageVisible: boolean
) {
  dispatch({
    type: actionNames.SHOW_MESSAGE,
    payload: { scope: scope, showMessage: messageVisible }
  })
}

export const showToastMessage = (message: any, type: any) => {
  showMessage({
    message: message,
    type: type,
    backgroundColor:
      type === 'success' ? '#2C8636' : type === 'danger' ? '#C54C4C' : '#FFF',
    color: type === 'error' || type === 'invalid' ? '#000000' : '#FFF',
    icon: 'none',
    style:
      type === 'error' || type === 'invalid' || type === 'danger'
        ? {
            borderLeftWidth: 10,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderColor: 'red',
            paddingBottom: 24,
            paddingTop: 24,
            marginBottom: 80
          }
        : {
            borderLeftWidth: 10,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderColor: 'red',
            paddingBottom: 24,
            paddingTop: 24,
            marginBottom: 80
          },
    titleStyle: {
      fontSize: vw(15),
      lineHeight: vh(25),
      fontWeight: '500',
      paddingLeft: vw(8),
      paddingBottom: vh(2),
      paddingRight: vw(20),
      paddingTop: type === 'success' ? 2 : 0,
      fontFamily: fonts.MEDIUM
    }
  })
}

export const showToastMessageFromModel = (
  message: any,
  type: any,
  reference: any
) => {
  reference.current.showMessage({
    message: message,
    type: type,
    backgroundColor:
      type === 'success' ? '#2C8636' : type === 'danger' ? '#C54C4C' : '#FFF',
    color: type === 'error' || type === 'invalid' ? '#000000' : '#FFF',
    icon: 'none',
    style:
      type === 'error' || type === 'invalid' || type === 'danger'
        ? {
            borderLeftWidth: 10,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderColor: 'red',
            paddingBottom: 24,
            paddingTop: 24,
            marginBottom: 80,
            elevation: 1000,
            zIndex: 1000
          }
        : {
            borderLeftWidth: 10,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderRightWidth: 1,
            borderColor: 'red',
            paddingBottom: 24,
            paddingTop: 24,
            marginBottom: 80,
            elevation: 1000,
            zIndex: 1000
          },
    titleStyle: {
      fontSize: vw(15),
      lineHeight: vh(25),
      fontWeight: '500',
      paddingLeft: vw(8),
      paddingBottom: vh(2),
      paddingRight: vw(20),
      paddingTop: type === 'success' ? 2 : 0,
      fontFamily: fonts.MEDIUM
    }
  })
}

function validateEmail(email: string) {
  let error = '',
    errorFlag = false
  if (!email) {
    errorFlag = true
    error = 'Please enter your email address'
  } else if (!emailRegex.test(email)) {
    errorFlag = true
    error = 'Please enter valid email address'
  }
  if (errorFlag) {
  }
  return error
}
function validateCRNumber(CRNumber: string) {
  let error = '',
    errorFlag = false
  if (!CRNumber) {
    errorFlag = true
    error = 'Please enter your 12 digit Crown Rewards number.'
  } else if (CRNumber?.length < 12) {
    errorFlag = true
    error = 'Please enter your 12 digit Crown Rewards number.'
  }
  // else if (!emailRegex.test(CRNumber)) {
  //   errorFlag = true
  //   error = 'Please enter valid email address'
  // }
  if (errorFlag) {
  }
  return error
}

function validatePassword(password: string) {
  let error = ''
  if (!password) {
    error = 'Please enter your password'
  } else if (password.length < 8) {
    error = "Please try again. Your password doesn't meet requirements."
  } else if (!passwordRegex.test(password)) {
    error = "Please try again. Your password doesn't meet requirements."
  } else if (password?.toLowerCase().includes('password')) {
    error = 'Cannot contain any form of the word "password"'
  } else if (passRegexRepeat.test(password)) {
    error = 'Character more than 3 time in succession is disallowed'
  }
  return error
}
function validateConfirmPassword(password: string, newPassword: string) {
  let error = ''
  if (!newPassword) {
    error = 'Password is required'
  } else if (newPassword.length < 8) {
    error = "Please try again. Your password doesn't meet requirements."
  } else if (password !== newPassword) {
    error = "The confirmation doesn't match your new password."
  }

  return error
}

function validateChangePassword(password: string, newPassword: string) {
  let error = validatePassword(newPassword)

  if (error) {
    return error
  } else if (password === newPassword) {
    error = "Your new password shouldn't match your old password."
  }

  return error
}

function validateZip(zip: string) {
  let error = ''
  let errorFlag = false
  if (!zip) {
    errorFlag = true
    error = 'ZIP Code is required'
  } else if (zip.length !== 5 && /^\d+$/.test(zip)) {
    errorFlag = true
    error = 'Please enter a valid 5-digit ZIP code.'
  }
  if (errorFlag) {
  }
  return error
}

function validatePhoneNumber(phone: string) {
  let error = ''
  let errorFlag = false
  const phoneNumber = phone?.replace(/[^\d]/g, '')
  if (!phoneNumber) {
    errorFlag = true
    error = 'Phone number is required'
  } else if (phoneNumber.length !== 10) {
    errorFlag = true
    error = 'Please enter valid Phone Number (10 Digits)'
  }
  if (errorFlag) {
    error = 'Please enter valid Phone Number (10 Digits)'
  }
  return error
}

const formatPhoneNumber = (value: string) => {
  if (!value) return value
  const currentValue = value.replace(/[^\d]/g, '')
  const cvLength = currentValue.length
  if (cvLength < 4) return currentValue
  if (cvLength < 7)
    return `${currentValue.slice(0, 3)}-${currentValue.slice(3)}`
  return `${currentValue.slice(0, 3)}-${currentValue.slice(
    3,
    6
  )}-${currentValue.slice(6, 10)}`
}

function validateBirthDate(birthDate: string) {
  const splitDate = birthDate?.split('/')

  let error = '',
    errorFlag = false
  if (birthDate) {
    if (birthDate.length !== 5) {
      error = 'Please enter valid Birthday'
    } else if (splitDate[0] && !birthMonthRegex.test(splitDate[0])) {
      errorFlag = true
      error = 'Please enter valid Birthday'
    } else if (['04', '06', '09', '11'].includes(splitDate[0])) {
      if (splitDate[1] && !birthDate31DaysRegex.test(splitDate[1])) {
        errorFlag = true
        error = 'Please enter valid Birthday'
      }
    } else if (splitDate[0] === '02') {
      if (splitDate[1] && !birthDateFebRegex.test(splitDate[1])) {
        errorFlag = true
        error = 'Please enter valid Birthday'
      }
    } else if (splitDate[1] && !birthDateRegex.test(splitDate[1])) {
      errorFlag = true
      error = 'Please enter valid Birthday'
    }
  }
  if (errorFlag) {
    error = 'Please enter valid Birthday'
  }

  return error
}

function validateName(name: string) {
  let error = ''
  if (!name || name === undefined) {
    error = 'This field is mandatory'
  } else if (nameRegex.test(name)) {
    error = 'No special characters, please.'
  } else {
    error = ''
  }

  return error
}

function validateNames(name: string, field: string) {
  let error = ''
  if (!name) {
    error = 'Please enter your ' + field.toLowerCase()
  } else if (nameRegex.test(name)) {
    error = 'No special characters, please.'
  } else if (
    (name?.length < 2 || name?.length > 15) &&
    field.toLowerCase() == 'first name'
  ) {
    error = 'Please enter from 2 up to 15 characters.'
  } else if (
    (name?.length < 2 || name?.length > 20) &&
    field.toLowerCase() == 'last name'
  ) {
    error = 'Please enter from 2 up to 20 characters.'
  } else {
    error = ''
  }
  return error
}
function validateEmptiness(name: string, field: string) {
  let error = ''
  if (!name) {
    error = 'Please enter your ' + field.toLowerCase()
  } else {
    error = ''
  }
  return error
}

function validateCoupon(code: string) {
  let error = ''

  if (!code) {
    error = 'Something doesn’t look right 🤔'
  } else if (!numberRegex.test(code)) {
    error = 'Something doesn’t look right 🤔'
  } else {
    error = ''
  }
  return error
}

//open apple map with given lat long
const openMap = (item: any) => {
  const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
  const latLng = `${item?.latitude},${item?.longitude}`
  const label = item?.name
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label})`
  })
  Linking.openURL(url || '')
}

const getMonthName = (month: any) => {
  const d = new Date()
  d.setMonth(month - 1)
  const monthName = d?.toLocaleString('default', { month: 'short' })
  return monthName
}

const InjectedScript = ` const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);true; `
const mmToPx = (width: any, height: any) => {
  const maxHeight = Dimensions.get('window').height // or something else
  const maxWidth = Dimensions.get('window').width
  const ratio = Math.min(maxWidth / width, maxHeight / height)
  var convert = { width: width * ratio, height: height * ratio }
  return convert
}

const moneyFormatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const constant = {
  validateEmail,
  switchLoader,
  validatePassword,
  validateZip,
  validatePhoneNumber,
  formatPhoneNumber,
  validateBirthDate,
  validateName,
  validateNames,
  numberRegex,
  validateCoupon,
  openMap,
  validateConfirmPassword,
  getMonthName,
  InjectedScript,
  mmToPx,
  validateEmptiness,
  switchMessage,
  validateChangePassword,
  validateCRNumber,
  moneyFormatter
}
export default constant
