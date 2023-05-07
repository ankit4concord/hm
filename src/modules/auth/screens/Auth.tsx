import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native'
import React, { useRef, useState } from 'react'

import AuthModal from '@ecom/components/AuthModal'
import { CRAlreadyExist } from './CRAlreadyExist'
import ConfirmAuth from './ConfirmAuth'
import ConfirmResetPassword from './ConfirmResetPassword'
import FlashMessage from '@ecom/components/FlashMessage'
import { ForgotPass } from './ForgotPass'
import { Login } from './Login'
import PagerView from 'react-native-pager-view'
import { Signup } from './Signup'
import constant from '@ecom/utils/constant'
import { loginAsGuest } from '../action'
import screenNames from '@ecom/utils/screenNames'
import { useDispatch } from 'react-redux'

interface Props {
  navigation: any
  route: any
  authenticate: any
}

export const Auth = (props: Props) => {
  const dispatch = useDispatch()
  const [modalVisible, setModalVisible] = useState(false)
  const [initial, setInitial] = useState(
    props?.route?.params?.to ? props?.route?.params?.to : 0
  )
  const [isForgotPassword, setForgotPassword] = useState(false)
  const [currentScreen, setCurrentScreen] = useState(0)
  const ref = React.useRef(PagerView)
  const [emailSignup, setEmailSignup] = useState('')
  const [passwordSignup, setPasswordSignup] = useState('')
  const [firstNameSignup, setFirstNameSignup] = useState('')
  const [lastNameSignup, setLastNameSignup] = useState('')
  const flashmessage = useRef()

  const goToForgotPassword = (value: any) => {
    setForgotPassword(value)
  }
  const goToScreen = (page: number) => {
    //@ts-ignore
    ref.current.setPageWithoutAnimation(page)
  }

  const handleClose = () => {
    constant.switchLoader(dispatch, 'auth', true)
    if (props?.route?.params?.from == 'checkout') {
      props.navigation?.navigate(screenNames.CART_NAVIGATOR, {
        screen: screenNames.CART_SCREEN
      })
    } else if (props?.route?.params?.from == 'DigitalCheckout') {
      constant.switchLoader(dispatch, 'auth', false)
      props.navigation?.goBack()
    } else if (props?.route?.params?.closeNavigation) {
      constant.switchLoader(dispatch, 'auth', false)
      props.route.params.closeNavigation()
    } else {
      dispatch(loginAsGuest(() => {}))
      props.navigation.reset({
        index: 1,
        routes: [{ name: screenNames.BOTTOM_TAB }]
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <AuthModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        goToScreen={goToScreen}
        isForgot={isForgotPassword}
        navigation={props.navigation}
        setForgotPassword={goToForgotPassword}
        currentScreen={currentScreen}>
        <PagerView
          style={styles.pagerView}
          ref={ref}
          scrollEnabled={false}
          initialPage={initial}>
          <View key={1}>
            <Login
              isSplash={true}
              goToScreen={goToScreen}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ref={ref}
              flashref={flashmessage}
              navigation={props.navigation}
              handleClose={handleClose}
              handleSuccess={props?.route?.params?.successNavigation}
            />
          </View>
          <View key={2}>
            <Signup
              navigate={props.navigation}
              isSplash={true}
              goToScreen={goToScreen}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ref={ref}
              flashref={flashmessage}
              navigation={props.navigation}
              handleClose={handleClose}
              handleSuccess={props?.route?.params?.successNavigation}
              emailSignup={emailSignup}
              passwordSignup={passwordSignup}
              firstNameSignup={firstNameSignup}
              lastNameSignup={lastNameSignup}
              setEmailSignup={setEmailSignup}
              setPasswordSignup={setPasswordSignup}
              setFirstNameSignup={setFirstNameSignup}
              setLastNameSignup={setLastNameSignup}
            />
          </View>
          <View key={3}>
            <ForgotPass
              isSplash={true}
              goToScreen={goToScreen}
              setForgotPassword={goToForgotPassword}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ref={ref}
              flashref={flashmessage}
              navigation={props.navigation}
              handleClose={handleClose}
            />
          </View>
          <View key={4}>
            <ConfirmResetPassword
              goToScreen={goToScreen}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ref={ref}
              flashref={flashmessage}
              navigation={props.navigation}
              handleClose={handleClose}
            />
          </View>
          <View key={5}>
            <ConfirmAuth
              goToScreen={goToScreen}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ref={ref}
              navigation={props.navigation}
              handleClose={handleClose}
            />
          </View>
          <View key={6}>
            <CRAlreadyExist
              goToScreen={goToScreen}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              ref={ref}
              navigation={props.navigation}
              handleClose={handleClose}
              emailSignup={emailSignup}
              passwordSignup={passwordSignup}
              firstNameSignup={firstNameSignup}
              lastNameSignup={lastNameSignup}
            />
          </View>
        </PagerView>
        <FlashMessage
          ref={flashmessage}
          style={{
            marginBottom: 40,
            borderRadius: 8,
            marginLeft: 22,
            marginRight: 22
          }}
          duration={5000}
          hideOnPress={false}
          animationDuration={200}
          color="#000000"
          floating={true}
          position={
            Platform.OS === 'ios'
              ? 'bottom'
              : { top: StatusBar.currentHeight, left: 0, right: 0 }
          }
        />
      </AuthModal>
    </SafeAreaView>
  )
}

export default Auth

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },

  pagerView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    textAlign: 'center'
  }
})
