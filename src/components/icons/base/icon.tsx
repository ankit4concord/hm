import { StyleProp, StyleSheet, TextStyle } from 'react-native'

import HMIcon from './hm-icon'
import React from 'react'
import { SVGIcon } from './svg-icon'
import colors from '@ecom/utils/colors'
import { vw } from '@ecom/utils/dimension'

export interface IconProps {
  allowFontScaling?: boolean
  name?: string
  style?: StyleProp<TextStyle>
  color?: string
  fill?: string
  fillSecondary?: string
  size?: number
}

export const Icon = (props: IconProps) => {
  const {
    allowFontScaling = false,
    name,
    style,
    color,
    fill,
    fillSecondary,
    size = vw(16)
  } = props
  if (name?.startsWith('hm_')) {
    const iconName = name.substring(3)
    return (
      <HMIcon
        name={iconName}
        size={size}
        color={color}
        style={[!color ? styles.icon : {}, style]}
        allowFontScaling={allowFontScaling}
      />
    )
  } else if (name?.endsWith('_svg')) {
    return (
      <SVGIcon
        name={name}
        color={color}
        style={style}
        size={size}
        fill={fill}
        fillSecondary={fillSecondary}
      />
    )
  }

  return null
}

const styles = StyleSheet.create({
  icon: {
    color: colors.blackText
  }
})
