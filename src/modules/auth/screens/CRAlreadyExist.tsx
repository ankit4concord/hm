import * as navigation from '@ecom/utils/navigationService'

import { AccountOverview, Alert } from '@ecom/assets/svg'
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { createRef, useEffect, useRef, useState } from 'react'
import { signIn, signUp } from '../action'
import { useDispatch, useSelector } from 'react-redux'
import { vh, vw } from '@ecom/utils/dimension'

import CustomButton from '@ecom/components/CustomButton'
import { FloatingTextInput } from '@ecom/components/CustomInput'
import Loader from '@ecom/components/Loader'
import RBSheet from 'react-native-raw-bottom-sheet'
import { RootReducerModal } from '@ecom/modals'
import colors from '@ecom/utils/colors'
import constant from '@ecom/utils/constant'
import fonts from '@ecom/utils/fonts'
import screenNames from '@ecom/utils/screenNames'

interface Props {
  setModalVisible: any
  ref: any
  modalVisible: any
  navigation: any
  isSplash?: any
  navigate?: any
  goToScreen?: any
  handleClose?: any
  handleSuccess?: any
  emailSignup?: any
  passwordSignup?: any
  firstNameSignup?: any
  lastNameSignup?: any
}
export const CRAlreadyExist = (props: Props) => {
  const dispatch = useDispatch()

  const BOTTOM_TAB_NAVIGATION_STATE = {
    index: 0,
    routes: [
      {
        name: screenNames.BOTTOM_TAB
      }
    ]
  }
  const { authLoading } = useSelector(
    (state: RootReducerModal) => state.globalLoaderReducer
  )
  const [CRNumber, setCRNumber] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [CRNumberShowErr, setCRNumberShowErr] = useState(false)
  const [zipCodeShowErr, setZipCodeShowErr] = useState(false)
  const CRNumberRef = createRef()
  const BSheetRef = useRef(null)
  const zipRef = createRef()
  const clearState = () => {
    setCRNumber('')
    setZipCode('')
    setCRNumberShowErr(false)
    setZipCodeShowErr(false)
  }

  const { selectedProductType } = useSelector(
    (state: RootReducerModal) => state.categoryReducer
  )
  useEffect(() => {
    clearState()
  }, [])
  const updateText = (key: string, value: string) => {
    switch (key) {
      case 'CRNumber':
        setCRNumber(value)
        break
      case 'zipCode':
        setZipCode(value)
        break
    }
  }
  const handleCRCheck = () => {
    Keyboard.dismiss()
    if (!CRNumberShowErr && !zipCodeShowErr) {
      let payload = {
        password: props.passwordSignup,
        email: props.emailSignup,
        lastName: props.lastNameSignup,
        firstName: props.firstNameSignup,
        linkNow: true,
        CRNumber: CRNumber,
        Zip: zipCode
      }
      dispatch(
        signUp(payload, (res: any) => {
          console.log('signup res', res)
          switch (res) {
            case 200: {
              const signInPayload = {
                type: 'credentials',
                email: props.emailSignup,
                password: props.passwordSignup
              }
              dispatch(
                signIn(signInPayload, (res: any) => {
                  switch (res) {
                    case 200:
                      if (props?.handleSuccess) {
                        props.handleSuccess()
                      } else if (
                        props?.navigation?.getState()?.routes[0]?.params
                          ?.from == 'checkout'
                      ) {
                        props.navigation?.navigate(screenNames.CART_NAVIGATOR, {
                          screen: screenNames.CHECKOUT_MODAL
                        })
                      } else if (
                        props?.navigation?.getState()?.routes[0]?.params
                          ?.from == 'DigitalCheckout'
                      ) {
                        props.navigation?.navigate(screenNames.POD_ADDTOCART, {
                          customizationType: selectedProductType
                        })
                      } else {
                        navigation.reset(BOTTOM_TAB_NAVIGATION_STATE)
                      }
                      break
                    case 401:
                      break
                  }
                })
              )
              break
            }
            case 400: {
              BSheetRef?.current?.open()
            }
            default: {
            }
          }
        })
      )
    }
    // BSheetRef?.current?.open()
  }
  const handleCRCheckLater = () => {
    Keyboard.dismiss()

    let payload = {
      password: props.passwordSignup,
      email: props.emailSignup,
      lastName: props.lastNameSignup,
      firstName: props.firstNameSignup,
      linkLater: true
    }
    dispatch(
      signUp(payload, (res: any) => {
        console.log('signup res', res)
        switch (res) {
          case 200: {
            const signInPayload = {
              type: 'credentials',
              email: props.emailSignup,
              password: props.passwordSignup
            }
            dispatch(
              signIn(signInPayload, (res: any) => {
                switch (res) {
                  case 200:
                    if (props?.handleSuccess) {
                      props.handleSuccess()
                    } else if (
                      props?.navigation?.getState()?.routes[0]?.params?.from ==
                      'checkout'
                    ) {
                      props.navigation?.navigate(screenNames.CART_NAVIGATOR, {
                        screen: screenNames.CHECKOUT_MODAL
                      })
                    } else if (
                      props?.navigation?.getState()?.routes[0]?.params?.from ==
                      'DigitalCheckout'
                    ) {
                      props.navigation?.navigate(screenNames.POD_ADDTOCART, {
                        customizationType: selectedProductType
                      })
                    } else {
                      navigation.reset(BOTTOM_TAB_NAVIGATION_STATE)
                    }
                    break
                  case 401:
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
    // BSheetRef?.current?.open()
  }
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.image}>
          <AccountOverview height={vh(168)} width={vw(85)} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            You’re already a Crown Rewards member
          </Text>
          <Text style={styles.subTxt}>
            Please link your Crown Rewards membership to your account
          </Text>
        </View>
        <View style={styles.inputs}>
          <FloatingTextInput
            placeholder="Crown Rewards number"
            ref={CRNumberRef}
            autoCapitalize={false}
            fieldName={'CRNumber'}
            maxLength={40}
            returnKeyType={'next'}
            value={CRNumber}
            onBlur={() => {
              CRNumber?.length > 12
                ? setCRNumberShowErr(true)
                : constant.validateCRNumber(CRNumber)
                ? setCRNumberShowErr(true)
                : setCRNumberShowErr(false)
            }}
            hasError={
              CRNumberShowErr ? constant.validateCRNumber(CRNumber) : ''
            }
            onChangeText={updateText}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputs}>
          <FloatingTextInput
            placeholder="Zip code"
            ref={zipRef}
            autoCapitalize={false}
            fieldName={'zipCode'}
            maxLength={40}
            returnKeyType={'next'}
            value={zipCode}
            onBlur={() => {
              zipCode?.length > 0
                ? setZipCodeShowErr(true)
                : constant.validateZip(zipCode)
                ? setZipCodeShowErr(true)
                : setZipCodeShowErr(false)
            }}
            hasError={zipCodeShowErr ? constant.validateZip(zipCode) : ''}
            keyboardType="numeric"
            onChangeText={updateText}
          />
        </View>
        <View style={styles.inputs}>
          <CustomButton
            label="Link Now"
            onPress={() => handleCRCheck()}
            extraStyle={{}}
            labelExtraStyle={{
              fontSize: vw(16),
              fontWeight: '600',
              letterSpacing: 0
            }}
          />
        </View>
        <Text style={styles.bottomTxt}>
          Or link your account later at Hallmark.com.
        </Text>
        <View>
          <CustomButton
            label="Link Later"
            onPress={() => handleCRCheckLater()}
            extraStyle={styles.btnContainer}
            labelExtraStyle={{
              fontSize: vw(16),
              fontWeight: '600',
              color: colors.black,
              letterSpacing: 0
            }}
          />
        </View>
      </View>
      <RBSheet
        ref={BSheetRef}
        closeOnDragDown={true}
        height={vh(400)}
        customStyles={{
          container: styles.rbSheet
        }}
        closeOnPressMask={false}>
        <View style={styles.sheetContainer}>
          <View style={styles.imageRBsheet}>
            <Alert height={vh(153)} width={vw(147)} />
          </View>
          <Text style={styles.rbTxt}>
            We don't recognize that Crown Rewards information. Try again later
            at Hallmark.com.
          </Text>

          <View>
            <CustomButton
              label="Link Later"
              onPress={() => {
                handleCRCheckLater()
              }}
              extraStyle={styles.rbBtnContainer}
              labelExtraStyle={{
                fontSize: vw(16),
                fontWeight: '600',
                color: colors.black,
                letterSpacing: 0
              }}
            />
          </View>
        </View>
      </RBSheet>
      {authLoading && <Loader />}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: vw(20)
  },
  image: {
    alignSelf: 'center',
    marginTop: vh(80),
    marginBottom: vh(54)
  },
  heading: {
    fontFamily: fonts.BOLD,
    fontSize: vw(14),
    lineHeight: vh(20),
    marginBottom: vh(14)
  },
  textContainer: {
    alignItems: 'center'
  },
  subTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(20),
    paddingHorizontal: vw(20),
    textAlign: 'center',
    marginBottom: vh(20)
  },
  inputs: {
    marginBottom: vh(40)
  },
  bottomTxt: {
    fontSize: vw(14),
    fontFamily: fonts.REGULAR,
    textAlign: 'center'
  },
  btnContainer: {
    borderColor: colors.black,
    backgroundColor: colors.white,
    borderWidth: 2,
    marginBottom: vh(20)
  },
  rbSheet: {
    flex: 1,
    borderTopLeftRadius: vw(20),
    borderTopRightRadius: vw(20)
  },
  sheetContainer: {
    padding: vw(20)
  },
  imageRBsheet: {
    alignSelf: 'center',
    marginBottom: vh(43)
  },
  rbBtnContainer: {
    borderColor: colors.black,
    backgroundColor: colors.white,
    borderWidth: 2
  },
  rbTxt: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(20),
    textAlign: 'center',
    marginBottom: vh(10)
  }
})
