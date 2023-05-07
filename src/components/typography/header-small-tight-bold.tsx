import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const HeaderSmallTightBold = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'HeaderSmallTightBold'} {...props}>
      {children}
    </HMText>
  )
}

export { HeaderSmallTightBold }
