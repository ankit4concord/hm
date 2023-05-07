import { StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '../utils/dimension'

import React from 'react'

function TextItem(props: any) {
  const { content } = props
  return (
    <View style={styles.textView}>
      <Text style={styles.textStyle}>{content.content}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  textView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: vh(10),
    paddingHorizontal: vw(10)
  },
  textStyle: {
    textAlign: 'center'
  }
})

export default TextItem
