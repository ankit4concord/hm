import * as navigation from '@ecom/utils/navigationService'

import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import React, { createRef, useEffect, useState } from 'react'
import constant, { showToastMessageFromModel } from '@ecom/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import { CircleIcon } from '@ecom/components/icons/base/circle-icon'
import CustomButton from '@ecom/components/CustomButton'
import DropShadow from 'react-native-drop-shadow'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import screenNames from '@ecom/utils/screenNames'
import { signIn } from '../action'

interface Props {
  setModalVisible: any
  ref: any
  modalVisible: any
  goToScreen?: Function
  setForgotPassword?: Function
  isSplash?: Boolean
  props?: any
  navigate?: any
  setIsLookUp?: any
  navigation: any
  setIsStandardLogin?: any
  isStandardLogin?: any
  handleClose?: any
  currentScreen?: any
  handleSuccess?: any
  flashref?:any
}

const BOTTOM_TAB_NAVIGATION_STATE = {
  index: 0,
  routes: [
    {
      name: screenNames.BOTTOM_TAB
    }
  ]
}

export const Login = (props: Props) => {
  const { isConnected } = useSelector(
    (state: RootReducerModal) => state.internetStatusReducer
  )

  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailError, setShowEmailErr] = useState(false)
  const [showPassError, setShowPassErr] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [showAPIEmailError, setShowAPIEmailErr] = useState(false)
  const emailRef = createRef()
  const passwordRef = createRef()
  const clearState = () => {
    setEmail('')
    setPassword('')
    setShowEmailErr(false)
    setShowPassErr(false)
  }
  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  useEffect(() => {
    clearState()
  }, [])
  const updateText = (key: string, value: string) => {
    switch (key) {
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
    }
  }

  const routes = props?.navigation.getState()?.routes

  const handleSignIn = () => {
    Keyboard.dismiss()

    let payload = {
      type: 'credentials',
      email: email,
      password: password,
      check: true
    }

    let emailError = constant.validateEmail(email)
    if (emailError) setShowEmailErr(true)

    let passwordError = constant.validateEmptiness(password, 'password')
    if (passwordError) setShowPassErr(true)
    if (isConnected) {
      if (!emailError && !passwordError) {
        setAuthLoading(true)
        dispatch(
          signIn(payload, (res) => {
            setAuthLoading(false)
            switch (res) {
              case 200:
                setShowAPIEmailErr(false)
                if (props?.handleSuccess) {
                  props.handleSuccess()
                } else if (routes[0]?.params?.from == 'checkout') {
                  props.navigation?.navigate(screenNames.CART_NAVIGATOR, {
                    screen: screenNames.CHECKOUT_MODAL
                  })
                } else if (routes[0]?.params?.from == 'DigitalCheckout') {
                  props.navigation?.navigate(screenNames.POD_ADDTOCART, {
                    customizationType: selectedProductType
                  })
                } else {
                  navigation.reset(BOTTOM_TAB_NAVIGATION_STATE)
                }
                break
              default:
                setShowAPIEmailErr(true)
                break
            }
          })
        )
      }
    } else {
      setAuthLoading(false)
      showToastMessageFromModel('Please Check Your Internet Connection', 'invalid', props.flashref)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: vw(20), flex: 1 }}>
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
          <Text style={styles.header}>Sign In</Text>
          <View style={styles.btnSignupContainer}>
            <TouchableOpacity
              onPress={() => {
                clearState()
                props?.goToScreen(1)
              }}>
              <DropShadow style={styles.shadowContainer}>
                <Text style={styles.signupBtn}>Sign Up</Text>
              </DropShadow>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text style={styles.subHead}>You can sign in with your existing</Text>
          <Text style={styles.subHead}>Hallmark.com account</Text>
        </View>

        <View>
          <View style={{ marginTop: vh(14) }}>
            <FloatingTextInput
              placeholder="Email Address"
              ref={emailRef}
              required={true}
              autoCapitalize={false}
              fieldName={'email'}
              maxLength={40}
              returnKeyType={'next'}
              value={email}
              onFocus={() => {
                setShowAPIEmailErr(false)
                setShowEmailErr(false)
              }}
              onBlur={() => {
                email.length > 0 ? setShowEmailErr(true) : ''
              }}
              keyboardType="email-address"
              hasError={
                showEmailError
                  ? showAPIEmailError
                    ? 'Sign in Failed! Please ensure the username & password are valid'
                    : constant.validateEmail(email)
                  : ''
              }
              secureTextEntry={false}
              onChangeText={updateText}
              onSubmitEditing={() => {
                passwordRef.current.focus()
              }}
            />
          </View>
          <View style={{ marginTop: vh(20) }}>
            <FloatingTextInput
              placeholder="Password"
              ref={passwordRef}
              autoCapitalize={false}
              required={true}
              fieldName={'password'}
              maxLength={40}
              returnKeyType={'done'}
              onFocus={() => setShowPassErr(false)}
              value={password}
              onBlur={() => {
                password.length > 0 ? setShowPassErr(true) : ''
              }}
              hasError={
                showPassError
                  ? constant.validateEmptiness(password, 'Password')
                  : ''
              }
              secureTextEntry={true}
              onChangeText={updateText}
            />
          </View>
          <View style={styles.forgotPassLink}>
            <TouchableOpacity
              onPress={() => {
                clearState()
                props?.goToScreen(2)
              }}>
              <Text style={styles.forgotPasswordText}>
                Forgot your password?
              </Text>
            </TouchableOpacity>
          </View>
          <CustomButton
            label={'Sign In'}
            onPress={handleSignIn}
            extraStyle={{ marginTop: vh(30) }}
            labelExtraStyle={{
              fontSize: vw(16),
              lineHeight: vh(19),
              letterSpacing: 0
            }}
          />
        </View>
        {authLoading && <Loader />}
      </ScrollView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  forgotPassLink: {
    marginTop: vh(22),
    alignItems: 'flex-start',
    marginBottom: vh(30)
  },
  forgotPasswordText: {
    fontSize: vw(14),
    lineHeight: vh(18),

    color: colors.txtBtnCancel,
    fontFamily: fonts.MEDIUM,
    textDecorationLine: 'underline'
  },
  header: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  signupBtn: {
    fontFamily: fonts.MEDIUM,
    fontWeight: '700',
    fontSize: vw(14),
    lineHeight: vh(17),
    color: colors.txtBtnCancel
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: vh(12),
    paddingHorizontal: vw(14),
    backgroundColor: colors.white,
    borderRadius: vw(38)
  },
  subHead: {
    fontFamily: fonts.REGULAR,
    lineHeight: vh(20),
    fontSize: vw(14)
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh(16)
  },
  btnSignupContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
