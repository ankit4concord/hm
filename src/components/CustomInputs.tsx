import { StyleSheet, Text, TextInput, View } from 'react-native'
import { vh, vw } from '@ecom/utils/dimension'

import React from 'react'
import colors from '@ecom/utils/colors'
import fonts from '@ecom/utils/fonts'

export default function CustomInputs({
  onChange,
  disable = false,
  textStyle,
  value,
  label,
  subLabel,
  placeholder,
  keyboardType = 'default',
  type,
  error
}: {
  onChange: any
  disable?: boolean
  textStyle: any
  value: any
  label: any
  subLabel: any
  placeholder: any
  keyboardType?: any
  type: any
  error: any
}): JSX.Element {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
      <TextInput
        type={type}
        editable={!disable}
        selectTextOnFocus={!disable}
        style={[styles.input, textStyle]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={type === 'password' ? true : false}
        error={error}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}
const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginTop: vh(8),
    marginBottom: vh(20),
    backgroundColor: colors.inputBox,
    borderRadius: vw(10),
    padding: vw(15),
    fontFamily: fonts.MEDIUM,
    fontSize: vw(14)
  },
  label: {
    fontFamily: fonts.REGULAR,
    fontSize: vw(14)
  },
  error: {
    color: colors.darkOrange,
    fontSize: vw(12),
    marginTop: vh(-12),
    marginBottom: vh(12)
  },
  subLabel: {
    fontSize: vw(10),
    marginTop: vh(20),
    marginLeft: vw(10),
    color: colors.lableTxtInput
  }
})
