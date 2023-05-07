import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const Header = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'Header'} {...props}>
      {children}
    </HMText>
  )
}

export { Header }
