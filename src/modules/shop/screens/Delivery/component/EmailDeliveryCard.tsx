import { StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import colors from '@ecom/utils/colors'

const EmailDeliveryCard = () => {
  return (
    <View style={styles.container}>
      <View style={styles.subject}>
        <Text style={styles.subTxt}>Subject</Text>
        <Text numberOfLines={1} style={styles.txt}>
          Lorem Ipsum has been the industry's standard dummy
        </Text>
      </View>
      <View style={styles.subject}>
        <Text style={styles.subTxt}>Email</Text>
        <Text numberOfLines={1} style={styles.txt}>
          Lorem Ipsum has been the industry's standard dummy
        </Text>
      </View>
      <View style={styles.ETALabel}>
        <Text style={styles.notifyTxt}>Email is sent after checkout</Text>
      </View>
    </View>
  )
}

export default EmailDeliveryCard
const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  subject: {
    flexDirection: 'row',
    marginBottom: 10
  },
  ETALabel: {
    alignSelf: 'baseline',
    backgroundColor: colors.hmPurplelight,
    borderRadius: vw(10),
    paddingVertical: vh(6),
    paddingHorizontal: vw(10)
  },
  notifyTxt: {
    fontSize: vw(12),
    lineHeight: vh(14)
  },
  txt: {
    flex: 0.78,
    fontSize: vw(12),
    lineHeight: vh(14)
  },
  subTxt: {
    flex: 0.22,
    color: colors.grayTxt,
    fontSize: vw(12),
    lineHeight: vh(14)
  }
})
