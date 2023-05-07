import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import { AccountOverview } from '@ecom/assets/svg'
import Button from '@ecom/components/Button'
import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import DropShadow from 'react-native-drop-shadow'
import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

const ConfirmAuth = (props: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => props?.handleClose()}>
          <CircleIcon
            name={'hm_CloseLarge-thick'}
            circleColor={colors.white}
            circleSize={vw(36)}
            iconSize={vw(11)}
            circleStyle={{
              borderWidth: 1,
              borderColor: colors.graylight,
              marginRight: vw(18)
            }}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Create an Account or Sign In</Text>
      </View>
      <View style={styles.topSection}>
        <View style={styles.imgContainer}>
          <AccountOverview style={styles.image} />
        </View>
        <View>
          <Text style={styles.subTitle}>
            Want to send cards? Create an account with us or sign in with your
            Hallmark.com account.
          </Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <Button
          label="Create An Account"
          buttonColor={colors.darkPink}
          textStyle={{
            fontFamily: fonts.MEDIUM,
            color: colors.white,
            fontWeight: '600'
          }}
          buttonStyle={{ width: '100%', marginBottom: vh(16) }}
          onPress={() => {
            props.goToScreen(1)
          }}
        />
        <Button
          label="Sign In"
          buttonColor={colors.hmPurple}
          textStyle={{
            fontFamily: fonts.MEDIUM,
            color: colors.white,
            fontWeight: '600'
          }}
          buttonStyle={{ width: '100%' }}
          onPress={() => {
            props.goToScreen(0)
          }}
        />
      </View>
    </View>
  )
}

export default ConfirmAuth
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20),
    paddingBottom: vh(47),
    // justifyContent: 'space-between',
    alignItems: 'center'
  },
  topSection: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imgContainer: {
    marginBottom: vh(13)
  },
  bottomSection: {
    flex: 0.2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: vh(5)
  },
  image: {
    alignSelf: 'center',
    justifyContent: 'center'
  },

  subTitle: {
    textAlign: 'center',
    fontFamily: fonts.MEDIUM,
    color: colors.black,
    fontWeight: '400',
    fontSize: vw(14),
    lineHeight: vh(20),
    marginBottom: vh(7),
    marginHorizontal: vw(30)
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh(16),
    width: '100%'
  },
  header: {
    fontFamily: fonts.MEDIUM,
    fontWeight: '600',
    fontSize: vw(16),
    lineHeight: vh(19)
  }
})
