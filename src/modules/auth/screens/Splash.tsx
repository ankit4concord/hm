import * as Keychain from 'react-native-keychain'

import { ACPCore, ACPMobilePrivacyStatus } from '@adobe/react-native-acpcore'
import { Alert, AppState, Linking, View, NativeModules } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchHomeData, getCategoryList } from '@ecom/modules/home/action'
//Import actions
import {
  getAppConfig,
  loginAsGuest,
  signIn,
  updateInternetField
} from '../action'
import { useDispatch, useSelector } from 'react-redux'

import { ACPAnalytics } from '@adobe/react-native-acpanalytics'
import { AEPAssurance } from '@adobe/react-native-aepassurance'
import AWS from 'aws-sdk'
import { Auth } from './Auth'
import Common from '@ecom/utils/Common'
import DeepLinking from 'react-native-deep-linking'
import DeviceInfo from 'react-native-device-info'
import Lottie from 'lottie-react-native'
import NetInfo from '@react-native-community/netinfo'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { RootReducerModal } from '@ecom/modals'
import SplashScreen from 'react-native-splash-screen'
import actionNames from '@ecom/utils/actionNames'
import awsconfig from '@ecom/aws-exports'
import colors from '@ecom/utils/colors'
import { getBasket } from '@ecom/modules/cart/actions'
import { getPDPdetails } from '@ecom/modules/shop/action'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'
import constant, { showToastMessage } from '@ecom/utils/constant'
import strings from '@ecom/utils/strings'

export interface SplashProps {
  navigation: any
}

function randomString(length: number = 16) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function Splash(props: SplashProps) {
  const dispatch = useDispatch()

  let didLaunchFromPush = false
  const [authenticate, setAuthenticate] = useState(false)
  const [fetchRemoteConfigData, setFetchRemoteConfigData] = useState(false)
  let { isInstalled, uuid, isOnboarded, isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )

  let { riskifiedToken } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  const clearKeyChain = async () => {
    const bundleId = DeviceInfo.getBundleId()
    await Keychain.resetGenericPassword({ service: bundleId })
  }
  useEffect(() => {
    if (!isInstalled) clearKeyChain()
  }, [isInstalled])

  useEffect(() => {
    if (adobeReducerState && !adobeReducerState['cd.experienceCloudID']) {
      const { ACPIdentity } = NativeModules
      ACPIdentity.getExperienceCloudId().then((experienceCloudId: string) => {
        if (experienceCloudId) {
          dispatch({
            type: actionNames.TRACK_STATE,
            payload: {
              'cd.experienceCloudID': experienceCloudId
            }
          })
        }
      })
    }
  }, [adobeReducerState['cd.experienceCloudID']])

  useEffect(() => {
    ACPCore.setPrivacyStatus(ACPMobilePrivacyStatus.OPT_IN)
    ACPAnalytics.extensionVersion().then((version) =>
      console.log('AdobeExperienceSDK: ACPAnalytics version: ' + version)
    )
    ACPCore.getLogLevel().then((level) =>
      console.log('AdobeExperienceSDK: Log Level = ' + level)
    )
    ACPAnalytics.getTrackingIdentifier().then((identifier) =>
      console.log('AdobeExperienceSDK: Tracking identifier: ' + identifier)
    )
    AEPAssurance.extensionVersion().then((version) =>
      console.log('AdobeExperienceSDK: AEPAssurance version: ' + version)
    )
  }, [])

  const handleUrl = ({ url }) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        DeepLinking.evaluateUrl(url)
      }
    })
  }

  useEffect(() => {
    DeepLinking.addScheme(strings.scheme)

    const homeRegex = /\/home((\?|\&)?[^=]+\=([^&]+)(.*))?/g
    DeepLinking.addRoute(homeRegex, ({ scheme, path, match }) => {
      console.log(`*** DeepLinking home response ${match[1]}`)
      props.navigation.navigate(screenNames.HOME_NAVIGATOR, {
        screen: screenNames.HOME_SCREEN,
        params: {
          from: 'deeplink'
        }
      })
    })

    const discoverRegex = /\/discover((\?|\&)?[^=]+\=([^&]+)(.*))?/g
    DeepLinking.addRoute(discoverRegex, ({ scheme, path, match }) => {
      console.log(`*** DeepLinking discover response ${match[1]}`)
      props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
        screen: screenNames.CLP_SCREEN,
        params: {
          from: 'deeplink'
        }
      })
    })

    const plpRegex = /\/plp\/([^?]+)((\?|\&)?[^=]+\=([^&]+)(.*))?/g
    DeepLinking.addRoute(plpRegex, ({ scheme, path, match }) => {
      console.log(`*** DeepLinking response ${match[1]}`)
      if (match[4]) {
        dispatch({
          type: actionNames.MISC_INFO,
          payload: {
            icid: match[4]
          }
        })
      }
      props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
        screen: screenNames.PLP,
        params: {
          from: 'deeplink',
          categoryLabel: match[1],
          id: 'mobile-app-categories' // response?.id,
        }
      })
    })

    const productRegex = /\/product\/([^?]+)((\?|\&)?[^=]+\=([^&]+)(.*))?/g
    DeepLinking.addRoute(productRegex, ({ scheme, path, match }) => {
      console.log(`*** DeepLinking response ${match[1]}`)
      if (match[4]) {
        dispatch({
          type: actionNames.MISC_INFO,
          payload: {
            icid: match[4]
          }
        })
      }
      dispatch(getPDPdetails(match[1]))
      props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
        screen: screenNames.PDP_SCREEN,
        params: {
          from: 'deeplink',
          product: {
            item: {
              id: match[1]
            }
          }
        }
      })
    })

    const cartRegex = /\/cart((\?|\&)?[^=]+\=([^&]+)(.*))?/g
    DeepLinking.addRoute(cartRegex, ({ scheme, path, match }) => {
      console.log(`*** DeepLinking cart response ${match[1]}`)
      dispatch(
        getBasket(() => {
          props.navigation.navigate(screenNames.CART_NAVIGATOR, {
            screen: screenNames.CART_SCREEN,
            params: {
              from: 'deeplink'
            }
          })
        })
      )
    })

    const paypalCancelRegex = /\/paypal\/cancel\?token\=(.*)/g
    const paypalSuccessRegex = /\/paypal\/success\?token\=(.*)\&PayerID=(.*)/g
    DeepLinking.addRoute(paypalCancelRegex, ({ scheme, path, match }) => {
      console.log(`*** DeepLinking Paypal Token = ${match[1]}`)
      ACPCore.trackAction('PayPal Cancel', {
        ...adobeReducerState,
        'cd.deeplink': '1',
        'cd.paypalCancel': '1'
      })
      props.navigation.goBack()
    })

    DeepLinking.addRoute(paypalSuccessRegex, ({ scheme, path, match }) => {
      console.log(
        `DeepLinking Paypal Token = ${match[1]} && Paypal PayerID = ${match[2]}`
      )
      ACPCore.trackAction('PayPal Success', {
        ...adobeReducerState,
        'cd.deeplink': '1',
        'cd.paypalSuccess': '1'
      })
      props.navigation.goBack()
      props.navigation.navigate(screenNames.PAYPAL_CHECKOUT_SCREEN, {
        paypalPayerID: match[2]
      })
    })

    DeepLinking.addRoute('/payment-delete/:status', (response: any) => {
      console.log(
        `*** DeepLinking Delete Payment --- status = ${response?.status}`
      )
      let messageType:
        | undefined
        | 'PaymentDeleteSuccess'
        | 'PaymentDeleteError' = undefined
      if (response?.status === 'success') {
        messageType = 'PaymentDeleteSuccess'
      } else if (response?.status === 'error') {
        messageType = 'PaymentDeleteError'
      }
      if (messageType) {
        constant.switchMessage(dispatch, messageType, true)
      }
      props.navigation.navigate(screenNames.BOTTOM_TAB, {
        screen: screenNames.ACCOUNT_NAVIGATOR,
        params: {
          screen: screenNames.ACCOUNT_PAYMENTS_SCREEN
        }
      })
    })

    DeepLinking.addRoute('/order-history', () => {
      console.log(`*** DeepLinking Order History`)
      props.navigation.navigate(screenNames.BOTTOM_TAB, {
        screen: screenNames.ACCOUNT_NAVIGATOR,
        params: {
          screen: screenNames.ACCOUNT_ORDERS_SCREEN
        }
      })
    })

    Linking.addEventListener('url', handleUrl)
    authenticate &&
      dispatch(
        loginAsGuest(() => {
          props.navigation.reset({
            index: 1,
            routes: [{ name: screenNames.BOTTOM_TAB }]
          })
        })
      )

    if (!isOnboarded) {
      props.navigation.navigate(screenNames.AUTH_NAVIGATOR, {
        screen: screenNames.ONBOARDING_SCREEN
      })
      dispatch({
        type: actionNames.AUTH_REDUCER,
        payload: {
          isOnboarded: true
        }
      })
    }
  }, [])

  const getOpenIdToken = async () => {
    var cognitoIdentity = new AWS.CognitoIdentity()

    if (!uuid || uuid == '') {
      cognitoIdentity.getId(
        {
          IdentityPoolId: awsconfig.aws_cognito_identity_pool_id
        },
        (err, data: any) => {
          if (!err) {
            const aws_uuid = data?.IdentityId?.substr(
              data?.IdentityId?.indexOf(':') + 1
            )
            dispatch({
              type: actionNames.AUTH_REDUCER,
              payload: { uuid: aws_uuid }
            })
            cognitoIdentity.getOpenIdToken(
              {
                IdentityId: data?.IdentityId
              },
              (err, data: any) => {
                if (!err) {
                  dispatch({
                    type: actionNames.AUTH_REDUCER,
                    payload: { awsToken: data.Token }
                  })
                  setTimeout(() => {
                    fetchRemoteConfig()
                  }, 2000)
                }
              }
            )
          } else {
            console.log('error', err)
          }
        }
      )
    } else {
      cognitoIdentity.getOpenIdToken(
        {
          IdentityId: `${awsconfig.aws_cognito_region}:${uuid}`
        },
        (err, data: any) => {
          if (!err) {
            dispatch({
              type: actionNames.AUTH_REDUCER,
              payload: { awsToken: data.Token }
            })

            setTimeout(() => {
              fetchRemoteConfig()
            }, 2000)
          }
        }
      )
    }
  }

  useEffect(() => {
    if (!isInstalled) clearKeyChain()
  }, [isInstalled])

  useEffect(() => {
    PushNotificationIOS.addEventListener('register', (deviceToken) => {
      console.log(`*** APNS register deviceToken = ${deviceToken}`)
      dispatch({
        type: actionNames.PUSH_AUTH,
        payload: {
          apns_token: deviceToken
        }
      })
    })
    PushNotificationIOS.addEventListener('registrationError', (error) => {
      console.log(`onRegisterNotification error = ${JSON.stringify(error)}`)
    })
    PushNotificationIOS.addEventListener(
      'localNotification',
      (notification: any) => {
        didLaunchFromPush = true
        console.log(`*** AppState.currentState - ${AppState.currentState}`)
        console.log(`*** didLaunchFromPush - ${didLaunchFromPush}`)
        console.log(
          `***onLocalNotification notification = ${JSON.stringify(
            notification
          )}`
        )
        if (AppState.currentState === 'unknown') {
          dispatch(fetchRemoteConfig())
        } else {
          if (notification?._data?._od) {
            Linking.openURL(notification?._data?._od)
          }
        }
      }
    )
    PushNotificationIOS.addEventListener(
      'notification',
      (notification: any) => {
        console.log(
          `***onRemoteNotification notification = ${JSON.stringify(
            notification
          )}`
        )
        if (notification?._data?._od) {
          Alert.alert(notification?._alert?.title, notification?._alert?.body, [
            {
              text: 'OK',
              onPress: () => {
                console.log(
                  'User clicked ok on remote push message with deeplink'
                )
                if (notification?._data?._od) {
                  Linking.openURL(notification?._data?._od)
                }
              }
            },
            {
              text: 'Cancel',
              onPress: () => {
                console.log(
                  'User clicked cancel on remote push message with deeplink'
                )
              }
            }
          ])
        } else {
          Alert.alert(notification?._alert?.title, notification?._alert?.body, [
            {
              text: 'OK',
              onPress: () => {
                console.log('User clicked ok on remote push message alert')
              }
            }
          ])
        }
      }
    )
    PushNotificationIOS.getInitialNotification()
      .then((notification) => {
        if (notification) {
          console.log(
            `Launch by notification = ${JSON.stringify(notification)}`
          )
          ACPCore.trackAction('Push AppLaunch', {
            ...adobeReducerState,
            'cd.pushAppLaunch': '1'
          })
        } else {
          console.log(`Launch by user`)
          ACPCore.trackAction('User AppLaunch', {
            ...adobeReducerState,
            'cd.userAppLaunch': '1'
          })
        }
      })
      .catch((error) => {
        console.log(`Launch by notification error = ${JSON.stringify(error)}`)
      })
  }, [])

  useEffect(() => {
    SplashScreen.hide()
    dispatch({
      type: actionNames.SIGNUP_INFO,
      payload: { signUpDetails: {} }
    })
    NetInfo.addEventListener(({ isConnected }: any) =>
      handleConnectivityChange(isConnected)
    )
    if (awsconfig && awsconfig.aws_cognito_identity_pool_id) {
      AWS.config.region = awsconfig.aws_cognito_region
      getOpenIdToken()
    } else {
      console.error('There was a problem with loading aws config')
    }
  }, [])

  const handleConnectivityChange = (isConnected: boolean) => {
    dispatch(updateInternetField(isConnected))
    if (!isConnected) {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
  const signInAlways = (credentials: any) => {
    if (isGuestMode) {
      dispatch(loginAsGuest())

      props.navigation.reset({
        index: 1,
        routes: [{ name: screenNames.BOTTOM_TAB }]
      })
    } else if (
      credentials &&
      credentials?.username !== '_pfo' &&
      !isGuestMode
    ) {
      let payload = {
        type: 'credentials',
        email: credentials?.username,
        password: credentials?.password
      }
      dispatch(
        signIn(payload, (res) => {
          switch (res) {
            case 401: {
              signInAlways(credentials)
              break
            }
            case 200: {
              props.navigation.reset({
                index: 1,
                routes: [{ name: screenNames.BOTTOM_TAB }]
              })
              break
            }
            default: {
              setAuthenticate(false)
              break
            }
          }
        })
      )
    } else {
      setAuthenticate(true)
    }
  }
  const navigateTo = async () => {
    let credentials: any
    const bundleId = DeviceInfo.getBundleId()
    credentials = await Keychain.getGenericPassword({
      service: bundleId
    })

    riskifiedToken = randomString()
    dispatch({
      type: actionNames.RISKIFIED_TOKEN,
      payload: { riskifiedToken }
    })
    dispatch(fetchHomeData())
    dispatch(getCategoryList({}))
    signInAlways(credentials)
  }
  const fetchRemoteConfig = async () => {
    Common.axiosInstance.defaults.baseURL =
      'https://mobileapi.dev.hallmark.com/api/v1'
    Common.FINAL_API_URL = 'https://mobileapi.dev.hallmark.com/api/v1'
    dispatch(
      getAppConfig((res) => {
        if (res?.sfcc) {
          Common.FINAL_WEBVIEW_URL = res?.sfcc?.web_url
          Common.FINAL_DW_URL = res?.sfcc?.dw_url
          Common.MAPS_GEO_KEY = res?.maps_geo_key
          dispatch({
            type: actionNames.STATIC_DATA,
            payload: { appConfigValues: res }
          })
          setFetchRemoteConfigData(true)
          navigateTo()
        } else {
          console.log(
            'No configs were fetched from the backend, and the local configs were already activated'
          )
          showToastMessage('Sorry something went wrong', 'invalid')
        }
      })
    )
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.hmPurple
      }}>
      <Lottie
        source={localImages.splashScreen}
        autoPlay
        loop
        style={{ width: '100%' }}
      />
      {authenticate && fetchRemoteConfigData && (
        <Auth {...props} authenticate={authenticate} />
      )}
    </View>
  )
}
