import { Alert, Image, Linking, StyleSheet, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import HomePageSearchBar from '@ecom/components/HomepageSearchbar'
import Loader from '@ecom/components/Loader'
import PageDesignerComponents from '@ecom/components/PageDesignerComponents'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { RootReducerModal } from '@ecom/modals'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import localImages from '@ecom/utils/localImages'

export function HomeScreen(props: any) {
  const dispatch = useDispatch()

  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )

  const { homePageDesignerData } = useSelector(
    (state: RootReducerModal) => state.homeReducer
  )
  const { homeLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  const {
    notificationPermission,
    updatedNotificationPermission,
    registeredForPush,
    apns_token
  } = useSelector((state: RootReducerModal) => state.authReducer)
  useEffect(() => {
    constant.switchLoader(dispatch, 'auth', false)
  }, [])

  useEffect(() => {
    if (!apns_token && !registeredForPush) {
      PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true
      })
        .then((grant) => {
          console.log(
            `registerForRemoteNotifications = ${JSON.stringify(grant)}`
          )
          dispatch({
            type: actionNames.PUSH_AUTH,
            payload: {
              registeredForPush: true,
              notificationPermission: grant.authorizationStatus
            }
          })
          if (appConfigValues?.adobe?.isAnalyticsEnabled) {
            let optStatus = 'Opted-Out'
            if (grant.authorizationStatus === 2) {
              optStatus = 'Opted-In'
            }
            ACPCore.trackAction('Register For Push Notifications', {
              ...adobeReducerState,
              'cd.registerForPush': '1',
              'cd.optStatus': optStatus,
              'cd.deviceToken': `${apns_token}`
            })
          }
        })
        .catch((error) => {
          console.log(
            `registerForRemoteNotifications error = ${JSON.stringify(error)}`
          )
        })
    }
  }, [apns_token, registeredForPush])

  useEffect(() => {
    if (
      updatedNotificationPermission !== undefined &&
      notificationPermission !== undefined &&
      updatedNotificationPermission !== notificationPermission
    ) {
      //invoke sfmc update api
      console.log(
        `*** updating SFMC Push with permissions = ${updatedNotificationPermission}`
      )
      let optStatus = 'Opted-Out'
      if (updatedNotificationPermission === 2) {
        optStatus = 'Opted-In'
      }
      if (appConfigValues?.adobe?.isAnalyticsEnabled) {
        ACPCore.trackAction('Push Notifications Update', {
          ...adobeReducerState,
          'cd.pushUpdate': '1',
          'cd.optStatus': optStatus
        })
      }
      dispatch({
        type: actionNames.PUSH_AUTH,
        payload: {
          notificationPermission: updatedNotificationPermission
        }
      })
      if (optStatus === 'Opted-Out') {
        Alert.alert(
          'Looks like you opted-out of Push Notifications?',
          "We don't want you to miss any personalized notifications.",
          [
            {
              text: 'Settings',
              onPress: () => Linking.openSettings()
            },
            { text: 'Cancel', onPress: () => 'Cancel' }
          ]
        )
      }
    } else {
      console.log(`*** No change in push permissions`)
    }
  }, [updatedNotificationPermission])

  return (
    <SafeAreaView
      edges={['right', 'left', 'top']}
      style={styles.homeScreenContainer}>
      <ScrollView
        style={styles.homeScreenContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.iteamsHomepage}>
          <Image
            source={localImages.hallmark_logo}
            style={styles.hallmarkLogo}
          />
        </View>
        {homeLoading && <Loader />}

        <View style={{ paddingBottom: vh(30) }}>
          <HomePageSearchBar {...props} />
        </View>
        {!homeLoading && homePageDesignerData?.length > 0 ? (
          <PageDesignerComponents item={homePageDesignerData} />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    backgroundColor: colors.graybackground
  },
  hallmarkLogo: {
    resizeMode: 'contain',
    width: vw(100),
    height: vh(38),
    marginBottom: vh(20)
  },
  iteamsHomepage: {
    display: 'flex',
    backgroundColor: colors.graybackground,
    paddingTop: vh(20),
    alignItems: 'center'
  }
})
