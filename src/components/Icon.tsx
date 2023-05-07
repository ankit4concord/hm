import { Image } from 'react-native'
import React from 'react'

const Icon = (props: any) => {
  let { name } = props

  return <Image source={name} {...props} />
}

export default Icon
