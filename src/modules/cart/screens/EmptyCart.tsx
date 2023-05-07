import React, { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/tracking'
import { RootReducerModal } from '@ecom/modals'
import { ShoppingBag } from '@ecom/assets/svg'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import screenTypes from '@ecom/utils/screenTypes'
import { useIsFocused } from '@react-navigation/native'

const EmptyCart = () => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  useEffect(() => {
    // The screen is focused
    if (appConfigValues?.adobe?.isAnalyticsEnabled && isFocused) {
      const pageName = `Checkout>Shopping Cart>Empty Cart`
      let cartTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.pageType': screenTypes.CHECKOUT,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level1': 'Checkout',
        'cd.level2': 'Shopping Cart',
        'cd.level3': 'Empty Cart'
      }
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: cartTrackObj
      })
      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...cartTrackObj
      })
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <View style={{ flex: 0.5 }}>
          <Text style={styles.header}>Your Shopping Bag</Text>
          <Text style={styles.EmptyTxt}>Empty</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <ShoppingBag />
          <Text style={styles.subTxt}>Your shopping bag is still empty.</Text>
          <View style={styles.txtContainer}>
            <Text style={styles.txt}>
              Find a card you like in one of the{'\n'}categories below, or go to
              ‘Discover’ for{'\n'} more categories.
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.discoverContainer}
        onPress={() => {
          navigate(screenNames.SHOP_NAVIGATOR, {
            screen: screenNames.SHOP_SCREEN
          })
        }}>
        <Text style={styles.btnDiscover}>Discover Cards</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EmptyCart
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20)
  },
  subContainer: { flex: 1 },
  btnDiscover: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    color: colors.white,
    lineHeight: vh(19)
  },
  btnTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.white,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  header: {
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(19),
    fontSize: vw(16)
  },
  EmptyTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.grayTxt,
    fontSize: vw(12),
    marginTop: vh(3)
  },
  txtContainer: {
    alignItems: 'center'
  },
  txt: {
    textAlign: 'center',
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(18)
  },
  subTxt: {
    marginTop: vh(33),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    fontSize: vw(14),
    marginBottom: vh(3)
  },
  discoverContainer: {
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(20),
    borderRadius: vw(40),
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: vh(246),
    resizeMode: 'contain'
  }
})
