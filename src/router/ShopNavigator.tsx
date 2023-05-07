import {
  CLPScreen,
  PDPScreen,
  PLPScreen,
  SearchResultScreen,
  ShopScreen
} from '@ecom/modules/shop'
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { vh, vw } from '@ecom/utils/dimension'

import AlbumListComponent from '@ecom/modules/shop/screens/Customisation/components/AlbumListComponent'
import AnimationPreview from '@ecom/modules/shop/screens/Products/AnimationPreview'
import DeliveryMethod from '@ecom/modules/shop/screens/Products/DeliveryMethod'
import LoadTemplate from '@ecom/modules/shop/screens/Customisation/LoadTemplate'
import PODAddTOCart from '@ecom/modules/shop/screens/Delivery/PODAddToCart'
import React from 'react'
import { View } from 'react-native'
import colors from '@ecom/utils/colors'
import screenNames from '@ecom/utils/screenNames'

const Shop = createStackNavigator()
const ModalStack = createStackNavigator()
const ShopNavigator = () => {
  return (
    <Shop.Navigator
      initialRouteName={screenNames.SHOP_SCREEN}
      screenOptions={{ gestureEnabled: false }}>
      <Shop.Screen
        name={screenNames.SHOP_SCREEN}
        component={ShopScreen}
        options={() => ({
          headerShown: false,
          headerTintColor: colors.black,
          headerStyle: { height: 118, shadowOpacity: 0 },
          headerBackTitleVisible: false,
          headerTitle: '',

          navigationOptions: {
            gesturesEnabled: false
          },
          headerLeftContainerStyle: { paddingLeft: vw(24), marginVertical: 16 }
        })}
      />
      <Shop.Screen
        name={screenNames.PDP_SCREEN}
        component={ModalNavigator}
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
            marginTop: vh(95),
            borderTopLeftRadius: vw(20),
            borderTopRightRadius: vw(20)
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
      <Shop.Screen
        name={screenNames.ALBUM_MODAL}
        component={AlbumListComponent}
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
            marginTop: vh(95),
            borderTopLeftRadius: vw(20),
            borderTopRightRadius: vw(20)
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: true
        }}
      />
      <Shop.Screen
        name={screenNames.CLP_SCREEN}
        component={CLPScreen}
        options={() => ({
          headerShown: false
        })}
      />
      <Shop.Screen
        name={screenNames.PLP}
        component={PLPScreen}
        options={() => ({
          headerShown: false
        })}
      />
      <Shop.Screen
        name={screenNames.LOAD_TEMPLATE}
        component={LoadTemplate}
        options={{ headerShown: false }}
      />
      {/* {Common} */}
      <Shop.Screen
        name={screenNames.SEARCH_RESULT_SCREEN}
        component={SearchResultScreen}
        options={() => ({
          headerShown: false
        })}
      />
      <Shop.Screen
        name={screenNames.POD_ADDTOCART}
        component={PODAddTOCart}
        options={() => ({
          headerShown: false,
          title: ''
        })}
      />
    </Shop.Navigator>
  )
}
const ModalNavigator = () => {
  const horizontalAnimation = {
    gestureDirection: 'horizontal',
    cardStyleInterpolator: ({
      current,
      layouts
    }: {
      current: any
      layouts: any
    }) => {
      return {
        cardStyle: {
          backgroundColor: 'transparent',
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0]
              })
            }
          ]
        }
      }
    }
  }

  return (
    <ModalStack.Navigator screenOptions={horizontalAnimation}>
      <ModalStack.Screen
        name={screenNames.PDP_SCREEN_NAVIGATOR}
        component={PDPScreen}
        options={{
          headerShown: false,
          cardOverlay: () => (
            <View
              style={{ backgroundColor: 'grey', opacity: 0.7, flex: 1 }}></View>
          ),
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

      <ModalStack.Screen
        name={screenNames.DELIVERY_METHOD_SCREEN}
        component={DeliveryMethod}
        options={{
          headerShown: false,
          cardOverlay: () => (
            <View
              style={{
                backgroundColor: 'transparent',
                opacity: 0.7,
                flex: 1
              }}></View>
          ),
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'white',
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
      <ModalStack.Screen
        name={screenNames.ANIMATION_PREVIEW_SCREEN}
        component={AnimationPreview}
        options={{
          headerShown: false,
          cardOverlay: () => (
            <View
              style={{
                backgroundColor: 'transparent',
                opacity: 0.7,
                flex: 1
              }}></View>
          ),
          presentation: 'transparentModal',
          cardStyle: {
            backgroundColor: 'white',
            marginTop: vh(16),
            shadowOffset: { width: 2, height: 8 },
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 3
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: false
        }}
      />
    </ModalStack.Navigator>
  )
}

export default ShopNavigator
