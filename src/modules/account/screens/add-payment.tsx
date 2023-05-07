import React, { useRef, useState } from 'react'
import { SafeAreaView, StyleSheet, View } from 'react-native'

import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import CookieManager from '@react-native-cookies/cookies'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import { StackScreenProps } from '@react-navigation/stack'
import WebView from 'react-native-webview'
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'
import colors from '@ecom/utils/colors'
import { useSelector } from 'react-redux'

type AddPaymentProps = StackScreenProps<
  AccountStackParamList,
  'AccountAddPayment'
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const AddPayment = ({ navigation }: AddPaymentProps) => {
  const [visible, setVisible] = useState(true)
  const { user, uuid } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )

  let customerDwsId = user?.dwsid
  let customerAccountType = 'R'
  let customerAccountId = user?.accountId
  let customerAccessToken = user?.accessToken
  let customerName = `${user?.first_name} ${user?.last_name}`
  let jwtToken = user?.jwt
  let jwtRefresh = user?.jwt_refresh
  let jwtExpires = user?.jwt_expires
  let jwtRefreshExpires = user?.jwt_refresh_expires
  const webViewRef = useRef<WebView>(null)

  const paymentMethodsURL = 'https://www.dev.hallmark.com/payment-preferences/'

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
      '<html><body onload="document.forms[\'member_signup\'].submit();"><form action="https://www.dev.hallmark.com/sso" method="post" name="member_signup"><input type="text" name="jwt" value="' +
      jwtToken +
      '" /><input type="text" name="jwt_expires" value="' +
      jwtExpires +
      '" /><input type="text" name="jwt_refresh" value="' +
      jwtRefresh +
      '" /><input type="text" name="jwt_refresh_expires" value="' +
      jwtRefreshExpires +
      '" /><input type="submit" value="submit" style="display: none;"></form></html>',
    headers: {
      cookie: cookieString1,
      uuid: uuid
    }
  } as WebViewSource)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <WebView
          onMessage={(event) => {}}
          originWhitelist={['https://*']}
          javaScriptEnabled={true}
          ref={webViewRef}
          bounces={false}
          injectedJavaScript={scripts}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={false}
          domStorageEnabled
          source={sourceData}
          onLoadStart={async (navState) => {
            setVisible(true)
            if (
              navState.nativeEvent.url !== 'https://www.dev.hallmark.com/sso'
            ) {
              webViewRef.current?.injectJavaScript(scriptsNew)
            }
          }}
          onLoadEnd={(navState) => {
            setVisible(false)
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
              setTimeout(
                () =>
                  setSource({
                    uri: paymentMethodsURL,
                    headers: {
                      cookie: cookieString,
                      uuid: uuid
                    }
                  }),
                2000
              )
            }
          }}
          onNavigationStateChange={(res) => {
            console.log('URL CHANGE In', res.url)
          }}
        />
        {visible && <Loader />}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pageBackground,
    flex: 1
  },
  content: {
    flexDirection: 'column',
    flexGrow: 1
  }
})
