import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'
import React from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { CircleIcon } from './base/circle-icon'

interface EditCircleIconProps {
  iconColor?: string
  iconSize?: number
  circleColor?: string
  circleSize?: number
  circleStyle?: ViewStyle
  iconStyle?: TextStyle
}

export const EditCircleIcon = (props: EditCircleIconProps) => {
  const {
    iconColor = colors.blackText,
    circleColor = colors.graylight,
    circleSize = vw(26),
    iconSize = vw(14),
    circleStyle,
    iconStyle
  } = props

  return (
    <CircleIcon
      name={'hm_EditText-thin'}
      iconColor={iconColor}
      circleColor={circleColor}
      circleSize={circleSize}
      iconSize={iconSize}
      circleStyle={circleStyle}
      iconStyle={iconStyle}
    />
  )
}
