import { Modal, StyleSheet, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { vh, vw } from '@ecom/utils/dimension'

import { RootReducerModal } from '@ecom/modals'
import colors from '../utils/colors'
import fonts from '../utils/fonts'
import { useSelector } from 'react-redux'

const Loader = () => {
  const [showLoader, setLoader] = useState(true)
  const { appConfigValues } = useSelector(
    (state: RootReducerModal) => state.configReducer
  )
  useEffect(() => {
    setTimeout(() => {
      setLoader(false)
    }, appConfigValues?.screen_content?.timer_in_secs?.webviewLoader)
  }, [])

  return (
    <Modal
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      transparent={true}
      animationType={'none'}
      visible={showLoader}>
      <View style={styles.ahLoader}>
        <View style={styles.house}></View>
        <View style={styles.shadow}></View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  activityIndicatorWrapper: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: '80%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginHorizontal: vw(21)
  },
  loaderText: {
    fontSize: vw(16),
    fontFamily: fonts.REGULAR,
    marginLeft: vw(20),
    color: colors.black
  },
  loaderImage: {
    width: vw(110),
    height: vh(118),
    justifyContent: 'center',
    alignItems: 'center'
  },
  ahLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 0.5,
    transform: [{ translateX: 0.5 }, { translateX: -0.5 }]
  },

  shadow: {
    width: 50,
    height: 10,
    backgroundColor: '#000',
    opacity: 0.1,
    position: 'absolute',
    zIndex: 9999,
    left: 25,
    top: 75,
    borderRadius: 0.5
  },

  loaderTiny: {
    transform: [{ translateX: 0.5 }, { translateX: -0.5 }, { scaleX: 0.5 }]
  },
  house: {
    width: 50,
    height: 35,
    backgroundColor: '#00A7CE',
    position: 'relative',
    zIndex: 10000,
    left: 25,
    top: 30,
    borderRadius: 3
  }
})

export default Loader
