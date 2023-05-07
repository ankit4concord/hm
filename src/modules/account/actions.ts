/* eslint-disable no-console */
import {
  CareCase,
  CareFile,
  ErrorResponse,
  Profile
} from '@ecom/modals/interfaces'
import actionNames from '@ecom/utils/actionNames'
import { getApiCall, postApiCall, putApiCall } from '@ecom/utils/api'
import constant from '@ecom/utils/constant'
import endpoint from '@ecom/utils/endpoint'
import { lowercaseKeys } from '@ecom/utils/object-utils'
import { getKeychain, saveKeychain, signInAgain } from '../auth/action'
import RNFS from 'react-native-fs'
import { mapOrderDetails, mapOrders } from '@ecom/utils/order-history-helper'
import { OrderHistoryModel } from '@ecom/modals'

const unknownError = {
  code: 500,
  message: 'Uh-oh, something went wrong. Please try again.'
}

export const getProfile = () => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'profile', true)
      getApiCall(
        endpoint.profile,
        (response: any) => {
          const transformedResponse = lowercaseKeys(response)
          dispatch({
            type: actionNames.PROFILE_REDUCER,
            payload: {
              profile: {
                ...transformedResponse.data?.data
              }
            }
          })
          constant.switchLoader(dispatch, 'profile', false)
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(getProfile())
                } else {
                  constant.switchLoader(dispatch, 'profile', false)
                }
              })
            )
          } else {
            constant.switchLoader(dispatch, 'profile', false)
          }
        }
      )
    }
  }
}

export const getPaymentMethods = () => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'profile', true)
      getApiCall(
        endpoint.payments,
        (response: any) => {
          dispatch({
            type: actionNames.PAYMENT_METHODS_REDUCER,
            payload: {
              paymentMethods: response.data?.data
            }
          })
          constant.switchLoader(dispatch, 'profile', false)
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(getPaymentMethods())
                } else {
                  constant.switchLoader(dispatch, 'profile', false)
                }
              })
            )
          } else {
            constant.switchLoader(dispatch, 'profile', false)
          }
        }
      )
    }
  }
}

export const changePassword = (
  oldPassword: string,
  newPassword: string,
  confirmPassword: string,
  callback: (res: ErrorResponse) => void
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'profile', true)
      putApiCall(
        endpoint.password,
        { oldPassword, newPassword, confirmPassword },
        (response: any) => {
          if (response?.status === 200) {
            const { profile } = getState().authReducer
            if (profile?.email) {
              dispatch(
                saveKeychain(
                  { email: profile.email, password: newPassword },
                  () => console.log('data saved in keychain')
                )
              )
            }
            callback({ code: 200 })
          }
          constant.switchLoader(dispatch, 'profile', false)
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(
                    changePassword(
                      oldPassword,
                      newPassword,
                      confirmPassword,
                      callback
                    )
                  )
                } else {
                  changePasswordHandleError(error, dispatch, callback)
                }
              })
            )
          } else {
            changePasswordHandleError(error, dispatch, callback)
          }
        }
      )
    }
  }
}

const changePasswordHandleError = (
  error: any,
  dispatch: Function,
  callback: (res: ErrorResponse) => void
) => {
  if (error?.status === 400) {
    if (error?.data?.error) {
      switch (error.data.error) {
        case "'newPassword' contains an invalid value":
          callback({
            code: 400,
            message: "Your new password shouldn't match your old password."
          })
          break
        case 'The passwords do not match.':
          callback({
            code: 400,
            message: "The confirmation doesn't match your the new password."
          })
          break
        case 'Password should be minimum 8 characters and should contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character':
          callback({
            code: 400,
            message: "Please try again. Your password doesn't meet requirements"
          })
          break
        default:
          callback(unknownError)
      }
    } else if (Array.isArray(error?.data?.data) && error.data.data.length > 0) {
      const firstError = error.data.data[0]
      if (firstError?.Code === 403042) {
        callback({
          code: 400,
          message: "Your current password isn't correct."
        })
      } else {
        callback(unknownError)
      }
    } else {
      callback(unknownError)
    }
  } else {
    callback(unknownError)
  }
  constant.switchLoader(dispatch, 'profile', false)
}

export const updateProfile = (
  profile: Profile,
  callback: (res: ErrorResponse | ErrorResponse[]) => void
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'profile', true)
      putApiCall(
        endpoint.profile,
        {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          dateOfBirth: {
            Day: profile.dateOfBirth?.day,
            Month: profile.dateOfBirth?.month
          },
          address: {
            addressLine1: profile.address?.addressLine1,
            addressLine2: profile.address?.addressLine2 || '',
            city: profile.address?.city,
            stateCode: profile.address?.stateCode,
            countryCode: profile.address?.addressLine1 ? 'USA' : undefined,
            zip: profile.address?.zip
          }
        },
        async (response: any) => {
          if (response?.status === 200) {
            dispatch(
              getKeychain((credentials) => {
                if (
                  credentials &&
                  profile.email &&
                  profile.email !== credentials.username
                ) {
                  dispatch(
                    saveKeychain(
                      { email: profile.email, password: credentials.password },
                      () => console.log('data saved in keychain')
                    )
                  )
                }
              })
            )
            callback({ code: 200 })
          }
          constant.switchLoader(dispatch, 'profile', false)
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(updateProfile(profile, callback))
                } else {
                  updateProfileHandleError(error, dispatch, callback)
                }
              })
            )
          } else {
            updateProfileHandleError(error, dispatch, callback)
          }
        }
      )
    }
  }
}

const updateProfileHandleError = (
  error: any,
  dispatch: Function,
  callback: (res: ErrorResponse | ErrorResponse[]) => void
) => {
  if (error?.status === 400) {
    if (error?.data?.error) {
      switch (error.data.error) {
        case "'address.countryCode' is required":
          callback(unknownError)
          break
        case "'address.zip' is required":
          callback({
            code: 400,
            parentField: 'address',
            field: 'zip',
            message: 'Please enter your zip code'
          })
          break
        case "'address.stateCode' is required":
          callback({
            code: 400,
            parentField: 'address',
            field: 'stateCode',
            message: 'Please select a state'
          })
          break
        case "'address.city' is required":
          callback({
            code: 400,
            parentField: 'address',
            field: 'city',
            message: 'Please enter your city'
          })
          break
        case "'address.addressLine1' is required":
          callback({
            code: 400,
            parentField: 'address',
            field: 'addressLine1',
            message: 'Please enter address line 1'
          })
          break
        case "'firstName' is not allowed to be empty":
          callback({
            code: 400,
            field: 'firstName',
            message: 'Please enter your first name'
          })
          break
        case "'lastName' is not allowed to be empty":
          callback({
            code: 400,
            field: 'lastName',
            message: 'Please enter your last name'
          })
          break
        case "'email' is not allowed to be empty":
          callback({
            code: 400,
            field: 'email',
            message: 'Please enter your email address'
          })
          break
        case "'email' must be a valid email":
          callback({
            code: 400,
            field: 'email',
            message: 'Please enter a valid email'
          })
          break
        default:
          callback(unknownError)
      }
    } else if (Array.isArray(error?.data?.data) && error.data.data.length > 0) {
      const errors: ErrorResponse[] = []
      error.data.data.forEach((err: any) => {
        switch (err?.Code) {
          case 8027:
            errors.push({
              code: 400,
              parentField: 'address',
              field: 'zip',
              message: err.Message
            })
            break
          case 8055:
            errors.push({
              code: 400,
              parentField: 'address',
              field: 'city',
              message: err.Message
            })
            break
          case 8045:
            errors.push({
              code: 400,
              field: 'firstName',
              message: err.Message
            })
            break
          case 8046:
            errors.push({
              code: 400,
              field: 'lastName',
              message: err.Message
            })
            break
          case 8013:
            errors.push({
              code: 400,
              field: 'address',
              message: err.CorrectedValue
            })
            break
          default:
            break
        }
      })
      if (errors.length === 0) {
        callback(unknownError)
      } else {
        callback(errors)
      }
    } else {
      callback(unknownError)
    }
  } else {
    callback(unknownError)
  }
  constant.switchLoader(dispatch, 'profile', false)
}

export const createCareCase = (
  careCase: CareCase,
  callback: (res: ErrorResponse | ErrorResponse[]) => void,
  skipCaseNum?: boolean
) => {
  return async (dispatch: Function, getState: any) => {
    dispatch({
      type: actionNames.CARE_ADD_INFO,
      payload: careCase
    })
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      postApiCall(
        endpoint.createCase,
        careCase,
        async (response: any) => {
          if (response?.status === 201 && response?.data?.data?.id) {
            if (!skipCaseNum) {
              const id: string = response.data.data.id
              dispatch({
                type: actionNames.CARE_ADD_CASE_ID,
                payload: { caseID: id }
              })
              dispatch(getCaseNum(id, callback))
            } else {
              callback({ code: 200 })
            }
          } else {
            console.log(response)
            callback(unknownError)
          }
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(createCareCase(careCase, callback, skipCaseNum))
                } else {
                  console.log(error)
                  if (
                    error?.status === 400 &&
                    error?.data?.error &&
                    error.data.error.includes('email')
                  ) {
                    callback({
                      code: 400,
                      message: 'Please enter a valid email address'
                    })
                  } else {
                    callback(unknownError)
                  }
                }
              })
            )
          } else {
            console.log(error)
            if (
              error?.status === 400 &&
              error?.data?.error &&
              error.data.error.includes('email')
            ) {
              callback({
                code: 400,
                message: 'Please enter a valid email address'
              })
            } else {
              callback(unknownError)
            }
          }
        }
      )
    }
  }
}

export const getCaseNum = (
  id: string,
  callback: (res: ErrorResponse | ErrorResponse[]) => void,
  retry: number = 3
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      getApiCall(
        `${endpoint.caseDetails}?caseId=${id}`,
        async (response: any) => {
          if (response?.status === 200 && response?.data?.data?.CaseNumber) {
            const caseNum = response.data.data.CaseNumber
            dispatch({
              type: actionNames.CARE_ADD_CASE_NUM,
              payload: { caseNumber: caseNum }
            })
            callback({ code: 200 })
          } else {
            callback(unknownError)
          }
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(getCaseNum(id, callback, retry))
                } else {
                  if (
                    error?.status === 500 &&
                    error?.data?.error?.includes('404') &&
                    retry !== 0
                  ) {
                    setTimeout(() => {
                      dispatch(getCaseNum(id, callback, retry - 1))
                    }, 3000)
                  } else {
                    callback(unknownError)
                  }
                }
              })
            )
          } else {
            if (
              error?.status === 500 &&
              error?.data?.error?.includes('404') &&
              retry !== 0
            ) {
              setTimeout(() => {
                dispatch(getCaseNum(id, callback, retry - 1))
              }, 3000)
            } else {
              callback(unknownError)
            }
          }
        }
      )
    }
  }
}

export const uploadFiles = (callback: (res: ErrorResponse) => void) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      const care = getState().careReducer
      const files = [...care.files]
      files.forEach((f) => {
        dispatch(addCaseFile(f, care.caseID, callback))
      })
    }
  }
}

const addCaseFile = (
  file: CareFile,
  id: string,
  callback: (res: ErrorResponse) => void
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      // eslint-disable-next-line prettier/prettier
      const decodedURI = file.uri.split('%20').join('\ ')
      const base64 = await RNFS.readFile(decodedURI, 'base64')
      await dispatch({
        type: actionNames.CARE_UPDATE_FILE,
        payload: {
          uri: file.uri,
          uploadProgress: 0,
          showUploadBar: true,
          uploadMessage: '',
          uploadMessageError: false
        }
      })
      let previousPercentage = 0
      const onUploadProgress = (progressEvent: any) => {
        const progress = progressEvent.loaded / progressEvent.total
        const progressPercentage = Math.floor(progress * 100)
        if (
          progressPercentage > previousPercentage &&
          progressPercentage % 5 === 0 &&
          progress < 0.95
        ) {
          previousPercentage = progressPercentage
          dispatch({
            type: actionNames.CARE_UPDATE_FILE_PROGRESS,
            payload: {
              uri: file.uri,
              uploadProgress: progress,
              showUploadBar: true
            }
          })
        }
      }
      await postApiCall(
        endpoint.addCaseFiles,
        {
          Title: file.fileName,
          PathOnClient: 'simple',
          ContentLocation: 'S',
          FirstPublishLocationId: id,
          VersionData: base64
        },
        async (response: any) => {
          if (response.status === 201) {
            await dispatch({
              type: actionNames.CARE_UPDATE_FILE,
              payload: {
                uri: file.uri,
                uploadMessage: 'Upload Successful',
                uploadMessageError: false,
                uploadProgress: 1,
                showUploadBar: false
              }
            })
            const { finished, files } = getState().careReducer
            if (finished) {
              const success = files.every(
                (f: CareFile) => f.uploadMessage && !f.uploadMessageError
              )
              callback({ code: 200, message: success.toString() })
            }
          }
        },
        async (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(addCaseFile(file, id, callback))
                } else {
                  dispatch({
                    type: actionNames.CARE_UPDATE_FILE,
                    payload: {
                      uri: file.uri,
                      uploadMessage: 'Something went wrong. Please try again.',
                      uploadMessageError: true,
                      uploadProgress: 1,
                      showUploadBar: false
                    }
                  })
                  const { finished } = getState().careReducer
                  if (finished) {
                    callback(unknownError)
                  }
                }
              })
            )
          } else {
            await dispatch({
              type: actionNames.CARE_UPDATE_FILE,
              payload: {
                uri: file.uri,
                uploadMessage: 'Something went wrong. Please try again.',
                uploadMessageError: true,
                uploadProgress: 1,
                showUploadBar: false
              }
            })
            const { finished } = getState().careReducer
            if (finished) {
              callback(unknownError)
            }
          }
        },
        onUploadProgress
      )
    }
  }
}

const addMonths = (date: Date, months: number) => {
  date.setMonth(date.getMonth() + months)
  return date
}

export const getOrders = (
  getNext: boolean = false,
  callback: (loaded: boolean) => void
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'orderHistory', true)
      const date = addMonths(new Date(), -12).toISOString().substring(0, 10)
      const { page: currentPage } = getState().orderHistoryReducer
      const page = getNext ? currentPage + 1 : 0
      getApiCall(
        `${endpoint.orderHistory}?capturedStartDate=${date}&page=${page}&templateName=HLMKOrderHistoryTemplate`,
        (response: any) => {
          if (
            response?.status === 200 &&
            response?.data?.data?.EntityList &&
            response.data.data.EntityList.length > 0
          ) {
            const orders = response?.data?.data?.EntityList || []
            const mappedOrders = mapOrders(orders)
            const total = response?.data?.data?.TotalNoRecords || 0
            const action = getNext
              ? actionNames.ORDER_HISTORY_ADD_TO_LIST
              : actionNames.ORDER_HISTORY_SET_LIST
            dispatch({
              type: action,
              payload: {
                orders: mappedOrders,
                total: total,
                page: page
              }
            })
          }
          callback(true)
          constant.switchLoader(dispatch, 'orderHistory', false)
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(getOrders(getNext, callback))
                } else {
                  callback(true)
                  constant.switchLoader(dispatch, 'orderHistory', false)
                  console.log(error)
                }
              })
            )
          } else {
            callback(true)
            constant.switchLoader(dispatch, 'orderHistory', false)
            console.log(error)
          }
        }
      )
    }
  }
}

export const getOrder = (
  orderID: string,
  callback: (res: ErrorResponse) => void
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected && orderID) {
      constant.switchLoader(dispatch, 'orderHistory', true)
      getApiCall(
        `${endpoint.orderDetail}?orderId=${orderID}&templateName=HLMKKOCOrderDetailsTemplate`,
        (response: any) => {
          if (
            response?.status === 200 &&
            response?.data?.data?.EntityList &&
            response.data.data.EntityList.length > 0
          ) {
            const { orders } = getState()
              .orderHistoryReducer as OrderHistoryModel

            const ohOrder = orders.find(
              (o) => o.id === response.data.data.EntityList[0].OrderId
            )

            const order = mapOrderDetails(
              response.data.data.EntityList[0],
              ohOrder
            )
            callback({ code: 200, data: order })
          } else {
            callback(unknownError)
          }
          constant.switchLoader(dispatch, 'orderHistory', false)
        },
        (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(getOrder(orderID, callback))
                } else {
                  constant.switchLoader(dispatch, 'orderHistory', false)
                  callback(unknownError)
                  console.log(error)
                }
              })
            )
          } else {
            constant.switchLoader(dispatch, 'orderHistory', false)
            callback(unknownError)
            console.log(error)
          }
        }
      )
    }
  }
}

export const makePaymentDefault = (
  ccID: string,
  callback: (res: ErrorResponse) => void
) => {
  return async (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected && ccID) {
      await postApiCall(
        endpoint.makePaymentDefault,
        {
          CrditCardID: ccID
        },
        async (response: any) => {
          if (response?.status === 200) {
            callback({ code: 200 })
          } else {
            callback(unknownError)
          }
        },
        async (error: any) => {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                if (res === 'success') {
                  dispatch(makePaymentDefault(ccID, callback))
                } else {
                  console.log(error)
                  callback(unknownError)
                }
              })
            )
          } else {
            console.log(error)
            callback(unknownError)
          }
          console.log(error)
          callback(unknownError)
        }
      )
    }
  }
}
