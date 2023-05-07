import { Image, ImageBackground } from 'react-native'

import React from 'react'

const LoadFrameURL = (props: any) => {
  const { imageData, item } = props
  return (
    <Image
      style={{
        aspectRatio: imageData?.aspectRatio,
        zIndex: 1,
        resizeMode: 'contain'
      }}
      source={{
        uri: item?.FrameUrl
      }}
    />
  )
}

export default LoadFrameURL
