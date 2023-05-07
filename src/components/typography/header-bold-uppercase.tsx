import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const HeaderBoldUppercase = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'HeaderBoldUppercase'} {...props}>
      {children}
    </HMText>
  )
}

export { HeaderBoldUppercase }
