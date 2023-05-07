import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export default function DeliveryMethodCard(props: any) {
  const { title, ETA } = props
  return (
    <>
      <ScrollView>
        <View>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.ETALabel}>
          <Text style={styles.etaTxt}>{ETA}</Text>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.MEDIUM,
    fontSize: vw(12),
    color: colors.grayTxt,
    marginLeft: vw(10)
  },
  ETALabel: {
    alignSelf: 'baseline',
    backgroundColor: colors.hmPurplelight,
    borderRadius: vw(10),
    paddingVertical: vh(6),
    paddingHorizontal: vw(11),
    marginTop: vh(8),
    marginLeft: vw(10)
  },
  etaTxt: {
    fontSize: vw(12),
    lineHeight: vh(14.4)
  }
})
