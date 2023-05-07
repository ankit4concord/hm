import { ACPCore, ACPIdentity } from '@adobe/react-native-acpcore'
import constant, { showToastMessage } from '@ecom/utils/constant'
import { deleteApiCall, getApiCall, postApiCall } from '@ecom/utils/api'

import Common from '@ecom/utils/Common'
import actionNames from '@ecom/utils/actionNames'
import endpoint from '@ecom/utils/endpoint'
import { signInAgain } from '../auth/action'

export function getSession(callback = () => {}, source: string = '') {
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    const { isGuestMode } = getState().authReducer
    if (isConnected) {
      getApiCall(
        endpoint.session,
        (res: any) => {
          dispatch({
            type: actionNames.SESSION,
            payload: { dwsid: res?.data?.data?.dwsid }
          })
          if (source === 'checkout' || source === 'paypal') {
            const checkoutURL =
              source === 'checkout'
                ? isGuestMode
                  ? Common.FINAL_CHECKOUT_REGISTER_URL
                  : Common.FINAL_CHECKOUT_BILLING_URL
                : Common.FINAL_PAYPAL_CHECKOUT_URL
            ACPIdentity.appendVisitorInfoForURL(checkoutURL)
              .then((checkoutURLWithVisitorData: any) => {
                console.log(
                  '***AdobeExperenceSDK: checkoutURL with Visitor Data = ' +
                    checkoutURLWithVisitorData
                )
                dispatch({
                  type: actionNames.SESSION,
                  payload: { checkoutURL: checkoutURLWithVisitorData }
                })
              })
              .catch((error: any) => {
                console.log(
                  `***AdobeExperenceSDK: Error fetching checkoutURL with Visitor Data = ${error}`
                )
                dispatch({
                  type: actionNames.SESSION,
                  payload: { checkoutURL }
                })
              })
          }
          callback()
        },
        (err: any) => {
          if (err.status == 405 || err.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(getSession(callback))
                  : showToastMessage(
                      'Something went wrong in session 1!',
                      'invalid'
                    )
              })
            )
          } else {
            showToastMessage('Something went wrong in session 2!', 'invalid')
          }
        }
      )
    } else {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}
export function getBasket(callback = () => {}) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'cart', true)
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      getApiCall(
        endpoint.getBasketCart,
        (res: any) => {
          dispatch({
            type: actionNames.BASKET_INFO,
            payload: { basket: res?.data?.data }
          })
          constant.switchLoader(dispatch, 'cart', false)
          callback()
        },
        (err: any) => {
          if (err.status == 405 || err.status == 403) {
            dispatch(
              signInAgain((res: any) =>
                res === 'success'
                  ? dispatch(getBasket(callback))
                  : showToastMessage('Something went wrong!', 'invalid')
              )
            )
            constant.switchLoader(dispatch, 'cart', false)
          } else {
            showToastMessage('Something went wrong', 'invalid')
          }
        }
      )
    } else {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}

export function applyPromoCode(couponCode: any, callback = (res: any) => {}) {
  return (dispatch: Function, getState: any) => {
    const adobeReducerState = getState().globalAdobeReducer
    const body = {
      couponCode
    }
    constant.switchLoader(dispatch, 'cart', true)
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      postApiCall(
        endpoint.applyPromo,
        body,
        (res: any) => {
          dispatch({
            type: actionNames.BASKET_INFO,
            payload: { basket: res?.data?.data }
          })
          ACPCore.trackAction('Apply Promo Success', {
            ...adobeReducerState,
            'cd.applyPromoSuccess': '1',
            'cd.promoCode': `${couponCode}`
          })
          constant.switchLoader(dispatch, 'cart', false)
          callback('200')
        },
        (err: any) => {
          if (err.status == 405 || err.status == 403) {
            dispatch(
              signInAgain((res: any) =>
                res === 'success'
                  ? dispatch(applyPromoCode(couponCode, callback))
                  : showToastMessage('Something went wrong!', 'invalid')
              )
            )
            constant.switchLoader(dispatch, 'cart', false)
            callback('403')
          } else {
            ACPCore.trackAction('Apply Promo Error', {
              ...adobeReducerState,
              'cd.applyPromoError': '1',
              'cd.promoCode': `${couponCode}`
            })
            constant.switchLoader(dispatch, 'cart', false)
            callback(err.data)
          }
        }
      )
    } else {
      callback('500')
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}

export function removePromoCode(couponCode: any, callback = (res: any) => {}) {
  return (dispatch: Function, getState: any) => {
    const adobeReducerState = getState().globalAdobeReducer
    const body = {
      couponCode: couponCode
    }
    constant.switchLoader(dispatch, 'cart', true)
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      console.log('delete api call', body, endpoint.applyPromo)
      deleteApiCall(
        `${endpoint.applyPromo}/${couponCode}`,
        '',
        {},
        (res: any) => {
          // dispatch({
          //   type: actionNames.BASKET_INFO,
          //   payload: { basket: res?.data?.data }
          // })
          dispatch(
            getBasket((res) => {
              ACPCore.trackAction('Remove Promo Success', {
                ...adobeReducerState,
                'cd.removePromoSuccess': '1',
                'cd.promoCode': `${couponCode}`
              })
              // constant.switchLoader(dispatch, 'cart', false)
              callback('200')
            })
          )
        },
        (err: any) => {
          if (err.status == 405 || err.status == 403) {
            dispatch(
              signInAgain((res: any) =>
                res === 'success'
                  ? dispatch(removePromoCode(couponCode, callback))
                  : showToastMessage('Something went wrong!', 'invalid')
              )
            )
            // constant.switchLoader(dispatch, 'cart', false)
            callback('403')
          } else {
            ACPCore.trackAction('Remove Promo Error', {
              ...adobeReducerState,
              'cd.removePromoError': '1',
              'cd.promoCode': `${couponCode}`
            })
            constant.switchLoader(dispatch, 'cart', false)
            callback(err.data)
          }
        }
      )
    } else {
      callback('500')
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}
