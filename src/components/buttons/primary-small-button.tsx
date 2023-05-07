import React from 'react'
import { HMButton, HMButtonProps } from './hm-button'

export const PrimarySmallButton = (props: HMButtonProps) => {
  const { children, ...rest } = props

  return (
    <HMButton buttonSize={'Small'} buttonType={'Primary'} {...rest}>
      {children}
    </HMButton>
  )
}
