import { StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

interface Props {
  label: string
  extraStyle?: any
  onPress: Function
  labelExtraStyle?: TextStyle
  disabled?: boolean
}

const CustomButton = ({
  onPress,
  label,
  extraStyle = {},
  labelExtraStyle = {},
  disabled = false
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[disabled ? styles.fadedButton : styles.container, extraStyle]}
      onPress={() => onPress()}>
      <Text
        style={[
          disabled ? styles.fadedText : styles.labelStyle,
          labelExtraStyle
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    height: vh(56),
    borderRadius: vw(30),
    marginTop: vh(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.hmPurple
  },
  labelStyle: {
    fontSize: vw(22),
    color: colors.white,
    letterSpacing: vh(0.8),
    fontFamily: fonts.MEDIUM,
    fontWeight: '500'
  },
  fadedText: {
    fontSize: vw(22),
    color: colors.white,
    fontFamily: fonts.MEDIUM,
    letterSpacing: vh(0.8),
    fontWeight: '500'
  },
  fadedButton: {
    height: vh(56),
    borderRadius: vw(30),
    marginTop: vh(16),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightCustomPurple
  }
})

export default CustomButton
