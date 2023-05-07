import ActionNames from '../../utils/actionNames'
import {
  CareReducerModel,
  OrderHistoryModel,
  OrderViewModel
} from '../../modals'

export const careReducer = (state = new CareReducerModel(), action: any) => {
  switch (action.type) {
    case ActionNames.CARE_ADD_REASON:
      return {
        ...state,
        ...{ careCase: { ...state.careCase, ...action.payload } }
      }
    case ActionNames.CARE_ADD_INFO:
      return {
        ...state,
        ...{ careCase: { ...state.careCase, ...action.payload } }
      }
    case ActionNames.CARE_ADD_CASE_ID:
      return { ...state, ...action.payload }
    case ActionNames.CARE_ADD_CASE_NUM:
      return { ...state, ...action.payload }
    case ActionNames.CARE_FILES_UPDATE_FINISHED:
      return { ...state, ...action.payload }
    case ActionNames.CARE_ADD_FILE:
      return { ...state, ...{ files: [...state.files, action.payload] } }
    case ActionNames.CARE_REMOVE_FILE:
      const newFiles = state.files.filter((f) => f !== action.payload)
      return { ...state, ...{ files: newFiles } }
    case ActionNames.CARE_UPDATE_FILE_PROGRESS:
      const oldFile = state.files.find((f) => f.uri === action.payload.uri)
      const updateProgress =
        !!oldFile && action.payload.uploadProgress > oldFile.uploadProgress
      return getNewOrOldStateFileUpdate(!updateProgress, state, action.payload)
    case ActionNames.CARE_UPDATE_FILE:
      return getNewOrOldStateFileUpdate(false, state, action.payload)
    case ActionNames.CARE_CLEAR_CASE:
      const newModel = new CareReducerModel()
      return newModel
    default:
      return state
  }
}

const getNewOrOldStateFileUpdate = (
  giveOldState: boolean,
  state: CareReducerModel,
  payload: any
) => {
  if (giveOldState) {
    return state
  }

  const newState = {
    ...state,
    ...{
      files: state.files.map((f) =>
        f.uri === payload.uri ? { ...f, ...payload } : f
      )
    }
  }
  newState.finished = newState.files.every((f) => !!f.uploadMessage)
  return newState
}

export const orderHistoryReducer = (
  state = new OrderHistoryModel(),
  action: any
) => {
  switch (action.type) {
    case ActionNames.ORDER_HISTORY_SET_LIST:
      return { ...action.payload }
    case ActionNames.ORDER_HISTORY_ADD_TO_LIST:
      const { orders, ...rest } = action.payload
      const combinedOrders = [
        ...state.orders,
        ...(orders as OrderViewModel[])
      ].filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.id === value.id)
      )
      return { ...rest, orders: combinedOrders }
    case ActionNames.ORDER_HISTORY_CLEAR_LIST:
      return { page: 0, total: 0, orders: [] }
    default:
      return state
  }
}
