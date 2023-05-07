// custom imports
import {
  AdobeReducerModal,
  ConfigReducerModal,
  FavoriteCategoryReducerModal,
  InternetStatusModel,
  LoadMoreModal,
  LoadersModal,
  MessageModel,
  MiscReducerModal
} from '../modals'

import ActionNames from '../utils/actionNames'

export const globalLoaderReducer = (
  state: LoadersModal = new LoadersModal(),
  action: any
) => {
  const { payload } = action
  switch (action.type) {
    case ActionNames.LOADING:
      return Object.assign({}, state, {
        //@ts-ignore
        [`${payload.scope}Loading`]: payload.isLoading
      })
    default:
      return { ...state }
  }
}

export const globalMessageReducer = (
  state: MessageModel = new MessageModel(),
  action: any
) => {
  const { payload, type } = action
  switch (type) {
    case ActionNames.SHOW_MESSAGE:
      return {
        ...state,
        [`${payload.scope}Message`]: payload.showMessage
      }
    default:
      return { ...state }
  }
}

export const internetStatusReducer = (
  state: InternetStatusModel = new InternetStatusModel(),
  action: any
) => {
  const { payload } = action
  switch (action.type) {
    case ActionNames.UPDATE_INTERNET_FIELDS:
      return { ...state, ['isConnected']: payload.isConnected }
    default:
      return { ...state }
  }
}

export const globalLoadMoreReducer = (
  state: LoadMoreModal = new LoadMoreModal(),
  action: any
) => {
  //@ts-ignore
  const { payload } = action
  switch (action.type) {
    case ActionNames.DO_LOAD_MORE:
      return Object.assign({}, state, {
        // sets the loading boolean at this scope
        //@ts-ignore
        [`${payload.scope}LoadMore`]: payload.isLoadMore
      })
    default:
      return state
  }
}

export const globalAdobeReducer = (
  state: AdobeReducerModal = new AdobeReducerModal(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.TRACK_STATE:
      return { ...state, ...action.payload }
    case ActionNames.TRACK_ACTION:
      return { ...state, ...action.payload }
    default:
      return { ...state }
  }
}
export const configReducer = (
  state: ConfigReducerModal = new ConfigReducerModal(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.STATIC_DATA:
      return { ...state, ...action.payload }
    default:
      return { ...state }
  }
}
export const favoriteCategoryReducer = (
  state = new FavoriteCategoryReducerModal(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.RECENTLY_VIEWED:
      return { ...state, ...action.payload }
    case ActionNames.RECENT_SEARCHES:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
export const miscReducer = (
  state: MiscReducerModal = new MiscReducerModal(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.MISC_INFO:
      return { ...state, ...action.payload }
    default:
      return { ...state }
  }
}
