import Common from './Common'
import { showToastMessage } from './constant'
import { store } from '@ecom/store'

const header = {
  'X-Tracking-Id':
    store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
  'Cache-Control': 'no-cache',
  'Content-Type': 'application/json'
}
/**
 * post api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const customPostApiCallWithHeader = (
  endPoint: string,
  params: object,
  header: object,
  successCallback: Function,
  errorCalback: Function
) => {
  console.log('endpoint', endPoint)
  Common.custmisationAxiosInstance
    .post(endPoint, params, { headers: header })
    .then((response: any) => {
      console.log('response', response)
      successCallback(response)
    })
    .catch((error: any) => {
      console.log('error', error)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        errorCalback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          // store.dispatch(
          //   signInAgain((res: any) => {
          //     res === 'success'
          //       ? postApiCall(endPoint, params, successCallback, errorCalback)
          //       : errorCalback(error.response)
          //   })
          // )
        } else {
          errorCalback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        errorCalback(payload)
      }
    })
}
const customPostApiCall = (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCalback: Function
) => {
  Common.custmisationAxiosInstance
    .post(endPoint, params, { headers: header })
    .then((response: any) => {
      successCallback(response)
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        errorCalback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          // store.dispatch(
          //   signInAgain((res: any) => {
          //     res === 'success'
          //       ? postApiCall(endPoint, params, successCallback, errorCalback)
          //       : errorCalback(error.response)
          //   })
          // )
        } else {
          errorCalback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        errorCalback(payload)
      }
    })
}

/**
 * put api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */
const customPutApiCall = (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCalback: Function
) => {
  Common.custmisationAxiosInstance
    .put(endPoint, params, { headers: header })
    .then((response: any) => {
      successCallback(response)
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Internet', 'invalid')
        errorCalback(payload)
      } else if (error.response) {
        // console.log('error: ', error.response)
        // if (error.response?.status == 403) {
        //   store.dispatch(
        //     signInAgain((res: any) => {
        //       res === 'success'
        //         ? putApiCall(endPoint, params, successCallback, errorCalback)
        //         : errorCalback(error.response);
        //     }),
        //   );
        // } else {
        errorCalback(error.response)
        // }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        showToastMessage('Sorry Something went Wrong', 'invalid')
        errorCalback(payload)
      }
    })
}

/**
 * get api
 *
 * @param endPoint
 * @param body
 * @param errorCalback
 * @param successCallback
 *
 */

const customGetApiWithBodyCall = (
  endPoint: string,
  body: object,
  successCallback: Function,
  errorCalback: Function
) => {
  if (!body) {
    body = {}
  }
  Common.custmisationAxiosInstance
    .get(endPoint, { headers: header, params: body })
    .then((response: any) => {
      successCallback(response)
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Internet', 'invalid')
        errorCalback(payload)
      } else if (error.response) {
        if (error.response?.status == 403 || error.response?.status == 405) {
          // store.dispatch(
          // signInAgain((res: any) => {
          //   res === 'success'
          //     ? getApiWithBodyCall(
          //         endPoint,
          //         body,
          //         successCallback,
          //         errorCalback
          //       )
          //     : errorCalback(error.response)
          // })
          // )
        } else {
          errorCalback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        // showToastMessage('Sorry Something went Wrong', 'invalid')
        errorCalback(payload)
      }
    })
}

/**
 * get api
 *
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const customGetApiCall = (
  endPoint: string,
  successCallback: Function,
  errorCalback: Function
) => {
  Common.custmisationAxiosInstance
    .get(endPoint, { headers: header })
    .then((response: any) => {
      successCallback(response)
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        errorCalback(payload)
      } else if (error.response) {
        errorCalback(error.response)
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        // showToastMessage('Sorry Something went Wrong', 'invalid')
        errorCalback(payload)
      }
    })
}

/**
 * patch api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const customPatchApiCall = (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCalback: Function
) => {
  Common.custmisationAxiosInstance
    .patch(endPoint, params, { headers: header })
    .then((response: any) => {
      successCallback(response)
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        errorCalback(payload)
      } else if (error.response) {
        // if (error.response?.status == 403 || error.response?.status == 405) {
        //   if (awsconfig && awsconfig.aws_cognito_identity_pool_id) {
        //     AWS.config.region = awsconfig.aws_cognito_region
        //     var cognitoIdentity = new AWS.CognitoIdentity()

        //       console.info('*** uuid already exists in auth redux')
        //       cognitoIdentity.getOpenIdToken(
        //         {
        //           IdentityId: `${awsconfig.aws_cognito_region}:${1234}`,
        //         },
        //         (err, data: any) => {
        //           if (!err) {
        //             Common.setAwsToken(data.Token)
        //             console.log('Inside', data.Token)
        //           }
        //           console.log(
        //             `aws getOpenIdToken err = ${JSON.stringify(
        //               err
        //             )} data = ${JSON.stringify(data)}`
        //           )
        //         }
        //       )
        //       }

        //   // store.dispatch(
        //   //   signInAgain((res: any) => {
        //   //     res === 'success'
        //   //       ? patchApiCall(endPoint, params, successCallback, errorCalback)
        //   //       : errorCalback(error.response);
        //   //   }),
        //   // );
        // } else {
        errorCalback(error.response)
        // }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        // showToastMessage('Sorry Something went Wrong', 'invalid')
        errorCalback(payload)
      }
    })
}

/**
 * patch api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const customDeleteApiCall = (
  endPoint: string,
  params: string,
  body: any,
  successCallback: Function,
  errorCallback: Function
) => {
  body = body ? body : {}
  params = params ? params : ''
  Common.custmisationAxiosInstance
    .delete(endPoint + params, { headers: header })
    .then((response: any) => {
      successCallback(response)
    })
    .catch((error: any) => {
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            status: 408
          }
        }
        errorCallback(payload)
      } else if (error.response) {
        // if (error.response?.status == 403) {
        //   store.dispatch((res: any) => {
        //     res === 'success'
        //       ? deleteApiCall(
        //           endPoint,
        //           params,
        //           body,
        //           successCallback,
        //           errorCallback,
        //         )
        //       : errorCallback(error.response);
        //   });
        // } else {
        errorCallback(error.response)
        // }
      } else if (!error.response) {
        let payload = {
          data: {
            status: ''
          }
        }
        // showToastMessage('Sorry Something went Wrong', 'invalid')
        errorCallback(payload)
      }
    })
}
/**
 * Global API multi purpose handler
 * @param payload
 * @param dropdown
 */
const handleApiError = (payload: any) => {
  return payload
}

export {
  customGetApiCall,
  customPutApiCall,
  customPostApiCall,
  customPatchApiCall,
  customDeleteApiCall,
  handleApiError,
  customGetApiWithBodyCall,
  customPostApiCallWithHeader
}
