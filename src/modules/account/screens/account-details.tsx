import {
  AddCircleIcon,
  DeleteCircleIcon,
  EditCircleIcon
} from '@ecom/components/icons'
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { HeaderBody, HeaderSmallTight } from '@ecom/components/typography'
import { Profile, RootReducerModal } from '@ecom/modals'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { Divider } from '@ecom/components/divider'
import { HMMessage } from '@ecom/components/messages/hm-message'
import Loader from '@ecom/components/Loader'
import LocalizedStrings from 'react-native-localization'
import { StackScreenProps } from '@react-navigation/stack'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import { getProfile } from '@ecom/modules/account/actions'
import { useFocusEffect } from '@react-navigation/native'
import screenTypes from '@ecom/utils/screenTypes'
import actionNames from '@ecom/utils/actionNames'
import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/analytics'

type AccountScreenProps = StackScreenProps<
  AccountStackParamList,
  'AccountDetails'
>

export const AccountDetails = ({ navigation }: AccountScreenProps) => {
  const dispatch = useDispatch()

  const showChangePasswordMessage = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.ProfileChangePasswordMessage
  )

  const showEditDetailsMessage = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.ProfileEditDetailsMessage
  )

  const profile = useSelector(
    (state: RootReducerModal) => state.authReducer.profile
  )

  const { profileLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )

  const [currentProfile, setCurrentProfile] = useState({
    nickName: '',
    address: {}
  } as Profile)

  useEffect(() => {
    dispatch(getProfile())
  }, [dispatch])

  useEffect(() => {
    setCurrentProfile(profile)
  }, [profile])

  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const trackAnalytics = (level3: string) => {
    if (appConfigValues?.adobe?.isAnalyticsEnabled) {
      const pageName = `${screenTypes.ACCOUNT}>Account Details>${level3}`
      let accountTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.pageType': screenTypes.ACCOUNT,
        'cd.previousPageName': adobeReducerState['cd.pageName']
      }
      accountTrackObj['cd.level1'] = screenTypes.ACCOUNT
      accountTrackObj['cd.level2'] = 'Account Details'
      accountTrackObj['cd.level3'] = level3
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: accountTrackObj
      })
      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...accountTrackObj
      })
    }
  }

  const changePassword = () => {
    trackAnalytics('Change Password')
    navigation.navigate('AccountChangePassword')
  }
  const deleteAccount = () => {
    trackAnalytics('Delete Account')
    navigation.navigate('AccountDelete')
  }

  const editDetails = () => {
    trackAnalytics('Edit Account Details')
    navigation.navigate('AccountEditDetails')
  }

  const onClose = useCallback(() => {
    constant.switchMessage(dispatch, 'ProfileChangePassword', false)
    constant.switchMessage(dispatch, 'ProfileEditDetails', false)
  }, [dispatch])

  useFocusEffect(
    React.useCallback(() => {
      dispatch(getProfile())
      return () => {
        onClose()
      }
    }, [onClose, dispatch])
  )

  const renderName = () => {
    return (
      <View style={styles.cardContent}>
        <HeaderSmallTight>{strings.name}</HeaderSmallTight>
        <HeaderBody>{`${currentProfile?.firstName} ${currentProfile?.lastName}`}</HeaderBody>
      </View>
    )
  }

  const renderEmail = () => {
    return (
      <View style={styles.cardContent}>
        <HeaderSmallTight>{strings.email}</HeaderSmallTight>
        <HeaderBody>{currentProfile?.email}</HeaderBody>
      </View>
    )
  }

  const minTwoDigits = (n: number | undefined) => {
    return n ? `${n < 10 ? '0' : ''}${n}` : ''
  }

  const renderBirthday = () => {
    const { dateOfBirth } = currentProfile
    const showBirthday = dateOfBirth && dateOfBirth.month && dateOfBirth.day

    return showBirthday ? (
      <View style={styles.cardContent}>
        <HeaderSmallTight>{strings.birthday}</HeaderSmallTight>
        <HeaderBody>
          {`${minTwoDigits(dateOfBirth.month)}/${minTwoDigits(
            dateOfBirth.day
          )}`}
        </HeaderBody>
      </View>
    ) : (
      <View style={[styles.cardContent, styles.cardContentButton]}>
        <HeaderBody>{strings.birthday}</HeaderBody>
        <AddCircleIcon />
      </View>
    )
  }

  const renderAddress = () => {
    const { address } = currentProfile
    const showAddress =
      address &&
      address.addressLine1 &&
      address.city &&
      address.stateCode &&
      address.zip
    const regex = /(\d{5})(\d{4})/
    const zip =
      showAddress && address?.zip?.length === 9
        ? address.zip.replace(regex, '$1-$2')
        : address?.zip
    const addressLine3 = showAddress
      ? `${address.city}, ${address.stateCode} ${zip}`
      : ''

    return showAddress ? (
      <View style={styles.cardContent}>
        <HeaderSmallTight>{strings.address}</HeaderSmallTight>
        <HeaderBody>{address.addressLine1}</HeaderBody>
        {address.addressLine2 ? (
          <HeaderBody>{address.addressLine2}</HeaderBody>
        ) : null}
        <HeaderBody>{addressLine3}</HeaderBody>
      </View>
    ) : (
      <View style={[styles.cardContent, styles.cardContentButton]}>
        <HeaderBody>{strings.address}</HeaderBody>
        <AddCircleIcon />
      </View>
    )
  }

  const renderChangePassword = () => {
    return (
      <View style={styles.card}>
        <TouchableWithoutFeedback onPress={changePassword}>
          <View style={[styles.cardContent, styles.cardContentButton]}>
            <HeaderBody>{strings.changePassword}</HeaderBody>
            <EditCircleIcon />
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  const renderDeleteAccount = () => {
    return (
      <>
        <View style={[styles.card, styles.delete]}>
          <TouchableWithoutFeedback onPress={deleteAccount}>
            <View style={[styles.cardContent, styles.cardContentButton]}>
              <HeaderBody style={styles.deleteAccount}>
                {strings.deleteAccount}
              </HeaderBody>
              <DeleteCircleIcon
                iconColor={colors.darkOrange}
                circleColor={colors.darkOrangeLight}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </>
    )
  }

  const renderAccountDetails = () => {
    return (
      <TouchableWithoutFeedback onPress={editDetails}>
        <View style={styles.card}>
          <View style={[styles.cardContent, styles.cardContentButton]}>
            <HeaderBody>{strings.accountDetails}</HeaderBody>
            <EditCircleIcon />
          </View>
          <Divider />
          {renderName()}
          <Divider />
          {renderEmail()}
          <Divider />
          {renderBirthday()}
          <Divider />
          {renderAddress()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  let successMessage = ''
  if (showChangePasswordMessage) {
    successMessage = strings.password
  } else if (showEditDetailsMessage) {
    successMessage = strings.editDetails
  }

  return currentProfile ? (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HMMessage
          type={'Success'}
          message={successMessage}
          display={showChangePasswordMessage || showEditDetailsMessage}
          closeable
          containerStyle={styles.message}
          onClose={onClose}
          autoClose
        />
        {renderAccountDetails()}
        <Divider style={styles.divider} />
        {renderChangePassword()}
        {renderDeleteAccount()}
      </View>
      {profileLoading ? <Loader /> : null}
    </SafeAreaView>
  ) : null
}

const strings = new LocalizedStrings({
  'en-us': {
    accountDetails: 'Account Details',
    changePassword: 'Change Password',
    address: 'Primary address',
    birthday: 'Birthday',
    email: 'Email address',
    name: 'Name',
    password: 'Password updated!',
    deleteAccount: 'Delete Account',
    editDetails: 'Profile updated!'
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pageBackground,
    flex: 1
  },
  content: {
    marginHorizontal: vw(20),
    marginTop: vh(20)
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: vw(10),
    shadowOffset: { width: 0, height: vh(2) },
    shadowOpacity: 0.1,
    shadowRadius: vw(8)
  },
  cardContent: {
    marginHorizontal: vw(20),
    paddingVertical: vh(15)
  },
  divider: {
    marginVertical: vh(20)
  },
  cardContentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  message: {
    position: 'absolute',
    top: -vh(15)
  },
  delete: {
    marginTop: vh(10),
    marginBottom: vh(25)
  },
  deleteAccount: {
    color: colors.darkOrange
  }
})
