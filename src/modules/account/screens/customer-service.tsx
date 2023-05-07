import { SafeAreaView, StyleSheet, View, Linking } from 'react-native'
import React, { useCallback } from 'react'
import colors from '@ecom/utils/colors'
import { Care } from '@ecom/assets/svg'
import { vh, vw } from '@ecom/utils/dimension'
import {
  PrimaryLargeButton,
  SecondaryLargeButton,
  TertiaryMediumButton
} from '@ecom/components/buttons'
import LocalizedStrings from 'react-native-localization'
import { Body, HeaderSmallTight } from '@ecom/components/typography'
import { Divider } from '@ecom/components/divider'
import Common from '@ecom/utils/Common'
import { StackScreenProps } from '@react-navigation/stack'
import { AccountStackParamList } from '@ecom/router/AccountNavigator'
import { HMMessage } from '@ecom/components/messages/hm-message'
import { useDispatch, useSelector } from 'react-redux'
import { RootReducerModal } from '@ecom/modals'
import constant from '@ecom/utils/constant'
import { useFocusEffect } from '@react-navigation/native'
import { ACPCore } from '@adobe/react-native-acpcore'

type CustomerServiceProps = StackScreenProps<
  AccountStackParamList,
  'AccountCustomerService'
>

export const CustomerService = ({ navigation }: CustomerServiceProps) => {
  const dispatch = useDispatch()

  const showSuccessMessage = useSelector(
    (state: RootReducerModal) =>
      state.globalMessageReducer.CareFileUploadSuccessMessage
  )

  const adobeReducerState = useSelector(
    (state: RootReducerModal) => state.globalAdobeReducer
  )
  const callUs = async () => {
    ACPCore.trackAction('Consumer Care Call Us', {
      ...adobeReducerState,
      'cd.callUs': '1'
    })
    Linking.openURL(`tel:${Common.CARE_PHONE_NUMBER}`)
  }

  const faqPress = () => {
    ACPCore.trackAction('Consumer Care Visit FAQ', {
      ...adobeReducerState,
      'cd.visitFAQ': '1'
    })
    Linking.openURL(Common.CARE_FAQ_URL)
  }

  const contactUs = () => {
    ACPCore.trackAction('Consumer Care Contact Us', {
      ...adobeReducerState,
      'cd.contactUs': '1'
    })
    navigation.navigate('AccountCustomerServiceMessage')
  }

  const onClose = useCallback(() => {
    constant.switchMessage(dispatch, 'CareFileUploadSuccess', false)
  }, [dispatch])

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        onClose()
      }
    }, [onClose])
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <HMMessage
          type={'Success'}
          message={strings.success}
          subMessage={strings.fileSuccess}
          display={showSuccessMessage}
          closeable
          containerStyle={styles.message}
          onClose={onClose}
          autoClose
        />
        <Care style={styles.image} />
        <SecondaryLargeButton style={styles.callUsButton} onPress={callUs}>
          {strings.callUs}
        </SecondaryLargeButton>
        <Body style={styles.prompt}>{strings.prompt}</Body>
        <PrimaryLargeButton style={styles.contactUsButton} onPress={contactUs}>
          {strings.contactUs}
        </PrimaryLargeButton>
        <Divider />
        <HeaderSmallTight style={styles.need}>{strings.need}</HeaderSmallTight>
        <TertiaryMediumButton
          style={styles.faqButton}
          textStyle={styles.faqText}
          onPress={faqPress}>
          {strings.faq}
        </TertiaryMediumButton>
      </View>
    </SafeAreaView>
  )
}

const strings = new LocalizedStrings({
  'en-us': {
    callUs: 'Call Us',
    contactUs: 'Contact Us',
    prompt: 'Or send us a message with your concerns so we can help:',
    need: 'Need answers fast?',
    faq: 'Visit F.A.Q.',
    fileSuccess: 'Your file(s) have been uploaded',
    success: 'Success!'
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
  image: {
    alignSelf: 'center',
    marginBottom: vh(35)
  },
  callUsButton: {
    marginVertical: vh(15)
  },
  prompt: {
    marginHorizontal: vw(20),
    marginBottom: vh(10),
    textAlign: 'center'
  },
  contactUsButton: {
    marginBottom: vh(20)
  },
  need: {
    marginTop: vh(30),
    marginBottom: vh(10),
    alignSelf: 'center'
  },
  faqButton: {
    width: vw(100),
    alignSelf: 'center'
  },
  faqText: {
    color: colors.grayText
  },
  message: {
    position: 'absolute',
    top: -vh(10)
  }
})
