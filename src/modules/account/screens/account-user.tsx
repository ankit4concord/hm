import { CartReducerModal, Profile, RootReducerModal } from '@ecom/modals'
import {
  Description,
  Header,
  HeaderMedium,
  LabelName
} from '@ecom/components/typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { Divider } from '@ecom/components/divider'
import { Icon } from '@ecom/components/icons'
import Loader from '@ecom/components/Loader'
import LocalizedStrings from 'react-native-localization'
import RBSheet from 'react-native-raw-bottom-sheet'
import { SignOutBottomSheet } from './components/sign-out-bottom-sheet'
import { StackScreenProps } from '@react-navigation/stack'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import { getProfile } from '@ecom/modules/account/actions'
import screenTypes from '@ecom/utils/screenTypes'
import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/analytics'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import DeviceInfo from 'react-native-device-info'
import { AccountOverview } from '@ecom/assets/svg'
import {
  PrimaryMediumButton,
  SecondaryMediumButton
} from '@ecom/components/buttons'
import { useFocusEffect } from '@react-navigation/native'
import { loginAsGuest } from '@ecom/modules/auth/action'

type AccountScreenProps = StackScreenProps<
  AccountStackParamList,
  'AccountOverview'
>

export const AccountUser = ({ navigation }: AccountScreenProps) => {
  const dispatch = useDispatch()
  const { isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const profile = useSelector(
    (state: RootReducerModal) => state.authReducer.profile
  )
  const { profileLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const showDeleteAlert = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.ProfileDeleteAccountMessage
  )

  const [currentProfile, setCurrentProfile] = useState({
    nickName: ''
  } as Profile)
  const bottomSheetRef = useRef<RBSheet>(null)

  useEffect(() => {
    if (!isGuestMode) {
      dispatch(getProfile())
    }
  }, [dispatch, isGuestMode])

  useEffect(() => {
    setCurrentProfile(profile)
  }, [profile])

  const onClose = useCallback(() => {
    constant.switchMessage(dispatch, 'ProfileDeleteAccount', false)
  }, [dispatch])

  useEffect(() => {
    if (showDeleteAlert) {
      Alert.alert(
        strings.delete,
        strings.deleteMessage,
        [{ text: strings.okay, onPress: onClose }],
        { onDismiss: onClose, cancelable: true }
      )
    }
  }, [onClose, showDeleteAlert])

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        onClose()
      }
    }, [onClose])
  )

  const signOut = () => {
    dispatch({
      type: actionNames.USER_LOGOUT
    })
    dispatch({
      type: actionNames.TRACK_STATE,
      payload: {
        'cd.authenticatedStatus': 'not logged in',
        'cd.consumerID': undefined
      }
    })
    ACPCore.trackAction('Sign Out', {
      ...adobeReducerState,
      'cd.signOut': '1',
      'cd.authenticatedStatus': 'not logged in',
      'cd.consumerID': undefined
    })
    dispatch({
      type: actionNames.BASKET_INFO,
      payload: { ...new CartReducerModal() }
    })
    constant.switchMessage(dispatch, 'ProfileSignOut', true)
    closeBottomSheet()
    dispatch(
      loginAsGuest(() => {
        navigate(screenNames.BOTTOM_TAB, {
          screen: screenNames.ACCOUNT_NAVIGATOR
        })
      })
    )
  }

  const closeBottomSheet = () => {
    bottomSheetRef?.current?.close()
  }
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const trackAnalytics = (level2: string) => {
    if (appConfigValues?.adobe?.isAnalyticsEnabled) {
      const pageName = `${screenTypes.ACCOUNT}>${level2}`
      let accountTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.pageType': screenTypes.ACCOUNT,
        'cd.previousPageName': adobeReducerState['cd.pageName']
      }
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: accountTrackObj
      })
      accountTrackObj['cd.level1'] = screenTypes.ACCOUNT
      accountTrackObj['cd.level2'] = level2
      accountTrackObj['cd.level3'] = ''
      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...accountTrackObj
      })
    }
  }

  const accountDetails = () => {
    trackAnalytics('Account Details')
    navigation.navigate('AccountDetails')
  }

  const orderHistory = () => {
    trackAnalytics('Order History')
    navigation.navigate('AccountOrderHistory')
  }

  const paymentMethods = () => {
    trackAnalytics('Payment Methods')
    navigation.navigate('AccountPayments')
  }

  const consumerCare = () => {
    trackAnalytics('Consumer Care')
    navigation.navigate('AccountCustomerService')
  }

  const digitalSends = () => {
    //trackAnalytics('Digital Sends')
    //navigation.navigate('AccountDigitalOrderHistory')
  }

  const privacyPolicy = () => {
    trackAnalytics('Terms & Privacy Policy')
    navigation.navigate('AccountPrivacyPolicy')
  }

  const closeNavigation = () => {
    navigate(screenNames.BOTTOM_TAB, {
      screen: screenNames.ACCOUNT_NAVIGATOR
    })
  }

  const signInPress = () => {
    navigate(screenNames.AUTH_NAVIGATOR, {
      screen: screenNames.LOGIN,
      params: {
        closeNavigation: closeNavigation,
        successNavigation: closeNavigation
      }
    })
  }
  const signUpPress = () => {
    navigate(screenNames.AUTH_NAVIGATOR, {
      screen: screenNames.LOGIN,
      params: {
        to: 1,
        closeNavigation: closeNavigation,
        successNavigation: closeNavigation
      }
    })
  }

  const renderHeader = () => {
    const header = currentProfile?.nickname
      ? (strings.formatString(
          strings.commaSpace,
          currentProfile.nickname
        ) as string)
      : ''
    return isGuestMode ? (
      <View style={styles.guestHeaderRow}>
        <Header>{strings.overview}</Header>
      </View>
    ) : (
      <View style={styles.headerRow}>
        <HeaderMedium style={styles.headerText}>
          {strings.formatString(strings.header, header)}
        </HeaderMedium>
        <TouchableOpacity
          onPress={() => {
            bottomSheetRef?.current?.open()
          }}
          style={styles.signOutContainer}>
          <LabelName style={styles.signOutText}>{strings.signOut}</LabelName>
          <Icon
            size={vh(16)}
            name={'sign_out_svg'}
            allowFontScaling={false}
            color={colors.grayText}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const renderGuest = () => {
    return (
      <View>
        {isGuestMode ? (
          <View style={styles.guestContainer}>
            <View style={styles.signInContainer}>
              <SecondaryMediumButton
                style={styles.createAccountButton}
                onPress={signUpPress}>
                {strings.create}
              </SecondaryMediumButton>
              <PrimaryMediumButton onPress={signInPress}>
                {strings.signIn}
              </PrimaryMediumButton>
            </View>
            <View style={styles.imageContainer}>
              <View style={styles.image}>
                <AccountOverview
                  preserveAspectRatio={'xMinYMin slice'}
                  height={'100%'}
                  width={'100%'}
                />
              </View>
            </View>
          </View>
        ) : null}
        {renderVersion()}
      </View>
    )
  }

  const renderVersion = () => {
    return (
      <Description style={isGuestMode ? styles.versionGuest : styles.version}>
        {strings.formatString(strings.version, DeviceInfo.getReadableVersion())}
      </Description>
    )
  }

  const renderAccount = () => {
    return (
      <View style={isGuestMode ? styles.guestContent : styles.content}>
        {renderHeader()}
        <Divider />
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={isGuestMode ? signInPress : accountDetails}>
          <Icon
            size={vh(24)}
            name={'hm_Account-thick'}
            allowFontScaling={false}
            style={styles.icon}
            color={colors.blackText}
          />
          <Header>{strings.details}</Header>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={isGuestMode ? signInPress : orderHistory}>
          <Icon
            size={vh(24)}
            name={'hm_Orders-thick'}
            allowFontScaling={false}
            style={styles.icon}
            color={colors.blackText}
          />
          <Header>{strings.orders}</Header>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={isGuestMode ? signInPress : digitalSends}>
          <Icon
            size={vh(24)}
            name={'hm_DigitalSend-thick'}
            allowFontScaling={false}
            style={styles.icon}
          />
          <Header>{strings.digital}</Header>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={styles.rowContainer}
          onPress={isGuestMode ? signInPress : paymentMethods}>
          <Icon
            size={vh(24)}
            name={'hm_PaymentMethods-thick'}
            allowFontScaling={false}
            style={styles.icon}
          />
          <Header>{strings.payments}</Header>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.rowContainer} onPress={consumerCare}>
          <Icon
            size={vh(24)}
            name={'hm_Question-thick'}
            allowFontScaling={false}
            style={styles.icon}
          />
          <Header>{strings.care}</Header>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.rowContainer} onPress={privacyPolicy}>
          <Icon
            size={vh(24)}
            name={'hm_Legal-thick'}
            allowFontScaling={false}
            style={styles.icon}
          />
          <Header>{strings.privacy}</Header>
        </TouchableOpacity>
        <Divider />
        {renderGuest()}
        <SignOutBottomSheet
          bottomSheetRef={bottomSheetRef}
          close={closeBottomSheet}
          ok={signOut}
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {renderAccount()}
        {profileLoading ? <Loader /> : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    header: 'Hey{0}',
    commaSpace: ', {0}',
    signOut: 'Sign out',
    details: 'Account Details',
    orders: 'Orders',
    payments: 'Payment Methods',
    care: 'Consumer Care',
    privacy: 'Terms & Privacy Policy',
    digital: 'Digital Sends',
    overview: 'Account Overview',
    version: 'App Version v{0}',
    sendSmile: 'Send Them a Smile',
    loginPrompt:
      'You can send your personalized card right to their mailbox or instantly via text or email when you sign in.',
    create: 'Create an Account',
    signIn: 'Sign In',
    delete: 'Delete Account Submitted',
    deleteMessage:
      'Your request to delete your account has been submitted, and you will receive a confirmation email',
    okay: 'Okay'
  }
})

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1
  },
  container: {
    marginHorizontal: vw(20)
  },
  guestContent: {
    marginTop: vh(15)
  },
  content: {
    marginTop: vh(50)
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vh(35)
  },
  guestHeaderRow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vh(25)
  },
  headerText: {
    flex: 1,
    flexWrap: 'wrap'
  },
  signOutContainer: {
    flexDirection: 'row'
  },
  signOutText: {
    color: colors.grayText,
    marginRight: vw(5)
  },
  icon: {
    marginRight: vw(15)
  },
  rowContainer: {
    paddingVertical: vh(20),
    flexDirection: 'row',
    alignItems: 'center'
  },
  message: {
    position: 'absolute',
    top: 0
  },
  versionGuest: {
    marginTop: vh(-15),
    color: colors.grayText,
    alignSelf: 'center'
  },
  version: {
    marginTop: vh(20),
    color: colors.grayText,
    alignSelf: 'center'
  },
  guestContainer: {
    flexDirection: 'row',
    marginTop: vh(15)
  },
  signInContainer: {
    flex: 0.7,
    marginRight: vw(20)
  },
  image: {
    width: vw(60),
    height: vh(135),
    marginTop: vh(20),
    alignSelf: 'center'
  },
  createAccountButton: {
    marginTop: vh(20),
    marginBottom: vh(10)
  },
  imageContainer: {
    flex: 0.3
  }
})
