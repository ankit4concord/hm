import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'
import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { CircleIcon } from '../icons'

interface BackCircleButtonProps {
  style?: ViewStyle
}

export const BackCircleButton = (props: BackCircleButtonProps) => {
  const { style } = props
  const circleStyle = { ...styles.border, ...style }

  return (
    <CircleIcon
      name={'hm_ArrowBack-thick'}
      iconColor={colors.blackText}
      circleColor={colors.white}
      circleSize={vw(35)}
      iconSize={vw(18)}
      circleStyle={circleStyle}
    />
  )
}

const styles = StyleSheet.create({
  border: {
    borderWidth: vw(1),
    borderColor: colors.graylight
  }
})
