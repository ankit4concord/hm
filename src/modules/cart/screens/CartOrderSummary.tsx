import { CircleIcon, Icon } from '@ecom/components/icons'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { applyPromoCode, getSession, removePromoCode } from '../actions'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import CustomInputWithIcon from '@ecom/components/CustomInputWithIcon'
import DropShadow from 'react-native-drop-shadow'
import Loader from '@ecom/components/Loader'
import RBSheet from 'react-native-raw-bottom-sheet'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import endpoint from '@ecom/utils/endpoint'
import fonts from '@ecom/utils/fonts'
import { getApiCall } from '@ecom/utils/api'
import { isEmpty } from 'lodash'
import localImages from '@ecom/utils/localImages'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { showToastMessage } from '@ecom/utils/constant'

const CartOrderSummary = () => {
  const [couponCode, setCouponCode] = useState('')
  const [showPromoError, setShowPromoError] = useState(false)
  const { cartLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { basket } = useSelector((state: RootReducerModal) => state.cartReducer)

  const BSheetRef = useRef(null)

  const dispatch = useDispatch()
  const { isGuestMode } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const [visible, setVisible] = React.useState(false)
  const hideSpinner = () => {
    setVisible(false)
  }

  const handleApplyPromoCode = () => {
    if (couponCode?.length === 0) {
      setShowPromoError('Please enter promo code')
    } else {
      dispatch(
        applyPromoCode(couponCode, (res) => {
          if (res === '200') {
            BSheetRef?.current?.close()
            setShowPromoError(false)
          } else {
            setShowPromoError(res?.data)
          }
        })
      )
    }
  }

  const onSuffixClick = () => {
    setShowPromoError(false)
    setCouponCode('')
  }

  useEffect(() => {
    setShowPromoError(false)
  }, [BSheetRef?.current?.state?.modalVisible])
  const invokePaypal = async () => {
    setVisible(true)
    getApiCall(
      endpoint.paypalToken,
      async (res: any) => {
        if (res?.data?.data?.payPalEcSetReply?.errorCode) {
          showToastMessage(
            'Something went wrong while fetching PayPal Token',
            'invalid'
          )
        } else {
          const paypalToken = res?.data?.data?.payPalEcSetReply?.paypalToken
          const paypalRequestID = res?.data?.data?.requestID
          const paypalRequestToken = res?.data?.data?.requestToken
          const paypalCorrelationID =
            res?.data?.data?.payPalEcSetReply?.correlationID
          if (paypalToken) {
            dispatch({
              type: actionNames.SESSION,
              payload: {
                paypalToken,
                paypalRequestID,
                paypalRequestToken,
                paypalCorrelationID
              }
            })
            dispatch(
              getSession(() => {
                hideSpinner()
                navigate(screenNames.PAYPAL_PAYMENT_SCREEN, {
                  token: paypalToken
                })
              }, 'paypal')
            )
          }
        }
      },
      (err: any) => {
        hideSpinner()
      }
    )
    return false
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.priceContainer}>
          <Text style={styles.title}>Summary</Text>
          <View style={styles.subTxt}>
            <Text style={styles.txt}>
              Subtotal{' '}
              {`(${basket?.totalProducts} ${
                basket?.totalProducts > 1 ? 'items' : 'item'
              })`}
            </Text>
            <Text style={styles.cost}>
              {basket?.summary?.Subtotal?.value
                ? basket?.summary?.Subtotal?.value
                : 0}
            </Text>
          </View>
          {!isEmpty(basket?.summary?.Promocodes?.value) && (
            <View style={styles.subTxt}>
              <Text style={styles.txt}>
                {`Promo codes  ${
                  basket?.coupon_items[0]?.code.length > 12
                    ? `\n${basket?.coupon_items[0]?.code}`
                    : `${basket?.coupon_items[0]?.code}`
                }`}
                <TouchableOpacity
                  style={
                    basket?.coupon_items[0]?.code.length > 12
                      ? { marginTop: vh(-6) }
                      : ''
                  }
                  onPress={() =>
                    dispatch(removePromoCode(basket?.coupon_items[0]?.code))
                  }>
                  <CircleIcon
                    name={'hm_Delete-thick'}
                    circleColor={colors.white}
                    circleSize={vw(24)}
                    iconSize={vh(11)}
                    circleStyle={{
                      borderWidth: 1,
                      borderColor: colors.graylight,
                      marginLeft: vw(11)
                    }}
                  />
                </TouchableOpacity>
              </Text>
              <Text style={styles.cost}>
                {!isEmpty(basket?.summary?.Promocodes?.value)
                  ? basket?.summary?.Promocodes?.value
                  : 0}
              </Text>
            </View>
          )}

          <View style={styles.subTxt}>
            <Text style={styles.txt}>Estimated shipping</Text>
            <Text style={styles.cost}>
              {basket?.summary?.ShowShippingRow?.value &&
              !isEmpty(basket?.summary?.ShowShippingRow?.value)
                ? basket?.summary?.ShowShippingRow?.value
                : 0}
            </Text>
          </View>
          <View style={styles.subTxt}>
            <Text style={styles.taxTxt}>Tax</Text>
            <Text style={styles.cost}>
              {basket?.summary?.OrderTax?.value &&
              !isEmpty(basket?.summary?.OrderTax?.value)
                ? basket?.summary?.OrderTax?.value
                : 0}
            </Text>
          </View>
        </View>
        <View style={styles.subTxtTotal}>
          <Text style={styles.cost}>Total</Text>
          <Text style={styles.cost}>{basket?.summary?.OrderTotal?.value} </Text>
        </View>

        <DropShadow style={styles.shadowContainer}>
          <TouchableOpacity
            onPress={() => {
              BSheetRef?.current?.open()
            }}>
            <View style={styles.promoBtnContainer}>
              <Image
                source={localImages.promoCodeIcon}
                style={styles.promoIcon}
              />
              <Text style={styles.promoTxt}>Apply Promo Code </Text>
            </View>
          </TouchableOpacity>
        </DropShadow>

        <TouchableOpacity onPress={invokePaypal}>
          <View style={styles.paypalBtnContainer}>
            <Image source={localImages.paypal} style={styles.imgPaypal} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            dispatch(
              getSession(() => {
                navigate(screenNames.CHECKOUT_MODAL)
              }, 'checkout')
            )
          }}>
          <View style={styles.checkoutBtnContainer}>
            <Text style={styles.btnTxt}>Check Out</Text>
          </View>
        </TouchableOpacity>
        {isGuestMode && (
          <View style={styles.footerTxt}>
            <Text style={styles.accountTxt}>Make checkout simpler by</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() =>
                  navigate(screenNames.AUTH_NAVIGATOR, {
                    screen: screenNames.LOGIN,
                    params: { to: 1, from: 'checkout' }
                  })
                }>
                <Text style={styles.accountLinkTxt}>making an account</Text>
              </TouchableOpacity>
              <Text style={styles.accountTxt}> or </Text>
              <TouchableOpacity
                onPress={() =>
                  navigate(screenNames.AUTH_NAVIGATOR, {
                    screen: screenNames.LOGIN,
                    params: { from: 'checkout' }
                  })
                }>
                <Text style={styles.accountLinkTxt}>logging in.</Text>
              </TouchableOpacity>
            </View>
            {visible && (
              <View style={styles.loader}>
                <Loader />
              </View>
            )}
          </View>
        )}
      </View>

      <RBSheet
        ref={BSheetRef}
        closeOnDragDown={true}
        onClose={() => setShowPromoError(false)}
        height={vh(400)}
        customStyles={{
          container: styles.rbSheet
        }}
        closeOnPressMask={false}>
        {cartLoading && <Loader />}

        <View style={styles.rbContainer}>
          <View style={styles.hederContainer}>
            <Text style={styles.header}>Apply promo code</Text>
          </View>
          <View style={{ flex: 0.4 }}>
            <CustomInputWithIcon
              isError={showPromoError?.length > 0}
              label="Promo Code*"
              subLabel="include dashes, if applicable"
              suffix={
                <TouchableOpacity onPress={onSuffixClick}>
                  <Icon
                    name={'hm_CloseLarge-thick'}
                    size={vh(8)}
                    style={styles.back_icon}
                  />
                </TouchableOpacity>
              }
              onChange={(value: String) => {
                setCouponCode(value.toUpperCase())
                setShowPromoError(false)
              }}
              value={couponCode}
              type={undefined}
              textStyle={styles.label}
              onSuffixClick={undefined}
              placeholder={undefined}
              autoCapitalize={'characters'}
            />
            {showPromoError?.length > 0 && (
              <Text style={styles.errorTxt}>{showPromoError}</Text>
            )}
          </View>
          {basket?.coupon_items?.length > 0 && (
            <View style={styles.bottomContainer}>
              <Text style={styles.orderNumber}>
                {basket?.coupon_items[0]?.code}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    removePromoCode(basket?.coupon_items[0]?.code, (res) => {
                      if (res === '200') {
                        BSheetRef?.current?.close()
                      }
                    })
                  )
                }}>
                <Icon
                  name={'hm_CloseLarge-thick'}
                  size={vh(8)}
                  style={styles.applyCross}
                />
              </TouchableOpacity>
            </View>
          )}

          <View style={{ justifyContent: 'center', flex: 0.4 }}>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => {
                handleApplyPromoCode()
              }}>
              <Text style={styles.applyBtnTxt}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </>
  )
}

export default CartOrderSummary
const styles = StyleSheet.create({
  container: { padding: vw(20) },
  txt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(18),
    marginBottom: vh(15)
  },
  taxTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(18),
    marginBottom: vh(20)
  },
  cost: {
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    fontSize: vw(14)
  },
  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    letterSpacing: vw(-0.03),
    marginBottom: vh(16)
  },
  subTxt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.graylight,
    marginBottom: vh(20)
  },
  subTxtTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vh(30)
  },
  paypalBtnContainer: {
    backgroundColor: colors.paypalBtn,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vh(15.5),
    borderRadius: vw(40),
    marginBottom: vh(8)
  },
  imgPaypal: {
    width: vw(90),
    height: vh(24),
    resizeMode: 'contain'
  },
  checkoutBtnContainer: {
    backgroundColor: colors.hmPurple,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vh(18),
    borderRadius: vw(40),
    marginBottom: vh(40)
  },
  btnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.white
  },
  promoIcon: {
    width: vw(16.67),
    height: vh(13.33),
    resizeMode: 'contain'
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  promoTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.grayText,
    marginLeft: vw(10),
    fontSize: vw(14),
    lineHeight: vh(17)
  },
  promoBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: vh(13),
    backgroundColor: colors.white,
    marginHorizontal: '20%',
    marginBottom: vh(30),
    borderRadius: vw(38)
  },
  accountTxt: {
    color: colors.graylighttxt,
    fontSize: vw(12),
    lineHeight: vh(18),
    fontFamily: fonts.REGULAR
  },
  footerTxt: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vh(50)
  },
  accountLinkTxt: {
    fontFamily: fonts.MEDIUM,
    color: colors.graylighttxt,
    fontSize: vw(12),
    lineHeight: vh(18),
    textDecorationLine: 'underline'
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0
  },
  rbSheet: {
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20)
  },
  back_icon: {
    marginRight: vw(5)
  },
  label: {
    fontSize: vw(14),
    fontFamily: fonts.MEDIUM,
    padding: vw(10)
  },
  applyBtn: {
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(17.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(30),
    marginHorizontal: vw(90)
  },
  applyBtnTxt: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.white
  },
  orderNumber: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(18),
    marginTop: vh(20)
  },
  discountTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(18),
    color: colors.grayTxt
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.graylight,
    flex: 0.3
  },
  header: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(18)
  },
  hederContainer: {
    alignItems: 'center',
    flex: 0.2
  },
  rbContainer: {
    padding: vw(20),
    flex: 1
  },
  errorTxt: {
    color: colors.darkOrange,
    fontSize: vw(12),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    marginTop: vh(8)
  },
  promoNumber: {
    color: colors.defaultTextcolor
  },
  applyCross: {
    marginTop: vh(20),
    marginRight: vw(10),
    alignItems: 'center'
  }
})
