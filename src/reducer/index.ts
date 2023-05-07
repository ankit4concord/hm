import {
  cartReducer,
  categoryReducer,
  //collectionReducer,
  customisationReducer,
  deliveryReducer
} from '../modules/shop'
import {
  configReducer,
  favoriteCategoryReducer,
  globalAdobeReducer,
  globalLoadMoreReducer,
  globalLoaderReducer,
  internetStatusReducer,
  miscReducer,
  globalMessageReducer
} from './globalReducers'

import { authReducer } from '../modules/auth'
import { combineReducers } from 'redux'
//Reducers
import { homeReducer } from '../modules/home'
import { careReducer, orderHistoryReducer } from '@ecom/modules/account/reducer'

//custom imports below

const reducers = combineReducers({
  homeReducer,
  authReducer,
  globalAdobeReducer,
  globalLoaderReducer,
  categoryReducer,
  //collectionReducer,
  cartReducer,
  internetStatusReducer,
  globalLoadMoreReducer,
  configReducer,
  miscReducer,
  favoriteCategoryReducer,
  customisationReducer,
  deliveryReducer,
  globalMessageReducer,
  careReducer,
  orderHistoryReducer
})

export default reducers
