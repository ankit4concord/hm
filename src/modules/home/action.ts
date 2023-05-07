import Common from '@ecom/utils/Common'
import actionNames from '../../utils/actionNames'
import constant from '@ecom/utils/constant'
import endpoint from '../../utils/endpoint'
import { getApiCall } from '../../utils/api'
import { signInAgain } from '../auth/action'

export function fetchHomeData() {
  return (dispatch: Function, getState: any) => {
    const { authModal } = getState().homeReducer
    const { home_content_slots } = getState().homeReducer
    if ((home_content_slots && home_content_slots.length === 0) || !authModal) {
      constant.switchLoader(dispatch, 'home', true)
      getApiCall(
        endpoint.home,
        (res: any) => {
          if (
            JSON.stringify(res?.data?.content?.content_slots) !==
            JSON.stringify(home_content_slots)
          ) {
            let homepageComponents = ''
            if(res?.data?.content && res?.data?.content.length){
              res?.data?.content.forEach((element, index) => {
                if(index !== 0){
                  homepageComponents += '|'
                }
                homepageComponents += element?.type
              });
            }
            dispatch({
              type: actionNames.HOME_REDUCER,
              payload: {
                homePageDesignerData: res?.data?.content,
                homepageComponents
              }
            })
          }
          constant.switchLoader(dispatch, 'home', false)
        },
        (err: any) => {
          if (err.status == 403 || err.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success' ? dispatch(fetchHomeData()) : ''
              })
            )
          }
        }
      )
    }
  }
}

export function getCategoryList(data: object, callback = (data: any) => {}) {
  return (dispatch: Function, getState: Function) => {
    const { authModal } = getState().authReducer

    !authModal && constant.switchLoader(dispatch, 'shop', true)

    getApiCall(
      endpoint.categories,
      (res: any) => {
        dispatch({
          type: actionNames.CATEGORY_INFO,
          payload: {
            categories: res?.data?.data?.categoryData?.categories,
            redirectionData: res?.data?.data?.redirectData,
            rootCategories: res?.data?.data?.rootCategoryData?.categories
          }
        })
        constant.switchLoader(dispatch, 'shop', false)

        callback('200')
      },
      (err: any) => {
        if (err.status == 403 || err.status == 405) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(getCategoryList(data))
                : Common.showSnackbar()
            })
          )
          constant.switchLoader(dispatch, 'shop', false)
          constant.switchLoader(dispatch, 'home', true)
        }
        callback('500')
      }
    )
  }
}
