import {
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  View
} from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import { screenWidth, vh, vw } from '@ecom/utils/dimension'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import LocalizedStrings from 'react-native-localization'
import { useDispatch, useSelector } from 'react-redux'
import {
  ErrorResponse,
  Profile,
  ProfileAddress,
  RootReducerModal
} from '@ecom/modals'
import { getProfile, updateProfile } from '../actions'
import Loader from '@ecom/components/Loader'
import { HMMessage } from '@ecom/components/messages/hm-message'
import { PrimaryLargeButton } from '@ecom/components/buttons'
import { Description } from '@ecom/components/typography'
import colors from '@ecom/utils/colors'
import { Birthday } from './components/birthday'
import { AddressComponent } from './components/address'
import validateEditDetails from './components/validate-edit-details'
import constant from '@ecom/utils/constant'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { isEmptyDeep, lowercaseKeys } from '@ecom/utils/object-utils'
import { ACPCore } from '@adobe/react-native-acpcore'

type EditDetailsScreenProps = StackScreenProps<
  AccountStackParamList,
  'AccountEditDetails'
>

export const EditDetails = ({ navigation }: EditDetailsScreenProps) => {
  const dispatch = useDispatch()
  const { profileLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const profile = useSelector(
    (state: RootReducerModal) => state.authReducer.profile
  )

  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  useEffect(() => {
    setCurrentProfile(profile)
  }, [profile])

  const [currentProfile, setCurrentProfile] = useState({
    address: {},
    dateOfBirth: {}
  } as Profile)

  const [uspsCorrectedAddress, setUSPSCorrectedAddress] =
    useState<ProfileAddress>({})

  const [showAddressModal, setShowAddressModal] = useState(false)

  const [errors, setErrors] = useState({} as any)

  const lastNameRef = createRef<TextInput>()
  const emailRef = createRef<TextInput>()

  const handleChange = (type: any, value: any) => {
    const newProfile = { ...currentProfile, [type]: value }
    setCurrentProfile(newProfile)

    if (!['dateOfBirth', 'address'].includes(type)) {
      const newErrors = { ...errors, [type]: validateEditDetails(type, value) }
      setErrors(newErrors)
    }
  }

  const updateBirthDay = (month: string, day: string) => {
    const monthNum = Number(month) || null
    const dayNum = Number(day) || null
    handleChange('dateOfBirth', { day: dayNum, month: monthNum })
  }

  const updateAddress = (address: ProfileAddress) => {
    handleChange('address', address)
  }

  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const clearError = () => {
    setErrorMessage('')
    setShowErrorMessage(false)
  }

  const submit = (newProfile?: Profile) => {
    clearError()
    let errorData = {
      ...errors
    }
    const profileToSubmit = newProfile || currentProfile
    for (const type in profileToSubmit) {
      errorData = {
        ...errorData,
        [type]: validateEditDetails(
          type,
          profileToSubmit[type as keyof Profile]
        )
      }
    }
    setErrors(errorData)
    if (isEmptyDeep(errorData)) {
      dispatch(updateProfile(profileToSubmit, handleResponse))
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
    ACPCore.trackAction('Edit Account Details Success', {
      ...adobeReducerState,
      'cd.editAccountDetailsSuccess': '1'
    })
    constant.switchMessage(dispatch, 'ProfileEditDetails', true)
    navigation.pop()
  }

  const handleError = (err: ErrorResponse | ErrorResponse[]) => {
    ACPCore.trackAction('Edit Account Details Error', {
      ...adobeReducerState,
      'cd.editAccountDetailsError': '1'
    })
    if (!Array.isArray(err) && err.code === 500) {
      setErrorMessage(err.message || '')
      setShowErrorMessage(true)
    } else if (Array.isArray(err)) {
      const correctedAddress = err.find((x) => x.field === 'address')
      if (correctedAddress) {
        handleAddressCorrection(correctedAddress.message)
      } else {
        let errorData = {
          ...errors
        }
        err.forEach((e) => {
          if (e.parentField && e.field) {
            errorData = {
              ...errorData,
              [e.parentField]: {
                ...errorData[e.parentField],
                [e.field]: e.message || undefined
              }
            }
          } else if (e.field) {
            errorData = {
              ...errorData,
              [e.field]: e.message || undefined
            }
          } else {
            setErrorMessage(e.message || '')
            setShowErrorMessage(true)
          }
        })
        setErrors(errorData)
      }
    }
  }

  const handleAddressCorrection = (correctedValue: string | undefined) => {
    if (correctedValue) {
      try {
        const correctedAddress: any = JSON.parse(correctedValue)
        setUSPSCorrectedAddress(lowercaseKeys(correctedAddress))
        setShowAddressModal(true)
      } catch (e) {
        setErrorMessage('Uh-oh, something went wrong. Please try again.')
        setShowErrorMessage(true)
      }
    }
  }

  const okBottomSheet = (correctedAddress: ProfileAddress) => {
    updateAddress(correctedAddress)
    setShowAddressModal(false)
    submit({ ...currentProfile, ...{ address: correctedAddress } })
  }

  const hideAddressModal = () => {
    setShowAddressModal(false)
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={'position'}
        keyboardVerticalOffset={vh(100)}>
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
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.fieldContainer}>
            <FloatingTextInput
              placeholder={strings.firstName}
              autoCapitalize={false}
              required
              fieldName={'firstName'}
              maxLength={40}
              returnKeyType={'next'}
              onChangeText={handleChange}
              value={currentProfile?.firstName || ''}
              hasError={errors?.firstName}
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
              required
              fieldName={'lastName'}
              maxLength={40}
              returnKeyType={'next'}
              onChangeText={handleChange}
              value={currentProfile?.lastName || ''}
              hasError={errors?.lastName}
              onSubmitEditing={() => {
                emailRef?.current?.focus()
              }}
            />
          </View>
          <View style={styles.emailContainer}>
            <FloatingTextInput
              textInputRef={emailRef}
              placeholder={strings.email}
              autoCapitalize={false}
              required
              fieldName={'email'}
              maxLength={40}
              returnKeyType={'done'}
              onChangeText={handleChange}
              value={currentProfile?.email || ''}
              hasError={errors?.email}
              keyboardType={'email-address'}
            />
          </View>
          <Description style={styles.descriptionText}>
            {strings.emailWarning}
          </Description>
          <Birthday
            day={currentProfile?.dateOfBirth?.day || 0}
            month={currentProfile?.dateOfBirth?.month || 0}
            onChange={updateBirthDay}
            error={errors?.dateOfBirth}
          />
          <AddressComponent
            {...currentProfile?.address}
            onChange={updateAddress}
            addressErrors={errors?.address}
            uspsCorrectedAddress={uspsCorrectedAddress}
            okBottomSheet={okBottomSheet}
            showAddressModal={showAddressModal}
            hideAddressModal={hideAddressModal}
          />
          <PrimaryLargeButton onPress={submit}>
            {strings.save}
          </PrimaryLargeButton>
        </ScrollView>
      </KeyboardAvoidingView>
      {profileLoading ? <Loader /> : null}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    emailWarning:
      "The email address listed here can be used to sign in to Hallmark. If you've opted in, we'll send Crown Rewards information here, as well as special offers and promo codes.",
    error: 'Error',
    save: 'Save'
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1
  },
  content: {
    marginHorizontal: vw(20),
    marginTop: vh(30),
    paddingBottom: vh(100),
    flexDirection: 'column',
    flexGrow: 1
  },
  message: {
    position: 'absolute',
    top: 0,
    width: screenWidth - vw(40),
    alignSelf: 'center'
  },
  fieldContainer: {
    marginBottom: vh(20)
  },
  emailContainer: {
    marginBottom: vh(10)
  },
  descriptionText: {
    color: colors.grayText,
    marginBottom: vh(20)
  }
})
