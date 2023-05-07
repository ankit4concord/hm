import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import actionNames from '@ecom/utils/actionNames'
import colors from '@ecom/utils/colors'
import { useDispatch } from 'react-redux'
import { vh } from '@ecom/utils/dimension'

interface Props {
  navigation: any
  authenticate: any
  props?: any
}

export const AuthComponent = (props: Props) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      dispatch({
        type: actionNames.HOME_REDUCER,
        payload: {
          authModal: false
        }
      })
    })
    return unsubscribe
  }, [props.navigation])

  return (
    <>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.internalModalView}>
            <Text>Page</Text>
          </View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopRightRadius: vh(32),
    borderTopLeftRadius: vh(32),
    marginTop: 56
  },
  modalView: {
    flex: 1,
    paddingTop: vh(40),
    backgroundColor: colors.white,
    borderTopRightRadius: vh(32),
    borderTopLeftRadius: vh(32)
  },
  internalModalView: {
    flex: 1
  }
})
