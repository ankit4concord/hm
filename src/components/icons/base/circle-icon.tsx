import { StyleSheet, TextStyle, View, ViewStyle } from 'react-native'

import { Icon } from './icon'
import React from 'react'
import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'

interface CircleIconProps {
  name?: string
  iconColor?: string
  iconSize?: number
  circleColor?: string
  circleSize?: number
  circleStyle?: ViewStyle
  iconStyle?: TextStyle
  shadow?: Boolean
}

export const CircleIcon = (props: CircleIconProps) => {
  const {
    name = 'hm_Question',
    iconColor = colors.blackText,
    circleColor = colors.graylight,
    circleSize = vw(26),
    iconSize = vw(14),
    circleStyle,
    iconStyle,
    shadow = false
  } = props

  const styles = getStyles(circleSize, circleColor)

  return (
    <View
      style={[styles.circle, circleStyle, shadow ? styles.circleShadow : {}]}>
      <Icon name={name} size={iconSize} color={iconColor} style={iconStyle} />
    </View>
  )
}

const getStyles = (size: number, circleColor: string) =>
  StyleSheet.create({
    circle: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: circleColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    circleShadow: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.1,
      shadowRadius: 4
    }
  })
