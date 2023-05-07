import ActionNames from '../../utils/actionNames'
import { AuthReducerModal } from '../../modals'

export const authReducer = (state = new AuthReducerModal(), action: any) => {
  switch (action.type) {
    case ActionNames.AUTH_REDUCER:
      return { ...state, ...action.payload }
    case ActionNames.UPDATE_UUID:
      return { ...state, ...action.payload }
    case ActionNames.USER_REDUCER:
      return { ...state, ...action.payload }
    case ActionNames.RISKIFIED_TOKEN:
      return { ...state, ...action.payload }
    case ActionNames.PUSH_AUTH:
      return { ...state, ...action.payload }
    case ActionNames.SIGNUP_INFO:
      return { ...state, ...action.payload }
    case ActionNames.PROFILE_REDUCER:
      return { ...state, ...action.payload }
    case ActionNames.PAYMENT_METHODS_REDUCER:
      return {
        ...state,
        ...{ profile: { ...state.profile, ...action.payload } }
      }
    case ActionNames.USER_LOGOUT:
      return {
        uuid: state.uuid,
        isLogout: true,
        isGuestMode: true,
        isInstalled: state?.isInstalled,
        awsToken: state?.awsToken,
        isOnboarded: state?.isOnboarded,
        isCustomised: state?.isCustomised,
        isUserVisitHomeFirstTime: state?.isUserVisitHomeFirstTime,
        isUserVisitSearchFirstTime: state?.isUserVisitSearchFirstTime,
        isUserVisitedForYouFirstTime: state?.isUserVisitedForYouFirstTime,
        notificationEmail: state?.notificationEmail,
        apns_token: state?.apns_token,
        registeredForPush: state?.registeredForPush,
        updatedNotificationPermission: state?.updatedNotificationPermission,
        notificationPermission: state?.notificationPermission,
        locationPermission: state?.locationPermission
      }
    default:
      return state
  }
}
