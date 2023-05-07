declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<
    SvgProps & {
      fillSecondary?: string
    }
  >
  export default content
}

declare module '@adobe/react-native-acpcore'
