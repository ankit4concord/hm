import { Text, View } from 'react-native'

import React from 'react'

export function TextWithIcon(props: any) {
  return (
    <View>
      <Text key={Math.random() * 2} {...props}>
        {props.isIcon}
        {props.label}
      </Text>
    </View>
  )
}
