import React from 'react'
import { HMText, TypographyProps } from './hm-text'

const Body = (props: TypographyProps) => {
  const { children } = props
  return (
    <HMText textType={'Body'} {...props}>
      {children}
    </HMText>
  )
}

export { Body }
