import * as Keychain from 'react-native-keychain'

import constant, { showToastMessage } from '@ecom/utils/constant'
import { getApiCall, postApiCall } from '@ecom/utils/api'

import { ACPCore } from '@adobe/react-native-acpcore'
import AWS from 'aws-sdk'
import Common from '@ecom/utils/Common'
import DeviceInfo from 'react-native-device-info'
import { NativeModules } from 'react-native'
import actionNames from '@ecom/utils/actionNames'
import awsconfig from '@ecom/aws-exports'
import endpoint from '@ecom/utils/endpoint'
import { getBasket } from '../cart/actions'

export function saveKeychain(data: any, callback = () => {}) {
  return async () => {
    const username = data.email
    const password = data.password
    const bundleId = DeviceInfo.getBundleId()
    var settings = { service: bundleId }
    await Keychain.setGenericPassword(username, password, settings)
    try {
      const credentials = await Keychain.getGenericPassword(settings)
      if (credentials) {
        callback()
      }
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error)
    }
  }
}

export function getKeychain(
  callback = (credentials: false | Keychain.UserCredentials) => {}
) {
  return async () => {
    const credentials = await Keychain.getGenericPassword({
      service: DeviceInfo.getBundleId()
    })
    callback(credentials)
  }
}

export function signIn(data: any, callback = (res: any) => {}) {
  const { RNMarketingCloudSdk } = NativeModules
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    const adobeReducerState = getState().globalAdobeReducer
    const { basket } = getState().cartReducer
    let payload = {
      type: 'credentials',
      email: data?.email,
      password: data?.password
    }

    if (isConnected) {
      constant.switchLoader(dispatch, 'auth', true)
      postApiCall(
        endpoint.signIn,
        payload,
        async (response: any) => {
          Common.setCustomerId(response?.data?.customerId)
          Common.setBearerToken(response?.data?.customerData?.hallmarkToken)

          const cid = response?.data?.customerData?.cid
          if (cid) {
            await RNMarketingCloudSdk.getContactKey().then(
              (contactKey: string) => {
                if (contactKey && contactKey !== cid) {
                  RNMarketingCloudSdk.setContactKey(cid)
                }
              }
            )
          }

          dispatch({
            type: actionNames.USER_REDUCER,
            payload: {
              user: {
                ...response.data?.data,
                ...response.data?.customerData
              }
            }
          })

          constant.switchLoader(dispatch, 'auth', false)

          if (data?.type !== 'guest' && data?.check)
            dispatch(
              saveKeychain(data, () => console.log('data saved in keychain'))
            )

          ACPCore.trackAction('Sign In Success', {
            ...adobeReducerState,
            'cd.authenticatedStatus': 'credentials',
            'cd.signInSuccess': '1'
          })
          dispatch({
            type: actionNames.TRACK_STATE,
            payload: {
              'cd.authenticatedStatus': 'credentials',
              'cd.consumerID': response.data?.data?.c_consumerID
            }
          })

          dispatch({
            type: actionNames.AUTH_REDUCER,
            payload: {
              isInstalled: true,
              isGuestMode: false
            }
          })
          if (data?.type !== 'guest' && !basket?.basketID) {
            dispatch(
              getBasket(() => {
                callback(200)
              })
            )
          } else {
            callback(200)
          }
        },
        (error: any) => {
          ACPCore.trackAction('Sign In Error', {
            ...adobeReducerState,
            'cd.signInError': '1'
          })
          if (error?.data?.code === 401) {
            callback(401)
            constant.switchLoader(dispatch, 'auth', false)
          } else if (error?.status === 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(signIn(data, callback))
                  : showToastMessage('Unable to get product list', 'danger')
              })
            )
          } else if (error?.data?.statusCode === 408) {
            constant.switchLoader(dispatch, 'auth', false)
          } else {
            console.log('error of login', error)
            showToastMessage('Sorry Something went worng', 'invalid')
            callback(error?.data?.code)
            constant.switchLoader(dispatch, 'auth', false)
          }
        }
      )
    } else {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}

export function forgotPass(data: object, callback = (res: any) => {}) {
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'auth', true)
      postApiCall(
        endpoint.forgotPass,
        data,
        (response: any) => {
          callback(200)
          constant.switchLoader(dispatch, 'auth', false)
        },
        (error: any) => {
          if (error?.data?.code === 401) {
            callback(401)
            constant.switchLoader(dispatch, 'auth', false)
          } else if (error?.data?.statusCode === 408) {
            constant.switchLoader(dispatch, 'auth', false)
          } else {
            console.log('error of forgotPass', error)
            callback(401)
            constant.switchLoader(dispatch, 'auth', false)
          }
        }
      )
    } else {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}

export function signUp(data: object, callback = (res: any) => {}) {
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    const adobeReducerState = getState().globalAdobeReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'auth', true)
      postApiCall(
        endpoint.signUp,
        data,
        (response: any) => {
          constant.switchLoader(dispatch, 'auth', false)
          console.log('Signup response', response)

          ACPCore.trackAction('Create Account Success', {
            ...adobeReducerState,
            'cd.signUpSuccess': '1'
          })
          dispatch({
            type: actionNames.AUTH_REDUCER,
            payload: {
              isGuestMode: false
            }
          })
          callback(200)
        },
        (error: any) => {
          ACPCore.trackAction('Create Account Error', {
            ...adobeReducerState,
            'cd.signUpError': '1'
          })
          if (error?.data?.code === 409) {
            callback(409)
            constant.switchLoader(dispatch, 'auth', false)
          } else if (error?.data?.statusCode === 408) {
            constant.switchLoader(dispatch, 'auth', false)
          } else if (error?.status === 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(signUp(data, callback))
                  : showToastMessage('Unable to get product list', 'danger')
              })
            )
          } else {
            console.log('error of register', error)
            callback(error.status)
            constant.switchLoader(dispatch, 'auth', false)
          }
        }
      )
    } else {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}

export function signInAgain(callback = (res: string) => {}) {
  return async (dispatch: Function, getState: any) => {
    const { uuid, isGuestMode } = getState().authReducer
    const { basket } = getState().cartReducer
    const { isConnected } = getState().internetStatusReducer

    if (isConnected) {
      //Refresh Aws
      AWS.config.region = awsconfig.aws_cognito_region
      var cognitoIdentity = new AWS.CognitoIdentity()
      if (awsconfig && awsconfig.aws_cognito_identity_pool_id) {
        var cognitoIdentity = new AWS.CognitoIdentity()
        cognitoIdentity.getOpenIdToken(
          {
            IdentityId: `${awsconfig.aws_cognito_region}:${uuid}`
          },
          async (err, data: any) => {
            if (!err) {
              dispatch({
                type: actionNames.AUTH_REDUCER,
                payload: { awsToken: data.Token }
              })
              Common.setAwsToken(data.Token)

              if (isGuestMode) {
                dispatch(
                  loginAsGuest((res) => {
                    if (res === 'success') callback('success')
                    else showToastMessage('Something went wrong', 'error')
                  })
                )
              } else {
                let credentials: any = undefined
                const bundleId = DeviceInfo.getBundleId()
                credentials = await Keychain.getGenericPassword({
                  service: bundleId
                })
                let payload = {
                  type: 'credentials',
                  email: credentials?.username,
                  password: credentials?.password
                }

                postApiCall(
                  endpoint.signIn,
                  payload,
                  (response: any) => {
                    console.log('Login Response', response)

                    dispatch({
                      type: actionNames.USER_REDUCER,
                      payload: {
                        user: {
                          ...response.data?.data,
                          ...response.data?.customerData
                        }
                      }
                    })
                    Common.setBearerToken(
                      response?.data?.customerData?.hallmarkToken
                    )
                    if (isGuestMode) {
                      console.log(response?.data)
                      Common.setCustomerId(response?.data?.customerId)
                    } else {
                      Common.setCustomerId(
                        response?.data?.customerData?.customerId
                      )
                    }
                    if (data?.type !== 'guest' && !basket?.basketID) {
                      dispatch(
                        getBasket(() => {
                          callback('success')
                        })
                      )
                    } else {
                      callback('success')
                    }
                  },
                  (error: any) => {
                    if (error?.data?.code === 401) {
                      callback('error')
                      constant.switchLoader(dispatch, 'auth', false)
                    } else if (error?.data?.statusCode === 408) {
                      constant.switchLoader(dispatch, 'auth', false)
                    } else if (error?.data?.statusCode === 403) {
                      showToastMessage('Something went wrong', 'error')
                    } else {
                      console.log('error of login', error)
                      callback('error')
                      constant.switchLoader(dispatch, 'auth', false)
                    }
                  }
                )
              }
            } else {
              callback('error')
            }
          }
        )
      }
    } else {
      showToastMessage('Please Check Your Internet Connection', 'invalid')
    }
  }
}

export function updateInternetField(connected: boolean) {
  return (dispatch: Function) => {
    dispatch({
      type: actionNames.UPDATE_INTERNET_FIELDS,
      payload: { isConnected: connected }
    })
  }
}

export function loginAsGuest(callback = (res: String) => {}) {
  return async (dispatch: Function) => {
    let payload = {
      type: 'guest'
    }
    postApiCall(
      endpoint.signIn,
      payload,
      (response: any) => {
        dispatch({
          type: actionNames.AUTH_REDUCER,
          payload: {
            isGuestMode: true,
            isUserVisitedForYouFirstTime: false,
            isUserVisitHomeFirstTime: false
          }
        })
        dispatch({
          type: actionNames.USER_REDUCER,
          payload: { user: response?.data }
        })
        Common.setCustomerId(response?.data?.customerId)

        Common.setBearerToken(response?.data?.customerData?.hallmarkToken)

        callback('success')
      },
      (error: any) => {
        console.log(' error of guest', error)
        callback('error')
      }
    )
  }
}

export function getAppConfig(callback = (res: any) => {}) {
  return async (dispatch: Function) => {
    getApiCall(
      endpoint.appConfig,
      (response: any) => {
        dispatch({
          type: actionNames.STATIC_DATA,
          payload: { appConfigValues: response?.data?.data }
        })
        callback(response?.data?.data)
      },
      (error: any) => {
        console.log(' error of config', error)
        callback({ data: false })
      }
    )
  }
}
