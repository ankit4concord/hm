import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ACPCore } from '@adobe/react-native-acpcore'
import { NavigationContainer } from '@react-navigation/native'
import RootNavigator from './RootNavigator'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import { navigationRef } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import screenTypes from '@ecom/utils/screenTypes'
import strings from '@ecom/utils/strings'

export default function Router() {
  const routeNameRef = React.useRef()
  const dispatch = useDispatch()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { apns_token } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const { componentClicked, homepageComponents } = useSelector(
    (state: RootReducerModal) => state.homeReducer
  )
  const { externalCampaignCode, icid } = useSelector(
    (state: RootReducerModal) => state.miscReducer
  )
  const { personalizationStart } = useSelector(
    (state: RootReducerModal) => state.customisationReducer
  )
  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef?.current.getCurrentRoute()?.name
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current
        const currentRouteName = navigationRef?.current.getCurrentRoute()?.name
        const currentRouteParams =
          navigationRef?.current.getCurrentRoute()?.params
        if (previousRouteName !== currentRouteName) {
          let trackObj: any = {}
          trackObj['cd.previousPageName'] =
            adobeReducerState['cd.pageName'] ?? ''
          trackObj['cd.level1'] = ''
          trackObj['cd.level2'] = ''
          trackObj['cd.level3'] = ''
          if (externalCampaignCode) {
            trackObj['cd.campaign'] = externalCampaignCode
            dispatch({
              type: actionNames.MISC_INFO,
              payload: { externalCampaignCode: undefined }
            })
          }
          if (icid) {
            trackObj['cd.icid'] = icid
            dispatch({
              type: actionNames.MISC_INFO,
              payload: { icid: undefined }
            })
          }
          if (currentRouteName === screenNames.HOME_SCREEN) {
            trackObj['cd.pageName'] = screenTypes.HOME
            trackObj['cd.pageType'] = screenTypes.HOME
            trackObj['cd.previousPageName'] = adobeReducerState['cd.pageName']
            trackObj['cd.level1'] = screenTypes.HOME
            ACPCore.trackState(trackObj['cd.pageName'], {
              ...adobeReducerState,
              ...trackObj,
              'cd.pageComponents': homepageComponents,
              'cd.deviceToken': `${apns_token}`
            })
            trackObj['cd.icid'] = undefined
            trackObj['cd.campaign'] = undefined
            dispatch({
              type: actionNames.TRACK_STATE,
              payload: trackObj
            })
          } else if (currentRouteName === screenNames.SHOP_SCREEN) {
            trackObj['cd.pageName'] = screenNames.SHOP_NAVIGATOR
            trackObj['cd.pageType'] = screenTypes.CLP
            trackObj['cd.previousPageName'] = adobeReducerState['cd.pageName']
            trackObj['cd.level1'] = screenNames.SHOP_NAVIGATOR
            trackObj['cd.level2'] = ''
            trackObj['cd.level3'] = ''
            trackObj['cd.digitalDeliveryProjectID'] = undefined
            ACPCore.trackState(trackObj['cd.pageName'], {
              ...adobeReducerState,
              ...trackObj
            })
            trackObj['cd.icid'] = undefined
            trackObj['cd.campaign'] = undefined
            dispatch({
              type: actionNames.TRACK_STATE,
              payload: trackObj
            })
          } else if (currentRouteName === screenNames.PLP) {
            let customObj = {}
            trackObj['cd.pageName'] = currentRouteParams.categoryLabel || screenTypes.PLP
            trackObj['cd.pageType'] = screenTypes.PLP
            trackObj['cd.previousPageName'] = adobeReducerState['cd.pageName']
            trackObj['cd.level1'] = currentRouteParams.categoryLabel || screenTypes.PLP
            trackObj = { ...trackObj, 'cd.level2': '', 'cd.level3': '' }
            if(currentRouteParams.from === 'customization'){
              const personalizationEnd = new Date().getTime()
              const personalizationSecs = Math.floor(Math.abs(personalizationEnd - personalizationStart) / 1000);
              if(adobeReducerState['cd.printOnDemandProjectID']){
                customObj['cd.printOnDemandProjectID'] = ''
              } else {
                customObj['cd.digitalDeliveryProjectID'] = ''
              }
              customObj['cd.personalizationFlowCancel'] = '1'
              customObj['cd.personalizationEndTime'] = new Date(personalizationEnd).toLocaleString(),
              customObj['cd.personalizationSecs'] = `${personalizationSecs}`
            }
            if (componentClicked) {
              trackObj['cd.trackAction'] = currentRouteParams.from === 'home' ? `${componentClicked}- All` : componentClicked
              dispatch({
                type: actionNames.HOME_REDUCER,
                payload: {
                  componentClicked: ''
                }
              })
            }
            ACPCore.trackState(trackObj['cd.pageName'], {
              ...adobeReducerState,
              ...trackObj,
              ...customObj
            })
            trackObj['cd.trackAction'] = ''
            trackObj['cd.icid'] = undefined
            trackObj['cd.campaign'] = undefined
            dispatch({
              type: actionNames.TRACK_STATE,
              payload: trackObj
            })
          } else if (currentRouteName === screenNames.POD_ADDTOCART && selectedProductType === 'D') {
            trackObj['cd.pageName'] = strings.SendDigitalGreeting
            trackObj['cd.level1'] = strings.SendDigitalGreeting
            trackObj['cd.pageType'] = strings.SendDigitalGreeting
            trackObj['cd.previousPageName'] = adobeReducerState['cd.pageName']
            const personalizationEnd = new Date().getTime()
            const personalizationSecs = Math.floor(Math.abs(personalizationEnd - personalizationStart) / 1000);
            ACPCore.trackState(trackObj['cd.pageName'], {
              ...adobeReducerState,
              ...trackObj,
              'cd.personalizationFlowEnd': '1',
              'cd.personalizationEndTime': new Date(personalizationEnd).toLocaleString(),
              'cd.personalizationSecs': `${personalizationSecs}`
            })
          } else if (currentRouteName === screenNames.ACCOUNT_SCREEN) {
            trackObj['cd.pageName'] = screenTypes.ACCOUNT
            trackObj['cd.pageType'] = screenTypes.ACCOUNT
            trackObj['cd.level1'] = screenTypes.ACCOUNT
            ACPCore.trackState(screenTypes.ACCOUNT, {
              ...adobeReducerState,
              ...trackObj
            })
            trackObj['cd.icid'] = undefined
            trackObj['cd.campaign'] = undefined
            dispatch({
              type: actionNames.TRACK_STATE,
              payload: trackObj
            })
          }
        }

        routeNameRef.current = currentRouteName
      }}>
      <RootNavigator />
    </NavigationContainer>
  )
}
