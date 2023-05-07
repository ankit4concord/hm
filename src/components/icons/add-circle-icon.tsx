import { TextStyle, ViewStyle } from 'react-native'
import { CircleIcon } from './base/circle-icon'
import React from 'react'
import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'

interface AddCircleIconProps {
  iconColor?: string
  iconSize?: number
  circleColor?: string
  circleSize?: number
  circleStyle?: ViewStyle
  iconStyle?: TextStyle
}

export const AddCircleIcon = (props: AddCircleIconProps) => {
  const {
    iconColor = colors.white,
    circleColor = colors.darkPink,
    circleSize = vw(26),
    iconSize = vw(10),
    circleStyle,
    iconStyle
  } = props

  return (
    <CircleIcon
      name={'plus_bold_svg'}
      iconColor={iconColor}
      circleColor={circleColor}
      circleSize={circleSize}
      iconSize={iconSize}
      circleStyle={circleStyle}
      iconStyle={iconStyle}
    />
  )
}
