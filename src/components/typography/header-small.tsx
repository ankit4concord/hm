import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const HeaderSmall = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'HeaderSmall'} {...props}>
      {children}
    </HMText>
  )
}

export { HeaderSmall }
