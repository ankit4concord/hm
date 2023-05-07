import React from 'react'
import { HMButton, HMButtonProps } from './hm-button'

export const TertiaryLargeButton = (props: HMButtonProps) => {
  const { children, ...rest } = props

  return (
    <HMButton buttonSize={'Large'} buttonType={'Tertiary'} {...rest}>
      {children}
    </HMButton>
  )
}
