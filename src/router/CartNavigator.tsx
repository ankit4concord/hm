import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack'
import { CartScreen, CheckoutScreen } from '@ecom/modules/cart'

import React from 'react'
import screenNames from '@ecom/utils/screenNames'

const Cart = createStackNavigator()

const CartNavigator = () => {
  return (
    <Cart.Navigator>
      <Cart.Screen
        name={screenNames.CART_SCREEN}
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Cart.Screen
        name={screenNames.CHECKOUT_MODAL}
        component={CheckoutScreen}
        options={{
          headerShown: false,
          presentation: 'modal',
          cardStyle: {},
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardOverlayEnabled: true,
          cardShadowEnabled: true
        }}
      />
    </Cart.Navigator>
  )
}

export default CartNavigator
