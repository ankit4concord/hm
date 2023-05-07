import { AccountOverview, PaymentConfirmation } from '@ecom/assets/svg'
import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { ACPCore } from '@adobe/react-native-acpcore'
import { AdobeObj } from '@ecom/utils/tracking'
import Button from '@ecom/components/Button'
import { RootReducerModal } from '@ecom/modals'
import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import screenTypes from '@ecom/utils/screenTypes'
import strings from '@ecom/utils/strings'
import { useIsFocused } from '@react-navigation/native'

const SuccessDigitalSend = (props: any) => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  useEffect(() => {
    // The screen is focused
    if (appConfigValues?.adobe?.isAnalyticsEnabled && isFocused) {
      const pageName = `${strings.SendDigitalGreeting}>Hooray`
      let cartTrackObj: AdobeObj = {
        'cd.pageName': pageName,
        'cd.pageType': strings.SendDigitalGreeting,
        'cd.previousPageName': adobeReducerState['cd.pageName'],
        'cd.level1': strings.SendDigitalGreeting,
        'cd.level2': 'Hooray',
        'cd.level3': ''
      }
      ACPCore.trackState(pageName, {
        ...adobeReducerState,
        ...cartTrackObj
      })
      cartTrackObj['cd.digitalDeliveryProjectID'] = ''
      dispatch({
        type: actionNames.TRACK_STATE,
        payload: cartTrackObj
      })
    }
  }, [isFocused])

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={styles.imgContainer}>
          <PaymentConfirmation
            width={vw(176)}
            height={vw(220)}
            style={styles.image}
          />
        </View>
        <View>
          <Text style={styles.title}>Hooray! Your card is on its way.</Text>
          <Text style={styles.subTitle}>
            See all your digital sends in your account.
          </Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Button
          label="Send Another Card"
          buttonColor={colors.hmPurple}
          textStyle={{
            fontFamily: fonts.BOLD,
            color: colors.white
          }}
          buttonStyle={{ width: '100%' }}
          onPress={() => {
            props.navigation.navigate(screenNames.SHOP_NAVIGATOR, {
              screen: screenNames.SHOP_SCREEN,
              params: { from: 'success' }
            })
          }}
        />
      </View>
    </View>
  )
}

export default SuccessDigitalSend
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20)
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgContainer: {
    paddingLeft: vw(60)
  },
  bottomSection: {
    height: vh(55),
    width: '100%',
    marginBottom: vh(5)
  },
  image: {
    alignSelf: 'center',
    justifyContent: 'center'
    // marginBottom: vh(10)
    // backgroundColor: 'red'
  },
  title: {
    textAlign: 'center',
    fontFamily: fonts.MEDIUM,
    color: colors.black,
    fontWeight: '600',
    fontSize: vw(16),
    lineHeight: vh(20),
    marginBottom: vh(7)
  },
  subTitle: {
    textAlign: 'center',
    fontFamily: fonts.MEDIUM,
    color: colors.black,
    fontWeight: '400',
    fontSize: vw(14),
    lineHeight: vh(20),
    marginBottom: vh(7),
    marginHorizontal: vw(70)
  }
})
