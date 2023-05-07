import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const HeaderBold = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'HeaderBold'} {...props}>
      {children}
    </HMText>
  )
}

export { HeaderBold }
