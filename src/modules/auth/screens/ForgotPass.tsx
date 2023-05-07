import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import CustomButton from '@ecom/components/CustomButton'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import constant, { showToastMessageFromModel } from '@ecom/utils/constant'
import fonts from '@ecom/utils/fonts'
import { forgotPass } from '../action'

interface Props {
  setModalVisible: any
  modalVisible: any
  goToScreen?: any
  setForgotPassword?: any
  isSplash?: Boolean
  navigation: any
  handleClose?: any
  flashref?:any
}

export const ForgotPass = (props: Props) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [showEmailError, setShowEmailErr] = useState(false)
  const { authLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { isConnected } = useSelector(
    (state: RootReducerModal) => state.internetStatusReducer
  )

  const clearState = () => {
    setEmail('')
    setShowEmailErr(false)
  }
  useEffect(() => {
    clearState()
  }, [])
  const emailRef = createRef()
  const updateText = (key: string, value: string) => {
    switch (key) {
      case 'email':
        setEmail(value)
        break
    }
  }

  const handleForgotPass = () => {
    let payload = {
      email: email
    }
    let emailError = constant.validateEmail(email)
    if (emailError) setShowEmailErr(true)

    if (!emailError) {
      if (isConnected) {
      dispatch(
        forgotPass(payload, (res) => {
          switch (res) {
            case 200:
              clearState()
              props?.goToScreen(3)
              break
            case 401:
              setShowEmailErr(true)
              break
          }
        })
      )
    } else {
      showToastMessageFromModel('Please Check Your Internet Connection', 'invalid', props.flashref)
    }
  }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.header}>
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
          <View>
            <Text style={styles.modalTextTitle}>Reset Your Password</Text>
          </View>
        </View>
        <Text style={styles.modalTextSubTitle}>
          To reset the password for your Hallmark.com account, please enter your
          email address.
        </Text>
        <View>
          <FloatingTextInput
            placeholder="Email address*"
            ref={emailRef}
            autoCapitalize={false}
            fieldName={'email'}
            maxLength={40}
            returnKeyType={'next'}
            value={email}
            onBlur={() => {
              email?.length > 0
                ? setShowEmailErr(true)
                : constant.validateEmail(email)
                ? setShowEmailErr(true)
                : setShowEmailErr(false)
            }}
            hasError={showEmailError ? constant.validateEmail(email) : ''}
            secureTextEntry={false}
            keyboardType="email-address"
            onChangeText={updateText}
          />
          <CustomButton
            label="Reset password"
            onPress={handleForgotPass}
            extraStyle={{ marginTop: vh(30) }}
            labelExtraStyle={{
              fontSize: vw(16),
              lineHeight: vh(19),
              letterSpacing: 0
            }}
          />
          <View style={styles.footer}>
            <Text style={styles.footerTxt}>Or, </Text>
            <TouchableOpacity
              onPress={() => {
                clearState()
                props?.goToScreen(0)
              }}>
              <Text
                style={{
                  textDecorationLine: 'underline',
                  color: colors.txtBtnCancel,
                  fontFamily: fonts.MEDIUM,
                  lineHeight: vh(18),
                  fontSize: vw(14)
                }}>
                sign in with a different account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {authLoading && <Loader />}
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20)
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: vh(16)
  },
  modalTextTitle: {
    fontSize: vw(16),
    lineHeight: vh(19),
    color: colors.appBlack,
    fontFamily: fonts.MEDIUM,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalTextSubTitle: {
    fontSize: vw(14),
    marginBottom: vh(20),
    lineHeight: vh(20),
    color: colors.placeholderHomeScreen,
    fontFamily: fonts.REGULAR
  },
  textInputStyle: {
    borderWidth: 1,
    borderColor: colors.lightgray,
    borderRadius: vw(8),
    padding: vw(12)
  },
  forgotPassView: {
    marginVertical: vh(30)
  },
  linkText: {
    fontSize: vw(15),
    lineHeight: vh(15),
    paddingLeft: vh(8),
    color: colors.linkColor,
    fontWeight: '400',
    fontFamily: fonts.MEDIUM,
    textAlign: 'center'
  },
  footerLineText: {
    fontSize: vw(15),
    lineHeight: vh(18),
    color: colors.appBlack,
    fontWeight: '400',
    fontFamily: fonts.MEDIUM,
    textAlign: 'center'
  },
  footerline: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: vh(10)
  },
  footerText: {
    flex: 0.2,
    marginBottom: vh(20)
  },
  footer: {
    marginTop: vh(20),
    flexDirection: 'row'
  },
  footerTxt: {
    color: colors.txtBtnCancel,
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    fontSize: vw(14)
  }
})
