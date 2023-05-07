import { TextStyle, ViewStyle } from 'react-native'

import { CircleIcon } from './base/circle-icon'
import React from 'react'
import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'

interface DeleteCircleIconProps {
  iconColor?: string
  iconSize?: number
  circleColor?: string
  circleSize?: number
  circleStyle?: ViewStyle
  iconStyle?: TextStyle
}

export const DeleteCircleIcon = (props: DeleteCircleIconProps) => {
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
      name={'hm_Delete-thick'}
      iconColor={iconColor}
      circleColor={circleColor}
      circleSize={circleSize}
      iconSize={iconSize}
      circleStyle={circleStyle}
      iconStyle={iconStyle}
    />
  )
}
