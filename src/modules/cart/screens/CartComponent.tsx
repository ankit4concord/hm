import {
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/tracking'
import CartAppProduct from './CartAppProduct'
import CartOrderSummary from './CartOrderSummary'
import CartWebProduct from './CartWebProduct'
import { Delete } from '@ecom/assets/svg'
import Loader from '@ecom/components/Loader'
import RBSheet from 'react-native-raw-bottom-sheet'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { removeFromCart } from '@ecom/modules/shop/action'
import screenTypes from '@ecom/utils/screenTypes'
import { useIsFocused } from '@react-navigation/native'

export const CartComponent = () => {
  const { basket } = useSelector((state: RootReducerModal) => state.cartReducer)
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const BSheetRef = useRef(null)
  const [itemIdData, setItemId] = useState('')
  const { cartLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const receiveItemId = (itemId: any) => {
    setItemId(itemId)
    BSheetRef?.current?.open()
  }
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  useEffect(() => {
    // The screen is focused
    if (
      appConfigValues?.adobe?.isAnalyticsEnabled &&
      isFocused &&
      basket?.totalProducts
    ) {
      const pageName = `Checkout>Shopping Cart`
      let cartTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.pageType': screenTypes.CHECKOUT,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level1': 'Checkout',
        'cd.level2': 'Shopping Cart',
        'cd.level3': ''
      }
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: cartTrackObj
      })
      cartTrackObj['cd.cartView'] = '1'
      if (basket?.totalProducts) {
        cartTrackObj['cd.totalProducts'] = `${basket?.totalProducts}`
        cartTrackObj['cd.appProducts'] = `${basket?.appProducts?.length}`
        cartTrackObj['cd.webProducts'] = `${basket?.webProducts?.length}`
        cartTrackObj['cd.orderTotal'] = `${basket?.summary?.OrderTotal?.value}`
      }
      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...cartTrackObj
      })
    }
  }, [isFocused])

  return (
    <>
      <View style={{ paddingBottom: vh(30) }}>
        {cartLoading && <Loader />}
        <View style={styles.header}>
          <Text style={styles.headerTxt}>Your Shopping Bag</Text>
          <Text style={styles.subTxt}>
            {basket?.totalProducts}{' '}
            {basket?.totalProducts > 1 ? 'items' : 'item'} (
            {basket?.summary?.OrderTotal?.value})
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {basket?.appProducts?.length > 0 && (
            <View style={styles.flatlist}>
              <FlatList
                data={basket?.appProducts}
                renderItem={(item: any) => (
                  <CartAppProduct
                    item={item}
                    BSheetRef={BSheetRef}
                    receiveItemId={receiveItemId}
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      borderBottomWidth: 1,
                      borderBottomColor: colors.graylight,
                      marginBottom: vh(10)
                    }}
                  />
                )}
              />
            </View>
          )}
          {basket?.webProducts?.length > 0 && (
            <View style={styles.container}>
              <View style={styles.heading}>
                <Text style={styles.headerText}>Added on Hallmark.com</Text>
              </View>
              <View style={styles.subTxtContainer}>
                <Text style={styles.txt}>
                  The items below were added on{' '}
                  <Text
                    style={styles.linkTxt}
                    onPress={() => Linking.openURL('https://www.hallmark.com')}>
                    Hallmark.com.
                  </Text>{' '}
                  If you want to change something like quantity or shipping
                  options, head over to{' '}
                  <Text
                    style={styles.linkTxt}
                    onPress={() => Linking.openURL('https://www.hallmark.com')}>
                    Hallmark.com.
                  </Text>{' '}
                  You can check out from here if everything looks good.
                </Text>
              </View>
              <View>
                <FlatList
                  data={basket?.webProducts}
                  renderItem={(item: any) => (
                    <CartWebProduct
                      item={item}
                      BSheetRef={BSheetRef}
                      receiveItemId={receiveItemId}
                    />
                  )}
                  ItemSeparatorComponent={() => (
                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: colors.graylight,
                        marginBottom: vh(10)
                      }}
                    />
                  )}
                />
              </View>
            </View>
          )}
          <View>
            <CartOrderSummary />
          </View>
        </ScrollView>
        <RBSheet
          ref={BSheetRef}
          closeOnDragDown={true}
          height={vh(400)}
          customStyles={{
            container: styles.rbSheet
          }}
          closeOnPressMask={false}>
          <View style={styles.sheetContainer}>
            <View>
              <Delete height={vh(135)} width={vw(100)} />
            </View>
            <Text style={styles.deleteText}>
              Are you sure you want to delete this?
            </Text>
            <View style={styles.sheetbtnContainer}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  BSheetRef?.current?.close()
                }}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deletebtn}
                onPress={() => {
                  // delete item
                  dispatch(removeFromCart(itemIdData))
                  BSheetRef?.current?.close()
                }}>
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: vh(10),
    padding: vw(20)
  },
  headerTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    letterSpacing: vw(-0.03),
    marginBottom: vh(2)
  },
  subTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(14),
    letterSpacing: vw(-0.03),
    color: colors.grayTxt
  },
  flatlist: { padding: vh(20) },
  container: {
    flex: 1,
    backgroundColor: colors.lightblue,
    borderRadius: vw(10),
    padding: vw(20),
    marginHorizontal: vw(4),
    marginVertical: vh(20)
  },
  heading: {
    marginBottom: vh(20)
  },
  headerText: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    letterSpacing: vw(-0.03)
  },
  subTxtContainer: { marginBottom: vh(40) },
  txt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(18),
    letterSpacing: vw(-0.03)
  },
  rbSheet: {
    flex: 1,
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20)
  },
  linkTxt: { textDecorationLine: 'underline' },
  sheetContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: vw(20)
  },

  deleteText: {
    fontSize: vw(14),
    lineHeight: vh(18),
    fontFamily: fonts.BOLD,
    marginBottom: vh(70),
    marginTop: vh(40)
  },
  sheetbtnContainer: {
    flexDirection: 'row'
  },
  cancelBtnText: {
    fontFamily: fonts.MEDIUM,
    color: colors.black,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  deleteBtnText: {
    fontFamily: fonts.MEDIUM,
    color: colors.white,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  cancelBtn: {
    paddingVertical: vh(17),
    paddingHorizontal: vw(25),
    borderWidth: 2,
    borderColor: colors.black,
    backgroundColor: colors.white,
    marginRight: vw(15),
    borderRadius: vw(30)
  },
  deletebtn: {
    paddingVertical: vh(17),
    paddingHorizontal: vw(25),
    borderWidth: 2,
    borderColor: colors.hmPurple,
    backgroundColor: colors.hmPurple,
    borderRadius: vw(30)
  }
})
