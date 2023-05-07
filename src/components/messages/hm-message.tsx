import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle
} from 'react-native'
import { Body, LabelName } from '../typography'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Icon } from '../icons'
import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'

interface HMMessageProps {
  type?: 'Error' | 'Success'
  message: string
  subMessage?: string
  display: boolean
  closeable?: boolean
  testID?: string
  containerStyle?: ViewStyle
  onClose?: () => void
  autoClose?: boolean
  autoCloseTime?: number
}

export const HMMessage = (props: HMMessageProps) => {
  const {
    type = 'Success',
    message,
    subMessage,
    closeable = false,
    testID,
    containerStyle,
    onClose,
    autoClose,
    autoCloseTime = 10000
  } = props
  const fadeAnim = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(props.display)
  const backgroundStyle = styles[type]
  const textStyle = styles[`${type}Text`]

  useEffect(() => setDisplay(props.display), [props.display])

  const close = useCallback(() => {
    setDisplay(false)
    if (onClose) {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true
    }).start()
    if (autoClose) {
      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true
        })
        close()
      }, autoCloseTime)
    }
  }, [autoClose, autoCloseTime, close, fadeAnim])

  const renderCloseable = () => {
    return closeable ? (
      <TouchableOpacity onPress={close} style={styles.close}>
        <Icon
          name={'hm_CloseLarge-thick'}
          color={textStyle.color}
          size={vw(12)}
        />
      </TouchableOpacity>
    ) : null
  }

  const renderMessage = () => {
    return (
      <View style={styles.messageContainer}>
        <LabelName style={textStyle}>{message}</LabelName>
        {subMessage ? (
          <Body style={[textStyle, styles.subMessage]}>{subMessage}</Body>
        ) : null}
      </View>
    )
  }

  return display ? (
    <Animated.View
      style={[
        backgroundStyle,
        styles.container,
        containerStyle,
        { opacity: fadeAnim }
      ]}
      testID={testID || `${type}_Message`}>
      {renderMessage()}
      {renderCloseable()}
    </Animated.View>
  ) : null
}

const styles = StyleSheet.create({
  container: {
    padding: vw(20),
    borderRadius: vw(10),
    width: '100%',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    zIndex: 9000,
    justifyContent: 'space-between'
  },
  messageContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'column'
  },
  subMessage: {
    flex: 1,
    flexWrap: 'wrap'
  },
  close: {
    alignSelf: 'flex-start',
    marginLeft: vw(10)
  },
  Error: {
    backgroundColor: colors.errorToastBG
  },
  ErrorText: {
    color: colors.errorToastText
  },
  Success: {
    backgroundColor: colors.lightGreen
  },
  SuccessText: {
    color: colors.brown
  }
})
