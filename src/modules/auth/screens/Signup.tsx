import * as navigation from '@ecom/utils/navigationService'

import { CircleIcon, Icon } from '@ecom/components/icons'
import {
  Keyboard,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import React, { createRef, useEffect, useRef, useState } from 'react'
import constant, { showToastMessageFromModel } from '@ecom/utils/constant'
import { screenHeight, vh, vw } from '@ecom/utils/dimension'
import { signIn, signUp } from '../action'
import { useDispatch, useSelector } from 'react-redux'

import Common from '@ecom/utils/Common'
import CustomButton from '@ecom/components/CustomButton'
import DropShadow from 'react-native-drop-shadow'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loader from '@ecom/components/Loader'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'
import screenNames from '@ecom/utils/screenNames'

interface Props {
  setModalVisible: any
  ref: any
  modalVisible: any
  navigation: any
  isSplash?: any
  navigate?: any
  phoneNumber?: any
  goToScreen?: any
  handleClose?: any
  handleSuccess?: any
  emailSignup?: any
  passwordSignup?: any
  firstNameSignup?: any
  lastNameSignup?: any
  setEmailSignup?: any
  setPasswordSignup?: any
  setFirstNameSignup?: any
  setLastNameSignup?: any
  flashref?: any
}

export const Signup = (props: Props) => {
  const dispatch = useDispatch()

  const { isConnected } = useSelector(
    (state: RootReducerModal) => state.internetStatusReducer
  )
  const { authLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const { signUpDetails } = useSelector(
    (state: RootReducerModal) => state.authReducer
  )
  const [visible, setVisible] = useState(false)
  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [birthday, setBirthday] = useState('')
  const [showFirstNameError, setShowFirstNameErr] = useState(false)
  const [showLastNameError, setShowLastNameErr] = useState(false)
  const [showEmailError, setShowEmailErr] = useState(false)
  const [showPassError, setShowPassErr] = useState(false)
  const [showAPIEmailError, setShowAPIEmailErr] = useState(false)
  const [params, setParams] = useState({})
  const clearState = () => {
    // props.setEmailSignup('')
    // props.setPasswordSignup('')
    // props.setFirstNameSignup('')
    // props.setLastNameSignup('')
    setShowFirstNameErr(false)
    setShowLastNameErr(false)
    setShowEmailErr(false)
    setShowPassErr(false)
    setShowAPIEmailErr(false)
  }
  const scrollViewRef = useRef(null)
  const emailRef = createRef()
  const passwordRef = createRef()
  const firstNameRef = createRef()
  const lastNameRef = createRef()

  useEffect(() => {
    props?.phoneNumber && setPhoneNumber(props?.phoneNumber)
  }, [props])

  const BOTTOM_TAB_NAVIGATION_STATE = {
    index: 0,
    routes: [
      {
        name: screenNames.BOTTOM_TAB
      }
    ]
  }
  useEffect(() => {
    clearState()
  }, [])

  const onPlaceChosen = (params: any) => {
    setParams(params)
    props.setEmailSignup(params?.email)
    props.setPasswordSignup(params?.password)
    props.setFirstNameSignup(params?.first_name)
    props.setLastNameSignup(params?.last_name)
    setPhoneNumber(params?.phone_mobile)
    setZipCode(params?.zipCode)
    setBirthday(params?.birthday)
  }

  useEffect(() => {
    onPlaceChosen(signUpDetails)
  }, [signUpDetails])

  const handleSignUp = () => {
    let firstNameError = constant.validateNames(
      props.firstNameSignup,
      'First Name'
    )
    firstNameError ? setShowFirstNameErr(true) : setShowFirstNameErr(false)
    let lastNameError = constant.validateNames(
      props.lastNameSignup,
      'Last Name'
    )
    lastNameError ? setShowLastNameErr(true) : setShowLastNameErr(false)
    let emailError = constant.validateEmail(props.emailSignup)
    emailError ? setShowEmailErr(true) : setShowEmailErr(false)
    let passwordError = constant.validatePassword(props.passwordSignup)
    passwordError ? setShowPassErr(true) : setShowPassErr(false)

    if (!emailError && !passwordError && !firstNameError && !lastNameError) {
      let payload = {
        password: props.passwordSignup,
        email: props.emailSignup,
        lastName: props.lastNameSignup,
        firstName: props.firstNameSignup
      }
      if (isConnected) {
        dispatch(
          signUp(payload, (res: any) => {
            console.log('signup res', res)
            switch (res) {
              case 409: {
                setShowAPIEmailErr(true)
                break
              }
              case 422: {
                props?.goToScreen(5)
                break
              }
              case 200: {
                setShowAPIEmailErr(false)
                const signInPayload = {
                  type: 'credentials',
                  email: props.emailSignup,
                  password: props.passwordSignup
                }
                dispatch(
                  signIn(signInPayload, (res: any) => {
                    switch (res) {
                      case 200:
                        setShowAPIEmailErr(false)

                        if (props?.handleSuccess) {
                          props.handleSuccess()
                        } else if (
                          props?.navigation?.getState()?.routes[0]?.params
                            ?.from == 'checkout'
                        ) {
                          props.navigation?.navigate(
                            screenNames.CART_NAVIGATOR,
                            {
                              screen: screenNames.CHECKOUT_MODAL
                            }
                          )
                        } else if (
                          props?.navigation?.getState()?.routes[0]?.params
                            ?.from == 'DigitalCheckout'
                        ) {
                          props.navigation?.navigate(
                            screenNames.POD_ADDTOCART,
                            {
                              customizationType: selectedProductType
                            }
                          )
                        } else {
                          navigation.reset(BOTTOM_TAB_NAVIGATION_STATE)
                        }
                        break
                      case 401:
                        setShowAPIEmailErr(true)
                        break
                    }
                  })
                )
                break
              }
              default: {
              }
            }
          })
        )
      } else {
        showToastMessageFromModel(
          'Please Check Your Internet Connection',
          'invalid',
          props.flashref
        )
      }
    }
  }

  const updateText = (key: string, value: string) => {
    switch (key) {
      case 'email':
        props.setEmailSignup(value)
        break
      case 'password':
        props.setPasswordSignup(value)
        break
      case 'firstName':
        props.setFirstNameSignup(value)
        break
      case 'lastName':
        props.setLastNameSignup(value)
        break
    }
  }
  const [isKeyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true)
      }
    )
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false)
      }
    )

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  const privacy = () => {
    Linking.openURL(Common.PRIVACY_POLICY_URL)
  }

  const terms = () => {
    Linking.openURL(Common.TERMS_OF_USE_URL)
  }

  const crTerms = () => {
    Linking.openURL(Common.CR_TC_URL)
  }

  return (
    <SafeAreaView
      onStartShouldSetResponder={() => {
        Keyboard.dismiss()
        setVisible(false)
      }}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        extraScrollHeight={screenHeight * 0.08}
        extraHeight={screenHeight * 0.24}
        style={{ marginBottom: isKeyboardVisible ? -(screenHeight * 0.1) : 0 }}>
        <ScrollView>
          <View style={styles.mainContainer}>
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
              <Text style={styles.header}>Create an account</Text>
              <View style={styles.btnSignupContainer}>
                <TouchableOpacity
                  onPress={() => {
                    clearState()
                    props?.goToScreen(0)
                  }}>
                  <DropShadow style={styles.shadowContainer}>
                    <Text style={styles.signupBtn}>Sign In</Text>
                  </DropShadow>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.form}>
              <View>
                <View style={styles.textInputs}>
                  <FloatingTextInput
                    placeholder={'First name'}
                    ref={firstNameRef}
                    autoCapitalize={true}
                    required={true}
                    fieldName={'firstName'}
                    maxLength={40}
                    returnKeyType={'next'}
                    value={props.firstNameSignup}
                    secureTextEntry={false}
                    onChangeText={updateText}
                    onFocus={() => {
                      setShowFirstNameErr(false)
                    }}
                    onBlur={() => {
                      props.firstNameSignup?.length > 0
                        ? setShowFirstNameErr(true)
                        : constant.validateNames(
                            props.firstNameSignup,
                            'First Name'
                          )
                        ? setShowFirstNameErr(true)
                        : setShowFirstNameErr(false)
                    }}
                    hasError={
                      showFirstNameError
                        ? constant.validateNames(
                            props.firstNameSignup,
                            'First name'
                          )
                        : ''
                    }
                    onSubmitEditing={() => {
                      lastNameRef.current.focus()
                    }}
                  />
                </View>
                <View style={styles.textInputs}>
                  <FloatingTextInput
                    placeholder="Last name"
                    ref={lastNameRef}
                    autoCapitalize={true}
                    fieldName={'lastName'}
                    maxLength={40}
                    required={true}
                    returnKeyType={'next'}
                    value={props.lastNameSignup}
                    secureTextEntry={false}
                    onChangeText={updateText}
                    onFocus={() => {
                      setShowLastNameErr(false)
                    }}
                    onBlur={() => {
                      props.lastNameSignup?.length > 0
                        ? setShowLastNameErr(true)
                        : constant.validateNames(
                            props.lastNameSignup,
                            'Last Name'
                          )
                        ? setShowLastNameErr(true)
                        : setShowLastNameErr(false)
                    }}
                    hasError={
                      showLastNameError
                        ? constant.validateNames(
                            props.lastNameSignup,
                            'Last name'
                          )
                        : ''
                    }
                    onSubmitEditing={() => {
                      emailRef.current.focus()
                    }}
                  />
                </View>
                <View style={styles.textInputs}>
                  <FloatingTextInput
                    placeholder="Email address"
                    ref={emailRef}
                    autoCapitalize={false}
                    required={true}
                    fieldName={'email'}
                    maxLength={40}
                    returnKeyType={'next'}
                    onFocus={() => {
                      setShowAPIEmailErr(false)
                      setShowEmailErr(false)
                    }}
                    onBlur={() => {
                      props.emailSignup?.length > 0
                        ? setShowEmailErr(true)
                        : constant.validateEmail(props.emailSignup)
                        ? setShowEmailErr(true)
                        : setShowEmailErr(false)
                    }}
                    hasError={
                      showEmailError
                        ? constant.validateEmail(props.emailSignup)
                        : showAPIEmailError
                        ? 'Account already exists with this Email. Please try to Log in with same email'
                        : ''
                    }
                    value={props.emailSignup}
                    onChangeText={updateText}
                    keyboardType="email-address"
                    onSubmitEditing={() => {
                      passwordRef.current.focus()
                    }}
                  />
                </View>
                <View style={styles.textInputs}>
                  <FloatingTextInput
                    placeholder="Password"
                    ref={passwordRef}
                    autoCapitalize={false}
                    fieldName={'password'}
                    required={true}
                    maxLength={40}
                    returnKeyType={'done'}
                    value={props.passwordSignup}
                    secureTextEntry={true}
                    onChangeText={updateText}
                    onFocus={() => {
                      setShowPassErr(false)
                      setVisible(true)
                    }}
                    onBlur={() => {
                      props.passwordSignup?.length > 0
                        ? setShowPassErr(true)
                        : constant.validatePassword(props.passwordSignup)
                        ? setShowPassErr(true)
                        : setShowPassErr(false)
                    }}
                    hasError={
                      showPassError
                        ? constant.validatePassword(props.passwordSignup)
                        : ''
                    }
                    onSubmitEditing={() => {
                      scrollViewRef.current.scrollToEnd()
                    }}
                  />
                </View>
              </View>
              <View>
                <Text style={styles.passwordInformation}>
                  {'\u2022'} 1 or more case-sensitive characters
                </Text>
                <Text style={styles.passwordInformation}>
                  {'\u2022'} 1 or more numerical digits
                </Text>
                <Text style={styles.passwordInformation}>
                  {'\u2022'} 1 or more special characters
                </Text>
                <Text style={styles.passwordInformation}>
                  {'\u2022'} Minimum length of 8 characters
                </Text>
              </View>
              <View style={styles.crownNtxt}>
                <Icon
                  name={'hm_CrownRewards-thick'}
                  size={vw(15)}
                  style={styles.crown}
                />
                <Text style={styles.rewardsTxt}>Crown rewards</Text>
              </View>
              <View>
                <Text style={styles.txt}>
                  By creating an account you’re also signing up for Crown
                  Rewards. Earn points on purchases. Points turn to Reward
                  Dollars that save you money in-store & online. Opt out later
                  under ‘My account’.
                </Text>
              </View>
              <CustomButton
                label={'Register'}
                onPress={handleSignUp}
                extraStyle={{ marginTop: vh(30) }}
                labelExtraStyle={{
                  fontSize: vw(16),
                  lineHeight: vh(19),
                  letterSpacing: 0
                }}
              />
              <View style={styles.footerContainer}>
                <Text style={styles.footerTxt}>
                  By creating a Hallmark.com account, you agree to the{' '}
                  <Text style={styles.underline} onPress={terms}>
                    Terms of Use
                  </Text>{' '}
                  and{' '}
                  <Text style={styles.underline} onPress={privacy}>
                    Privacy Policy.
                  </Text>{' '}
                  Hallmark and its companies can email you about special offers
                  and promotions. You can change your email preferences at any
                  time. For Crown Rewards, see{' '}
                  <Text style={styles.underline} onPress={crTerms}>
                    Program Information & Terms and Conditions.
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          {authLoading && <Loader />}
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20
  },
  form: {
    width: '100%',
    flex: 1,
    height: '100%'
  },
  primaryButton: {
    backgroundColor: '#0098BD',
    padding: vw(15),
    alignItems: 'center',
    marginVertical: vh(20),
    borderRadius: vw(8),
    borderWidth: 1,
    borderColor: '#0098BD',
    alignSelf: 'center',
    width: '60%'
  },
  primaryButtonDisabled: {
    backgroundColor: '#99D5E5',
    padding: vw(15),
    alignItems: 'center',
    marginVertical: vh(20),
    borderRadius: vw(8),
    borderWidth: 1,
    borderColor: '#99D5E5',
    alignSelf: 'center',
    width: '60%',
    opacity: 0.4
  },
  w_85p: {
    width: '85%'
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: vw(22),
    fontWeight: '500',
    letterSpacing: vw(0.8),
    lineHeight: vh(27),
    fontFamily: fonts.REGULAR,
    textAlign: 'center'
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    padding: vw(15),
    alignItems: 'center',
    marginVertical: vh(20),
    borderRadius: vw(8),
    borderWidth: 1,
    borderColor: '#fff',
    width: '60%',
    alignSelf: 'center'
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: vw(22),
    fontWeight: '500',
    letterSpacing: vw(0.8),
    lineHeight: vh(26),
    fontFamily: fonts.MEDIUM
  },
  forgotPassView: {
    marginVertical: vh(30)
  },
  linkText: {
    fontSize: vw(15),
    lineHeight: vh(18),
    color: '#007694',
    fontWeight: '400',
    fontFamily: fonts.REGULAR,
    textAlign: 'center',
    marginLeft: vw(8)
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
    marginBottom: vh(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerText: {
    marginBottom: vh(40)
  },
  formInputsContainer: {
    flexDirection: 'row',
    marginBottom: 16
  },
  textInputs: {
    marginBottom: vh(20)
  },
  textInputDesc: {
    fontSize: vw(14),
    lineHeight: vw(16.8),
    color: colors.appBlack,
    justifyContent: 'center'
  },
  textInputsDescContainer: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    flex: 0.5,
    marginVertical: vh(5)
  },
  textInputFullWidth: {
    marginTop: vh(16)
  },
  marginLeft: {
    marginLeft: vw(10)
  },
  marginRight: {
    marginRight: vw(10)
  },
  section3: {
    marginTop: vh(24),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: vw(48)
  },
  concentText: {
    fontFamily: fonts.REGULAR,
    fontWeight: '400',
    fontSize: vw(14),
    lineHeight: 16.8,
    textAlign: 'center'
  },
  footerLinkText: {
    fontFamily: fonts.REGULAR,
    fontWeight: '400',
    fontSize: vw(14),
    lineHeight: vh(16.8),
    color: colors.hmPurple,
    textAlign: 'center'
  },
  passwordToolTipText: {
    color: colors.black,
    fontFamily: fonts.MEDIUM,
    paddingHorizontal: 16,
    paddingVertical: 2,
    lineHeight: 16.8
  },
  passwordInformation: {
    color: colors.passSubTxt,
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(18),
    textAlignVertical: 'center'
  },
  crown: {
    marginRight: vw(8)
  },
  crownNtxt: {
    flexDirection: 'row',
    marginTop: vh(25),
    alignItems: 'center',
    marginBottom: vh(7)
  },
  rewardsTxt: {
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(18),
    fontSize: vw(14)
  },
  txt: {
    fontFamily: fonts.REGULAR,
    lineHeight: vh(18),
    fontSize: vw(12)
  },
  btnContainer: {
    marginTop: vh(30),
    backgroundColor: colors.hmPurple,
    paddingVertical: vh(18),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: vw(30)
  },
  btnTxt: {
    color: colors.white,
    fontSize: vw(16),
    fontFamily: fonts.MEDIUM,
    lineHeight: vh(19)
  },
  footerContainer: {
    borderTopWidth: 1,
    marginTop: vh(20),
    borderTopColor: colors.graylight
  },
  footerTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(18),
    marginTop: vh(20)
  },
  underline: {
    textDecorationLine: 'underline',
    fontFamily: fonts.MEDIUM
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vh(16)
  },
  header: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19)
  },
  btnSignupContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    borderRadius: 38
  },
  signupBtn: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(17),
    color: colors.txtBtnCancel
  }
})
