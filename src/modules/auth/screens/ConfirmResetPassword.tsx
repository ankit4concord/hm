import * as navigation from '@ecom/utils/navigationService'

import { CircleIcon, Icon } from '@ecom/components/icons'
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import React, { createRef, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import CustomButton from '@ecom/components/CustomButton'
import DropShadow from 'react-native-drop-shadow'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import constant, { showToastMessageFromModel } from '@ecom/utils/constant'
import fonts from '@ecom/utils/fonts'
import screenNames from '@ecom/utils/screenNames'
import { useDispatch, useSelector } from 'react-redux'
import { signIn } from '../action'

interface Props {
  flashref?: any
}

const ConfirmResetPassword = (props: any) => {
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailError, setShowEmailErr] = useState(false)
  const [showPassError, setShowPassErr] = useState(false)
  const [showPopup, setShowPopup] = useState(true)
  const dispatch = useDispatch()

  const { authLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const [showAPIEmailError, setShowAPIEmailErr] = useState(false)
  const emailRef = createRef()
  const passwordRef = createRef()
  const { isConnected } = useSelector(
    (state: RootReducerModal) => state.internetStatusReducer
  )

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

  const handleSignIn = () => {
    Keyboard.dismiss()

    let emailError = constant.validateEmail(email)
    if (emailError) setShowEmailErr(true)

    let passwordError = constant.validateEmptiness(password, 'Password')
    if (passwordError) setShowPassErr(true)

    let payload = {
      type: 'credentials',
      email: email,
      password: password,
      check: true
    }

    if (!emailError && !passwordError) {
      if (isConnected) {
        dispatch(
          signIn(payload, (res) => {
            switch (res) {
              case 200:
                setShowAPIEmailErr(false)
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: screenNames.BOTTOM_TAB
                    }
                  ]
                })
                break
              default:
                setShowAPIEmailErr(true)
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, flex: 1 }}>
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
        </View>
        {showPopup && (
          <DropShadow style={styles.shadowContainer}>
            <View style={styles.headContainer}>
              <View style={styles.container}>
                <Text style={styles.heading}>Check your email!</Text>
                <TouchableOpacity onPress={() => setShowPopup(false)}>
                  <Icon
                    name={'hm_Close-thick'}
                    size={vw(30)}
                    color={colors.brown}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.subHead}>
                We’ll email the password reset instructions to you in a few
                moments.
              </Text>
            </View>
          </DropShadow>
        )}

        <View>
          <View style={{ marginTop: vh(14) }}>
            <FloatingTextInput
              placeholder="Email address"
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
                    ? appConfigValues?.screen_content?.auth
                      ?.auth_login_email_error_message
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

          {/* <View style={styles.checkBoxContainer}>
            <CheckBox
              disabled={false}
              style={{
                width: 20,
                height: 20,
                borderWidth: 1,
                borderColor: '#DFDFDF',
                borderRadius: 3
              }}
              value={check}
              boxType="square"
              tintColor={'#F8F8F8'}
              onCheckColor={'#fff'}
              onFillColor={colors.green}
              onTintColor={'transparent'}
              animationDuration={0.1}
            />
            <Text style={styles.txtSignedIn}>Keep me signed in</Text>
          </View> */}
          <CustomButton
            label={'Sign In'}
            onPress={handleSignIn}
            extraStyle={{ marginTop: 30 }}
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

export default ConfirmResetPassword
const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.15,
    shadowRadius: 4
  },
  subHead: {
    fontFamily: fonts.REGULAR,
    paddingRight: 30,
    color: colors.brown,
    fontSize: vw(14),
    lineHeight: vh(18)
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
  },
  checkBoxContainer: {
    marginTop: vh(22),
    flexDirection: 'row',
    alignItems: 'center'
  },
  txtSignedIn: {
    paddingLeft: vw(14),
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(18)
  },
  headContainer: {
    backgroundColor: colors.lightYellow,
    padding: vw(20),
    borderRadius: vw(10)
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  heading: {
    fontFamily: fonts.MEDIUM,
    paddingRight: 30,
    color: colors.brown,
    fontSize: vw(14),
    lineHeight: vh(18)
  },

  header: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  signupBtn: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(17),
    color: colors.txtBtnCancel
  }
})
