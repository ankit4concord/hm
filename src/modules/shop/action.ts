import constant, { showToastMessage } from '@ecom/utils/constant'
import {
  customDeleteApiCall,
  customGetApiCall,
  customPatchApiCall,
  customPostApiCall,
  customPostApiCallWithHeader,
  customPutApiCall
} from '@ecom/utils/customisationApi'
import {
  deleteApiCall,
  getApiCall,
  getApiWithBodyCall,
  postApiCall
} from '@ecom/utils/api'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/tracking'
import { AnyAction } from 'redux'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import actionNames from '@ecom/utils/actionNames'
import axios from 'axios'
import { cleanHMObj } from '@ecom/utils/fab'
import endpoint from '@ecom/utils/endpoint'
import { generateCanvasJSONUtil } from './canvasConversion'
import { getBasket } from '../cart/actions'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { signInAgain } from '../auth/action'
import strings from '@ecom/utils/strings'

export function getCategoryBanner(from: any) {
  return (dispatch: Function, getState: any) => {
    from === 'clp' && constant.switchLoader(dispatch, 'category', true)
    const { isConnected } = getState().internetStatusReducer
    let baseUrl = endpoint.categories_banner
    if (isConnected) {
      getApiCall(
        baseUrl,
        (response: any) => {
          if (response?.data?.code === 200) {
            if (from === 'clp') {
              dispatch({
                type: actionNames.CATEGORY_INFO,
                payload: {
                  clpPageDesignerData: response?.data?.content
                }
              })
              constant.switchLoader(dispatch, 'category', false)
            } else if (from === 'plp') {
              dispatch({
                type: actionNames.CATEGORY_INFO,
                payload: {
                  plp_content_slots: response?.data?.content
                }
              })
            }
          } else if (response?.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success' ? dispatch(getCategoryBanner(cgid, from)) : ''
              })
            )
          } else {
          }
        },
        (err: any) => {
          if (err.status == 403 || err.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(getCategoryBanner(cgid, from))
                  : constant.switchLoader(dispatch, 'category', false)
              })
            )
          } else {
            constant.switchLoader(dispatch, 'category', false)
          }
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function getProductList(
  subcat: any,
  start: any = 0,
  limit: any = 10,
  loadMore = false,
  callback = () => {}
) {
  return (dispatch: Function, getState: any) => {
    const { filters } = getState().categoryReducer
    const { isConnected } = getState().internetStatusReducer
    if (!loadMore) {
      dispatch({
        type: actionNames.PRODUCTLIST_INFO,
        payload: { productlist: [] }
      })
    }
    const { productlist } = getState().categoryReducer
    const { user, isGuestMode } = getState().authReducer
    let customerType = 'guest'
    if (!isGuestMode)
      user?.c_isBoss ? (customerType = 'boss') : (customerType = 'ip')

    constant.switchLoader(dispatch, 'product', true)
    let baseUrl = endpoint.products
    if (subcat) {
      baseUrl += `?cgid=${subcat}&sort=${filters?.sort[0]?.value ?? 'featured'}`
    }
    if (isConnected) {
      getApiCall(
        `${baseUrl}&start=${start}&limit=${limit}`,
        (response: any) => {
          constant.switchLoader(dispatch, 'product', false)
          if (response?.data?.code === 200) {
            dispatch({
              type: actionNames.PRODUCTLIST_INFO,
              payload: {
                productlist: [
                  ...productlist,
                  ...response?.data?.products?.products
                ]
              }
            })

            dispatch({
              type: actionNames.PRODUCTS_COUNT,
              payload: {
                productsCount: response?.data?.products?.count,
                tempProductCount: response?.data?.products?.count,
                productsHasMore: response?.data?.products?.hasMore,
                productsEnd: response?.data?.products?.end,
                filters: response?.data?.products?.refine
              }
            })

            dispatch({
              type: actionNames.ACTIVE_FILTERS,
              payload: {
                universalMaxFilter: false,
                universalMinFilter: false
              }
            })
            // }
          } else if (response?.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(getProductList(subcat))
                  : showToastMessage('Unable to get product list', 'danger')
              })
            )
          } else {
            showToastMessage('Unable to get product list', 'danger')
          }
        },
        (err: any) => {
          if (err.status == 403 || err.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(getProductList(subcat))
                  : constant.switchLoader(dispatch, 'product', false)
              })
            )
          } else {
            constant.switchLoader(dispatch, 'product', false)
            showToastMessage('Sorry Something went Wrong', 'invalid')
          }
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
      constant.switchLoader(dispatch, 'product', false)
    }
  }
}

export function getMoreProducts(
  subcat: any,
  start: any = 0,
  limit: any = 10,
  loadMore = false,
  callback = () => {}
) {
  return (dispatch: Function, getState: any) => {
    const { productlist, sort, minPrice, maxPrice, activeFilters } =
      getState().categoryReducer

    let baseUrl = `${endpoint.products}?cgid=${subcat}`

    let filters = activeFilters.reduce((obj: Object, item: any) => {
      if (obj.hasOwnProperty(item.cat.value)) {
        //@ts-ignore
        return Object.assign(obj, {
          [item.cat.value]: `${obj[item.cat.value]}|${item.value}`
        })
      } else {
        return Object.assign(obj, { [item.cat.value]: item.value })
      }
    }, {})
    filters.start = start
    filters.limit = limit ?? 10
    if (sort) filters.sort = sort.value
    if (minPrice?.length > 0 || maxPrice?.length > 0) {
      if (!minPrice) {
        filters.price = `(..${maxPrice})`
      } else if (!maxPrice) {
        filters.price = `(..${minPrice})`
      } else {
        filters.price = `(${minPrice}..${maxPrice})`
      }
    }
    dispatch({
      type: actionNames.DO_LOAD_MORE,
      payload: { scope: 'isProduct', isLoadMore: true }
    })
    getApiWithBodyCall(
      baseUrl,
      filters,
      (response: any) => {
        dispatch({
          type: actionNames.DO_LOAD_MORE,
          payload: { scope: 'isProduct', isLoadMore: false }
        })
        if (response?.data?.code === 200) {
          dispatch({
            type: actionNames.PRODUCTLIST_INFO,
            payload: {
              productlist: [
                ...productlist,
                ...response?.data?.products?.products
              ],
              productsHasMore: response?.data?.products?.hasMore,
              productsEnd: response?.data?.products?.end,
              filters: response?.data?.products?.refine
            }
          })
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(getMoreProducts(subcat))
                : showToastMessage('Unable to load more products', 'danger')
            })
          )
        } else {
          showToastMessage('Unable to load more products', 'danger')
        }
      },
      (err: any) => {
        if (err.status == 403 || err.status == 405) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(getMoreProducts(subcat))
                : dispatch({
                    type: actionNames.DO_LOAD_MORE,
                    payload: { scope: 'isProduct', isLoadMore: false }
                  })
              showToastMessage('Unable to load more products', 'danger')
            })
          )
        } else {
          dispatch({
            type: actionNames.DO_LOAD_MORE,
            payload: { scope: 'isProduct', isLoadMore: false }
          })
        }
      }
    )
  }
}

export function getFilteredProductList(
  subcat: string,
  sort: string,
  type?: string,
  label?: any,
  fromList?: boolean
) {
  return (dispatch: Function, getState: any) => {
    const { tempFilters, maxPrice, minPrice } = getState().categoryReducer
    const { user, isGuestMode } = getState().authReducer
    let customerType = 'guest'
    if (!isGuestMode)
      user?.c_isBoss ? (customerType = 'boss') : (customerType = 'ip')
    if (
      (type && type === 'price') ||
      maxPrice?.length > 0 ||
      minPrice?.length > 0
    ) {
      dispatch({
        type: actionNames.ACTIVE_FILTERS,
        payload: {
          minPrice: label.min ?? minPrice,
          maxPrice: label.max ?? maxPrice
        }
      })
    }

    let filters = tempFilters.reduce((obj: Object, item: any) => {
      if (obj.hasOwnProperty(item.cat.value)) {
        return Object.assign(obj, {
          [item.cat.value]: `${obj[item.cat.value]}|${item.value}`
        })
      } else {
        return Object.assign(obj, { [item.cat.value]: item.value })
      }
    }, {})
    if (
      label?.min?.length > 0 ||
      label?.max?.length > 0 ||
      minPrice?.length > 0 ||
      maxPrice?.length > 0
    ) {
      filters.price = `(${label.min ?? minPrice}..${label.max ?? maxPrice})`
    }
    filters.sort = sort ?? 'featured'
    filters.start = 0
    filters.limit = 10
    constant.switchLoader(dispatch, 'shop', true)
    constant.switchLoader(dispatch, 'product', true)
    getApiWithBodyCall(
      `${endpoint.products}`,
      {
        ...filters,
        cgid: subcat,
        customer_type: customerType
      },
      (response: any) => {
        constant.switchLoader(dispatch, 'shop', false)
        constant.switchLoader(dispatch, 'product', false)
        if (response?.data?.code === 200) {
          dispatch({
            type: actionNames.PRODUCTLIST_INFO,
            payload: {
              tempProductCount: response?.data?.products?.count,
              tempData: response?.data?.products?.products,
              filters: response?.data?.products?.refine,
              productEnd: response?.data?.products?.end,
              productsHasMore: response?.data?.products?.hasMore
            }
          })
          if (fromList) {
            dispatch(setFilteredData(sort))
          }
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(
                    getFilteredProductList(subcat, sort, type, label, fromList)
                  )
                : showToastMessage(
                    'Unable to get filtered product list',
                    'danger'
                  )
            })
          )
        } else {
          showToastMessage('Unable to get filtered product list', 'danger')
        }
      },
      (error: any) => {
        if (error.status == 403 || error.status == 405) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(
                    getFilteredProductList(subcat, sort, type, label, fromList)
                  )
                : constant.switchLoader(dispatch, 'shop', false)
              constant.switchLoader(dispatch, 'product', false)
              showToastMessage('Unable to get filtered product list', 'danger')
            })
          )
        } else {
          constant.switchLoader(dispatch, 'shop', false)
          constant.switchLoader(dispatch, 'product', false)
        }
      }
    )
  }
}

export function addFilters(
  data: any,
  check: boolean,
  subcat: string,
  fromList: boolean = false
) {
  return (dispatch: Function, getState: any) => {
    const { tempFilters, sort } = getState().categoryReducer
    const sortValue =
      sort?.value === ''
        ? sort?.label?.toLocaleLowerCase() + '+desc'
        : sort?.value
    let taskArray = null
    if (check) {
      taskArray = {
        ...data
      }
      dispatch({
        type: actionNames.ACTIVE_FILTERS,
        payload: { tempFilters: [...tempFilters, taskArray] }
      })
      dispatch(getFilteredProductList(subcat, sortValue, '', {}, fromList))
    } else {
      let selectedFilters = tempFilters
      const select = selectedFilters.filter(
        (item: any) => item.label !== data.label
      )
      dispatch({
        type: actionNames.ACTIVE_FILTERS,
        payload: { tempFilters: select }
      })
      dispatch(getFilteredProductList(subcat, sortValue, '', {}, fromList))
    }
  }
}

export function removeFilter(
  data: any,
  check: boolean,
  subcat: string,
  fromList: boolean = false
) {
  return (dispatch: Function, getState: any) => {
    const { activeFilters, sort } = getState().categoryReducer
    const sortValue =
      sort?.value === ''
        ? sort?.label?.toLocaleLowerCase() + '+desc'
        : sort?.value
    let selectedFilters = activeFilters
    const select = selectedFilters.filter(
      (item: any) => item.label !== data.label
    )
    dispatch({
      type: actionNames.ACTIVE_FILTERS,
      payload: {
        activeFilters: select,
        tempFilters: select
      }
    })
    dispatch(getFilteredProductList(subcat, sortValue, '', {}, fromList))
  }
}

export function clearActiveFilters(subcat: string) {
  return (dispatch: Function, getState: any) => {
    const { sort, minPrice, universalMinFilter, universalMaxFilter, maxPrice } =
      getState().categoryReducer
    dispatch({
      type: actionNames.ACTIVE_FILTERS,
      payload: {
        tempFilters: [],
        minPrice: universalMinFilter ? minPrice : '',
        maxPrice: universalMaxFilter ? maxPrice : ''
      }
    })
    dispatch(getFilteredProductList(subcat, sort?.value))
  }
}

export function setFilteredData(sort: any, callback = () => {}) {
  return (dispatch: Function, getState: any) => {
    const adobeReducerState = getState().globalAdobeReducer
    const { tempData, tempFilters, tempProductCount } =
      getState().categoryReducer

    if (tempFilters && tempFilters.length) {
      let filterKeys = ''
      let filterValues = ''
      tempFilters.forEach((element, index) => {
        if (index !== 0) {
          filterKeys += '|'
          filterValues += '|'
        }
        filterKeys += element?.cat?.value
        filterValues += element?.label
      })
      ACPCore.trackAction('Filter', {
        ...adobeReducerState,
        'cd.filter': '1',
        'cd.filterKeys': filterKeys,
        'cd.filterValues': filterValues,
        'cd.sortValue': sort?.label
      })
    }
    dispatch({
      type: actionNames.PRODUCTLIST_INFO,
      payload: {
        productlist: tempData,
        activeFilters: tempFilters,
        productsCount: tempProductCount,
        sort: sort,
        productsEnd: 10
      }
    })
    dispatch({
      type: actionNames.ACTIVE_FILTERS,
      payload: {
        universalMaxFilter: false,
        universalMinFilter: false
      }
    })
    callback()
  }
}

export function resetFilterOnChangeTab() {
  return (dispatch: Function, getState: any) => {
    const {
      filters,
      minPrice,
      universalMinFilter,
      universalMaxFilter,
      maxPrice
    } = getState().categoryReducer
    dispatch({
      type: actionNames.ACTIVE_FILTERS,
      payload: {
        activeFilters: [],
        tempFilters: [],
        sort: filters?.sort[0],
        minPrice: universalMinFilter ? minPrice : '',
        maxPrice: universalMaxFilter ? maxPrice : '',
        productlist: []
      }
    })
  }
}

export function getPDPdetails(id: string) {
  return (dispatch: Function, getState: any) => {
    const { user, isGuestMode } = getState().authReducer
    const { appConfigValues } = getState().configReducer
    let customerType = 'guest'
    if (!isGuestMode)
      user?.c_isBoss ? (customerType = 'boss') : (customerType = 'ip')

    constant.switchLoader(dispatch, 'shop', true)

    getApiWithBodyCall(
      endpoint.productDetail,
      {
        id: id,
        all_images: true,
        customer_type: customerType
      },
      (response: any) => {
        constant.switchLoader(dispatch, 'shop', false)

        if (response?.data?.code === 200) {
          dispatch({
            type: actionNames.PDP_DETAIL,
            payload: {
              pdpDetail: {
                ...response.data.data,
                pdpLevel1: 'Cards',
                pdpLevel2: 'Greeting Cards'
              }
            }
          })
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success' && dispatch(getPDPdetails(id))
            })
          )
        }
      },
      (err: any) => {
        if (err.status == 405 || err.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(getPDPdetails(id))
                : constant.switchLoader(dispatch, 'shop', false)
            })
          )
        } else {
          constant.switchLoader(dispatch, 'shop', false)
          showToastMessage(
            appConfigValues?.screen_content?.utils?.sorry_message2,
            'error'
          )
        }
      }
    )
  }
}

export function productSuggestions(query: any) {
  return (dispatch: Function) => {
    let baseUrl = `${endpoint.productSearchSuggestion}?query=${query}`

    getApiCall(
      baseUrl,
      (response: any) => {
        if (response?.data?.code === 200) {
          dispatch({
            type: actionNames.SEARCH_SUGGESTIONS,
            payload: {
              searchSuggestions: response?.data?.data?.suggestions
            }
          })
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(productSuggestions(query))
                : showToastMessage(
                    'Unable to get product suggestions',
                    'danger'
                  )
            })
          )
        } else {
          showToastMessage('Unable to get product suggestions', 'invalid')
        }
      },
      (err: any) => {
        if (err.status == 405 || err.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(productSuggestions(query))
                : showToastMessage(
                    'Unable to get product suggestions',
                    'danger'
                  )
            })
          )
        } else {
          dispatch({
            type: actionNames.SEARCH_SUGGESTIONS,
            payload: {
              searchSuggestions: []
            }
          })
          showToastMessage('Unable to get product suggestions', 'invalid')
        }
      }
    )
  }
}

export function getProductSearchResults(
  query: any = '',
  start: any = 0,
  limit: any = 10,
  loadMore = false,
  callback = () => {}
) {
  return (dispatch: Function, getState: any) => {
    dispatch({
      type: actionNames.PRODUCT_SEARCH_RESULTS,
      payload: { searchResults: [] }
    })
    const { searchResults } = getState().categoryReducer
    const { searchGrouping, autoPopulateSearch } = getState().miscReducer

    const adobeReducerState = getState().globalAdobeReducer
    const { appConfigValues } = getState().configReducer

    constant.switchLoader(dispatch, 'product', true)
    let baseUrl = endpoint.searchProducts
    if (query) {
      baseUrl += `?query=${query}`
    }
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      getApiCall(
        `${baseUrl}&start=${start}&limit=${limit}`,
        (response: any) => {
          constant.switchLoader(dispatch, 'product', false)
          if (response?.data?.code === 200) {
            dispatch({
              type: actionNames.MISC_INFO,
              payload: {
                siteSection: 'search',
                searchResultsCount: response?.data?.products?.count + '',
                searchQuery: query
              }
            })
            dispatch({
              type: actionNames.PRODUCT_SEARCH_RESULTS,
              payload: {
                searchResults: [
                  ...searchResults,
                  ...response?.data?.products?.products
                ]
              }
            })
            dispatch({
              type: actionNames.PRODUCT_SEARCH_RESULTS_COUNT,
              payload: {
                searchResultsCount: response?.data?.products?.count,
                searchResultstempProductCount: response?.data?.products?.count,
                searchResultHasMore: response?.data?.products?.hasMore,
                searchResultEnd: response?.data?.products?.end,
                searchResultFilters: response?.data?.products?.refine
              }
            })

            let searchTrackObj: any = {
              'cd.previousPageName': adobeReducerState['cd.pageName'],
              'cd.pageType': 'Search Results'
            }

            if (appConfigValues?.adobe?.isAnalyticsEnabled) {
              if (response?.data?.products?.count === 0) {
                searchTrackObj['cd.level2'] = 'No Results'
              } else {
                searchTrackObj['cd.level2'] = 'Results'
                searchTrackObj['cd.searchResultsCount'] =
                  response?.data?.products?.count + ''
              }
              searchTrackObj['cd.searchQuery'] = query?.toLocaleLowerCase()
              searchTrackObj['cd.autoPopulateSearch'] = autoPopulateSearch
                ? '1'
                : undefined
              searchTrackObj['cd.level1'] = 'Search Results'
              searchTrackObj['cd.trackAction'] = 'Search'
              const pageName = `${searchTrackObj['cd.level1']}>${searchTrackObj['cd.level2']}`
              searchTrackObj['cd.pageName'] = pageName
              ACPCore.trackState(pageName, {
                ...adobeReducerState,
                ...searchTrackObj
              })
              dispatch({
                type: actionNames.TRACK_STATE,
                payload: {
                  'cd.pageName': searchTrackObj['cd.pageName'],
                  'cd.previousPageName': searchTrackObj['cd.previousPageName'],
                  'cd.pageType': searchTrackObj['cd.pageType'],
                  'cd.level1': searchTrackObj['cd.level1'],
                  'cd.level2': searchTrackObj['cd.level2']
                }
              })
              dispatch({
                type: actionNames.MISC_INFO,
                payload: {
                  navigationType: searchGrouping,
                  searchResultsCount: undefined,
                  autoPopulateSearch: true
                }
              })
            }
          } else if (response?.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(getProductSearchResults(query))
                  : showToastMessage(
                      'Unable to get product search results',
                      'danger'
                    )
              })
            )
          } else {
            showToastMessage('Unable to get product search results', 'danger')
          }
        },
        (err: any) => {
          if (err.status == 405 || err.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(getProductSearchResults(query))
                  : constant.switchLoader(dispatch, 'product', false)
              })
            )
          } else {
            constant.switchLoader(dispatch, 'product', false)
          }
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function getMoreSearchResults(
  query: any,
  start: any = 0,
  limit: any = 10,
  loadMore = false,
  callback = () => {}
) {
  return (dispatch: Function, getState: any) => {
    const {
      searchResults,
      searchResultSort,
      searchResultMinPrice,
      searchResultMaxPrice,
      searchResultActiveFilters
    } = getState().categoryReducer

    let baseUrl = `${endpoint.searchProducts}?query=${query}`
    let filters = searchResultActiveFilters.reduce((obj: Object, item: any) => {
      if (obj.hasOwnProperty(item.cat.value)) {
        return Object.assign(obj, {
          [item.cat.value]: `${obj[item.cat.value]}|${item.value}`
        })
      } else {
        return Object.assign(obj, { [item.cat.value]: item.value })
      }
    }, {})
    filters.start = start
    filters.limit = limit ?? 10
    if (searchResultSort) filters.sort = searchResultSort.value
    if (searchResultMinPrice?.length > 0 || searchResultMaxPrice?.length > 0) {
      filters.price = `(${searchResultMinPrice}..${searchResultMaxPrice})`
    }
    dispatch({
      type: actionNames.DO_LOAD_MORE,
      payload: { scope: 'isProduct', isLoadMore: true }
    })
    getApiWithBodyCall(
      baseUrl,
      filters,
      (response: any) => {
        dispatch({
          type: actionNames.DO_LOAD_MORE,
          payload: { scope: 'isProduct', isLoadMore: false }
        })
        if (response?.data?.code === 200) {
          dispatch({
            type: actionNames.PRODUCT_SEARCH_RESULTS,
            payload: {
              searchResults: [
                ...searchResults,
                ...response?.data?.products?.products
              ],
              searchResultHasMore: response?.data?.products?.hasMore,
              searchResultEnd: response?.data?.products?.end,
              searchResultFilters: response?.data?.products?.refine
            }
          })
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(getMoreSearchResults(query))
                : showToastMessage(
                    'Unable to load product search results',
                    'danger'
                  )
            })
          )
        } else {
          showToastMessage('Unable to load product search results', 'danger')
        }
      },
      (err: any) => {
        if (err.status == 405 || err.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(getMoreSearchResults(query))
                : dispatch({
                    type: actionNames.DO_LOAD_MORE,
                    payload: { scope: 'isProduct', isLoadMore: false }
                  })
              showToastMessage(
                'Unable to load product search results',
                'danger'
              )
            })
          )
        } else {
          dispatch({
            type: actionNames.DO_LOAD_MORE,
            payload: { scope: 'isProduct', isLoadMore: false }
          })
        }
      }
    )
  }
}

export function getFilteredSearchResults(
  query: string,
  sort: string,
  type?: string,
  label?: any,
  fromList?: boolean
) {
  return (dispatch: Function, getState: any) => {
    const {
      searchResultTempFilters,
      searchResultMaxPrice,
      searchResultMinPrice
    } = getState().categoryReducer

    if (
      (type && type === 'price') ||
      searchResultMaxPrice.length > 0 ||
      searchResultMinPrice.length > 0
    ) {
      dispatch({
        type: actionNames.ACTIVE_SEARCH_FILTERS,
        payload: {
          searchResultMinPrice: label.min ?? searchResultMinPrice,
          searchResultMaxPrice: label.max ?? searchResultMaxPrice
        }
      })
    }

    let filters = searchResultTempFilters.reduce((obj: Object, item: any) => {
      if (obj.hasOwnProperty(item.cat.value)) {
        return Object.assign(obj, {
          [item.cat.value]: `${decodeURIComponent(
            obj[item.cat.value]
          )}|${decodeURIComponent(item.value)}`
        })
      } else {
        return Object.assign(obj, {
          [item.cat.value]: decodeURIComponent(item.value)
        })
      }
    }, {})

    if (
      label?.min?.length > 0 ||
      label?.max?.length > 0 ||
      searchResultMinPrice.length > 0 ||
      searchResultMaxPrice.length > 0
    ) {
      filters.price = `(${label.min ?? searchResultMinPrice}..${
        label.max ?? searchResultMaxPrice
      })`
    }
    filters.sort = sort
    filters.start = 0
    filters.limit = 10
    filters.query = query
    constant.switchLoader(dispatch, 'shop', true)
    constant.switchLoader(dispatch, 'product', true)
    getApiWithBodyCall(
      endpoint.searchProducts,
      { ...filters },
      (response: any) => {
        constant.switchLoader(dispatch, 'shop', false)
        constant.switchLoader(dispatch, 'product', false)
        if (response?.data?.code === 200) {
          dispatch({
            type: actionNames.PRODUCT_SEARCH_RESULTS,
            payload: {
              searchResultstempProductCount: response?.data?.products?.count,
              tempData: response?.data?.products?.products,
              searchResultFilters: response?.data?.products?.refine,
              searchTempLoadMore: response?.data?.products?.hasMore
            }
          })
          if (fromList) {
            dispatch(
              setSearchResultFilteredData(
                response?.data?.products?.refine?.sort[0]
              )
            )
          }
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(
                    getFilteredSearchResults(query, sort, type, label, fromList)
                  )
                : showToastMessage('Unable to get filtered products', 'danger')
            })
          )
        } else {
          showToastMessage('Unable to get filtered products', 'danger')
        }
      },
      (error: any) => {
        if (error.status == 405 || error.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(
                    getFilteredSearchResults(query, sort, type, label, fromList)
                  )
                : constant.switchLoader(dispatch, 'shop', false)
              constant.switchLoader(dispatch, 'product', false)
              showToastMessage('Unable to get filtered products', 'danger')
            })
          )
        } else {
          constant.switchLoader(dispatch, 'shop', false)
          constant.switchLoader(dispatch, 'product', false)
        }
      }
    )
  }
}

export function addSearchResultFilters(
  data: any,
  check: boolean,
  query: string,
  fromList: boolean = false
) {
  return (dispatch: Function, getState: any) => {
    const { searchResultTempFilters, searchResultSort } =
      getState().categoryReducer
    let taskArray = null
    const sortValue =
      searchResultSort?.value === ''
        ? searchResultSort?.label?.toLocaleLowerCase() + '+desc'
        : searchResultSort?.value
    if (check) {
      taskArray = {
        ...data
      }
      if (data?.cat?.value === 'cgid') {
        let selectedFilters = searchResultTempFilters
        const selected = selectedFilters?.filter(
          (item: any) => item?.cat?.value !== 'cgid'
        )

        dispatch({
          type: actionNames.ACTIVE_SEARCH_FILTERS,
          payload: {
            searchResultTempFilters: [...selected, taskArray]
          }
        })
        dispatch(getFilteredSearchResults(query, sortValue, '', {}, fromList))
      } else {
        dispatch({
          type: actionNames.ACTIVE_SEARCH_FILTERS,
          payload: {
            searchResultTempFilters: [...searchResultTempFilters, taskArray]
          }
        })
        dispatch(getFilteredSearchResults(query, sortValue, '', {}, fromList))
      }
    } else {
      let selectedFilters = searchResultTempFilters
      const select = selectedFilters.filter(
        (item: any) => item.label !== data.label
      )

      dispatch({
        type: actionNames.ACTIVE_SEARCH_FILTERS,
        payload: { searchResultTempFilters: select }
      })
      dispatch(getFilteredSearchResults(query, sortValue, '', {}, fromList))
    }
  }
}

export function removeSearchResultFilter(
  data: any,
  check: boolean,
  query: string,
  fromList: boolean = false
) {
  return (dispatch: Function, getState: any) => {
    const { searchResultActiveFilters, searchResultSort } =
      getState().categoryReducer

    let selectedFilters = searchResultActiveFilters
    const select = selectedFilters.filter(
      (item: any) => item.label !== data.label
    )
    dispatch({
      type: actionNames.ACTIVE_SEARCH_FILTERS,
      payload: {
        searchResultActiveFilters: select,
        searchResultTempFilters: select
      }
    })
    const sortValue =
      searchResultSort?.value === ''
        ? searchResultSort?.label?.toLocaleLowerCase() + '+desc'
        : searchResultSort?.value
    dispatch(getFilteredSearchResults(query, sortValue))
  }
}

export function clearActiveSearchResultFilters(query: string) {
  return (dispatch: Function, getState: any) => {
    const { searchResultSort } = getState().categoryReducer
    dispatch({
      type: actionNames.ACTIVE_SEARCH_FILTERS,
      payload: {
        searchResultTempFilters: [],
        searchResultMinPrice: '',
        searchResultMaxPrice: ''
      }
    })
    const sortValue =
      searchResultSort?.value === ''
        ? searchResultSort?.label?.toLocaleLowerCase() + '+desc'
        : searchResultSort?.value
    dispatch(getFilteredSearchResults(query, sortValue))
  }
}

export function setSearchResultFilteredData(sort: any, callback = () => {}) {
  return (dispatch: Function, getState: any) => {
    const adobeReducerState = getState().globalAdobeReducer
    const {
      tempData,
      searchResultTempFilters,
      searchResultstempProductCount,
      searchTempLoadMore
    } = getState().categoryReducer
    dispatch({
      type: actionNames.PRODUCT_SEARCH_RESULTS,
      payload: {
        searchResults: tempData,
        searchResultActiveFilters: searchResultTempFilters,
        searchResultsCount: searchResultstempProductCount,
        searchResultHasMore: searchTempLoadMore,
        searchResultSort: sort,
        searchResultEnd: 10
      }
    })
    if (searchResultTempFilters && searchResultTempFilters.length) {
      let filterKeys = ''
      let filterValues = ''
      searchResultTempFilters.forEach((element, index) => {
        if (index !== 0) {
          filterKeys += ';'
          filterValues += ';'
        }
        filterKeys += element?.cat?.value
        filterValues += element?.label
      })
      ACPCore.trackAction('Filter', {
        ...adobeReducerState,
        'cd.filter': '1',
        'cd.filterKeys': filterKeys,
        'cd.filterValues': filterValues,
        'cd.sortValue': sort?.label
      })
    }
    callback()
  }
}

export function getProductInfo(id: string, callback = (res?: object) => {}) {
  return (dispatch: Function, getState: any) => {
    const { user, isGuestMode } = getState().authReducer
    let customerType = 'guest'
    if (!isGuestMode)
      user?.c_isBoss ? (customerType = 'boss') : (customerType = 'ip')
    getApiWithBodyCall(
      endpoint.productDetail,
      {
        id: id,
        all_images: true,
        customer_type: customerType
      },
      (response: any) => {
        if (response?.data?.code === 200) {
          callback(response?.data?.products)
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success' && dispatch(getProductInfo(id, callback))
            })
          )
        } else {
          callback(response)
        }
      },
      (err: any) => {
        if (err.status == 405 || err.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success' && dispatch(getProductInfo(id, callback))
            })
          )
        } else {
          callback(err)
        }
      }
    )
  }
}

export function getProductListWithFilter(
  categoryId: any,
  filters: any,
  callback = (res: any) => {}
) {
  return (dispatch: Function, getState: Function) => {
    constant.switchLoader(dispatch, 'category', true)
    constant.switchLoader(dispatch, 'product', true)

    const { user, isGuestMode } = getState().authReducer
    let customerType = 'guest'
    if (!isGuestMode)
      user?.c_isBoss ? (customerType = 'boss') : (customerType = 'ip')
    let baseUrl = `${endpoint.products}`

    const recFilters = filters

    filters = {
      ...filters,
      cgid: categoryId,
      limit: 10,
      start: 0
    }
    getApiWithBodyCall(
      baseUrl,
      filters,
      (response: any) => {
        dispatch({
          type: actionNames.DO_LOAD_MORE,
          payload: { scope: 'isProduct', isLoadMore: false }
        })
        if (response?.data?.code === 200) {
          if (Object.keys(recFilters).length === 0) {
            dispatch({
              type: actionNames.PRODUCTLIST_INFO,
              payload: {
                productlist: [],
                filters: response?.data?.products?.refine
              }
            })
            callback({ status: 200, filters: response?.data?.products?.refine })
          } else {
            dispatch({
              type: actionNames.PRODUCTLIST_INFO,
              payload: {
                productlist: [...response?.data?.products?.products],
                productsHasMore: response?.data?.products?.hasMore,
                productsEnd: response?.data?.products?.end,
                filters: response?.data?.products?.refine
              }
            })
            dispatch({
              type: actionNames.PRODUCTS_COUNT,
              payload: {
                productsCount: response?.data?.products?.count,
                tempProductCount: response?.data?.products?.count,
                productsHasMore: response?.data?.products?.hasMore,
                productsEnd: response?.data?.products?.end,
                filters: response?.data?.products?.refine
              }
            })
            dispatch({
              type: actionNames.ACTIVE_FILTERS,
              payload: {
                universalMaxFilter: false,
                universalMinFilter: false
              }
            })
            constant.switchLoader(dispatch, 'category', false)
            constant.switchLoader(dispatch, 'product', false)

            callback({ status: 200, filters: response?.data?.products?.refine })
          }
        } else if (response?.status == 403) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(
                    getProductListWithFilter(categoryId, filters, callback)
                  )
                : showToastMessage('Unable to load more products', 'danger')
            })
          )
          constant.switchLoader(dispatch, 'category', false)
          constant.switchLoader(dispatch, 'product', false)

          callback({ status: 403 })
        } else {
          showToastMessage('Unable to load more products', 'danger')
          constant.switchLoader(dispatch, 'category', false)
          constant.switchLoader(dispatch, 'product', false)

          callback({ status: 405 })
        }
      },
      (err: any) => {
        if (err.status == 403 || err.status == 405) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(
                    getProductListWithFilter(categoryId, filters, callback)
                  )
                : dispatch({
                    type: actionNames.DO_LOAD_MORE,
                    payload: { scope: 'isProduct', isLoadMore: false }
                  })
              showToastMessage('Unable to load more products', 'danger')
            })
          )
          constant.switchLoader(dispatch, 'category', false)
          constant.switchLoader(dispatch, 'product', false)
        } else {
          dispatch({
            type: actionNames.DO_LOAD_MORE,
            payload: { scope: 'isProduct', isLoadMore: false }
          })
          constant.switchLoader(dispatch, 'category', false)
          constant.switchLoader(dispatch, 'product', false)
          showToastMessage('Sorry Something went Wrong', 'invalid')
        }
      }
    )
  }
}

// export function categoryRedirect(
//   redirectData: any,
//   callback = (res: any) => {}
// ) {
//   return (dispatch: Function) => {
//     let appliedFilters: any = {}

//     const redirectFilters = redirectData?.filters.filter(
//       (item: any) => item !== ''
//     )
//     dispatch(
//       getProductListWithFilter(redirectData?.cgid, {}, async (res) => {
//         switch (res.status) {
//           case 200:
//             const activeFilters: any = []
//             let price = ''
//             let minPrice: any
//             let maxPrice: any
//             redirectFilters?.forEach((filter: any, filtersIndex: any) => {
//               if (filter) {
//                 if (filter.includes('pmin=')) {
//                   minPrice = Math.round(filter.split('pmin=')[1]).toString()
//                 }
//                 if (filter.includes('pmax=')) {
//                   maxPrice = Math.round(filter.split('pmax=')[1]).toString()
//                 }
//                 const catFilters = res?.filters?.filters
//                 catFilters?.forEach((element: any, elementsIndex: any) => {
//                   if (element.value === 'price' && (minPrice || maxPrice)) {
//                     dispatch({
//                       type: actionNames.ACTIVE_FILTERS,
//                       payload: {
//                         minPrice,
//                         maxPrice
//                       }
//                     })
//                   }
//                   element.options &&
//                     element.value != 'cgid' &&
//                     element.options.forEach(
//                       (option: any, optionsIndex: any) => {
//                         const appliedActiveFilters = {}
//                         if (
//                           filter.toLocaleLowerCase() ===
//                           option.value.toLocaleLowerCase()
//                         ) {
//                           appliedFilters[element.value] = option.value
//                           appliedActiveFilters.cat = element
//                           appliedActiveFilters.label = option.label
//                           appliedActiveFilters.value = option.value
//                           appliedActiveFilters.count = option.count
//                           activeFilters.push(appliedActiveFilters)
//                         }
//                         const optionsDone =
//                           optionsIndex >= element.options.length - 1
//                         const elementsDone =
//                           elementsIndex >= catFilters.length - 1
//                         const filtersDone =
//                           filtersIndex >= redirectFilters.length - 1
//                         if (optionsDone && elementsDone && filtersDone) {
//                           dispatch({
//                             type: actionNames.ACTIVE_FILTERS,
//                             payload: {
//                               activeFilters,
//                               tempFilters: activeFilters,
//                               sort: {}
//                             }
//                           })
//                           if (minPrice || maxPrice) {
//                             if (minPrice && maxPrice) {
//                               appliedFilters[
//                                 'price'
//                               ] = `(${minPrice}..${maxPrice})`
//                             } else if (!minPrice && maxPrice) {
//                               appliedFilters['price'] = `(..${maxPrice})`
//                             } else if (minPrice && !maxPrice) {
//                               appliedFilters['price'] = `(${minPrice}..)`
//                             }
//                           }
//                           callback(appliedFilters)
//                         }
//                       }
//                     )
//                 })
//               }
//             })
//             break
//         }
//       })
//     )
//   }
// }

export function initialiseTemplate(request: any, callback = (res: any) => {}) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'product', true)
    const { accountId } = getState().authReducer?.user
    const adobeReducerState = getState().globalAdobeReducer
    const { customFabricObj } = getState().customisationReducer
    const { appConfigValues } = getState().configReducer
    const payload = {
      name: 'test',
      product_id: request.product_id,
      project_type_code: request.product_type_code
    }
    const canvasObj: any = {
      version: '3.6.6',
      objects: [],
      selectionColor: 'rgba(100, 100, 255, 0.3)',
      hoverCursor: 'move'
    }
    customPostApiCall(
      `/${accountId}${endpoint.initialize}`,
      payload,
      async (response: any) => {
        dispatch({
          type: actionNames.CUSTOMISATION_STATE,
          payload: { customisationTemplateData: response?.data?.data }
        })
        const fabObj = cleanHMObj(response?.data?.data)
        generateCanvasJSONUtil.cleanUp()
        generateCanvasJSONUtil.initializeProject(response?.data?.data)
        console.log('MyJSON', generateCanvasJSONUtil.getProjectData())
        const personalizationStart = new Date().getTime()

        // const finalJSON = await loadCanvasJSON(fabObj)
        dispatch({
          type: actionNames.CUSTOMISATION_STATE,
          payload: {
            customFabricObj: fabObj
            // canvasJSON: finalJSON
          }
        })
        dispatch({
          type: actionNames.CUSTOMIZATION_INITIAL_STATE,
          payload: {
            customFabricObjInitial: cleanHMObj(response?.data?.data),
            personalizationStart
          }
        })
        if (appConfigValues?.adobe?.isAnalyticsEnabled) {
          let customizeTrackObj: AdobeObj = {
            'cd.pageName': `${strings.Customization}>${strings.Editor}`,
            'cd.pageType': strings.Customization,
            'cd.previousPageName': adobeReducerState['cd.pageName'],
            'cd.level1': strings.Customization,
            'cd.level2': strings.Editor,
            'cd.level3': ''
          }
          if (request?.source && request?.source === 'LoadTemplate') {
            if (request?.productType === 'Photo Card') {
              customizeTrackObj['cd.printOnDemandProjectID'] = fabObj.project_id
            } else {
              customizeTrackObj['cd.digitalDeliveryProjectID'] =
                fabObj.project_id
            }
            dispatch({
              type: actionNames.TRACK_STATE,
              payload: customizeTrackObj
            })
            ACPCore.trackState(customizeTrackObj['cd.pageName'], {
              ...adobeReducerState,
              ...customizeTrackObj,
              'cd.trackAction': request?.trackAction,
              'cd.productType': request?.productType,
              '&&products': request?.productString,
              'cd.personalizedEditArea': 'outside-front',
              'cd.personalizedEditType': 'flow start',
              'cd.personalizedEditValue': 'start',
              'cd.personalizationFlowStart': '1',
              'cd.prodView': '1',
              'cd.productId': request.product_id,
              'cd.personalizationStartTime': new Date(
                personalizationStart
              ).toLocaleString()
            })
          }
        }
        constant.switchLoader(dispatch, 'product', false)
        callback(response?.data?.data)
      },
      (error: any) => {
        if (error.status === 401) {
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(initialiseTemplate(request, callback))
                : ''
            })
          )
        } else {
          showToastMessage('Something went wrong', 'invalid')
          constant.switchLoader(dispatch, 'product', false)
          callback('error')
        }
      }
    )
  }
}

export function loadTemplate(projectId: any, callback = (res: string) => {}) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'product', true)
    const { isConnected } = getState().internetStatusReducer
    const { accountId } = getState().authReducer?.user
    if (isConnected) {
      getApiCall(
        `customisation/load?project_id=${projectId}`,
        (response1: any) => {
          console.log('response1=', response1)
          if (response1?.data?.code === 200) {
            const customFabObj = JSON.parse(response1?.data?.data?.customObj)
            dispatch({
              type: actionNames.CUSTOMISATION_STATE,
              payload: {
                customFabricObj: customFabObj
              }
            })

            dispatch(getPDPdetails(customFabObj?.product_id))
            dispatch(
              updateProductType(
                customFabObj?.is_digital_fulfillment ? 'D' : 'S'
              )
            )
            customGetApiCall(
              `/${accountId}/${projectId}/load`,
              async (response: any) => {
                dispatch({
                  type: actionNames.CUSTOMISATION_STATE,
                  payload: { customisationTemplateData: response?.data?.data }
                })

                const recipientAddress = response.data.data.addresses.filter(
                  (res: any) => res.address_type_code === 'R'
                )[0]
                const senderAddress = response.data.data.addresses.filter(
                  (res: any) => res.address_type_code === 'S'
                )[0]

                if (recipientAddress) {
                  dispatch({
                    type: actionNames.UPDATE_RECIPIENT_ADDRESS,
                    payload: {
                      formDetails: {
                        ra_id: recipientAddress?.address_id
                          ? recipientAddress?.address_id
                          : false,
                        addrLine1: recipientAddress?.address_line_1
                          ? recipientAddress?.address_line_1
                          : '',
                        addrLine2: recipientAddress?.address_line_2
                          ? recipientAddress?.address_line_2
                          : '',
                        lastName: recipientAddress?.last_name
                          ? recipientAddress?.last_name
                          : '',
                        city: recipientAddress?.city
                          ? recipientAddress?.city
                          : '',
                        state: recipientAddress?.state_code
                          ? recipientAddress?.state_code
                          : '',
                        zipCode: recipientAddress?.zip
                          ? recipientAddress?.zip
                          : '',
                        name: recipientAddress?.first_name
                          ? recipientAddress?.first_name
                          : ''
                      }
                    }
                  })
                }

                if (senderAddress) {
                  dispatch({
                    type: actionNames.UPDATE_SENDER_ADDRESS,
                    payload: {
                      formDetails: {
                        sa_id: senderAddress?.address_id
                          ? senderAddress?.address_id
                          : false,
                        addrLine1: senderAddress?.address_line_1
                          ? senderAddress?.address_line_1
                          : '',
                        addrLine2: senderAddress?.address_line_2
                          ? senderAddress?.address_line_2
                          : '',
                        lastName: senderAddress?.last_name
                          ? senderAddress?.last_name
                          : '',
                        city: senderAddress?.city ? senderAddress?.city : '',
                        state: senderAddress?.state_code
                          ? senderAddress?.state_code
                          : '',
                        zipCode: senderAddress?.zip ? senderAddress?.zip : '',
                        name: senderAddress?.first_name
                          ? senderAddress?.first_name
                          : ''
                      }
                    }
                  })
                }
              },
              (error: any) => {
                if (error.status === 401) {
                  dispatch(
                    signInAgain((res: any) => {
                      res === 'success'
                        ? dispatch(loadTemplate(projectId, callback))
                        : ''
                    })
                  )
                } else {
                  showToastMessage('Something went wrong', 'invalid')
                  constant.switchLoader(dispatch, 'product', false)
                  callback('error')
                }
              }
            )
            constant.switchLoader(dispatch, 'product', false)
          } else if (response?.status == 403 || response?.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(loadTemplate(projectId, callback))
                  : showToastMessage('Something went worng', 'error')
              })
            )
          }
        },
        (err: any) => {
          if (err.status == 403 || err.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(loadTemplate(projectId, callback))
                  : ''
              })
            )
          } else {
          }
        }
      )
    } else {
      // showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function deleteAssetsAndPhotoTray(itemIndex) {
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      const { imageId, customFabricObj, photoTrayId } =
        getState().customisationReducer
      const { accountId } = getState().authReducer?.user
      customDeleteApiCall(
        `/${accountId}/${customFabricObj?.project_id}/images/${imageId}`,
        '',
        '',
        (response: any) => {},
        (error: any) => {}
      )

      customDeleteApiCall(
        `/${accountId}/photo-tray-images/${photoTrayId}`,
        '',
        '',
        (response: any) => {},
        (error: any) => {}
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function savePersonalization() {
  return (dispatch: Function, getState: any) => {
    const { customFabricObj } = getState().customisationReducer
    constant.switchLoader(dispatch, 'customisation', true)
    const adobeReducerState = getState().globalAdobeReducer
    const { appConfigValues } = getState().configReducer
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      let payload = {
        customobj: customFabricObj,
        savedPersonalization: generateCanvasJSONUtil.getProjectData()
      }
      postApiCall(
        `/customisation/save`,
        payload,
        (resp: any) => {
          dispatch({
            type: actionNames.PREVIEW_TEMPLATE,
            payload: {
              previewTemplate: resp.data.data
            }
          })
          if (appConfigValues?.adobe?.isAnalyticsEnabled) {
            let customizeTrackObj: AdobeObj = {
              'cd.pageName': `${strings.Customization}>Preview`,
              'cd.pageType': strings.Customization,
              'cd.previousPageName': adobeReducerState['cd.pageName'],
              'cd.level1': strings.Customization,
              'cd.level2': 'Preview',
              'cd.level3': ''
            }
            dispatch({
              type: actionNames.TRACK_STATE,
              payload: customizeTrackObj
            })
            ACPCore.trackState(customizeTrackObj['cd.pageName'], {
              ...adobeReducerState,
              ...customizeTrackObj
            })
          }
          constant.switchLoader(dispatch, 'customisation', false)
        },
        (error: any) => {
          console.log(error, 'error')
          if (error?.status == 403 || error?.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(savePersonalization())
                  : showToastMessage('Something went worng', 'error')
              })
            )
          } else {
            constant.switchLoader(dispatch, 'customisation', false)
          }
        }
      )
    } else {
      constant.switchLoader(dispatch, 'customisation', false)
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function postImage(
  fileData: any,
  callback = (res: any, response: any, response1: any) => {}
) {
  return async (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'customisation', true)
    const { accountId } = getState().authReducer?.user
    const { customFabricObj } = getState().customisationReducer

    let headers = {
      'Content-Type': 'multipart/form-data'
    }

    let FormData = require('form-data')
    const formData = new FormData()
    let localImageUrl = ''
    if (
      fileData.extension != 'jpg' &&
      fileData.extension != 'jpeg' &&
      fileData.extension != 'png'
    ) {
      fileData = await CameraRoll.iosGetImageDataById(fileData?.uri, true)
      formData.append('file', {
        uri: fileData?.node?.image?.filepath,
        type: fileData?.node?.type,
        name: fileData?.node?.image?.filename
      })
      console.log(
        'Post Image',
        fileData?.node?.image?.filepath,
        fileData?.node?.type,
        fileData?.node?.image?.filename,
        fileData
      )
      localImageUrl = fileData?.node?.image?.filepath
    } else {
      formData.append('file', {
        uri: fileData.uri,
        type: fileData.type,
        name: fileData.fileName
      })
      console.log(
        'Post Image1',
        fileData.uri,
        fileData.type,
        fileData.fileName,
        fileData
      )
      localImageUrl = fileData.uri
    }

    formData.append('is_handwriting_image', false)
    formData.append('display_indicator', true)
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      constant.switchLoader(dispatch, 'customisation', true)
      customPostApiCallWithHeader(
        `/${accountId}${endpoint.photoTrayImg}`,
        formData,
        headers,
        (response: any) => {
          customPostApiCall(
            `/${accountId}/${customFabricObj?.project_id}/images`,
            {
              image_reference_id: response.data.data.photo_tray_image_id
            },
            (resp: any) => {
              console.log('resp', resp)
              dispatch({
                type: actionNames.CUSTOMISATION_STATE,
                payload: {
                  backgroundImageUrl: response?.data?.data?.image_url,
                  photoTrayId: response.data.data.photo_tray_image_id,
                  localImageUrl: localImageUrl,
                  imageId: resp.data.data.image_id
                }
              })

              callback(
                response.data.data.photo_tray_image_id,
                resp.data.data.image_id,
                response?.data?.data?.image_url
              )
              constant.switchLoader(dispatch, 'customisation', false)
            },
            (error: any) => {
              console.log('error upload', error)
              callback(undefined, undefined, undefined)
              dispatch(editingModeChange(false))
              constant.switchLoader(dispatch, 'customisation', false)
            }
          )
        },
        (error: any) => {
          callback(undefined, undefined, undefined)
          console.log('error upload', error)
          dispatch(editingModeChange(false))
          constant.switchLoader(dispatch, 'customisation', false)
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function editingModeChange(mode: Boolean) {
  return (dispatch: Function) => {
    constant.switchLoader(dispatch, 'customisation', true)
    dispatch({
      type: actionNames.CUSTOMISATION_STATE,
      payload: {
        editingMode: mode
      }
    })
    constant.switchLoader(dispatch, 'customisation', false)
  }
}

export function updateProductType(type: any) {
  return (dispatch: Function, getState: any) => {
    const { pdpDetail } = getState().categoryReducer
    const currentProduct = pdpDetail?.variations?.filter(
      (dd: any) => dd.attributes.customizationProductTypeCode === type
    )
    const POD_CARDS_INITIAL_STATE = [
      {
        title: 'Your Item',
        subtitle: `Standard Delivery ($${currentProduct[0]?.price})`,
        type: '',
        isCompleted: true,
        buttonText: '',
        show: true,
        back: true
      },
      {
        title: 'Delivery Method',
        subtitle: 'First Class Mail',
        type: 'delivery',
        show: true,
        isCompleted: true,
        buttonText: 'Choose Delivery Method',
        back: false
      },
      {
        title: 'Your Address',
        subtitle: 'Your Address',
        type: 'DeliveryYourAddress',
        isCompleted: false,
        show: true,
        buttonText: 'Add Your Address',
        back: false
      },
      {
        title: 'Recipient',
        subtitle: 'Recipient',
        type: 'recipient',
        show: true,
        isCompleted: false,
        back: false,
        buttonText: 'Add Recipient Address'
      }
    ]

    const DIGITAL_CARDS_INITIAL_STATE = [
      {
        title: 'Your Item',
        subtitle: `Digital Delivery`,
        type: 'yourcard',
        isCompleted: true,
        show: true,
        buttonText: '',
        back: true
      },
      {
        title: 'Delivery',
        subtitle: 'Send via email',
        type: 'delivery',
        isCompleted: false,
        show: true,
        buttonText: 'Choose Email or Text',
        back: false
      },
      {
        title: 'Recipient',
        subtitle: 'Recipient',
        type: 'DeliveryEmailReceiverAddress',
        isCompleted: true,
        show: false,
        back: false,
        buttonText: 'Recipient'
      },
      {
        title: 'Sender',
        subtitle: 'Sender',
        type: 'DeliveryEmailSenderAddress',
        isCompleted: true,
        show: false,
        buttonText: 'Sender',
        back: false
      }
    ]

    dispatch({
      type: actionNames.UPDATE_PRODUCT_TYPE,
      payload: {
        selectedProductType: type
      }
    })
    if (type == 'D')
      dispatch(updateDigitalCardData(DIGITAL_CARDS_INITIAL_STATE))
    else dispatch(updatePODCardData(POD_CARDS_INITIAL_STATE))
  }
}
export function updateDigitalCardData(data: any) {
  return (dispatch: Function) => {
    dispatch({
      type: actionNames.DIGITAL_CARD_STATE,
      payload: {
        cardDeliveryData: data
      }
    })
  }
}

export function updatePODCardData(data: any) {
  return (dispatch: Function) => {
    dispatch({
      type: actionNames.POD_CARD_STATE,
      payload: {
        cardDeliveryData: data
      }
    })
  }
}

export function updateSenderAddress(
  data: any,
  callback = (response: any) => {}
) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'address', true)
    const { customisationTemplateData } = getState().customisationReducer
    const { cardDeliveryData } = getState().deliveryReducer
    let updateSenderAddId = cardDeliveryData[2]?.formDetails?.sa_id

    const { accountId } = getState().authReducer?.user
    let payload = {
      first_name: data?.name,
      last_name: data?.lastName,
      company_name: '',
      address_line_1: data?.addrLine1,
      address_line_2: data?.addrLine2,
      city: data?.city,
      state_code: data?.state,
      zip: data?.zipCode,
      country_code: 'USA',
      address_type_code: 'S',
      skip_usps_validation: false
    }

    if (updateSenderAddId) {
      delete payload?.address_type_code

      customPutApiCall(
        `/${accountId}/${customisationTemplateData?.project_id}/addresses/${updateSenderAddId}`,
        payload,
        (response: any) => {
          console.log('Update Sender address', response)

          if (response?.status === 200) {
            data.sa_id = response.data.data.address_id

            dispatch({
              type: actionNames.UPDATE_SENDER_ADDRESS,
              payload: {
                formDetails: data
              }
            })
            callback(201)
            constant.switchLoader(dispatch, 'address', false)
          } else if (response?.status === 422) {
            console.log('Update usps', response)
            showToastMessage('Invalid Address', 'invalid')
            constant.switchLoader(dispatch, 'address', false)
            callback(response?.status)
          } else {
            callback(response?.status)
            constant.switchLoader(dispatch, 'address', false)
          }
        },
        (error: any) => {
          console.log('Update Sender address error', error)
          showToastMessage('Invalid Address', 'invalid')
          callback(error?.status)
          showToastMessage('Sorry something went wrong', 'invalid')
        }
      )
    } else {
      customPostApiCall(
        `/${accountId}/${customisationTemplateData?.project_id}/addresses`,
        payload,
        (response: any) => {
          console.log('Add Sender address', response)
          if (response?.status === 201) {
            data.sa_id = response.data.data.address_id

            dispatch({
              type: actionNames.UPDATE_SENDER_ADDRESS,
              payload: {
                formDetails: data
              }
            })
            constant.switchLoader(dispatch, 'address', false)
            callback(201)
          } else if (response?.status === 422) {
            console.log('usps', response)
            showToastMessage('Invalid Address', 'invalid')
            constant.switchLoader(dispatch, 'address', false)
            callback(response?.status)
          } else {
            callback(response?.status)
          }
        },
        (error: any) => {
          console.log('Add Sender address error', error)
          constant.switchLoader(dispatch, 'address', false)
          showToastMessage('Invalid Address', 'invalid')
          callback(error?.status)
          showToastMessage('Sorry something went wrong', 'invalid')
        }
      )
    }
  }
}
export function updateRecipientAddress(
  data: any,
  callback = (response: any) => {}
) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'address', true)
    const { customisationTemplateData } = getState().customisationReducer
    const { cardDeliveryData } = getState().deliveryReducer
    let updateRecipientAddId = cardDeliveryData[3]?.formDetails?.ra_id

    const { accountId } = getState().authReducer?.user
    let payload = {
      first_name: data?.name,
      last_name: data?.lastName,
      company_name: '',
      address_line_1: data?.addrLine1,
      address_line_2: data?.addrLine2,
      city: data?.city,
      state_code: data?.state,
      zip: data?.zipCode,
      country_code: 'USA',
      address_type_code: 'R',
      skip_usps_validation: false
    }
    //Attach address to project
    if (updateRecipientAddId) {
      delete payload?.address_type_code

      customPutApiCall(
        `/${accountId}/${customisationTemplateData?.project_id}/addresses/${updateRecipientAddId}`,
        payload,
        (response: any) => {
          console.log('Update Receiver address', response)
          if (response?.status === 200) {
            data.ra_id = response.data.data.address_id

            dispatch({
              type: actionNames.UPDATE_RECIPIENT_ADDRESS,
              payload: {
                formDetails: data
              }
            })
            constant.switchLoader(dispatch, 'address', false)
            callback(201)
          } else {
            showToastMessage('Invalid Address', 'invalid')
            constant.switchLoader(dispatch, 'address', false)
            callback(422)
          }
        },
        (error: any) => {
          showToastMessage('Sorry something went wrong', 'invalid')
          constant.switchLoader(dispatch, 'address', false)
          console.log('Update Receiver address error', error)
        }
      )
    } else {
      customPostApiCall(
        `/${accountId}/${customisationTemplateData?.project_id}/addresses`,
        payload,
        (response: any) => {
          console.log('Add Receiver address', response)
          if (response?.status === 201) {
            data.ra_id = response.data.data.address_id
            dispatch({
              type: actionNames.UPDATE_RECIPIENT_ADDRESS,
              payload: {
                formDetails: data
              }
            })
            constant.switchLoader(dispatch, 'address', false)
            callback(201)
          } else {
            constant.switchLoader(dispatch, 'address', false)
            showToastMessage('Sorry something went wrong', 'invalid')
          }
        },
        (error: any) => {
          showToastMessage('Sorry something went wrong', 'invalid')
          console.log('Add Receiver address error', error)
          constant.switchLoader(dispatch, 'address', false)
          callback(error?.status)
        }
      )
    }
  }
}
export function updateRecipientEmailAddress(data: any, callback: any) {
  return (dispatch: Function, getState: any) => {
    const { customisationTemplateData } = getState().customisationReducer
    const { cardDeliveryData } = getState().deliveryReducer

    const { accountId } = getState().authReducer?.user

    let payload = {
      recipient_first_name: data?.recipientFirstName,
      recipient_last_name: data?.recipientLastName,
      contact_info: data?.recipientEmailAddress,
      sender_first_name: data?.senderFirstName,
      sender_last_name: data?.senderLastName,
      sender_email: 'TestSender@hallmark.com',
      recipient_type_code: 'E'
    }
    //Attach address to project
    let updateEmailRcId = cardDeliveryData[1]?.formDetails?.recp_id

    // console.log('Update Email data', data)
    //console.log('Update updateEmailRcId', updateEmailRcId)
    //console.log(
    //  'Update customisationTemplateData data',
    //   customisationTemplateData
    // )
    // console.log('Update cardDeliveryData data', cardDeliveryData)

    if (updateEmailRcId) {
      customPutApiCall(
        `/${accountId}/${customisationTemplateData?.project_id}/recipients/${updateEmailRcId}`,
        payload,
        (response: any) => {
          if (response?.status === 200) {
            data.recp_id = response.data.data.recipient_id
            callback()

            dispatch({
              type: actionNames.UPDATE_RECIPIENT_EMAIL_ADDRESS,
              payload: {
                formDetails: data
              }
            })
          }
          console.log('Update Email', response)
        },
        (error: any) => {
          showToastMessage('Something went wrong', 'invalid')
          console.log('Update Email error', error)
        }
      )
    } else {
      customPostApiCall(
        `/${accountId}/${customisationTemplateData?.project_id}/recipients`,
        payload,
        (response: any) => {
          if (response?.status === 201) {
            data.recp_id = response.data.data.recipient_id
            callback()

            dispatch({
              type: actionNames.UPDATE_RECIPIENT_EMAIL_ADDRESS,
              payload: {
                formDetails: data
              }
            })
          }
          console.log('Add Email', response)
        },
        (error: any) => {
          showToastMessage('Something went wrong', 'invalid')
          console.log('Add Email error', error)
        }
      )
    }
  }
}
export function updateDeliveryAsText() {
  return (dispatch: Function, getState: any) => {
    const { customisationTemplateData } = getState().customisationReducer
    const { accountId } = getState().authReducer?.user

    let payload = {
      recipient_first_name: 'Mobile',
      recipient_last_name: 'Text',
      contact_info: '1234567890',
      sender_first_name: 'SenderFirstName',
      sender_last_name: 'SenderLastName',
      sender_email: 'TestSender@hallmark.com',
      recipient_type_code: 'S'
    }
    //Attach address to project
    customPostApiCall(
      `/${accountId}/${customisationTemplateData?.project_id}/recipients`,
      payload,
      (response: any) => {
        if (response?.status === 201) {
          dispatch({
            type: actionNames.UPDATE_TEXT_DELIVERY,
            payload: {}
          })
        }
        console.log('Add Text', response)
      },
      (error: any) => {
        showToastMessage('Something went wrong', 'invalid')
        console.log('Add Text error', error)
      }
    )
    // dispatch({
    //   type: actionNames.UPDATE_TEXT_DELIVERY,
    //   payload: {}
    // })
  }
}

export function updateCustomisationState() {
  return (dispatch: Function) => {
    dispatch({
      type: actionNames.AUTH_REDUCER,
      payload: {
        isCustomised: false
      }
    })
  }
}

export function getPODDeliveryOptions() {
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    let baseUrl = endpoint.podDeliveryOption
    if (isConnected) {
      getApiCall(
        baseUrl,
        (response: any) => {
          if (response?.data?.code === 200) {
            dispatch({
              type: actionNames.POD_DELIVERY_OPTIONS,
              payload: {
                podDeliveryOptions: response?.data?.data
              }
            })
            constant.switchLoader(dispatch, 'category', false)
          }
        },
        (err: any) => {
          if (err.status == 403 || err.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success' ? dispatch(getPODDeliveryOptions()) : ''
              })
            )
          } else {
          }
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function getDigitalDeliveryOptions() {
  return (dispatch: Function, getState: any) => {
    const { isConnected } = getState().internetStatusReducer
    let baseUrl = endpoint.digitalDeliveryOption
    if (isConnected) {
      getApiCall(
        baseUrl,
        (response: any) => {
          if (response?.data?.code === 200) {
            dispatch({
              type: actionNames.DIGITAL_DELIVERY_OPTIONS,
              payload: {
                digitalDeliveryOptions: response?.data?.data
              }
            })
            constant.switchLoader(dispatch, 'category', false)
          }
        },
        (err: any) => {
          if (err.status == 403 || err.status == 405) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success' ? dispatch(getDigitalDeliveryOptions()) : ''
              })
            )
          } else {
          }
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function addToCart(callback = (res: any) => {}) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'addtocart', true)

    const { accountId } = getState().authReducer?.user
    const adobeReducerState = getState().globalAdobeReducer
    const { customisationTemplateData, previewTemplate } =
      getState().customisationReducer

    const { selectedProductType, pdpDetail } = getState().categoryReducer

    const { cardDeliveryData } = getState().deliveryReducer

    customPatchApiCall(
      `/${accountId}/${customisationTemplateData?.project_id}/add-to-cart`,
      {},

      (resp) => {
        console.log(resp, 'responsee from patch')
      },
      () => {}
    )

    let bodyData = {}

    let deliveryInfo = pdpDetail?.variations.filter(
      (d: any) => d.id === customisationTemplateData?.product_id
    )
    if (selectedProductType == 'S') {
      bodyData = {
        quantity: 1,

        projectID: customisationTemplateData?.project_id,

        fulfillmentProductTypeCode: 'S',

        shippingOptionCode: 'S',

        firstName: cardDeliveryData[3]?.formDetails?.name,

        lastName: cardDeliveryData[3]?.formDetails?.lastName,
        addressLine1: cardDeliveryData[3]?.formDetails?.addrLine1,
        // addressLine2: cardDeliveryData[2]?.formDetails?.addrLine2,

        city: cardDeliveryData[3]?.formDetails?.city,

        stateCode: cardDeliveryData[3]?.formDetails?.state,

        zip: cardDeliveryData[3]?.formDetails?.zipCode,

        thumbnailImageURL: previewTemplate?.length
          ? previewTemplate[0]
          : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Hallmark_logo.svg/2560px-Hallmark_logo.svg.png',

        product_id: customisationTemplateData?.product_id,

        deviceSource: 'A',
        earliest_delivery_date: `${deliveryInfo[0]?.earliest_delivery_date}T00:00:00.000Z`,
        latest_delivery_date: `${deliveryInfo[0]?.latest_delivery_date}T00:00:00.000Z`,
        req_ship_date: `${deliveryInfo[0]?.fulfillment_date}T00:00:00.000Z`,
        scanCode: customisationTemplateData?.scan_code,
        cardType: 'P'
      }
    }

    postApiCall(
      `${endpoint.addToCart}`,

      bodyData,

      (response: any) => {
        console.log('add to cart', response)

        if (response?.data?.code === 200) {
          ACPCore.trackAction('AddToCart Success', {
            ...adobeReducerState,
            'cd.addToCart': '1',
            'cd.productId': bodyData.product_id
          })
          navigate(screenNames.CART_NAVIGATOR, {
            screen: screenNames.CART_SCREEN
          })
          dispatch(getBasket(() => {}))
          constant.switchLoader(dispatch, 'addtocart', false)

          callback('200')
        } else if (response?.status == 403 || response?.status == 405) {
          ACPCore.trackAction('AddToCart Error', {
            ...adobeReducerState,
            'cd.addToCartError': '1',
            'cd.productId': bodyData.product_id
          })
          dispatch(
            signInAgain((res: any) => {
              res === 'success'
                ? dispatch(addToCart(callback))
                : showToastMessage('Something went worng', 'error')
            })
          )

          constant.switchLoader(dispatch, 'addtocart', false)
        } else {
          ACPCore.trackAction('AddToCart Error', {
            ...adobeReducerState,
            'cd.addToCartError': '1',
            'cd.productId': bodyData.product_id
          })
          showToastMessage('Something went worng', 'error')
        }
      },

      (error: any) => {
        console.log('add to cart', error)
        ACPCore.trackAction('AddToCart Error', {
          ...adobeReducerState,
          'cd.addToCartError': '1',
          'cd.productId': bodyData.product_id
        })

        if (error.status == 500) {
          showToastMessage(error?.data?.arguments?.statusMessage, 'danger')

          constant.switchLoader(dispatch, 'addtocart', false)
        } else {
          if (error.status == 405 || error.status == 403) {
            dispatch(
              signInAgain((res: any) => {
                res === 'success'
                  ? dispatch(addToCart(callback))
                  : showToastMessage('Sorry Something went Wrong', 'error')
              })
            )

            constant.switchLoader(dispatch, 'addtocart', false)
          } else {
            constant.switchLoader(dispatch, 'addtocart', false)

            showToastMessage('Sorry Something went Wrong', 'error')
          }
        }
      }
    )
  }
}

export function removeFromCart(
  productId: any,
  callback = (res?: object) => {}
) {
  return (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'cart', true)
    const adobeReducerState = getState().globalAdobeReducer
    let baseUrl = `${endpoint.updateCartItem}${productId}`
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      deleteApiCall(
        baseUrl,
        '',
        {},
        async (response: any) => {
          if (response?.data?.code === 200) {
            ACPCore.trackAction('RemoveFromCart Success', {
              ...adobeReducerState,
              'cd.cartRemoveSuccess': '1',
              'cd.productId': productId
            })
            dispatch(
              getBasket(() => {
                callback(response)
              })
            )
          } else if (response?.status == 403 || response?.status == 405) {
            dispatch(
              signInAgain((res: any) =>
                res === 'success'
                  ? dispatch(removeFromCart(productId, callback))
                  : showToastMessage('Sorry Something went Wrong', 'invalid')
              )
            )
          } else {
            ACPCore.trackAction('RemoveFromCart Error', {
              ...adobeReducerState,
              'cd.cartRemoveError': '1',
              'cd.productId': productId
            })
            constant.switchLoader(dispatch, 'cart', false)
            showToastMessage('Unable to remove product from cart', 'danger')
          }
        },
        (err: any) => {
          if (err.status == 405 || err.status == 403) {
            dispatch(
              signInAgain((res: any) =>
                res === 'success'
                  ? dispatch(removeFromCart(productId))
                  : showToastMessage('Sorry Something went Wrong', 'error')
              )
            )
            constant.switchLoader(dispatch, 'cart', false)
          } else {
            ACPCore.trackAction('RemoveFromCart Error', {
              ...adobeReducerState,
              'cd.cartRemoveError': '1',
              'cd.productId': productId
            })
            constant.switchLoader(dispatch, 'cart', false)
            showToastMessage('Sorry Something went Wrong', 'error')
          }
        }
      )
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}

export function addressLookup(
  lookupString: string,
  callback = (res?: object) => {}
) {
  return async (dispatch: Function, getState: any) => {
    let baseUrl = `https://us-autocomplete-pro.api.smartystreets.com/lookup?key=126217453190614057&search=${encodeURIComponent(
      lookupString
    )}`
    const config = {
      headers: {
        Referer: 'https://www.dev.hallmark.com'
      }
    }
    const { isConnected } = getState().internetStatusReducer
    if (isConnected) {
      const url = baseUrl
      try {
        const response = await axios.get(url, config)
        callback(response?.data?.suggestions)
      } catch (error) {}
    } else {
      showToastMessage('Please check your internet connection', 'invalid')
    }
  }
}
export function cropImage(
  imageId: any,
  x: any,
  y: any,
  width: any,
  height: any,
  rotation: any,
  source_version_id: any,
  callback = (version_id: any) => {}
) {
  return async (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'customisation', true)
    const { accountId } = getState().authReducer?.user
    const { customFabricObj } = getState().customisationReducer
    console.log('payload', {
      x_pos: x,
      y_pos: y,
      width: width,
      height: height,
      rotation: rotation,
      source_version_id: source_version_id
    })
    customPostApiCall(
      `/${accountId}/${customFabricObj?.project_id}/images/${imageId}/crop-and-rotate`,
      {
        x_pos: x,
        y_pos: y,
        width: width,
        height: height,
        rotation: rotation,
        source_version_id: source_version_id
      },
      (resp: any) => {
        console.log('resp', resp)
        callback(resp?.data?.data)

        constant.switchLoader(dispatch, 'customisation', false)
      },
      (error: any) => {
        console.log('error upload', error)
        callback(error.status)
        constant.switchLoader(dispatch, 'customisation', false)
      }
    )
  }
}

export function digitalSends(callback = (res: any) => {}) {
  return async (dispatch: Function, getState: any) => {
    constant.switchLoader(dispatch, 'digitalSend', true)
    const { accountId } = getState().authReducer?.user
    const { cardDeliveryData } = getState().deliveryReducer

    const { customFabricObj, customisationTemplateData, previewTemplate } =
      getState().customisationReducer
    let payload = {
      product_id: customisationTemplateData?.product_id,

      quantity: 1,

      firstName: cardDeliveryData[1]?.formDetails?.recipientFirstName
        ? cardDeliveryData[1]?.formDetails?.recipientFirstName
        : 'FirstName',

      lastName: cardDeliveryData[1]?.formDetails?.recipientLastName
        ? cardDeliveryData[1]?.formDetails?.recipientLastName
        : 'lastName',

      email: cardDeliveryData[1]?.formDetails?.recipientEmailAddress
        ? cardDeliveryData[1]?.formDetails?.recipientEmailAddress
        : 'test@gmai.com',

      thumbnailImageURL: previewTemplate?.length
        ? previewTemplate[0]
        : 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Hallmark_logo.svg/2560px-Hallmark_logo.svg.png',

      description: customFabricObj?.product?.product_name,
      projectID: customFabricObj?.project_id,

      account_id: accountId,

      recipient_id: cardDeliveryData[1]?.formDetails?.recp_id,

      front_url: previewTemplate?.length ? previewTemplate[0] : '',

      inside_url: previewTemplate?.length ? previewTemplate[1] : ''
    }
    postApiCall(
      `/order`,
      payload,
      (resp: any) => {
        if (resp?.code === 200) callback(resp?.data?.tinyUrl)
        else callback('invalid')
        constant.switchLoader(dispatch, 'digitalSend', false)
      },
      (error: any) => {
        console.log('error upload', error)
        callback('invalid')
        constant.switchLoader(dispatch, 'digitalSend', false)
      }
    )
  }
}
