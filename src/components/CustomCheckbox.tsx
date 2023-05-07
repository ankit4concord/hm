import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import CheckBox from '@react-native-community/checkbox'
import colors from '@ecom/utils/colors'

export default function CustomCheckbox(props: any) {
  const [check, setCheck] = useState(false)

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          disabled={false}
          style={styles.disebleCheckBox}
          value={check}
          boxType="square"
          tintColor={colors.checkBox}
          onCheckColor={colors.white}
          onFillColor={colors.green}
          onTintColor={'transparent'}
          animationDuration={0.1}
          onValueChange={(newValue) => {
            setCheck(newValue)
          }}
        />
        {props.content && <Text style={styles.label}>{props.content}</Text>}
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: vh(20)
  },
  checkbox: {
    alignSelf: 'flex-start'
  },
  label: {
    marginLeft: vw(8),
    fontSize: vw(12),
    lineHeight: vh(18)
  },
  disebleCheckBox: {
    width: vw(20),
    height: vh(20),
    borderWidth: vw(1),
    borderColor: colors.disableCheakBox,
    borderRadius: vw(3)
  }
})
