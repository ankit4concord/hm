import { ScrollView, StyleSheet, Text, View } from 'react-native'

import React from 'react'
import fonts from '@ecom/utils/fonts'
import { vw } from '@ecom/utils/dimension'

export default function SenderRecipientItem(props: any) {
  return (
    <>
      <View>
        <Text style={styles.bodyContent}>{props.content}</Text>
      </View>
    </>
  )
}
const styles = StyleSheet.create({
  bodyContent: {
    fontSize: vw(14),
    marginLeft: vw(10)
  }
})
