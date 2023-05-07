import ActionNames from '../../utils/actionNames'
import { HomeReducerModal } from '../../modals'

export const homeReducer = (state = new HomeReducerModal(), action: any) => {
  switch (action.type) {
    case ActionNames.HOME_REDUCER:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
