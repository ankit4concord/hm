import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const HeaderSmallTight = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'HeaderSmallTight'} {...props}>
      {children}
    </HMText>
  )
}

export { HeaderSmallTight }
