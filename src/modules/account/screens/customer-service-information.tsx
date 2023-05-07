import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import colors from '@ecom/utils/colors'
import { screenHeight, screenWidth, vh, vw } from '@ecom/utils/dimension'
import LocalizedStrings from 'react-native-localization'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { useDispatch, useSelector } from 'react-redux'
import { PrimaryLargeButton } from '@ecom/components/buttons'
import { CareInformation, ErrorResponse, RootReducerModal } from '@ecom/modals'
import { Description } from '@ecom/components/typography'
import validateCareInformation from './components/validate-care-information'
import DeviceInfo from 'react-native-device-info'
import { createCareCase } from '../actions'
import { isEmptyDeep } from '@ecom/utils/object-utils'
import { HMMessage } from '@ecom/components/messages/hm-message'
import { PhoneInput } from '@ecom/components/phone-input'
import Loader from '@ecom/components/Loader'

type CustomerServiceInformationProps = StackScreenProps<
  AccountStackParamList,
  'AccountCustomerServiceInformation'
>

export const CustomerServiceInformation = ({
  navigation
}: CustomerServiceInformationProps) => {
  const dispatch = useDispatch()

  const careCase = useSelector(
    (state: RootReducerModal) => state.careReducer.careCase
  )

  const profile = useSelector(
    (state: RootReducerModal) => state.authReducer.profile
  )

  const lastNameRef = createRef<TextInput>()
  const emailRef = createRef<TextInput>()
  const phoneRef = createRef<TextInput>()
  const zipRef = createRef<TextInput>()

  const [form, setForm] = useState({
    Supplied_First_Name__c:
      careCase.Supplied_First_Name__c || profile?.firstName || '',
    Supplied_Last_Name__c:
      careCase.Supplied_Last_Name__c || profile?.lastName || '',
    SuppliedEmail: careCase.SuppliedEmail || profile?.email || '',
    SuppliedPhone: careCase.SuppliedPhone || profile?.phone || '',
    Supplied_Postal_Code__c:
      careCase.Supplied_Postal_Code__c || profile?.address?.zip || ''
  })

  useEffect(() => {
    setForm({
      ...careCase,
      ...{
        Supplied_First_Name__c:
          careCase.Supplied_First_Name__c || profile?.firstName || '',
        Supplied_Last_Name__c:
          careCase.Supplied_Last_Name__c || profile?.lastName || '',
        SuppliedEmail: careCase.SuppliedEmail || profile?.email || '',
        SuppliedPhone: careCase.SuppliedPhone || profile?.phone || '',
        Supplied_Postal_Code__c:
          careCase.Supplied_Postal_Code__c || profile?.address?.zip || ''
      }
    })
  }, [careCase, profile])

  const [errors, setErrors] = useState({} as any)
  const [loading, setLoading] = useState(false)

  const handleChange = (type: any, value: any) => {
    const newCareCase = { ...form, [type]: value }
    setForm(newCareCase)
  }

  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const clearError = () => {
    setErrorMessage('')
    setShowErrorMessage(false)
  }

  const onNext = async () => {
    clearError()
    let errorData = {
      ...errors
    }
    for (const type in form) {
      errorData = {
        ...errorData,
        [type]: validateCareInformation(
          type,
          form[type as keyof CareInformation]
        )
      }
    }
    setErrors(errorData)
    if (isEmptyDeep(errorData)) {
      const completeCareCase = {
        ...form,
        ...{
          Screen_Size__c: `${screenWidth}x${screenHeight}`,
          Operating_System__c: `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`,
          Mobile_Device__c: `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`,
          Mobile_App_Version__c: DeviceInfo.getReadableVersion(),
          Category_2__c: 'Hallmark Cards Now',
          Origin: 'Web'
        }
      }
      setLoading(true)
      dispatch(createCareCase(completeCareCase, handleResponse))
    }
  }

  const handleResponse = (err: ErrorResponse | ErrorResponse[]) => {
    if (!Array.isArray(err) && err.code === 200) {
      handleSuccess()
    } else {
      handleError(err)
    }
  }

  const handleSuccess = () => {
    const state = navigation.getState()
    const routes = [
      ...state.routes.slice(0, -2),
      {
        name: 'AccountCustomerServiceFiles'
      } as any
    ]
    setLoading(false)
    navigation.reset({
      ...state,
      routes,
      index: routes.length - 1
    })
  }

  const handleError = (err: ErrorResponse | ErrorResponse[]): boolean => {
    setLoading(false)
    let error = err
    if (Array.isArray(error)) {
      error =
        error.length > 0
          ? error[0]
          : {
              code: 500,
              message: 'Uh-oh, something went wrong. Please try again.'
            }
    } else if (error.code === 400 && error?.message?.includes('email')) {
      setErrors({
        ...errors,
        ...{
          SuppliedEmail: error.message
        }
      })
      return true
    }

    if (error) {
      setErrorMessage(error.message || '')
      setShowErrorMessage(true)
      return true
    }

    return false
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={vh(75)}>
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
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              placeholder={strings.firstName}
              autoCapitalize={false}
              fieldName={'Supplied_First_Name__c'}
              returnKeyType={'next'}
              value={form.Supplied_First_Name__c}
              onChangeText={handleChange}
              required
              hasError={errors?.Supplied_First_Name__c}
              onSubmitEditing={() => {
                lastNameRef?.current?.focus()
              }}
            />
          </View>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              textInputRef={lastNameRef}
              placeholder={strings.lastName}
              autoCapitalize={false}
              fieldName={'Supplied_Last_Name__c'}
              returnKeyType={'next'}
              value={form.Supplied_Last_Name__c}
              onChangeText={handleChange}
              required
              hasError={errors?.Supplied_Last_Name__c}
              onSubmitEditing={() => {
                emailRef?.current?.focus()
              }}
            />
          </View>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              textInputRef={emailRef}
              placeholder={strings.email}
              autoCapitalize={false}
              fieldName={'SuppliedEmail'}
              returnKeyType={'next'}
              value={form.SuppliedEmail}
              onChangeText={handleChange}
              required
              hasError={errors?.SuppliedEmail}
              keyboardType={'email-address'}
              onSubmitEditing={() => {
                phoneRef?.current?.focus()
              }}
            />
          </View>
          <View style={styles.fieldContainer}>
            <PhoneInput
              textInputRef={phoneRef}
              placeholder={strings.phone}
              autoCapitalize={false}
              fieldName={'SuppliedPhone'}
              returnKeyType={'next'}
              keyboardType={'phone-pad'}
              value={form.SuppliedPhone}
              onChangeText={handleChange}
              hasError={errors?.SuppliedPhone}
              onSubmitEditing={() => {
                zipRef?.current?.focus()
              }}
            />
          </View>
          <Description style={styles.text}>{strings.explain}</Description>
          <View style={styles.zip}>
            <FloatingTextInput
              textInputRef={zipRef}
              placeholder={strings.zip}
              autoCapitalize={false}
              fieldName={'Supplied_Postal_Code__c'}
              keyboardType={'number-pad'}
              returnKeyType={'done'}
              value={form.Supplied_Postal_Code__c}
              onChangeText={handleChange}
              hasError={errors?.Supplied_Postal_Code__c}
            />
          </View>
          <PrimaryLargeButton style={styles.nextButton} onPress={onNext}>
            {strings.next}
          </PrimaryLargeButton>
        </ScrollView>
        {loading ? <Loader /> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    zip: 'Postal Code',
    next: 'Submit',
    explain: 'In case we have questions regarding delivery',
    error: 'Error'
  }
})

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1
  },
  container: {
    marginTop: vh(35),
    marginHorizontal: vw(20)
  },
  fieldContainer: {
    marginTop: vh(20)
  },
  nextButton: {
    marginTop: vh(25),
    marginBottom: vh(100)
  },
  text: {
    color: colors.grayText,
    marginTop: vh(5)
  },
  zip: {
    width: vw(165),
    marginTop: vh(20)
  },
  message: {
    position: 'absolute',
    top: 0,
    width: screenWidth - vw(40),
    alignSelf: 'center'
  }
})
