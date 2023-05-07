import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

interface HMTextProps extends TextProps {
  children: ReactNode[] | ReactNode | string
  style?: StyleProp<TextStyle>
  textType?:
    | 'HeaderBigOnboarding'
    | 'HeaderBig'
    | 'HeaderMedium'
    | 'HeaderBody'
    | 'HeaderBoldUppercase'
    | 'HeaderSmallTightBold'
    | 'HeaderSmallTight'
    | 'HeaderSmall'
    | 'Header'
    | 'HeaderBold'
    | 'Body'
    | 'Description'
    | 'LabelButton'
    | 'LabelName'
}

interface TypographyProps extends TextProps {
  children: ReactNode[] | ReactNode | string
  style?: StyleProp<TextStyle>
}

const HMText = (props: HMTextProps) => {
  const { children, style, textType = 'Body', ...rest } = props
  return (
    <Text style={[styles.base, styles[textType], style]} {...rest}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  base: {
    color: colors.blackText
  },
  HeaderBigOnboarding: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(32),
    lineHeight: vh(36),
    letterSpacing: vw(-0.02)
  },
  HeaderBig: {
    fontFamily: fonts.BOLD,
    fontSize: vw(35),
    lineHeight: vh(31),
    letterSpacing: vw(-0.0),
    textTransform: 'uppercase'
  },
  HeaderMedium: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(24),
    lineHeight: vh(28.8)
  },
  HeaderBoldUppercase: {
    fontFamily: fonts.BOLD,
    fontSize: vw(16),
    lineHeight: vh(18),
    textTransform: 'uppercase'
  },
  Header: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(16),
    lineHeight: vh(19.2),
    letterSpacing: vw(-0.02)
  },
  HeaderBold: {
    fontFamily: fonts.BOLD,
    fontSize: vw(16),
    lineHeight: vh(19.2),
    letterSpacing: vw(-0.02)
  },
  HeaderBody: {
    fontFamily: fonts.BOLD,
    fontSize: vw(14),
    lineHeight: vh(20)
  },
  LabelName: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14),
    lineHeight: vh(18)
  },
  Body: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14),
    lineHeight: vh(20),
    letterSpacing: vw(-0.01)
  },
  HeaderSmallTightBold: {
    fontFamily: fonts.BOLD,
    fontSize: vw(12),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03)
  },
  HeaderSmallTight: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(16),
    letterSpacing: vw(-0.03)
  },
  HeaderSmall: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    lineHeight: vh(16)
  },
  Description: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(12),
    lineHeight: vh(18)
  },
  LabelButton: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(9),
    lineHeight: vh(10),
    letterSpacing: vw(-0.05)
  }
})

export { HMText }
export type { TypographyProps, HMTextProps }
