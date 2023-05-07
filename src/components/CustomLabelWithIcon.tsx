import * as React from 'react'

import { Text, View } from 'react-native'

export function CustomLabelWithIcon(props: any) {
  return (
    <View style={{ flexDirection: 'row' }}>
      {props.isIcon}
      <Text key={Math.random() * 2} {...props}>
        {props.label}
      </Text>
    </View>
  )
}
