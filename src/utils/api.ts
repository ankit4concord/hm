import Common from './Common'
import { showToastMessage } from './constant'
import { store } from '@ecom/store'

const postApiCall = async (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCallback: Function,
  onUploadProgress?: (progressEvent: any) => void
) => {
  if (store.getState()?.internetStatusReducer?.isConnected) {
    const header = {
      'X-Tracking-Id':
        store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
      'Cache-Control': 'no-cache',
      identityToken: store.getState()?.authReducer?.awsToken,
      customerId: store.getState()?.authReducer?.user?.customer_id
    }
    console.log(endPoint)

    const uploadProgress = onUploadProgress ? onUploadProgress : () => {}

    try {
      let postResponse = await Common.axiosInstance.post(endPoint, params, {
        headers: header,
        onUploadProgress: uploadProgress
      })
      console.log('response=', postResponse)
      successCallback(postResponse)
    } catch (error: any) {
      console.log('error=', error.response)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          errorCallback(error.response)
        } else {
          errorCallback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        // showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      }
    }
  } else {
    // showToastMessage('Please Check Your Internet Connection', 'invalid')
    let payload = {
      data: {
        statusCode: 500
      }
    }
    errorCallback(payload)
  }
}

/**
 * put api
 *
 * @param params
 * @param endPoint
 * @param errorCallback
 * @param successCallback
 */
const putApiCall = async (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCallback: Function
) => {
  if (store.getState()?.internetStatusReducer?.isConnected) {
    const header = {
      'X-Tracking-Id':
        store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
      'Cache-Control': 'no-cache',
      identityToken: store.getState()?.authReducer?.awsToken,
      customerId: store.getState()?.authReducer?.user?.customer_id
    }
    console.log(endPoint)
    try {
      const putResponse = await Common.axiosInstance.put(endPoint, params, {
        headers: header
      })
      console.log('response=', putResponse)
      successCallback(putResponse)
    } catch (error: any) {
      console.log('error=', error.response)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          errorCallback(error.response)
        } else errorCallback(error.response)
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      }
    }
  } else {
    showToastMessage('Please Check Your Internet Connection', 'invalid')
    let payload = {
      data: {
        statusCode: 500
      }
    }
    errorCallback(payload)
  }
}

/**
 * get api
 *
 * @param endPoint
 * @param body
 * @param errorCallback
 * @param successCallback
 *
 */

const getApiWithBodyCall = async (
  endPoint: string,
  body: object,
  successCallback: Function,
  errorCallback: Function
) => {
  if (store.getState()?.internetStatusReducer?.isConnected) {
    const header = {
      'X-Tracking-Id':
        store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
      'Cache-Control': 'no-cache',
      identityToken: store.getState()?.authReducer?.awsToken,
      customerId: store.getState()?.authReducer?.user?.customer_id
    }
    console.log(endPoint)
    console.log(header)
    if (!body) {
      body = {}
    }
    try {
      const getResponseWithBody = await Common.axiosInstance.get(endPoint, {
        headers: header,
        params: body
      })
      console.log('response=', getResponseWithBody)
      successCallback(getResponseWithBody)
    } catch (error: any) {
      console.log('error=', error.response)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      } else if (error.response) {
        if (error.response?.status == 403 || error.response?.status == 405) {
          errorCallback(error.response)
        } else {
          errorCallback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      }
    }
  } else {
    showToastMessage('Please Check Your Internet Connection', 'invalid')
    let payload = {
      data: {
        statusCode: 500
      }
    }
    errorCallback(payload)
  }
}

/**
 * get api
 *
 * @param endPoint
 * @param errorCallback
 * @param successCallback
 */

const getApiCall = async (
  endPoint: string,
  successCallback: Function,
  errorCallback: Function
) => {
  if (store.getState()?.internetStatusReducer?.isConnected) {
    const headerData = {
      'X-Tracking-Id':
        store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
      'Cache-Control': 'no-cache',
      identityToken: store.getState()?.authReducer?.awsToken,
      customerId: store.getState()?.authReducer?.user?.customer_id
    }
    console.log(endPoint, headerData)
    try {
      const getResponse = await Common.axiosInstance.get(endPoint, {
        headers: headerData
      })
      console.log('response-', getResponse)
      successCallback(getResponse)
    } catch (error: any) {
      console.log('error-', error)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          errorCallback(error.response)
        } else {
          errorCallback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        // showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      }
    }
  } else {
    showToastMessage('Please Check Your Internet Connection', 'invalid')
    let payload = {
      data: {
        statusCode: 500
      }
    }
    errorCallback(payload)
  }
}

/**
 * patch api
 *
 * @param params
 * @param endPoint
 * @param errorCallback
 * @param successCallback
 */

const patchApiCall = async (
  endPoint: string,
  params: object,
  successCallback: Function,
  errorCallback: Function
) => {
  if (store.getState()?.internetStatusReducer?.isConnected) {
    const header = {
      'X-Tracking-Id':
        store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
      'Cache-Control': 'no-cache',
      identityToken: store.getState()?.authReducer?.awsToken,
      customerId: store.getState()?.authReducer?.user?.customer_id
    }
    try {
      const patchResponse = await Common.axiosInstance.patch(endPoint, params, {
        headers: header
      })
      console.log('response=', patchResponse)
      successCallback(patchResponse)
    } catch (error: any) {
      console.log('error=', error.response)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            statusCode: 408
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          errorCallback(error.response)
        } else {
          errorCallback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            statusCode: ''
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      }
    }
  } else {
    showToastMessage('Please Check Your Internet Connection', 'invalid')
    let payload = {
      data: {
        statusCode: 500
      }
    }
    errorCallback(payload)
  }
}

/**
 * patch api
 *
 * @param params
 * @param endPoint
 * @param errorCallback
 * @param successCallback
 */

const deleteApiCall = async (
  endPoint: string,
  params: string,
  body: any,
  successCallback: Function,
  errorCallback: Function
) => {
  console.log('inside api')
  if (store.getState()?.internetStatusReducer?.isConnected) {
    const header = {
      'X-Tracking-Id':
        store.getState()?.authReducer?.uuid + '-' + new Date().getTime(),
      'Cache-Control': 'no-cache',
      identityToken: store.getState()?.authReducer?.awsToken,
      customerId: store.getState()?.authReducer?.user?.customer_id
    }
    console.log(endPoint, 'body=', body, 'param=', params, 'headers=', header)
    try {
      body = body ? body : {}
      params = params ? params : ''
      const deleteResponse = await Common.axiosInstance.delete(endPoint, {
        headers: header
      })
      console.log('response=', deleteResponse)
      successCallback(deleteResponse)
    } catch (error: any) {
      console.log('error=', error.response)
      if (error.code === 'ECONNABORTED') {
        let payload = {
          data: {
            status: 408
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      } else if (error.response) {
        if (error.response?.status == 403) {
          errorCallback(error.response)
        } else {
          errorCallback(error.response)
        }
      } else if (!error.response) {
        let payload = {
          data: {
            status: ''
          }
        }
        showToastMessage('Please Check Your Internet Connection', 'invalid')
        errorCallback(payload)
      }
    }
  } else {
    console.log('inside api 2')
    showToastMessage('Please Check Your Internet Connection', 'invalid')
    let payload = {
      data: {
        statusCode: 500
      }
    }
    errorCallback(payload)
  }
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
  getApiCall,
  putApiCall,
  postApiCall,
  patchApiCall,
  deleteApiCall,
  handleApiError,
  getApiWithBodyCall
}
