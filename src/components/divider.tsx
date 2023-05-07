import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Description } from './typography'
import React from 'react'
import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'

interface DividerProps {
  style?: StyleProp<ViewStyle>
  containerStyle?: StyleProp<ViewStyle>
  centerText?: string
}

export const Divider = (props: DividerProps) => {
  const { style = {}, centerText, containerStyle = {} } = props
  return centerText ? (
    <View style={[styles.row, containerStyle]}>
      <View style={[styles.base, style]} />
      <Description style={styles.text}>{centerText}</Description>
      <View style={[styles.base, style]} />
    </View>
  ) : (
    <View style={[styles.base, style]} />
  )
}

const styles = StyleSheet.create({
  base: {
    borderColor: colors.graylight,
    borderWidth: 1,
    flex: 1
  },
  left: {
    marginRight: vw(10)
  },
  right: {
    marginLeft: vw(10)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  text: {
    color: colors.grayText,
    marginHorizontal: vw(10)
  }
})
