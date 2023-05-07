import { AppState, View } from 'react-native'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import {
  FiltersModal,
  SearchFiltersModal,
  SearchScreen
} from '@ecom/modules/shop'
import { PaypalCheckoutScreen, PaypalPaymentScreen } from '@ecom/modules/cart'
import React, { useEffect, useRef } from 'react'
import { fetchHomeData, getCategoryList } from '@ecom/modules/home/action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { AuthComponent } from '@ecom/components/AuthComponent'
import AuthNavigator from './AuthNavigator'
import { BottomMenu } from './bottomMenu'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import SuccessDigitalSend from '@ecom/modules/shop/screens/Delivery/SuccessDigitalSend'
import actionNames from '@ecom/utils/actionNames'
import { getCategoryBanner } from '@ecom/modules/shop/action'
import screenNames from '@ecom/utils/screenNames'

const Root = createStackNavigator()
const RootNavigator = () => {
  const dispatch = useDispatch()
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        dispatch(fetchHomeData())
        dispatch(getCategoryBanner('clp'))
        dispatch(getCategoryList({}))

        PushNotificationIOS.checkPermissions((permissionStatus) => {
          if (permissionStatus && permissionStatus.authorizationStatus) {
            dispatch({
              type: actionNames.PUSH_AUTH,
              payload: {
                updatedNotificationPermission:
                  permissionStatus.authorizationStatus
              }
            })
          }
        })
      }
      appState.current = nextAppState
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <Root.Navigator>
      <Root.Screen
        name={screenNames.AUTH_NAVIGATOR}
        component={AuthNavigator}
        options={{ headerShown: false }}
      />
      <Root.Screen
        name={screenNames.BOTTOM_TAB}
        component={BottomMenu}
        options={{ headerShown: false }}
      />

      <Root.Screen
        name={screenNames.ROOT_AUTH_NAVIGATOR}
        component={AuthComponent}
        options={{
          headerShown: false,
          presentation: 'modal',

          cardStyle: {
            opacity: 1
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
        }}
      />
      <Root.Screen
        name={screenNames.SEARCH_SCREEN}
        component={SearchScreen}
        options={() => ({
          headerShown: false,
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: true
        })}
      />
      <Root.Screen
        name={screenNames.PAYPAL_PAYMENT_SCREEN}
        component={PaypalPaymentScreen}
        options={() => ({
          cardOverlay: () => (
            <View
              style={{ backgroundColor: 'gray', opacity: 0.7, flex: 1 }}></View>
          ),
          headerShown: false,
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'white',
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3,
            marginTop: vh(80),
            borderTopLeftRadius: vw(28),
            borderTopRightRadius: vw(28)
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: true
        })}
      />
      <Root.Screen
        name={screenNames.PAYPAL_CHECKOUT_SCREEN}
        component={PaypalCheckoutScreen}
        options={() => ({
          headerShown: false,
          presentation: 'modal',
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: true
        })}
      />
      <Root.Screen
        name={screenNames.FILTER_MODAl}
        component={FiltersModal}
        options={{
          cardOverlay: () => (
            <View
              style={{ backgroundColor: 'gray', opacity: 0.7, flex: 1 }}></View>
          ),
          headerShown: false,
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'white',
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3,
            marginTop: vh(80),
            borderTopLeftRadius: vw(28),
            borderTopRightRadius: vw(28)
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
      <Root.Screen
        name={screenNames.SUCCESS_DIGITAL_SEND}
        component={SuccessDigitalSend}
        options={{
          gestureEnabled: false,
          cardOverlay: () => (
            <View
              style={{ backgroundColor: 'gray', opacity: 0.7, flex: 1 }}></View>
          ),
          headerShown: false,
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'white',
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
      <Root.Screen
        name={screenNames.SEARCH_FILTER_MODAl}
        component={SearchFiltersModal}
        options={{
          cardOverlay: () => (
            <View
              style={{ backgroundColor: 'gray', opacity: 0.7, flex: 1 }}></View>
          ),
          headerShown: false,
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'white',
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3,
            marginTop: vh(80),
            borderTopLeftRadius: vw(28),
            borderTopRightRadius: vw(28)
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
    </Root.Navigator>
  )
}

export default RootNavigator
