import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useRef, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import Common from '@ecom/utils/Common'
import CookieManager from '@react-native-cookies/cookies'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import { WebView } from 'react-native-webview'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import localImages from '@ecom/utils/localImages'
import screenNames from '@ecom/utils/screenNames'
import { useSelector } from 'react-redux'

interface Props {
  route: any
  navigation: any
  paypalPayerID: string
}

export function PaypalCheckoutScreen(props: Props) {
  const [checkoutLoading, setCheckoutLoading] = React.useState(true)
  const {
    checkoutURL,
    paypalToken,
    paypalRequestID,
    paypalRequestToken,
    paypalCorrelationID
  } = useSelector((state: RootReducerModal) => state.cartReducer)
  const { user, uuid, isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const hideSpinner = () => {
    setCheckoutLoading(false)
  }
  let customerDwsId = isGuestMode ? user?.customerData?.dwsid : user?.dwsid
  let customerAccountType = isGuestMode ? 'G' : 'R'
  let customerAccountId = user?.accountId
  let customerAccessToken = isGuestMode ? '' : user?.accessToken
  let customerName = isGuestMode ? '' : `${user?.first_name} ${user?.last_name}`
  let jwtToken = isGuestMode ? user?.customerData?.jwt : user?.jwt
  let jwtRefresh = isGuestMode
    ? user?.customerData?.jwt_refresh
    : user?.jwt_refresh
  let jwtExpires = isGuestMode
    ? user?.customerData?.jwt_expires
    : user?.jwt_expires
  let jwtRefreshExpires = isGuestMode
    ? user?.customerData?.jwt_refresh_expires
    : user?.jwt_refresh_expires
  const webViewRef = useRef<WebView>(null)

  const scripts = `(function() {
    const tokenLocalStorage = window.localStorage.setItem('jwt', '${jwtToken}');
    window.ReactNativeWebView.postMessage(tokenLocalStorage);
    const tokenLocalStorage1 = window.localStorage.setItem('jwt_refresh', '${jwtRefresh}');
    window.ReactNativeWebView.postMessage(tokenLocalStorage1);
    const tokenLocalStorage2 = window.localStorage.setItem('jwt_expires', '${jwtExpires}');
    window.ReactNativeWebView.postMessage(tokenLocalStorage2);
    const tokenLocalStorage3 = window.localStorage.setItem('jwt_refresh_expires', '${jwtRefreshExpires}');
    window.ReactNativeWebView.postMessage(tokenLocalStorage3);
      })();
      document.cookie = "accountType=${customerAccountType};domain=.dev.hallmark.com;path=/";
      document.cookie = "accountId=${customerAccountId};domain=.dev.hallmark.com;path=/";
      document.cookie = "accessToken=${customerAccessToken};domain=.dev.hallmark.com;path=/"
      document.cookie = "name=${customerName};domain=.dev.hallmark.com;path=/"
      document.cookie = "isFromMobileApp=A;domain=.dev.hallmark.com;path=/"
      true;
    `
  const scriptsNew = `(function() {
      const tokenLocalStorage = window.localStorage.setItem('jwt', '${jwtToken}');
      window.ReactNativeWebView.postMessage(tokenLocalStorage);
      const tokenLocalStorage1 = window.localStorage.setItem('jwt_refresh', '${jwtRefresh}');
      window.ReactNativeWebView.postMessage(tokenLocalStorage1);
      const tokenLocalStorage2 = window.localStorage.setItem('jwt_expires', '${jwtExpires}');
      window.ReactNativeWebView.postMessage(tokenLocalStorage2);
      const tokenLocalStorage3 = window.localStorage.setItem('jwt_refresh_expires', '${jwtRefreshExpires}');
      window.ReactNativeWebView.postMessage(tokenLocalStorage3);
        })();
        document.cookie = "dwsid=${customerDwsId}";
        document.cookie = "accountType=${customerAccountType};domain=.dev.hallmark.com;path=/";
        document.cookie = "accountId=${customerAccountId};domain=.dev.hallmark.com;path=/";
        document.cookie = "accessToken=${customerAccessToken};domain=.dev.hallmark.com;path=/"
        document.cookie = "name=${customerName};domain=.dev.hallmark.com;path=/"
        document.cookie = "isFromMobileApp=A;domain=.dev.hallmark.com;path=/"
        true;
      `

  let cookieString = `dwsid=${customerDwsId};accountType=${customerAccountType};accountId=${customerAccountId};accessToken=${customerAccessToken};name=${customerName};isFromMobileApp=A;`
  let cookieString1 = `accountType=${customerAccountType};accountId=${customerAccountId};accessToken=${customerAccessToken};name=${customerName};isFromMobileApp=A;`
  const [sourceData, setSource] = useState({
    html:
      '<html><body onload="document.forms[\'member_signup\'].submit();"><form action="https://www.dev.hallmark.com/sso" method="post" name="member_signup"><input type="hidden" name="jwt" value="' +
      jwtToken +
      '" /><input type="hidden" name="jwt_expires" value="' +
      jwtExpires +
      '" /><input type="hidden" name="jwt_refresh" value="' +
      jwtRefresh +
      '" /><input type="hidden" name="jwt_refresh_expires" value="' +
      jwtRefreshExpires +
      '" /><input type="submit" value="submit" style="display: none;"></form></html>',
    headers: {
      cookie: cookieString1,
      uuid: uuid
    }
  })

  return (
    <SafeAreaView style={styles.maincontainer}>
      <View style={styles.header}>
        <View style={{ flex: 0.1 }}>
          <TouchableOpacity
            style={styles.btncontainer}
            onPress={() => {
              props.navigation.navigate(screenNames.CART_NAVIGATOR, {
                screen: screenNames.CART_SCREEN
              })
            }}>
            <CircleIcon
              name={'hm_CloseLarge-thick'}
              circleColor={colors.white}
              circleSize={vw(36)}
              iconSize={vw(11)}
              circleStyle={{
                borderWidth: 1,
                borderColor: colors.graylight,
                marginTop: '25%'
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
          <Text
            style={{
              color: colors.defaultTextcolor,
              fontSize: 16,
              fontFamily: fonts.MEDIUM
            }}>
            Checkout
          </Text>
        </View>
        <View style={{ flex: 0.1 }}></View>
      </View>
      <View style={{ flex: 1 }}>
        <WebView
          originWhitelist={['https://*']}
          javaScriptEnabled={true}
          onMessage={() => {}}
          bounces={false}
          injectedJavaScript={scripts}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={false}
          domStorageEnabled
          source={sourceData}
          ref={webViewRef}
          onLoadEnd={(navState) => {
            hideSpinner()
            if (
              navState.nativeEvent.url !== 'https://www.dev.hallmark.com/sso'
            ) {
              webViewRef.current?.injectJavaScript(scriptsNew)
            }
            CookieManager.getAll().then((cookies) => {
              console.log('CookieManager.getAll =>', cookies)
            })
            if (
              navState.nativeEvent.url === 'https://www.dev.hallmark.com/sso'
            ) {
              setTimeout(() => {
                setSource({
                  uri: checkoutURL
                    ? checkoutURL
                    : Common.FINAL_PAYPAL_CHECKOUT_URL,
                  headers: {
                    cookie: cookieString,
                    uuid: uuid,
                    paypalToken,
                    paypalRequestID,
                    paypalRequestToken,
                    paypalCorrelationID,
                    paypalPayerID: props?.route?.params?.paypalPayerID
                  }
                })
              }, 2000)
            }
          }}
          onLoadStart={async (navState) => {
            if (
              navState.nativeEvent.url !== 'https://www.dev.hallmark.com/sso'
            ) {
              webViewRef.current?.injectJavaScript(scriptsNew)
            }
          }}
          onNavigationStateChange={(res) => {
            console.log('URL CHANGE In', res.url)
          }}
        />
      </View>
      {checkoutLoading && (
        <View style={styles.loader}>
          <Loader />
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: colors.white,
    position: 'relative'
  },
  btncontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: vw(5),
    flex: 0.1
  },
  topHeaderIcon: {
    width: vw(60),
    height: vh(60),
    resizeMode: 'cover'
  }
})
