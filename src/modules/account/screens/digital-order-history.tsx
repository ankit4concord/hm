import { Alert, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import LocalizedStrings from 'react-native-localization'
import { Body, HeaderBody, HeaderSmall } from '@ecom/components/typography'
import { vh, vw } from '@ecom/utils/dimension'
import { Divider } from '@ecom/components/divider'
import { AccountOverview } from '@ecom/assets/svg'
import {
  PrimaryLargeButton,
  SecondaryLargeButton,
  TertiaryMediumButton
} from '@ecom/components/buttons'
import { Icon } from '@ecom/components/icons'
import colors from '@ecom/utils/colors'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { StackScreenProps } from '@react-navigation/stack'
import { navigate } from '@ecom/utils/navigationService'
import screenNames from '@ecom/utils/screenNames'
import { HMMessage } from '@ecom/components/messages/hm-message'
import { RootReducerModal } from '@ecom/modals'
import { useDispatch, useSelector } from 'react-redux'
import constant from '@ecom/utils/constant'
import { useFocusEffect } from '@react-navigation/native'

type DigitalOrderHistoryProps = StackScreenProps<
  AccountStackParamList,
  'AccountDigitalOrderHistory'
>

export const DigitalOrderHistory = ({
  navigation
}: DigitalOrderHistoryProps) => {
  const showMessage = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.ProfileSignOutMessage
  )

  const showDeleteAlert = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.ProfileDeleteAccountMessage
  )

  const checkmarkSize = vw(12)
  const dispatch = useDispatch()

  const closeNavigation = () => {
    navigate(screenNames.BOTTOM_TAB, {
      screen: screenNames.ACCOUNT_NAVIGATOR
    })
  }

  const csButtonPress = () => {
    navigation.navigate('AccountCustomerService')
  }

  const onClose = useCallback(() => {
    constant.switchMessage(dispatch, 'ProfileSignOut', false)
    constant.switchMessage(dispatch, 'ProfileDeleteAccount', false)
  }, [dispatch])

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        onClose()
      }
    }, [onClose])
  )

  useEffect(() => {
    if (showDeleteAlert) {
      Alert.alert(
        strings.delete,
        strings.deleteMessage,
        [{ text: strings.okay, onPress: onClose }],
        { onDismiss: onClose, cancelable: true }
      )
    }
  }, [onClose, showDeleteAlert])

  const signInPress = () => {
    navigate(screenNames.AUTH_NAVIGATOR, {
      screen: screenNames.LOGIN,
      params: {
        closeNavigation: closeNavigation,
        successNavigation: closeNavigation
      }
    })
  }
  const signUpPress = () => {
    navigate(screenNames.AUTH_NAVIGATOR, {
      screen: screenNames.LOGIN,
      params: {
        to: 1,
        closeNavigation: closeNavigation,
        successNavigation: closeNavigation
      }
    })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HMMessage
          type={'Success'}
          message={strings.successfullySignedOut}
          display={showMessage}
          closeable
          containerStyle={styles.message}
          onClose={onClose}
          autoClose
        />
        <AccountOverview style={styles.image} />
        <HeaderBody style={styles.bodyHeader}>{strings.header}</HeaderBody>
        <Body style={styles.bodyText}>{strings.body}</Body>
        <Divider style={styles.divider} />
        <View style={{ flexDirection: 'row' }}>
          <Icon
            name={'hm_Check-thick'}
            size={checkmarkSize}
            style={styles.checkmark}
          />
          <HeaderSmall style={styles.listText}>{strings.list1}</HeaderSmall>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Icon
            name={'hm_Check-thick'}
            size={checkmarkSize}
            style={styles.checkmark}
          />
          <HeaderSmall style={styles.listText}>{strings.list2}</HeaderSmall>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Icon
            name={'hm_Check-thick'}
            size={checkmarkSize}
            style={styles.checkmark}
          />
          <HeaderSmall style={styles.listText}>{strings.list3}</HeaderSmall>
        </View>
        <SecondaryLargeButton
          style={styles.createAccountButton}
          onPress={signUpPress}>
          {strings.createAccount}
        </SecondaryLargeButton>
        <PrimaryLargeButton style={styles.signInButton} onPress={signInPress}>
          {strings.signIn}
        </PrimaryLargeButton>
        <TertiaryMediumButton
          style={styles.ccButton}
          textStyle={styles.ccButtonText}
          icon={'hm_Question-thick'}
          iconType={'Left'}
          iconColor={styles.ccButtonText.color}
          iconSize={vw(20)}
          onPress={csButtonPress}>
          {strings.care}
        </TertiaryMediumButton>
      </View>
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    header: 'Create an Account or Sign In',
    body: 'You can access even more features when you have an account.',
    list1: 'Save your payment methods',
    list2: 'Access your order history',
    list3: 'Get notifications about your orders',
    createAccount: 'Create an Account',
    signIn: 'Sign In',
    care: 'Consumer Care',
    successfullySignedOut: 'Successfully Signed Out',
    delete: 'Delete Account Submitted',
    deleteMessage:
      'Your request to delete your account has been submitted, and you will receive a confirmation email',
    okay: 'Okay'
  }
})

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    marginHorizontal: vw(20)
  },
  bodyText: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  bodyHeader: {
    alignSelf: 'center',
    marginBottom: vh(2)
  },
  divider: {
    marginVertical: vh(20)
  },
  listText: {
    marginBottom: vh(5)
  },
  image: {
    alignSelf: 'center',
    marginBottom: vh(20)
  },
  icon: {
    marginRight: vw(8)
  },
  createAccountButton: {
    marginTop: vh(20),
    marginBottom: vh(10)
  },
  signInButton: {
    marginBottom: vh(35)
  },
  checkmark: {
    marginRight: vw(8)
  },
  ccButton: {
    width: vw(192),
    alignSelf: 'center'
  },
  ccButtonText: {
    color: colors.grayText
  },
  message: {
    position: 'absolute',
    top: 0
  }
})
