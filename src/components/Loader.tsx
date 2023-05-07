import { Modal, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import DropShadow from 'react-native-drop-shadow'
import Lottie from 'lottie-react-native'
import { RootReducerModal } from '@ecom/modals'
import { useSelector } from 'react-redux'
//Custom Imports
import { vw } from '@ecom/utils/dimension'

const Loader = () => {
  const [showLoader, setLoader] = useState(true)
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  useEffect(() => {
    const subscribe = setTimeout(() => {
      setLoader(false)
    }, appConfigValues?.screen_content?.timer_in_secs?.webviewLoader)

    return () => {
      clearTimeout(subscribe)
    }
  }, [])

  return (
    <Modal animationType="none" transparent={true} visible={showLoader}>
      <View style={styles.modalBackground}>
        <DropShadow style={styles.shadowContainer}>
          <View style={styles.activityIndicatorWrapper}>
            <Lottie
              source={require('./animation.json')}
              autoPlay
              loop
              style={{ width: 116 }}
            />
          </View>
        </DropShadow>
      </View>
    </Modal>
  )
}
export default Loader

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 246, 252,0.5)'
  },
  activityIndicatorWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: vw(100),
    width: vw(66),
    height: vw(66)
  },

  loaderImage: {
    width: vw(100),
    resizeMode: 'contain',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.1,
    shadowRadius: 8
  }
})
