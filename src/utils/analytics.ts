import { useDispatch, useSelector } from 'react-redux'

import { ACPCore } from '@adobe/react-native-acpcore'
import { RootReducerModal } from '@ecom/modals'
import actionNames from './actionNames'

export interface AdobeObj {
  'cd.pageName': String
  'cd.previousPageName'?: String
  'cd.pageType'?: String
  'cd.level1'?: String
  'cd.level2'?: String
  'cd.level3'?: String
  '&&products'?: String
}

export function AdobeTrackState(trackObj: AdobeObj) {
  const dispatch = useDispatch()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  if (adobeReducerState['cd.pageName']) {
    trackObj['cd.previousPageName'] = adobeReducerState['cd.pageName']
  }
  if (!trackObj['cd.level1']) trackObj['cd.level1'] = ''
  if (!trackObj['cd.level2']) trackObj['cd.level2'] = ''
  if (!trackObj['cd.level3']) trackObj['cd.level3'] = ''
  ACPCore.trackState(trackObj['cd.pageName'], {
    ...adobeReducerState,
    ...trackObj
  })
  dispatch({
    type: actionNames.TRACK_STATE,
    payload: trackObj
  })
}
