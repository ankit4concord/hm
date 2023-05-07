import { CartComponent } from './CartComponent'
import EmptyCart from './EmptyCart'
import React from 'react'
import { RootReducerModal } from '@ecom/modals'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { vh } from '@ecom/utils/dimension'

export function CartScreen() {
  const { basket } = useSelector((state: RootReducerModal) => state.cartReducer)

  return (
    <>
      <View style={{ flex: 1, backgroundColor: '#F8F6FC', paddingTop: vh(40) }}>
        {basket?.appProducts?.length === 0 &&
        basket?.webProducts?.length === 0 ? (
          <EmptyCart />
        ) : (
          <CartComponent />
        )}
      </View>
    </>
  )
}
