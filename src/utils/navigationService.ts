import { NavigationAction, NavigationState } from '@react-navigation/native'

import React from 'react'

export const navigationRef = React.createRef<any>()

export function navigate(
  routeName: string,
  params: { [key: string]: object | string | undefined } = {}
): void {
  navigationRef.current?.navigate(routeName, params)
}

export const reset = (state: any) => {
  navigationRef.current?.reset(state)
}

export function currentRoute() {
  return navigationRef?.current?.getCurrentRoute()
}

export function dispatch(
  action: NavigationAction | ((state: NavigationState) => NavigationAction)
): void {
  navigationRef.current?.dispatch(action)
}

export function goBack() {
  return navigationRef?.current.goBack()
}
