import { applyMiddleware, compose, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { createLogger } from 'redux-logger'
//custom imports below
import reducers from '../reducer'
import thunkMiddleware from 'redux-thunk'

const enhancers = [
  applyMiddleware(
    thunkMiddleware,
    // logger,
    createLogger({
      collapsed: true,
      predicate: () => __DEV__
    })
  )
]

const enhancer = compose(...enhancers)

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['authReducer', 'cartReducer', 'favoriteCategoryReducer']
}

const persistedReducer = persistReducer(persistConfig, reducers)
//@ts-ignore
export const store = createStore(persistedReducer, {}, enhancer)
export const persistor = persistStore(store)
