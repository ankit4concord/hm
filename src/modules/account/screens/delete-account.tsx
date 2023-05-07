import { SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import colors from '@ecom/utils/colors'
import { screenHeight, screenWidth, vh, vw } from '@ecom/utils/dimension'
import LocalizedStrings from 'react-native-localization'
import {
  Body,
  HeaderBody,
  HeaderSmallTightBold
} from '@ecom/components/typography'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { Divider } from 'react-native-elements'
import { Icon } from '@ecom/components/icons'
import {
  OutlinedLargeButton,
  PrimaryLargeButton
} from '@ecom/components/buttons'
import {
  CareCase,
  CartReducerModal,
  ErrorResponse,
  RootReducerModal
} from '@ecom/modals'
import { useSelector, useDispatch } from 'react-redux'
import { createCareCase, getProfile } from '../actions'
import DeviceInfo from 'react-native-device-info'
import { HMMessage } from '@ecom/components/messages/hm-message'
import actionNames from '@ecom/utils/actionNames'
import constant from '@ecom/utils/constant'
import Loader from '@ecom/components/Loader'

type DeleteAccountProps = StackScreenProps<
  AccountStackParamList,
  'AccountDelete'
>

export const DeleteAccount = ({ navigation }: DeleteAccountProps) => {
  const dispatch = useDispatch()
  const profile = useSelector(
    (state: RootReducerModal) => state.authReducer.profile
  )

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const clearError = () => {
    setErrorMessage('')
  }

  const cancel = () => {
    navigation.goBack()
  }

  const signOut = () => {
    dispatch({
      type: actionNames.USER_LOGOUT
    })
    dispatch({
      type: actionNames.TRACK_STATE,
      payload: {
        'cd.authenticatedStatus': 'not logged in'
      }
    })
    dispatch({
      type: actionNames.BASKET_INFO,
      payload: { ...new CartReducerModal() }
    })
  }

  const submit = async () => {
    setLoading(true)
    if (profile && profile.firstName && profile.lastName && profile.email) {
      const careCase: CareCase = {
        Topic_2__c: 'Account Assistance',
        Type_2__c: 'Delete Account',
        Supplied_First_Name__c: profile.firstName,
        Supplied_Last_Name__c: profile.lastName,
        SuppliedEmail: profile.email,
        Supplied_Crown_Rewards_Number__c: profile.crNumber
          ? profile.crNumber.toString()
          : 'No CRN on Profile',
        SuppliedPhone: profile.phone,
        Supplied_Postal_Code__c: profile.address?.zip,
        Origin: 'App',
        Category_2__c: 'Hallmark Cards Now',
        Screen_Size__c: `${screenWidth}x${screenHeight}`,
        Operating_System__c: `${DeviceInfo.getSystemName()} ${DeviceInfo.getSystemVersion()}`,
        Mobile_Device__c: `${DeviceInfo.getBrand()} ${DeviceInfo.getModel()}`,
        Mobile_App_Version__c: DeviceInfo.getReadableVersion()
      }
      dispatch(createCareCase(careCase, handleResponse, true))
    } else {
      handleError()
    }
  }

  const handleResponse = (res: ErrorResponse | ErrorResponse[]) => {
    if (!Array.isArray(res) && res.code === 200) {
      handleSuccess()
    } else {
      handleError()
    }
  }

  const handleSuccess = () => {
    setLoading(false)
    navigation.popToTop()
    signOut()
    constant.switchMessage(dispatch, 'ProfileDeleteAccount', true)
    navigation.popToTop()
  }

  const handleError = () => {
    setLoading(false)
    setErrorMessage('Uh-oh, something went wrong. Please try again.')
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <HMMessage
        type={'Error'}
        message={strings.error}
        subMessage={errorMessage}
        display={!!errorMessage}
        closeable
        containerStyle={styles.message}
        onClose={clearError}
        autoClose
      />
      <View style={styles.container}>
        <View>
          <HeaderBody style={styles.header}>{strings.header}</HeaderBody>
          <Body style={styles.body}>{strings.body}</Body>
          <HeaderSmallTightBold style={styles.byDeleting}>
            {strings.byDeleting}
          </HeaderSmallTightBold>
          <Divider style={styles.divider} />
          <View style={styles.infoListItem}>
            <Icon
              name={'hm_Close_large_thick'}
              size={vw(10)}
              style={styles.icon}
            />
            <HeaderSmallTightBold>{strings.item1}</HeaderSmallTightBold>
          </View>
          <View style={styles.infoListItem}>
            <Icon
              name={'hm_Close_large_thick'}
              size={vw(10)}
              style={styles.icon}
            />
            <HeaderSmallTightBold>{strings.item2}</HeaderSmallTightBold>
          </View>
          <View style={styles.infoListItem}>
            <Icon
              name={'hm_Close_large_thick'}
              size={vw(10)}
              style={styles.icon}
            />
            <HeaderSmallTightBold>{strings.item3}</HeaderSmallTightBold>
          </View>
          <View style={styles.infoListItem}>
            <Icon
              name={'hm_Close_large_thick'}
              size={vw(10)}
              color={colors.darkOrange}
              style={styles.icon}
            />
            <HeaderSmallTightBold style={styles.warning}>
              {strings.item4}
            </HeaderSmallTightBold>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <OutlinedLargeButton style={styles.cancelButton} onPress={cancel}>
            {strings.cancel}
          </OutlinedLargeButton>
          <PrimaryLargeButton style={styles.deleteButton} onPress={submit}>
            {strings.deleteAccount}
          </PrimaryLargeButton>
        </View>
      </View>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    header:
      'Are you sure you want to delete your Hallmark Cards Now AND Hallmark.com account?',
    body: 'This is a shared account login with Hallmark.com and may take up to 45 days to be fully deleted.',
    byDeleting: 'By deleting your account:',
    item1: 'Crown Rewards account and points will be deleted',
    item2: 'Order History will be deleted',
    item3: "Digital Sends can't be accessed",
    item4: 'We cannot restore an account after it has been deleted',
    cancel: 'Cancel',
    deleteAccount: 'Delete Account',
    error: 'Error'
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
    flex: 1,
    justifyContent: 'space-between'
  },
  header: {
    marginTop: vh(35),
    marginBottom: vh(10)
  },
  body: {
    marginBottom: vh(70)
  },
  byDeleting: {
    marginBottom: vh(15),
    alignSelf: 'center'
  },
  divider: {
    marginBottom: vh(20)
  },
  infoListItem: {
    flexDirection: 'row',
    marginBottom: vh(15),
    alignItems: 'center'
  },
  warning: {
    color: colors.darkOrange
  },
  buttonContainer: {
    marginBottom: vh(25),
    flexDirection: 'row'
  },
  cancelButton: {
    width: '35%',
    marginRight: vw(10)
  },
  deleteButton: {
    width: '65%'
  },
  icon: {
    marginRight: vw(10)
  },
  message: {
    position: 'absolute',
    top: 0,
    width: screenWidth - vw(40),
    alignSelf: 'center'
  }
})
