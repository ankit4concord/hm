import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { CLPScreen } from '@ecom/modules/shop/screens/index'
import { getCategoryBanner } from '../action'
import { RootReducerModal } from '@ecom/modals'

export function ShopScreen() {
  const dispatch = useDispatch()
  const { clpPageDesignerData } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  useEffect(() => {
    if(clpPageDesignerData && clpPageDesignerData.length === 0){
      dispatch(getCategoryBanner('clp'))
    }
  }, [])
  return (
    <View style={styles.container}>
      <CLPScreen />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingTop: vh(56),
    marginBottom: -60
  }
})
