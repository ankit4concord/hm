import { Image, Modal, StyleSheet, View } from 'react-native'
import { screenWidth, vh } from '@ecom/utils/dimension'

import React from 'react'
import colors from '@ecom/utils/colors'

interface Props {
  modalVisible: any
  setModalVisible: any
  children: any
  goToScreen: Function
  isForgot: any
  currentScreen: any
  setForgotPassword: Function
  navigation: any
}

const AuthModal = (props: Props) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      swipeDirection="down"
      style={styles.modalContainer}
      visible={true}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.internalModalView}>{props.children}</View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    marginTop: vh(30)
  },
  modalView: {
    flex: 1,

    zIndex: 1
  },
  internalModalView: {
    flex: 1,
    backgroundColor: colors.white
  },
  centeredView: {
    flex: 1,
    marginTop: vh(30),
    justifyContent: 'flex-start'
  },
  absoluteCloseView: {
    top: 0,
    height: vh(150),
    width: '100%',
    position: 'absolute',
    zIndex: 1
  }
})
export default AuthModal
