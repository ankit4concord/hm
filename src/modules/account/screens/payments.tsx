import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Linking
} from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ErrorResponse, PaymentMethods, RootReducerModal } from '@ecom/modals'
import { getPaymentMethods, makePaymentDefault } from '../actions'
import colors from '@ecom/utils/colors'
import { vh, vw } from '@ecom/utils/dimension'
import Loader from '@ecom/components/Loader'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import fonts from '@ecom/utils/fonts'
import {
  Body,
  Description,
  HeaderBody,
  HeaderSmallTight
} from '@ecom/components/typography'
import { AddCircleIcon, DeleteCircleIcon, Icon } from '@ecom/components/icons'
import LocalizedStrings from 'react-native-localization'
import { minTwoDigits } from '@ecom/utils/object-utils'
import { Divider } from '@ecom/components/divider'
import Common from '@ecom/utils/Common'
import WebView from 'react-native-webview'
import CookieManager from '@react-native-cookies/cookies'
import { WebViewSource } from 'react-native-webview/lib/WebViewTypes'
import Modal from 'react-native-modal'
import { NonModalLoader } from '@ecom/components/non-modal-loader'
import { HMMessage } from '@ecom/components/messages/hm-message'
import constant from '@ecom/utils/constant'
import { useFocusEffect } from '@react-navigation/native'

type PaymentsScreenProps = StackScreenProps<
  AccountStackParamList,
  'AccountPayments'
>

interface CCProps {
  icon: string
  prettyString: string
}

const CC_MAP: Map<string, CCProps> = new Map([
  ['discover', { icon: 'cc_discover_svg', prettyString: 'Discover' }],
  ['americanexpress', { icon: 'cc_amex_svg', prettyString: 'AMEX' }],
  ['visa', { icon: 'cc_visa_svg', prettyString: 'Visa' }],
  ['mastercard', { icon: 'cc_mastercard_svg', prettyString: 'Mastercard' }]
])

const genericCard: CCProps = {
  icon: 'hm_PaymentMethods-thick',
  prettyString: ''
}

export const Payments = ({ navigation }: PaymentsScreenProps) => {
  const dispatch = useDispatch()
  const { profileLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const paymentMethods = useSelector(
    (state: RootReducerModal) => state.authReducer.profile?.paymentMethods
  )
  const showDeleteSuccess = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.PaymentDeleteSuccessMessage
  )

  const showDeleteError = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.PaymentDeleteErrorMessage
  )

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCCID, setDeleteCCID] = useState('')
  const [showDeleteModalLoader, setShowDeleteModalLoader] = useState(false)
  const [loading, setLoading] = useState(profileLoading)
  const [payMethods, setPayMethods] = useState<PaymentMethods[]>(
    paymentMethods || []
  )

  const renderHeader = useCallback(() => {
    return (
      <View>
        <Text style={styles.headerTitleText}>{strings.title}</Text>
        {payMethods?.length || 0 > 0 ? (
          <HeaderSmallTight style={styles.headerSubText}>{`${
            payMethods?.length
          } card${payMethods?.length || 0 > 1 ? 's' : ''}`}</HeaderSmallTight>
        ) : null}
      </View>
    )
  }, [payMethods])

  useEffect(() => {
    navigation.setOptions({ headerTitle: renderHeader })
  }, [navigation, payMethods, renderHeader])

  useEffect(() => {
    dispatch(getPaymentMethods())
  }, [dispatch])

  useEffect(() => {
    if (showDeleteError || showDeleteSuccess) {
      setShowDeleteModal(false)
      dispatch(getPaymentMethods())
    }
  }, [showDeleteError, showDeleteSuccess, setShowDeleteModal, dispatch])

  const addPaymentMethod = () => {
    navigation.navigate('AccountAddPayment')
  }
  const makePrimary = (id: string) => {
    dispatch(makePaymentDefault(id, handleMakePrimaryResponse))
  }

  const handleMakePrimaryResponse = (res: ErrorResponse) => {
    if (res.code === 200) {
      dispatch(getPaymentMethods())
    }
  }
  const deleteCard = (id: string) => {
    setDeleteCCID(id)
    setShowDeleteModal(true)
  }

  useEffect(() => {
    setPayMethods(paymentMethods || [])
    setLoading(false)
  }, [paymentMethods])

  useEffect(() => {
    setLoading(profileLoading)
  }, [profileLoading])

  const policy = () => {
    Linking.openURL(Common.PRIVACY_POLICY_URL)
  }

  const closeModal = () => {
    setShowDeleteModal(false)
    setDeleteCCID('')
    dispatch(getPaymentMethods())
  }

  const onClose = useCallback(() => {
    constant.switchMessage(dispatch, 'PaymentDeleteSuccess', false)
    constant.switchMessage(dispatch, 'PaymentDeleteError', false)
  }, [dispatch])

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true)
      dispatch(getPaymentMethods())
      return () => {
        onClose()
      }
    }, [dispatch, onClose])
  )

  const renderAddPaymentMethod = () => {
    return (payMethods?.length || 0) < 3 && false ? (
      <View style={[styles.card, styles.add]}>
        <TouchableWithoutFeedback onPress={addPaymentMethod}>
          <View style={[styles.cardContent, styles.cardContentButton]}>
            <HeaderBody>{strings.addCard}</HeaderBody>
            <AddCircleIcon />
          </View>
        </TouchableWithoutFeedback>
      </View>
    ) : null
  }

  const renderPaymentMethod = (pm: PaymentMethods) => {
    const cc = CC_MAP.get(pm.cardType?.toLowerCase()) || {
      ...genericCard,
      ...{ prettyString: pm.cardType }
    }
    const makePrimaryStroke = pm.preferred ? colors.green : colors.grayStroke
    const makePrimaryFill = pm.preferred ? colors.green : colors.offWhiteFill
    const makePrimaryText = pm.preferred ? colors.green : colors.grayText
    const makePrimaryStr = pm.preferred ? strings.primary : strings.makePrimary

    const onDelete = () => {
      deleteCard(pm.UUID)
    }

    const onMakePrimary = () => {
      makePrimary(pm.UUID)
    }

    return (
      <View style={[styles.card, styles.creditCardCard]} key={pm.UUID}>
        <View style={styles.cardContent}>
          <View style={styles.ccRow}>
            <View style={styles.leftSide}>
              <Icon name={cc.icon} size={vw(35)} style={styles.paymentIcon} />
              <HeaderBody>
                {strings.formatString(
                  strings.cardTitle,
                  cc.prettyString,
                  pm.lastFour
                )}
              </HeaderBody>
            </View>
            <Pressable onPress={onDelete}>
              <DeleteCircleIcon />
            </Pressable>
          </View>
          <View style={styles.leftSide}>
            <Description style={styles.headerSubText}>
              {strings.formatString(
                strings.expires,
                minTwoDigits(pm.expirationMonth),
                pm.expirationYear.toString()
              )}
            </Description>
          </View>
          <TouchableWithoutFeedback
            onPress={onMakePrimary}
            disabled={pm.preferred}>
            <View style={styles.makePrimary}>
              <Icon
                name={'flag_svg'}
                fill={makePrimaryFill}
                color={makePrimaryStroke}
                size={vw(18)}
              />
              <Description style={[styles.primary, { color: makePrimaryText }]}>
                {makePrimaryStr}
              </Description>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

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

  const paymentMethodsURL = `https://www.dev.hallmark.com/payment-preferences-delete?cardNumberUUID=${deleteCCID}`

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

  const renderModal = () => {
    return (
      <Modal
        isVisible={showDeleteModal}
        backdropColor={colors.black}
        animationInTiming={1}
        animationOutTiming={1}
        backdropOpacity={0.2}
        onBackdropPress={closeModal}>
        <View style={styles.webViewContainer}>
          {showDeleteModalLoader ? (
            <View style={styles.loader}>
              <NonModalLoader />
            </View>
          ) : null}
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
              setShowDeleteModalLoader(true)
              if (
                navState.nativeEvent.url !== 'https://www.dev.hallmark.com/sso'
              ) {
                webViewRef.current?.injectJavaScript(scriptsNew)
              }
            }}
            onLoadEnd={(navState) => {
              setShowDeleteModalLoader(false)
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
        </View>
      </Modal>
    )
  }

  let deleteMessage = ''
  if (showDeleteSuccess) {
    deleteMessage = strings.deleteSuccess
  } else if (showDeleteError) {
    deleteMessage = strings.deleteError
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <HMMessage
          type={showDeleteSuccess ? 'Success' : 'Error'}
          message={deleteMessage}
          display={showDeleteSuccess || showDeleteError}
          closeable
          containerStyle={styles.message}
          onClose={onClose}
          autoClose
        />
        <Body>
          {strings.description}
          <HeaderBody style={styles.link} onPress={policy}>
            {strings.link}
          </HeaderBody>
        </Body>
        <Divider
          centerText={strings.cards}
          containerStyle={styles.dividerContainer}
        />
        {payMethods
          ?.sort((a, b) => Number(b.preferred) - Number(a.preferred))
          .map((pm) => {
            return renderPaymentMethod(pm)
          })}
        {renderAddPaymentMethod()}
      </View>
      {loading ? <Loader /> : null}
      {renderModal()}
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    title: 'Payment Methods',
    addCard: 'Add a credit or debit card',
    cardTitle: '{0} • Ending in {1}',
    expires: 'Expires on {0}/{1}',
    makePrimary: 'Mark as primary',
    primary: 'Primary card',
    cards: 'Cards',
    description:
      "Save up to 3 payment methods to speed up checkout. See how we're keeping your information safe and secure in our ",
    link: 'Privacy and Security Policy.',
    deleteSuccess: 'Delete Success',
    deleteError: 'Delete Error'
  }
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.pageBackground,
    flex: 1
  },
  content: {
    marginHorizontal: vw(20),
    marginTop: vh(20),
    paddingBottom: vh(100),
    flexDirection: 'column',
    flexGrow: 1
  },
  headerContainer: {
    flexDirection: 'column'
  },
  headerTitleText: {
    fontFamily: fonts.BOLD,
    fontSize: vw(16),
    lineHeight: vh(19.2),
    color: colors.blackText
  },
  headerSubText: {
    color: colors.grayText
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: vw(10),
    shadowOffset: { width: 0, height: vh(2) },
    shadowOpacity: 0.1,
    shadowRadius: vw(8)
  },
  add: {
    marginTop: vh(10)
  },
  cardContentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardContent: {
    paddingHorizontal: vw(20),
    paddingVertical: vh(15)
  },
  creditCardCard: {
    marginTop: vh(10)
  },
  ccRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  makePrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vh(20),
    marginBottom: vh(5)
  },
  dividerContainer: {
    marginVertical: vh(20)
  },
  primary: {
    marginLeft: vw(10)
  },
  link: {
    textDecorationLine: 'underline'
  },
  paymentIcon: {
    marginRight: vw(10)
  },
  webViewContainer: {
    height: 150,
    borderRadius: vw(10),
    overflow: 'hidden'
  },
  loader: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10000
  },
  message: {
    position: 'absolute',
    top: -vh(15)
  }
})
